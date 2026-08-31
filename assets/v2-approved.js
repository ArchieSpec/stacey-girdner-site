/*
 * Stacey Girdner V2 approved overlay
 * Preserve Version 11.5 and apply only explicit post-call decisions.
 */

(() => {
  const base = '/stacey-girdner-site';
  const contactPath = `${base}/contact/`;

  const navigation = [
    ['Home', `${base}/`, 'home'],
    ['About', `${base}/about/`, 'about'],
    ['Individual', `${base}/individual/`, 'individual'],
    ['Couples', `${base}/couples/`, 'couples'],
    ['Professional', `${base}/executives/`, 'professional'],
    ['Transitions', `${base}/life-transitions/`, 'transitions'],
    ['FAQ', `${base}/faq/`, 'faq'],
    ['Contact', contactPath, 'contact'],
  ];

  const routeKey = () => {
    const path = window.location.pathname
      .replace(base, '')
      .replace(/\/+$/, '') || '/';

    return ({
      '/': 'home',
      '/about': 'about',
      '/individual': 'individual',
      '/couples': 'couples',
      '/executives': 'professional',
      '/life-transitions': 'transitions',
      '/faq': 'faq',
      '/contact': 'contact',
    })[path] || '';
  };

  const makeLink = ([label, href, key], current) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (key === current) {
      link.className = 'active';
      link.setAttribute('aria-current', 'page');
    }
    return link;
  };

  const updateNavigation = () => {
    const current = routeKey();

    document.querySelectorAll('.desktop-nav').forEach((nav) => {
      if (nav.dataset.v2Nav === current) return;
      nav.replaceChildren(...navigation.map((item) => makeLink(item, current)));
      nav.dataset.v2Nav = current;
    });

    document.querySelectorAll('.mobile-nav').forEach((nav) => {
      if (nav.dataset.v2Nav === current) return;
      const links = navigation.map((item) => makeLink(item, current));
      const cta = document.createElement('a');
      cta.href = contactPath;
      cta.className = 'mobile-cta';
      cta.textContent = 'Schedule a Consultation';
      links.push(cta);
      nav.replaceChildren(...links);
      nav.dataset.v2Nav = current;
    });

    document.querySelectorAll('.header-cta').forEach((link) => {
      if (link.getAttribute('href') !== contactPath) link.href = contactPath;
      if (link.textContent !== 'Consultation') link.textContent = 'Consultation';
    });
  };

  const updateSharedContent = () => {
    document.querySelectorAll('main h1 br').forEach((lineBreak) => {
      lineBreak.replaceWith(document.createTextNode(' '));
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      if (link.classList.contains('header-cta') || link.classList.contains('mobile-cta')) return;
      if (/consultation|talk|call/i.test(link.textContent || '')) {
        if (link.getAttribute('href') !== contactPath) link.href = contactPath;
        if (link.textContent !== 'Schedule a Consultation') {
          link.textContent = 'Schedule a Consultation';
        }
      }
    });

    document.querySelectorAll('.site-footer .footer-inner > span:first-child').forEach((item) => {
      const footerText = 'Pasadena, California • In-person • Virtual throughout California';
      if (item.textContent !== footerText) item.textContent = footerText;
    });

    document.querySelectorAll('.footer-links a').forEach((link) => {
      if (/fees|policies|parking/i.test(link.textContent || '')) {
        link.href = `${base}/policies/`;
      }
    });

    document.querySelectorAll('.contact-address-card .eyebrow').forEach((item) => {
      const text = item.textContent.replace(/virtual/g, 'Virtual');
      if (item.textContent !== text) item.textContent = text;
    });
  };

  const updateHome = () => {
    const home = document.querySelector('.home-hero-v115');
    if (!home) return;

    const geography = home.querySelector('.home-copy > .eyebrow');
    if (geography) {
      geography.textContent = 'Psychodynamic Therapy in Pasadena • Virtual Across California';
    }

    const image = home.querySelector('.home-media > img');
    if (image) {
      image.src = `${base}/images/contact.jpg`;
      image.alt = 'A teal door opening toward light';
    }

    home.querySelector('.start-mark')?.remove();
    home.querySelector('.home-guiding-quote')?.remove();
    document.querySelector('.home-reflection')?.remove();

    const approachLink = [...home.querySelectorAll('a')].find((link) =>
      /explore how i work/i.test(link.textContent || '')
    );
    if (approachLink) approachLink.href = `${base}/about/#psychodynamic-approach`;
  };

  const updateAbout = () => {
    const page = document.querySelector('.editorial-page');
    if (!page) return;

    const quote = page.querySelector('.editorial-media .image-note');
    if (quote) {
      quote.classList.add('v2-about-quote');
      quote.querySelector('.eyebrow')?.remove();
    }

    const approachButton = [...page.querySelectorAll('a')].find((link) =>
      /learn about my approach/i.test(link.textContent || '')
    );
    if (approachButton) approachButton.href = '#psychodynamic-approach';

    if (!document.querySelector('#psychodynamic-approach')) {
      const section = document.createElement('section');
      section.id = 'psychodynamic-approach';
      section.className = 'v2-approach-section';
      section.innerHTML = `
        <div>
          <span class="eyebrow">Psychodynamic approach</span>
          <h2>Why do I keep doing this, even when I know better?</h2>
        </div>
        <div class="v2-approach-copy">
          <p>Psychodynamic therapy looks beneath the immediate problem. Together, we become curious about the experiences, relationships, and adaptations that shaped how you learned to move through the world.</p>
          <div class="callout">
            <strong>The goal is not to blame the past.</strong>
            <p>It is to understand what still has a hold on the present, so you have more freedom in how you respond now.</p>
          </div>
        </div>`;
      page.insertAdjacentElement('afterend', section);
    }
  };

  const updateIndividual = () => {
    const image = document.querySelector('.editorial-media > img');
    if (image) {
      image.src = `${base}/images/individual-tree.jpg`;
      image.alt = 'Sunlight filtering through the branches of a large tree';
    }

    document.querySelectorAll('.point').forEach((point) => {
      if (point.querySelector('.point-num')?.textContent.trim() === '3') {
        const copy = point.querySelector('p');
        if (copy) {
          copy.textContent = 'Greater self-awareness can make new choices possible - without forcing change before you are ready.';
        }
      }
    });
  };

  const updateCouples = () => {
    const cards = document.querySelectorAll('.mini-card-row > div');
    if (cards[0]) {
      const heading = cards[0].querySelector('strong');
      if (heading) heading.textContent = 'Explore the pattern';
    }
    if (cards[1]) {
      const copy = cards[1].querySelector('p');
      if (copy) {
        copy.textContent = 'Explore the needs, fears, beliefs, and expectations beneath what is being said.';
      }
    }
  };

  const updateFaq = () => {
    const image = document.querySelector('.editorial-media > img');
    if (image) {
      image.src = `${base}/images/faq-approved-staircase.jpg`;
      image.alt = 'A child standing at the base of a monumental staircase';
    }
  };

  const updatePolicies = () => {
    document.querySelectorAll('.mini-card-row strong').forEach((heading) => {
      if (heading.textContent.trim() === 'Cancellation') {
        heading.textContent = 'What happens when schedules change.';
      }
      if (heading.textContent.trim() === 'Parking + arrival') {
        heading.textContent = 'Details about parking and arrival.';
      }
    });
    document.querySelector('.privacy-callout')?.remove();
  };

  const updateContact = () => {
    const image = document.querySelector('.editorial-media > img');
    if (image) {
      image.src = `${base}/images/consultation-orange-stairwell.jpg`;
      image.alt = 'A warm orange curved stairwell';
    }

    const submit = document.querySelector('.contact-form button[type="submit"]');
    if (submit) submit.textContent = 'Schedule a Consultation';
  };

  const applyPage = () => {
    const main = document.querySelector('main');
    if (!main || main.dataset.v2Applied === 'true') return;

    const route = routeKey();
    if (route === 'home') updateHome();
    if (route === 'about') updateAbout();
    if (route === 'individual') updateIndividual();
    if (route === 'couples') updateCouples();
    if (route === 'faq') updateFaq();
    if (route === 'contact') updateContact();
    if (window.location.pathname.replace(/\/+$/, '').endsWith('/policies')) updatePolicies();

    main.dataset.v2Applied = 'true';
  };

  let scheduled = false;
  const apply = () => {
    scheduled = false;
    updateNavigation();
    updateSharedContent();
    applyPage();
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(apply);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  /*
   * Version 11.5 uses client-side Wouter links, which previously produced blank
   * mobile transitions on direct service routes. The route shells already exist,
   * so use dependable document navigation while leaving layout and content intact.
   */
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (!link || event.defaultPrevented || event.button > 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith(base)) return;
    if (url.href === window.location.href) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.href);
  }, true);

  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('load', schedule, { once: true });
  schedule();
})();
