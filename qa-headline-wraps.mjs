import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE = 'http://localhost:4178/stacey-girdner-site';
const pages = [
  ['Home', '/'],
  ['About', '/about/'],
  ['Individual', '/individual/'],
  ['Couples', '/couples/'],
  ['Professional', '/executives/'],
  ['Transitions', '/life-transitions/'],
  ['FAQ', '/faq/'],
  ['Policies', '/policies/'],
  ['Contact', '/contact/'],
];
const viewports = [
  ['phone', 390, 844],
  ['wide-phone', 660, 844],
  ['tablet', 768, 900],
  ['laptop', 1024, 900],
  ['desktop', 1440, 1000],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Chromium is still starting.
    }
    await sleep(100);
  }
  throw new Error('Chromium debugger did not start');
}

async function newPage(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about%3Ablank`, { method: 'PUT' });
  return response.json();
}

function cdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let id = 0;
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
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  async function send(method, params = {}) {
    await ready;
    const current = ++id;
    const promise = new Promise((resolve, reject) => pending.set(current, { resolve, reject }));
    socket.send(JSON.stringify({ id: current, method, params }));
    return promise;
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  return { send, evaluate, close: () => socket.close() };
}

async function waitFor(client, expression, label) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await client.evaluate(`Boolean(${expression})`)) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

const profile = '/tmp/stacey-headline-qa';
await rm(profile, { recursive: true, force: true });
const port = 9232;
const browser = spawn('chromium', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' });

try {
  await waitForDebugger(port);
  const page = await newPage(port);
  const client = cdp(page.webSocketDebuggerUrl);
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const results = [];
  for (const [viewport, width, height] of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 768,
    });

    for (const [pageName, path] of pages) {
      await client.send('Page.navigate', { url: `${BASE}${path}?headline-qa=${viewport}` });
      await waitFor(
        client,
        `document.readyState === 'complete' && document.querySelector('[data-v2-applied="true"]') && document.querySelector('main h1')`,
        `${viewport} ${pageName}`,
      );
      await sleep(150);

      const layout = await client.evaluate(`(() => {
        const heading = document.querySelector('main h1');
        const tokens = [];
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const text = node.nodeValue || '';
          const pattern = /\\S+/g;
          let match;
          while ((match = pattern.exec(text))) {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const rect = range.getBoundingClientRect();
            tokens.push({ word: match[0], top: Math.round(rect.top), left: Math.round(rect.left) });
          }
        }
        const groups = [];
        for (const token of tokens) {
          let group = groups.find((item) => Math.abs(item.top - token.top) <= 2);
          if (!group) {
            group = { top: token.top, words: [] };
            groups.push(group);
          }
          group.words.push(token);
        }
        groups.sort((a, b) => a.top - b.top);
        const lines = groups.map((group) => group.words.sort((a, b) => a.left - b.left).map((item) => item.word).join(' '));

        const header = document.querySelector('.site-header');
        const brand = document.querySelector('.brand');
        const desktopNav = document.querySelector('.desktop-nav');
        const desktopCta = document.querySelector('.header-cta');
        const menu = document.querySelector('.menu-button');
        const rect = (element) => element ? element.getBoundingClientRect().toJSON() : null;
        const visible = (element) => element && getComputedStyle(element).display !== 'none';
        const brandRect = rect(brand);
        const navRect = visible(desktopNav) ? rect(desktopNav) : null;
        const ctaRect = visible(desktopCta) ? rect(desktopCta) : null;

        return {
          text: heading.innerText.trim(),
          lines,
          headingFont: getComputedStyle(heading).fontSize,
          headingWidth: Math.round(heading.getBoundingClientRect().width),
          headerHeight: Math.round(header.getBoundingClientRect().height),
          brandFont: getComputedStyle(document.querySelector('.brand-name')).fontSize,
          credentialFont: getComputedStyle(document.querySelector('.brand-sub')).fontSize,
          navFont: visible(desktopNav) ? getComputedStyle(desktopNav.querySelector('a')).fontSize : null,
          ctaFont: visible(desktopCta) ? getComputedStyle(desktopCta).fontSize : null,
          desktopNavVisible: visible(desktopNav),
          menuVisible: visible(menu),
          headerOverlap: Boolean(
            brandRect && navRect && brandRect.right + 12 > navRect.left ||
            navRect && ctaRect && navRect.right + 12 > ctaRect.left
          ),
        };
      })()`);

      results.push({ viewport, width, page: pageName, ...layout });
    }
  }

  client.close();
  const singles = results.filter((item) => item.lines.some((line) => line.trim().split(' ').filter(Boolean).length === 1));
  const overlaps = results.filter((item) => item.headerOverlap);
  console.log(JSON.stringify({
    summary: {
      pagesChecked: results.length,
      singleWordLineCount: singles.length,
      headerOverlapCount: overlaps.length,
    },
    singleWordLines: singles.map((item) => ({ viewport: item.viewport, page: item.page, lines: item.lines })),
    headerOverlaps: overlaps.map((item) => ({ viewport: item.viewport, page: item.page })),
    results,
  }, null, 2));
} finally {
  browser.kill('SIGTERM');
  await sleep(250);
  await rm(profile, { recursive: true, force: true });
}
