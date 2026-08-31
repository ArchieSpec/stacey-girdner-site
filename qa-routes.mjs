import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE_URL = 'http://localhost:4178/stacey-girdner-site';
const items = [
  ['Home', '/'],
  ['About', '/about/'],
  ['Individual', '/individual/'],
  ['Couples', '/couples/'],
  ['Professional', '/executives/'],
  ['Transitions', '/life-transitions/'],
  ['FAQ', '/faq/'],
  ['Contact', '/contact/'],
  ['Consultation', '/contact/'],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Browser is still starting.
    }
    await sleep(100);
  }
  throw new Error(`Chromium debugger did not start on port ${port}`);
}

async function createPage(port, url) {
  const response = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: 'PUT' },
  );
  if (!response.ok) throw new Error(`Unable to create browser page: ${response.status}`);
  return response.json();
}

function createCdpClient(webSocketDebuggerUrl) {
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
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  async function send(method, params = {}) {
    await ready;
    const id = ++sequence;
    const promise = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    socket.send(JSON.stringify({ id, method, params }));
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

async function waitForPage(client, predicate, label) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = await client.evaluate(`(() => Boolean(${predicate}))()`);
    if (result) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function navigate(client, url) {
  await client.send('Page.navigate', { url });
  await waitForPage(
    client,
    `document.readyState === 'complete' && document.querySelector('main') && document.querySelector('[data-v2-applied="true"]')`,
    url,
  );
  await sleep(200);
}

async function assertPage(client, expectedPath, label) {
  const state = await client.evaluate(`(() => ({
    path: window.location.pathname,
    title: document.title,
    mainText: (document.querySelector('main')?.innerText || '').trim(),
    bodyColor: getComputedStyle(document.body).backgroundColor,
    rootChildren: document.querySelector('#root')?.children.length || 0,
  }))()`);
  const normalized = state.path.replace('/stacey-girdner-site', '').replace(/\/$/, '') || '/';
  const expected = expectedPath.replace(/\/$/, '') || '/';
  if (normalized !== expected) {
    throw new Error(`${label}: expected ${expectedPath}, reached ${state.path}`);
  }
  if (state.mainText.length < 80 || state.rootChildren < 1) {
    throw new Error(`${label}: rendered content is blank or incomplete`);
  }
  if (state.bodyColor === 'rgb(0, 0, 0)') {
    throw new Error(`${label}: black-screen body detected`);
  }
  return state;
}

async function clickByText(client, selector, text) {
  const result = await client.evaluate(`(() => {
    const node = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((item) => item.textContent.trim() === ${JSON.stringify(text)});
    if (!node) return { ok: false, available: [...document.querySelectorAll(${JSON.stringify(selector)})].map((item) => item.textContent.trim()) };
    node.click();
    return { ok: true };
  })()`);
  if (!result.ok) throw new Error(`Could not find ${text}; available: ${result.available.join(', ')}`);
}

async function runViewport(name, width, height, port) {
  const profile = `/tmp/stacey-qa-${name}`;
  await rm(profile, { recursive: true, force: true });
  const browser = spawn('chromium', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    await waitForDebugger(port);
    const page = await createPage(port, `${BASE_URL}/`);
    const client = createCdpClient(page.webSocketDebuggerUrl);
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await navigate(client, `${BASE_URL}/`);

    const results = [];
    const navSelector = width <= 720 ? '.mobile-nav a' : '.desktop-nav a, .header-cta';

    for (const [label, path] of items) {
      await navigate(client, `${BASE_URL}/`);
      if (width <= 720) {
        await client.evaluate(`document.querySelector('.menu-button')?.click()`);
        await waitForPage(client, `document.querySelector('.mobile-nav')`, 'mobile menu');
      }
      const clickLabel = width <= 720 && label === 'Consultation'
        ? 'Schedule a Consultation'
        : label;
      await clickByText(client, navSelector, clickLabel);
      await waitForPage(
        client,
        `document.readyState === 'complete' && document.querySelector('[data-v2-applied="true"]') && (document.querySelector('main')?.innerText || '').trim().length > 80`,
        label,
      );
      await sleep(250);
      const state = await assertPage(client, path, `${name} ${label}`);
      results.push({ viewport: name, interaction: `nav:${label}`, path: state.path, pass: true });
    }

    await navigate(client, `${BASE_URL}/`);
    await clickByText(client, 'a', 'Schedule a Consultation');
    await waitForPage(client, `window.location.pathname.includes('/contact') && document.querySelector('.contact-form')`, 'Home consultation CTA');
    await assertPage(client, '/contact/', `${name} Home CTA`);
    results.push({ viewport: name, interaction: 'home:Schedule a Consultation', path: '/contact/', pass: true });

    await navigate(client, `${BASE_URL}/faq/`);
    const faq = await client.evaluate(`(() => {
      const detail = document.querySelector('.faq-list details');
      detail?.querySelector('summary')?.click();
      return { open: detail?.open === true, text: detail?.querySelector('p')?.innerText || '' };
    })()`);
    if (!faq.open || faq.text.length < 20) throw new Error(`${name} FAQ disclosure did not open`);
    results.push({ viewport: name, interaction: 'faq:first disclosure', path: '/faq/', pass: true });

    await navigate(client, `${BASE_URL}/`);
    await clickByText(client, '.footer-links a', 'Fees, policies + parking');
    await waitForPage(
      client,
      `window.location.pathname.includes('/policies') && document.querySelector('[data-v2-applied="true"]') && (document.querySelector('main')?.innerText || '').trim().length > 80`,
      'Policies link',
    );
    await assertPage(client, '/policies/', `${name} policies footer link`);
    results.push({ viewport: name, interaction: 'footer:Fees, policies + parking', path: '/policies/', pass: true });

    await navigate(client, `${BASE_URL}/contact/`);
    const formState = await client.evaluate(`(() => ({
      form: Boolean(document.querySelector('.contact-form')),
      button: document.querySelector('.contact-form button')?.textContent.trim(),
      inputs: document.querySelectorAll('.contact-form input, .contact-form textarea').length,
    }))()`);
    if (!formState.form || formState.button !== 'Schedule a Consultation' || formState.inputs !== 4) {
      throw new Error(`${name} contact form structure or CTA label failed`);
    }
    results.push({ viewport: name, interaction: 'contact:form present, not submitted', path: '/contact/', pass: true });

    client.close();
    return results;
  } finally {
    browser.kill('SIGTERM');
    await sleep(250);
    await rm(profile, { recursive: true, force: true });
  }
}

const results = [
  ...(await runViewport('mobile-390', 390, 844, 9225)),
  ...(await runViewport('desktop-1440', 1440, 1000, 9226)),
];

console.log(JSON.stringify({ passed: results.length, failed: 0, results }, null, 2));
