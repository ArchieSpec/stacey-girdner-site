import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE_URL = 'http://localhost:4178/stacey-girdner-site';
const routes = ['/', '/about/', '/approach/', '/individual/', '/couples/', '/executives/', '/life-transitions/', '/faq/', '/policies/', '/contact/'];
const viewports = [
  ['mobile-390', 390, 844, 9231],
  ['tablet-768', 768, 1024, 9232],
  ['desktop-1440', 1440, 1000, 9233],
];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger(port) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error(`Chromium debugger did not start on ${port}`);
}

async function createPage(port, url) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Unable to create browser page: ${response.status}`);
  return response.json();
}

function createClient(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const item = pending.get(message.id);
    pending.delete(message.id);
    message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
  });
  const send = async (method, params = {}) => {
    await ready;
    const id = ++sequence;
    const promise = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    socket.send(JSON.stringify({ id, method, params }));
    return promise;
  };
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  return { send, evaluate, close: () => socket.close() };
}

async function auditViewport([name, width, height, port]) {
  const profile = `/tmp/stacey-font-${name}`;
  await rm(profile, { recursive: true, force: true });
  const browser = spawn('chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', `--window-size=${width},${height}`,
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });
  try {
    await waitForDebugger(port);
    const page = await createPage(port, `${BASE_URL}/`);
    const client = createClient(page.webSocketDebuggerUrl);
    await client.send('Page.enable');
    const results = [];
    for (const route of routes) {
      await client.send('Page.navigate', { url: `${BASE_URL}${route}` });
      for (let attempt = 0; attempt < 60; attempt += 1) {
        if (await client.evaluate(`document.readyState === 'complete' && Boolean(document.querySelector('[data-v2-applied="true"]'))`)) break;
        await sleep(100);
      }
      await sleep(180);
      const audit = await client.evaluate(`(() => {
        const rows = [];
        const seen = new Set();
        const visible = (el) => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
        };
        const directText = (el) => [...el.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent)
          .join(' ')
          .replace(/\\s+/g, ' ')
          .trim();
        const record = (el, minimum, category, text = directText(el) || el.getAttribute('placeholder') || el.textContent.trim()) => {
          if (!visible(el)) return;
          const size = Number.parseFloat(getComputedStyle(el).fontSize);
          const key = [category, minimum, el.tagName, el.className, text.slice(0, 80)].join('|');
          if (size < minimum && !seen.has(key)) {
            seen.add(key);
            rows.push({ category, minimum, tag: el.tagName.toLowerCase(), className: el.className || '', text: text.slice(0, 100), size });
          }
        };

        for (const el of document.body.querySelectorAll('*')) {
          if (['SCRIPT','STYLE','NOSCRIPT','SVG','PATH'].includes(el.tagName)) continue;
          const text = directText(el);
          if (text) record(el, 13, 'absolute-floor', text);
        }

        const groups = [
          ['reading-copy', 17, '.home-copy > p:not(.eyebrow), .editorial-copy > p:not(.eyebrow), .faq-list details p'],
          ['supporting-copy', 16, '.pathway-card p, .point p, .mini-card-row p'],
          ['controls', 16, '.btn, .contact-form input, .contact-form textarea, .contact-form select, .contact-form button'],
          ['labels', 14, '.eyebrow, .contact-form label, .contact-form-choice span, .practice-tag, .point-num'],
          ['compact-copy', 13, '.photo-credit, .site-footer .footer-inner > span:first-child, .footer-links a, .footer-links span'],
        ];
        for (const [category, minimum, selector] of groups) {
          document.querySelectorAll(selector).forEach((el) => record(el, minimum, category));
        }
        return { path: location.pathname, rows };
      })()`);
      results.push({ viewport: name, route, ...audit });
    }
    client.close();
    return results;
  } finally {
    browser.kill('SIGTERM');
    await sleep(250);
    await rm(profile, { recursive: true, force: true });
  }
}

const results = [];
for (const viewport of viewports) results.push(...await auditViewport(viewport));
const violations = results.flatMap((item) => item.rows.map((row) => ({ viewport: item.viewport, route: item.route, ...row })));
console.log(JSON.stringify({ checkedRoutes: results.length, violations: violations.length, details: violations }, null, 2));
