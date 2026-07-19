/* ==========================================================================
   DagenWeb — script.js
   Vanilla JS, no dependencies. Organized top to bottom as:
     1. Site content data (EDIT THIS to change hero/about/services/projects)
     2. Arabic translation + language toggle (EN/AR, with RTL)
     3. Content load/save helpers (localStorage)
     4. Render functions (turn content data into DOM)
     5. Scroll fade-in animation
     6. Mobile nav toggle
     7. Admin: auth + login modal
     8. Admin: dashboard panel (edit content, add/remove projects, etc.)
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. SITE CONTENT DATA
     ------------------------------------------------------------------------
     This is the single source of truth for everything rendered on the page.
     Edit these values directly to change copy, skills, services, or add
     projects — no HTML editing required. To add a new project, just add
     another object to the `projects` array.
     ======================================================================== */

  var DEFAULT_CONTENT = {
    hero: {
      eyebrow: 'Hi, my name is',
      name: 'Eng Hamzah',
      tagline: 'I design and build fast, accessible web applications with clean, maintainable code.',
      ctaText: 'View My Work'
    },

    about: {
      bio: 'I\'m a developer who enjoys turning ideas into simple, well-built products. I care about readable code, good performance, and details that make an interface feel right.\n\nOutside of client work I like exploring new tools and contributing to small open-source projects.',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Git']
    },

    services: [
      { icon: '💻', title: 'Web Development', description: 'Custom websites and web apps built with clean, maintainable code and modern best practices.' },
      { icon: '📱', title: 'Responsive Design', description: 'Interfaces that look and work great on every screen size, from phones to large desktop monitors.' },
      { icon: '⚙️', title: 'API Integration', description: 'Connecting your app to third-party services, payment providers, and internal APIs.' },
      { icon: '🚀', title: 'Performance Optimization', description: 'Auditing and speeding up slow sites — load time, rendering, and asset delivery.' }
    ],

    /* Swap `image` for your own screenshots in /assets, and `liveUrl` /
       `codeUrl` for your real links. assets/project-placeholder.svg is a
       generic placeholder used until you do. Set a URL to '#' to hide
       that link on the card entirely (see renderPortfolio below). */
    projects: [
      {
        title: 'GameRoll',
        description: 'A random game picker for indecisive gamers — roll a die, spin a wheel, or take a 20-question personality quiz to get matched with a game from a curated library of 100 titles, with optional filtering by genre, mode, mood, and difficulty.',
        image: 'assets/project-gameroll.svg',
        liveUrl: 'https://simon-dagenhart.github.io/Gameroll/',
        codeUrl: '#'
      },
      {
        title: 'Learn it twisted',
        description: 'A full multi-page website for a K-5 school — home, about, academics, admissions, news, events, and student success stories, built to feel warm and welcoming for parents and prospective families.',
        image: 'assets/project-school.svg',
        liveUrl: 'https://simon-dagenhart.github.io/Maple-school/',
        codeUrl: '#'
      },
      {
        title: 'Up Is To Go',
        description: 'A personal teaching and web-development site — live online English and computer-skills lessons taught by Mr. Hamzah (Al-Sindbad School, Cambridge Institution), plus custom websites built for small businesses.',
        image: 'assets/project-upistogo.svg',
        liveUrl: 'https://simon-dagenhart.github.io/Studies/',
        codeUrl: '#'
      },
      {
        title: 'Your Project',
        description: 'This is what we provide — custom, fast, and reliable websites built from scratch and tailored to what you need, from simple portfolios to full multi-page platforms. Get in touch and let\'s build yours next.',
        image: 'assets/project-your-project.svg',
        liveUrl: '#',
        codeUrl: '#'
      }
    ],

    contact: {
      intro: 'Have a project in mind or just want to say hi? My inbox is open.',
      email: 'simonkazage007@gmail.com',
      phone: '+964 781 9767 081',
      socials: [
        { label: 'GitHub', url: 'https://github.com/Simon-Dagenhart' },
        { label: 'Instagram', url: 'https://instagram.com/simonb8w' }
      ]
    }
  };

  /* ========================================================================
     2. ARABIC TRANSLATION + LANGUAGE TOGGLE
     ------------------------------------------------------------------------
     CONTENT_AR mirrors DEFAULT_CONTENT's shape exactly and is what renders
     when Arabic is selected. It's a fixed translation, not admin-editable —
     if you change DEFAULT_CONTENT (e.g. add a project), update CONTENT_AR
     to match by hand. Emails/phone/social links/skills are left as-is
     since those aren't translatable.
     ======================================================================== */

  var CONTENT_AR = {
    hero: {
      eyebrow: 'مرحبًا، اسمي',
      name: 'م. حمزة',
      tagline: 'أصمم وأطوّر تطبيقات ويب سريعة وسهلة الاستخدام بشيفرة نظيفة وقابلة للصيانة.',
      ctaText: 'أعمالي'
    },

    about: {
      bio: 'أنا مطوّر أستمتع بتحويل الأفكار إلى منتجات بسيطة ومُتقنة. أهتم بالشيفرة الواضحة، والأداء الجيد، والتفاصيل التي تجعل الواجهة مريحة للاستخدام.\n\nإلى جانب العمل مع العملاء، أحب تجربة أدوات جديدة والمساهمة في مشاريع صغيرة مفتوحة المصدر.',
      skills: DEFAULT_CONTENT.about.skills
    },

    services: [
      { icon: '💻', title: 'تطوير المواقع', description: 'مواقع وتطبيقات ويب مخصصة، مبنية بشيفرة نظيفة وأفضل الممارسات الحديثة.' },
      { icon: '📱', title: 'تصميم متجاوب', description: 'واجهات تعمل وتبدو رائعة على كل حجم شاشة، من الهواتف إلى شاشات الحاسوب الكبيرة.' },
      { icon: '⚙️', title: 'ربط واجهات برمجية', description: 'ربط تطبيقك بخدمات خارجية، وبوابات دفع، وواجهات برمجية داخلية.' },
      { icon: '🚀', title: 'تحسين الأداء', description: 'تدقيق وتسريع المواقع البطيئة — وقت التحميل، والعرض، وتسليم الملفات.' }
    ],

    projects: [
      {
        title: 'GameRoll',
        description: 'أداة اختيار عشوائي للألعاب لمن يصعب عليهم الاختيار — ارمِ نردًا، أو أدر العجلة، أو أجب عن استبيان شخصية من 20 سؤالًا لتحصل على لعبة مناسبة من مكتبة تضم 100 لعبة، مع إمكانية التصفية حسب النوع ونمط اللعب والمزاج ومستوى الصعوبة.',
        image: DEFAULT_CONTENT.projects[0].image,
        liveUrl: DEFAULT_CONTENT.projects[0].liveUrl,
        codeUrl: DEFAULT_CONTENT.projects[0].codeUrl
      },
      {
        title: 'Learn it twisted',
        description: 'موقع متكامل متعدد الصفحات لمدرسة ابتدائية (من الروضة حتى الصف الخامس) — يشمل الرئيسية، ونبذة عن المدرسة، والمناهج، والقبول، والأخبار، والفعاليات، وقصص نجاح الطلاب، صُمّم ليكون دافئًا ومرحّبًا بالعائلات.',
        image: DEFAULT_CONTENT.projects[1].image,
        liveUrl: DEFAULT_CONTENT.projects[1].liveUrl,
        codeUrl: DEFAULT_CONTENT.projects[1].codeUrl
      },
      {
        title: 'Up Is To Go',
        description: 'موقع شخصي للتدريس وتطوير المواقع — دروس مباشرة عبر الإنترنت في اللغة الإنجليزية ومهارات الحاسوب يقدّمها الأستاذ حمزة (مدرسة السندباد، ومعهد كامبردج)، بالإضافة إلى مواقع ويب مخصصة للشركات الصغيرة.',
        image: DEFAULT_CONTENT.projects[2].image,
        liveUrl: DEFAULT_CONTENT.projects[2].liveUrl,
        codeUrl: DEFAULT_CONTENT.projects[2].codeUrl
      },
      {
        title: 'مشروعك القادم',
        description: 'هذا ما نقدّمه — مواقع مخصصة وسريعة وموثوقة، مبنية من الصفر ووفق احتياجاتك، من معارض أعمال بسيطة إلى منصات متعددة الصفحات. تواصل معنا ولنبنِ موقعك القادم.',
        image: DEFAULT_CONTENT.projects[3].image,
        liveUrl: DEFAULT_CONTENT.projects[3].liveUrl,
        codeUrl: DEFAULT_CONTENT.projects[3].codeUrl
      }
    ],

    contact: {
      intro: 'لديك مشروع في ذهنك أو تريد فقط إلقاء التحية؟ صندوق بريدي مفتوح دائمًا.',
      email: DEFAULT_CONTENT.contact.email,
      phone: DEFAULT_CONTENT.contact.phone,
      socials: DEFAULT_CONTENT.contact.socials
    }
  };

  // Static UI strings that live in HTML, not in the content objects above
  // (nav links, section headings, footer, project-card link labels).
  var STRINGS = {
    en: {
      navAbout: 'About', navServices: 'Services', navPortfolio: 'Portfolio', navContact: 'Contact',
      secAboutTitle: 'About Me', secServicesTitle: 'What I Do', secPortfolioTitle: 'Portfolio', secContactTitle: 'Get In Touch',
      footerRights: 'All rights reserved.',
      visitSite: 'Visit Site ↗', code: 'Code ↗',
      langToggle: 'العربية'
    },
    ar: {
      navAbout: 'نبذة', navServices: 'خدماتي', navPortfolio: 'أعمالي', navContact: 'تواصل',
      secAboutTitle: 'نبذة عني', secServicesTitle: 'ماذا أقدّم', secPortfolioTitle: 'أعمالي', secContactTitle: 'تواصل معي',
      footerRights: 'جميع الحقوق محفوظة.',
      visitSite: 'زيارة الموقع ↗', code: 'الكود ↗',
      langToggle: 'English'
    }
  };

  var LANG_KEY = 'dagenweb_lang';
  var currentLang = localStorage.getItem(LANG_KEY) === 'ar' ? 'ar' : 'en';

  function applyStaticStrings(lang) {
    var s = STRINGS[lang];
    document.getElementById('navAbout').textContent = s.navAbout;
    document.getElementById('navServices').textContent = s.navServices;
    document.getElementById('navPortfolio').textContent = s.navPortfolio;
    document.getElementById('navContact').textContent = s.navContact;
    document.getElementById('secAboutTitle').textContent = s.secAboutTitle;
    document.getElementById('secServicesTitle').textContent = s.secServicesTitle;
    document.getElementById('secPortfolioTitle').textContent = s.secPortfolioTitle;
    document.getElementById('secContactTitle').textContent = s.secContactTitle;
    document.getElementById('footerRights').textContent = s.footerRights;
    document.getElementById('langToggle').textContent = s.langToggle;
  }

  // Exposed on the module scope (via closure) so renderPortfolio can read
  // the current language's link labels without needing its own parameter.
  function currentProjectLinkLabels() {
    return { visitSite: STRINGS[currentLang].visitSite, code: STRINGS[currentLang].code };
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyStaticStrings(lang);
    renderAll(lang === 'ar' ? CONTENT_AR : currentContent);
  }

  /* ========================================================================
     3. CONTENT LOAD / SAVE (localStorage)
     ------------------------------------------------------------------------
     Because GitHub Pages is static hosting with no server/database, admin
     edits are saved to the browser's localStorage rather than a real
     backend. That means:
       - Edits persist only on the device/browser you edited from.
       - Other visitors always see DEFAULT_CONTENT above, unless you use
         the admin panel's "Export JSON" button and paste the result back
         into DEFAULT_CONTENT here, then re-publish the site.
     ======================================================================== */

  var STORAGE_KEY = 'dagenweb_content';

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadContent() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepClone(DEFAULT_CONTENT);
    try {
      return JSON.parse(raw);
    } catch (err) {
      return deepClone(DEFAULT_CONTENT);
    }
  }

  function persistContent(content) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }

  var currentContent = loadContent();

  /* ========================================================================
     4. RENDER FUNCTIONS
     ------------------------------------------------------------------------
     Content is rendered via the DOM API (createElement/textContent) rather
     than innerHTML, so admin-entered text can never be interpreted as HTML.
     ======================================================================== */

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function renderHero(content) {
    document.getElementById('heroEyebrow').textContent = content.hero.eyebrow;
    document.getElementById('heroName').textContent = content.hero.name;
    document.getElementById('heroTagline').textContent = content.hero.tagline;
    document.getElementById('heroCta').textContent = content.hero.ctaText;
  }

  function renderAbout(content) {
    document.getElementById('aboutBio').textContent = content.about.bio;

    var skillsEl = document.getElementById('aboutSkills');
    clearChildren(skillsEl);
    content.about.skills.forEach(function (skill) {
      var tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      skillsEl.appendChild(tag);
    });
  }

  function renderServices(content) {
    var grid = document.getElementById('servicesGrid');
    clearChildren(grid);
    content.services.forEach(function (service) {
      var card = document.createElement('div');
      card.className = 'service-card';

      var icon = document.createElement('div');
      icon.className = 'service-card__icon';
      icon.textContent = service.icon;

      var title = document.createElement('h3');
      title.className = 'service-card__title';
      title.textContent = service.title;

      var desc = document.createElement('p');
      desc.className = 'service-card__desc';
      desc.textContent = service.description;

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      grid.appendChild(card);
    });
  }

  function renderPortfolio(content) {
    var grid = document.getElementById('portfolioGrid');
    clearChildren(grid);
    content.projects.forEach(function (project) {
      var card = document.createElement('div');
      card.className = 'project-card';

      var imageWrap = document.createElement('div');
      imageWrap.className = 'project-card__image-wrap';
      var img = document.createElement('img');
      img.className = 'project-card__image';
      img.src = project.image;
      img.alt = project.title;
      img.loading = 'lazy';
      imageWrap.appendChild(img);

      var body = document.createElement('div');
      body.className = 'project-card__body';

      var title = document.createElement('h3');
      title.className = 'project-card__title';
      title.textContent = project.title;

      var desc = document.createElement('p');
      desc.className = 'project-card__desc';
      desc.textContent = project.description;

      var links = document.createElement('div');
      links.className = 'project-card__links';

      // Only render a link if it actually points somewhere (URL isn't '#').
      // Lets a project show just "Live Site" with no repo, just "Code" with
      // no live demo, or both — set the unused field to '#' to hide it.
      var linkLabels = currentProjectLinkLabels();
      if (project.liveUrl && project.liveUrl !== '#') {
        var liveLink = document.createElement('a');
        liveLink.href = project.liveUrl;
        liveLink.textContent = linkLabels.visitSite;
        liveLink.target = '_blank';
        liveLink.rel = 'noopener noreferrer';
        links.appendChild(liveLink);
      }

      if (project.codeUrl && project.codeUrl !== '#') {
        var codeLink = document.createElement('a');
        codeLink.href = project.codeUrl;
        codeLink.textContent = linkLabels.code;
        codeLink.target = '_blank';
        codeLink.rel = 'noopener noreferrer';
        links.appendChild(codeLink);
      }

      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(links);

      card.appendChild(imageWrap);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderContact(content) {
    document.getElementById('contactIntro').textContent = content.contact.intro;

    var emailLink = document.getElementById('contactEmail');
    emailLink.textContent = content.contact.email;
    emailLink.href = 'mailto:' + content.contact.email;

    var phoneLink = document.getElementById('contactPhone');
    phoneLink.textContent = content.contact.phone;
    // tel: links want digits/plus only — strip spaces for the href but
    // keep the human-readable, spaced version as the visible text.
    phoneLink.href = 'tel:' + content.contact.phone.replace(/\s+/g, '');

    var socialsEl = document.getElementById('contactSocials');
    clearChildren(socialsEl);
    content.contact.socials.forEach(function (social) {
      var a = document.createElement('a');
      a.href = social.url;
      a.textContent = social.label;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      socialsEl.appendChild(a);
    });
  }

  function renderAll(content) {
    renderHero(content);
    renderAbout(content);
    renderServices(content);
    renderPortfolio(content);
    renderContact(content);
  }

  applyLanguage(currentLang);
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('langToggle').addEventListener('click', function () {
    applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });

  /* ========================================================================
     5. SCROLL FADE-IN ANIMATION
     ======================================================================== */

  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    // No IntersectionObserver support — just show everything.
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ========================================================================
     6. MOBILE NAV TOGGLE
     ======================================================================== */

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ========================================================================
     7. ADMIN: AUTH + LOGIN MODAL
     ------------------------------------------------------------------------
     IMPORTANT — read this before relying on it:
     This site has no server, so there is no way to do *real* authentication.
     Anyone who opens browser dev tools and reads this file can see the
     credentials below. This check only keeps the admin panel from showing
     up to casual visitors who click around — it is NOT security. Do not
     put anything here you wouldn't want a determined visitor to see.

     CHANGE THESE before you publish the site:
     ======================================================================== */
  var ADMIN_USERNAME = 'admin';
  var ADMIN_PASSWORD = 'change-this-password';

  var SESSION_KEY = 'dagenweb_admin_session';

  function isAdminAuthed() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  var loginModal = document.getElementById('loginModal');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');
  var adminAccessBtn = document.getElementById('adminAccess');

  function openModal(modalEl) {
    modalEl.hidden = false;
  }
  function closeModal(modalEl) {
    modalEl.hidden = true;
  }

  function openLoginModal() {
    loginError.textContent = '';
    loginForm.reset();
    openModal(loginModal);
    document.getElementById('loginUsername').focus();
  }

  adminAccessBtn.addEventListener('click', function () {
    if (isAdminAuthed()) {
      openAdminPanel();
    } else {
      openLoginModal();
    }
  });

  document.getElementById('loginClose').addEventListener('click', function () {
    closeModal(loginModal);
  });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      closeModal(loginModal);
      openAdminPanel();
    } else {
      loginError.textContent = 'Incorrect username or password.';
    }
  });

  // Close any modal by clicking its dark overlay (but not its content box).
  [loginModal, document.getElementById('adminPanel')].forEach(function (modalEl) {
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) closeModal(modalEl);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!loginModal.hidden) closeModal(loginModal);
      if (!adminPanel.hidden) closeModal(adminPanel);
    }
  });

  // Visiting the page with #admin in the URL jumps straight to the login
  // (or the dashboard, if already logged in this session).
  function checkAdminHash() {
    if (window.location.hash === '#admin') {
      if (isAdminAuthed()) openAdminPanel();
      else openLoginModal();
    }
  }
  window.addEventListener('load', checkAdminHash);
  window.addEventListener('hashchange', checkAdminHash);

  /* ========================================================================
     8. ADMIN: DASHBOARD PANEL
     ------------------------------------------------------------------------
     The panel edits a working copy (`formState`) of the content. Nothing
     touches the live site or localStorage until "Save Changes" is clicked.
     ======================================================================== */

  var adminPanel = document.getElementById('adminPanel');
  var adminForm = document.getElementById('adminForm');
  var saveStatus = document.getElementById('saveStatus');
  var formState = null;

  function openAdminPanel() {
    formState = deepClone(currentContent);
    populateAdminForm();
    saveStatus.textContent = '';
    openModal(adminPanel);
  }

  document.getElementById('adminClose').addEventListener('click', function () {
    closeModal(adminPanel);
  });

  document.getElementById('adminLogout').addEventListener('click', function () {
    sessionStorage.removeItem(SESSION_KEY);
    closeModal(adminPanel);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });

  function populateAdminForm() {
    document.getElementById('fHeroEyebrow').value = formState.hero.eyebrow;
    document.getElementById('fHeroName').value = formState.hero.name;
    document.getElementById('fHeroTagline').value = formState.hero.tagline;
    document.getElementById('fHeroCtaText').value = formState.hero.ctaText;

    document.getElementById('fAboutBio').value = formState.about.bio;
    document.getElementById('fAboutSkills').value = formState.about.skills.join(', ');

    document.getElementById('fContactIntro').value = formState.contact.intro;
    document.getElementById('fContactEmail').value = formState.contact.email;
    document.getElementById('fContactPhone').value = formState.contact.phone;

    renderServicesForm();
    renderProjectsForm();
    renderSocialsForm();
  }

  // --- Hero / About / Contact: simple fields, read on save -------------

  function readSimpleFieldsIntoFormState() {
    formState.hero.eyebrow = document.getElementById('fHeroEyebrow').value.trim();
    formState.hero.name = document.getElementById('fHeroName').value.trim();
    formState.hero.tagline = document.getElementById('fHeroTagline').value.trim();
    formState.hero.ctaText = document.getElementById('fHeroCtaText').value.trim();

    formState.about.bio = document.getElementById('fAboutBio').value;
    formState.about.skills = document.getElementById('fAboutSkills').value
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);

    formState.contact.intro = document.getElementById('fContactIntro').value.trim();
    formState.contact.email = document.getElementById('fContactEmail').value.trim();
    formState.contact.phone = document.getElementById('fContactPhone').value.trim();
  }

  // --- Services: repeatable list ----------------------------------------

  function renderServicesForm() {
    var container = document.getElementById('fServicesList');
    clearChildren(container);
    formState.services.forEach(function (service, index) {
      container.appendChild(buildRepeatableItem({
        fields: [
          { key: 'icon', label: 'Icon (emoji)', value: service.icon },
          { key: 'title', label: 'Title', value: service.title },
          { key: 'description', label: 'Description', value: service.description, textarea: true }
        ],
        onChange: function (key, value) { formState.services[index][key] = value; },
        onRemove: function () {
          formState.services.splice(index, 1);
          renderServicesForm();
        }
      }));
    });
  }

  document.getElementById('addService').addEventListener('click', function () {
    formState.services.push({ icon: '✨', title: 'New Service', description: 'Describe this service.' });
    renderServicesForm();
  });

  // --- Projects: repeatable list -----------------------------------------

  function renderProjectsForm() {
    var container = document.getElementById('fProjectsList');
    clearChildren(container);
    formState.projects.forEach(function (project, index) {
      container.appendChild(buildRepeatableItem({
        fields: [
          { key: 'title', label: 'Title', value: project.title },
          { key: 'description', label: 'Description', value: project.description, textarea: true },
          { key: 'image', label: 'Image path/URL', value: project.image },
          { key: 'liveUrl', label: 'Live site URL', value: project.liveUrl },
          { key: 'codeUrl', label: 'Code repo URL', value: project.codeUrl }
        ],
        onChange: function (key, value) { formState.projects[index][key] = value; },
        onRemove: function () {
          formState.projects.splice(index, 1);
          renderProjectsForm();
        }
      }));
    });
  }

  document.getElementById('addProject').addEventListener('click', function () {
    formState.projects.push({
      title: 'New Project',
      description: 'Describe this project.',
      image: 'assets/project-placeholder.svg',
      liveUrl: '#',
      codeUrl: '#'
    });
    renderProjectsForm();
  });

  // --- Socials: repeatable list -------------------------------------------

  function renderSocialsForm() {
    var container = document.getElementById('fSocialsList');
    clearChildren(container);
    formState.contact.socials.forEach(function (social, index) {
      container.appendChild(buildRepeatableItem({
        fields: [
          { key: 'label', label: 'Label', value: social.label },
          { key: 'url', label: 'URL', value: social.url }
        ],
        onChange: function (key, value) { formState.contact.socials[index][key] = value; },
        onRemove: function () {
          formState.contact.socials.splice(index, 1);
          renderSocialsForm();
        }
      }));
    });
  }

  document.getElementById('addSocial').addEventListener('click', function () {
    formState.contact.socials.push({ label: 'New Link', url: '#' });
    renderSocialsForm();
  });

  // Shared builder for a repeatable-list card (used by services/projects/socials)
  function buildRepeatableItem(config) {
    var item = document.createElement('div');
    item.className = 'admin-repeatable-item';

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'admin-repeatable-item__remove';
    removeBtn.textContent = 'Remove ✕';
    removeBtn.addEventListener('click', config.onRemove);
    item.appendChild(removeBtn);

    config.fields.forEach(function (field) {
      var wrap = document.createElement('div');
      wrap.className = 'form-field';

      var label = document.createElement('label');
      label.textContent = field.label;

      var input = document.createElement(field.textarea ? 'textarea' : 'input');
      if (!field.textarea) input.type = 'text';
      input.value = field.value;
      input.addEventListener('input', function () {
        config.onChange(field.key, input.value);
      });

      wrap.appendChild(label);
      wrap.appendChild(input);
      item.appendChild(wrap);
    });

    return item;
  }

  // --- Save / Export / Reset ---------------------------------------------

  adminForm.addEventListener('submit', function (e) {
    e.preventDefault();
    readSimpleFieldsIntoFormState();
    currentContent = deepClone(formState);
    persistContent(currentContent);
    renderAll(currentLang === 'ar' ? CONTENT_AR : currentContent);
    saveStatus.textContent = 'Saved. Changes are live on this page (this browser only).';
  });

  document.getElementById('exportJson').addEventListener('click', function () {
    readSimpleFieldsIntoFormState();
    var json = JSON.stringify(formState, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'dagenweb-content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    saveStatus.textContent = 'Exported. Paste this into DEFAULT_CONTENT in script.js to publish it for everyone.';
  });

  document.getElementById('resetContent').addEventListener('click', function () {
    if (!window.confirm('Reset all content back to the built-in defaults? This clears your saved edits in this browser.')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    currentContent = deepClone(DEFAULT_CONTENT);
    renderAll(currentLang === 'ar' ? CONTENT_AR : currentContent);
    formState = deepClone(currentContent);
    populateAdminForm();
    saveStatus.textContent = 'Reset to defaults.';
  });

})();
