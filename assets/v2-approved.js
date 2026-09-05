/*
 * Stacey Girdner V2 approved overlay
 * Preserve Version 11.5 and apply only explicit post-call decisions.
 */

(() => {
  const base = '/stacey-girdner-site';
  const contactPath = `${base}/contact/`;
  const web3FormsEndpoint = 'https://api.web3forms.com/submit';
  // Stacey will provide the site-specific Web3Forms access key before live activation.
  const web3FormsAccessKey = '';

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
      '/approach': 'approach',
      '/individual': 'individual',
      '/couples': 'couples',
      '/executives': 'professional',
      '/life-transitions': 'transitions',
      '/faq': 'faq',
      '/contact': 'contact',
      '/policies': 'policies',
    })[path] || '';
  };

  const photoCredits = {
    home: ['Jan Tinneberg', 'https://unsplash.com/@craft_ear'],
    transitions: ['Chris Lawton', 'https://unsplash.com/@chrislawton'],
    faq: ['Jukan Tateisi', 'https://unsplash.com/@tateisimikito'],
    contact: ['Ambrose Chua', 'https://unsplash.com/@serverwentdown'],
    policies: ['Javier Allegue Barros', 'https://unsplash.com/@soymeraki'],
    individual: ['Jeremy Bishop', 'https://unsplash.com/@jeremybishop'],
    couples: ['Gregoire Jeanneau', 'https://unsplash.com/@gregjeanneau'],
    professional: ['Nicholas Sampson', 'https://unsplash.com/@nicholassampson'],
    approach: ['Simon Gibson', 'https://unsplash.com/@onedharma'],
  };

  const addPhotoCredit = (route) => {
    const credit = photoCredits[route];
    if (!credit) return;

    const media = document.querySelector(route === 'home' ? '.home-media' : '.editorial-media');
    const image = media?.querySelector(':scope > img');
    if (!media || !image || media.querySelector(':scope > .photo-credit')) return;

    const caption = document.createElement('p');
    caption.className = 'photo-credit';
    const link = document.createElement('a');
    link.href = credit[1];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `Photo by ${credit[0]}`;
    link.setAttribute('aria-label', `Photo by ${credit[0]} on Unsplash`);
    caption.append(link);
    image.insertAdjacentElement('afterend', caption);
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

    const pathwayGrid = document.querySelector('.pathway-section .pathway-grid');
    if (pathwayGrid && pathwayGrid.dataset.v2Pathways !== 'true') {
      const pathways = [
        {
          number: '01',
          title: 'Individual',
          description: 'A private place to understand what you feel, what you avoid, and the patterns shaping your choices.',
          href: `${base}/individual/`,
        },
        {
          number: '02',
          title: 'Couples',
          description: 'Understand the pattern between you, the histories each of you brings, and what becomes possible when both partners feel more seen.',
          href: `${base}/couples/`,
        },
        {
          number: '03',
          title: 'Professional',
          description: 'A confidential space to think more honestly about work, relationships, ambition, identity, and the cost of carrying so much.',
          href: `${base}/executives/`,
        },
        {
          number: '04',
          title: 'Transitions',
          description: 'Empty nest, retirement, caregiving, loss, relocation, and other transitions can unsettle a familiar sense of identity.',
          href: `${base}/life-transitions/`,
        },
      ];

      const cards = pathways.map(({ number, title, description, href }) => {
        const card = document.createElement('a');
        card.href = href;
        card.className = 'pathway-card';
        card.setAttribute('aria-label', `${title} therapy`);
        card.innerHTML = `<span>${number}</span><h3>${title}</h3><p>${description}</p>`;
        return card;
      });

      pathwayGrid.replaceChildren(...cards);
      pathwayGrid.dataset.v2Pathways = 'true';
    }
  };

  const updateAbout = () => {
    const page = document.querySelector('.editorial-page');
    if (!page) return;

    const portrait = page.querySelector('.editorial-media > img');
    if (portrait) {
      portrait.src = `${base}/images/stacey-portrait-2023.jpg`;
      portrait.alt = 'Dr. Stacey Girdner';
    }

    const quote = page.querySelector('.editorial-media .image-note');
    if (quote) {
      quote.classList.add('v2-about-quote');
      quote.querySelector('.eyebrow')?.remove();
    }

    const approachButton = [...page.querySelectorAll('a')].find((link) =>
      /learn about my approach/i.test(link.textContent || '')
    );
    if (approachButton) approachButton.href = `${base}/approach/`;

    document.querySelector('#psychodynamic-approach')?.remove();
  };

  const updateApproach = () => {
    const image = document.querySelector('.editorial-media > img');
    if (image) {
      image.src = `${base}/images/approach-leaf-simon-gibson.webp`;
      image.alt = 'A brown maple leaf caught on a dark metal fence';
    }
    document.querySelector('.editorial-media .image-note')?.remove();
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

    const firstAnswer = document.querySelector('.faq-list details:first-child p');
    if (firstAnswer) {
      firstAnswer.textContent = 'The free consultation is a brief, 15-minute conversation. We will hear what is bringing you in, answer practical questions, and begin to see whether working together feels like a good fit. You do not need to know exactly what to say before you call.';
    }

    document.querySelector('.faq-reflection')?.remove();
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

    const form = document.querySelector('.contact-form');
    if (!form || form.dataset.v2Form === 'true') return;
    form.dataset.v2Form = 'true';

    const messageField = form.querySelector('textarea[name="message"]')?.closest('label');
    messageField?.remove();

    const makeSelectField = (labelText, name, options) => {
      const label = document.createElement('label');
      label.className = 'contact-form-choice';
      const text = document.createElement('span');
      text.textContent = labelText;
      const select = document.createElement('select');
      select.name = name;
      select.required = true;
      const prompt = document.createElement('option');
      prompt.value = '';
      prompt.textContent = 'Please choose';
      prompt.disabled = true;
      prompt.selected = true;
      select.append(prompt);
      options.forEach(([value, textValue]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = textValue;
        select.append(option);
      });
      label.append(text, select);
      return label;
    };

    const submit = form.querySelector('button[type="submit"]');
    if (!submit) return;
    submit.textContent = 'Schedule a Consultation';

    const choiceFields = document.createDocumentFragment();
    choiceFields.append(
      makeSelectField('How should Stacey reach you?', 'contact_method', [
        ['email', 'Email'],
        ['phone', 'Phone'],
        ['either', 'Either email or phone'],
      ]),
      makeSelectField('When is a good time to reach you?', 'contact_time', [
        ['morning', 'Morning'],
        ['afternoon', 'Afternoon'],
        ['evening', 'Evening'],
      ])
    );
    form.insertBefore(choiceFields, submit);

    const honeypot = document.createElement('input');
    honeypot.type = 'checkbox';
    honeypot.name = 'botcheck';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.className = 'contact-form-honeypot';
    form.append(honeypot);

    const status = document.createElement('p');
    status.className = 'contact-form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.insertBefore(status, submit);

    const privacyNote = form.querySelector('small');
    privacyNote?.remove();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (honeypot.checked) {
        form.reset();
        status.textContent = 'Thank you. Stacey will be in touch.';
        return;
      }

      if (!web3FormsAccessKey) {
        status.textContent = 'The contact form is being prepared. Please call or email Stacey directly for now.';
        return;
      }

      const formData = new FormData(form);
      formData.set('access_key', web3FormsAccessKey);
      formData.set('subject', 'New consultation request from staceygirdner.com');
      formData.set('from_name', 'Stacey Girdner Website');
      formData.set('replyto', String(formData.get('email') || ''));
      formData.delete('message');

      submit.disabled = true;
      submit.textContent = 'Sending…';
      status.textContent = 'Sending your request…';

      try {
        const response = await fetch(web3FormsEndpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error('Relay rejected the submission');
        form.reset();
        status.textContent = 'Thank you. Stacey will be in touch using your preferred method and time.';
      } catch (error) {
        console.error('[Contact form]', error);
        status.textContent = 'We could not send the form right now. Please email stacey@staceygirdner.com directly.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Schedule a Consultation';
      }
    });
  };

  const applyPage = () => {
    const main = document.querySelector('main');
    if (!main || main.dataset.v2Applied === 'true') return;

    const route = routeKey();
    if (route === 'home') updateHome();
    if (route === 'about') updateAbout();
    if (route === 'approach') updateApproach();
    if (route === 'individual') updateIndividual();
    if (route === 'couples') updateCouples();
    if (route === 'faq') updateFaq();
    if (route === 'contact') updateContact();
    if (route === 'policies') updatePolicies();
    addPhotoCredit(route);

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
