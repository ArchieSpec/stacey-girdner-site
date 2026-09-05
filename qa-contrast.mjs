import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE_URL = 'http://localhost:4178/stacey-girdner-site';
const routes = ['/', '/about/', '/approach/', '/individual/', '/couples/', '/executives/', '/life-transitions/', '/faq/', '/policies/', '/contact/'];
const viewports = [
  ['mobile-390', 390, 844, 9241],
  ['tablet-768', 768, 1024, 9242],
  ['desktop-1440', 1440, 1000, 9243],
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

async function auditViewport([viewport, width, height, port]) {
  const profile = `/tmp/stacey-contrast-${viewport}`;
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
      await sleep(200);

      const audit = await client.evaluate(`(() => {
        const parseColor = (value) => {
          const match = String(value).match(/rgba?\\(([^)]+)\\)/i);
          if (!match) return null;
          const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
          return { r: parts[0], g: parts[1], b: parts[2], a: Number.isFinite(parts[3]) ? parts[3] : 1 };
        };
        const composite = (front, back) => {
          const alpha = front.a + back.a * (1 - front.a);
          if (alpha === 0) return { r: 255, g: 255, b: 255, a: 0 };
          return {
            r: (front.r * front.a + back.r * back.a * (1 - front.a)) / alpha,
            g: (front.g * front.a + back.g * back.a * (1 - front.a)) / alpha,
            b: (front.b * front.a + back.b * back.a * (1 - front.a)) / alpha,
            a: alpha,
          };
        };
        const luminance = (color) => {
          const channel = (value) => {
            const normalized = value / 255;
            return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
        };
        const ratio = (first, second) => {
          const one = luminance(first);
          const two = luminance(second);
          return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
        };
        const colorText = (color) => 'rgb(' + Math.round(color.r) + ', ' + Math.round(color.g) + ', ' + Math.round(color.b) + ')';
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
        const backgroundFor = (el) => {
          const lineage = [];
          let node = el;
          let imageBackground = false;
          while (node && node.nodeType === Node.ELEMENT_NODE) {
            lineage.unshift(node);
            node = node.parentElement;
          }
          let background = { r: 255, g: 255, b: 255, a: 1 };
          for (const ancestor of lineage) {
            const style = getComputedStyle(ancestor);
            if (style.backgroundImage && style.backgroundImage !== 'none') imageBackground = true;
            const layer = parseColor(style.backgroundColor);
            if (layer && layer.a > 0) background = composite(layer, background);
          }
          return { background, imageBackground };
        };
        const rows = [];
        const inspect = (el, text, state = 'default', pseudo = null) => {
          if (!visible(el) || !text) return;
          const style = getComputedStyle(el, pseudo);
          const foreground = parseColor(style.color);
          if (!foreground) return;
          const { background, imageBackground } = backgroundFor(el);
          const effectiveForeground = composite(foreground, background);
          const contrast = ratio(effectiveForeground, background);
          const size = Number.parseFloat(style.fontSize);
          const weight = Number.parseInt(style.fontWeight, 10) || (style.fontWeight === 'bold' ? 700 : 400);
          const isLarge = size >= 24 || (size >= 18.5 && weight >= 700);
          const required = isLarge ? 3 : 4.5;
          rows.push({
            state,
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className : '',
            text: text.slice(0, 120),
            size,
            weight,
            foreground: colorText(effectiveForeground),
            background: colorText(background),
            ratio: Number(contrast.toFixed(3)),
            required,
            pass: contrast >= required,
            imageBackground,
          });
        };

        for (const el of document.body.querySelectorAll('*')) {
          if (['SCRIPT','STYLE','NOSCRIPT','SVG','PATH','OPTION'].includes(el.tagName)) continue;
          const text = directText(el);
          if (text) inspect(el, text);
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            const placeholder = el.getAttribute('placeholder');
            if (placeholder) inspect(el, placeholder, 'placeholder', '::placeholder');
          }
          if (el instanceof HTMLSelectElement) {
            inspect(el, el.options[el.selectedIndex]?.text || '', 'selected-option');
          }
        }

        for (const el of document.querySelectorAll('a, button, input, select, textarea, summary')) {
          if (!visible(el)) continue;
          el.focus({ preventScroll: true });
          const text = directText(el) || el.getAttribute('placeholder') || el.textContent.trim();
          inspect(el, text, 'focus');
          el.blur();
        }

        const violations = rows.filter((row) => !row.pass);
        const imageBackgroundRows = rows.filter((row) => row.imageBackground);
        const pairs = [...new Map(rows.map((row) => [
          [row.foreground, row.background, row.required].join('|'),
          { foreground: row.foreground, background: row.background, required: row.required, minimumRatio: row.ratio },
        ])).values()];
        return { path: location.pathname, rows, violations, imageBackgroundRows, pairs };
      })()`);

      results.push({ viewport, route, ...audit });
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

const violations = results.flatMap((page) => page.violations.map((row) => ({ viewport: page.viewport, route: page.route, ...row })));
const imageBackgroundRows = results.flatMap((page) => page.imageBackgroundRows.map((row) => ({ viewport: page.viewport, route: page.route, ...row })));
const checkedTextElements = results.reduce((total, page) => total + page.rows.length, 0);
const uniquePairs = [...new Map(results.flatMap((page) => page.pairs).map((pair) => [
  [pair.foreground, pair.background, pair.required].join('|'),
  pair,
])).values()].sort((a, b) => a.minimumRatio - b.minimumRatio);

console.log(JSON.stringify({
  standard: 'WCAG 2.2 AA SC 1.4.3',
  checkedRoutes: results.length,
  checkedTextElements,
  violations: violations.length,
  imageBackgroundCases: imageBackgroundRows.length,
  details: violations,
  imageBackgroundDetails: imageBackgroundRows,
  uniquePairs,
}, null, 2));
