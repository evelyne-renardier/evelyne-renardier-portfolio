/* ═══════════════════════════════════════════════════
   RENARDIER THEME — main.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Theme credit ───
     Console-only, deliberately not visible anywhere on the page --
     credits the theme's creator/developer, distinct from the site's
     owner/content. Every line below sits on its own background chip
     (not a bare foreground color) on purpose: %c has no way to detect
     whether the visitor's DevTools console is light- or dark-themed, so
     a foreground color tuned for one can vanish on the other -- a
     background we control removes that guesswork, same contrast either
     way. Colors are the theme's own real tokens (--accent/--accent-2/
     --accent-l/--text-2), not invented. See docs/architecture.md.

     Resists console.clear() -- overriding it to reprint right after
     clearing means the credit survives a stray/deliberate clear() call
     mid-session, not just the initial page-load print. This can NOT
     survive an actual page reload (a fresh page load is a fresh JS
     context by browser design, nothing site-side can override that) --
     a non-issue regardless, since renardierPrintCredit() already runs
     again on every single page load anyway. */
  function renardierPrintCredit() {
    console.log(
      '%c THÈME %c RENARDIER ',
      'background:#0F4A55;color:#fff;padding:5px 0 5px 11px;border-radius:4px 0 0 4px;font-weight:700;font-family:sans-serif;font-size:12px;letter-spacing:.04em;',
      'background:#176472;color:#fff;padding:5px 11px 5px 0;border-radius:0 4px 4px 0;font-weight:400;font-family:sans-serif;font-size:12px;letter-spacing:.04em;'
    );
    console.log(
      '%cConçu et développé par Reza Belounis',
      'font-family:Georgia,serif;font-size:15px;font-weight:600;background:#176472;color:#fff;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%c→ github.com/r-belounis',
      'font-family:monospace;font-size:12px;background:#4A6468;color:#EAF3F4;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%cPas un thème monolithique — une vraie bibliothèque de composants (esprit Flowbite), 27 blocs testés un par un',
      'font-style:italic;font-size:11px;background:#CBE8EE;color:#0F4A55;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%c👀 Vous jetez un œil au code ? Curiosité appréciée.',
      'font-size:11px;color:#7A7A7A;'
    );
  }
  renardierPrintCredit();
  if (window.console && typeof console.clear === 'function') {
    var renardierRealClear = console.clear;
    console.clear = function () {
      renardierRealClear.apply(console, arguments);
      renardierPrintCredit();
    };
  }

  /* ─── Desktop dropdowns ───
     Hover-only by design (CSS :hover / :focus-within in main.css) -- no
     click-to-toggle JS here. Keyboard users get it via :focus-within
     (tabbing into a link inside .dd keeps it open). */

  /* ─── Mobile nav ───
     The burger IS the close control (icon swaps to ✕ via its own "open"
     class, see main.css) -- one toggle, one element. */
  var burger = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      // Kept in sync with the real open/closed state -- a screen reader
      // announces "collapsed"/"expanded" off this attribute.
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (burger) {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }
  /* Tapping an actual link closes the panel -- matters for same-page
     anchors (e.g. a link back to "#" sections) that don't trigger a full
     navigation/reload, which would otherwise leave the menu stuck open. */
  if (mobileNav) {
    mobileNav.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ─── Mark active nav link ─── */
  var currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a, .dd a, .mobile-nav-links a').forEach(function (link) {
    var linkPath = link.getAttribute('href') || '';
    linkPath = linkPath.replace(/\/$/, '');
    if (linkPath && currentPath === linkPath) {
      link.classList.add('active');
    }
  });

  /* ─── Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Mobile submenu accordion ─── */
  document.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = this.nextElementSibling;
      var isOpen = sub ? sub.classList.toggle('open') : this.classList.toggle('open');
      if (sub) this.classList.toggle('open', isOpen);
      // Same reasoning as the burger above -- kept in sync with the real
      // expand/collapse state.
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ─── Dark mode toggle ───
     The dark-mode-toggle component only renders its button in "manuel"/
     "manuel-auto" modes, so this does nothing when the button isn't
     present. Persists the choice to localStorage under the same key
     header.hbs's own inline init script reads on the next page load. */
  var THEME_STORAGE_KEY = 'renardier-theme-dark';
  var themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme');
      var isDark =
        current === 'dark' ||
        (!current &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {}
    });
  }

  /* ─── Alert system ───
     Toast API + "une seule fois par visiteur" persistence for
     src/library/components/message-alerte -- general-purpose, used by the
     contact form below and any placed Message d'alerte component. */

  /* Toast (floating, auto-dismissing) -- container lives once in
     partials/footer.hbs (#toast-container). Icons reuse the exact SVG
     inner markup partials/icon.hbs defines for the same 4 states, kept
     here as plain strings since a toast is built entirely client-side. */
  var RENARDIER_TOAST_ICONS = {
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/>',
    success: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>',
    warning:
      '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
  };
  var renardierToastCount = 0;
  function renardierCloseToast(id) {
    var el = document.getElementById(id);
    if (!el || el.classList.contains('dismissing')) return;
    el.classList.add('dismissing');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 260);
  }
  /* window-scoped so any future trigger elsewhere can call
     window.showToast(...) without its own copy of this logic. */
  window.showToast = function (type, title, msg, duration) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    duration = duration || 4000;
    var id = 'toast-' + ++renardierToastCount;
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.id = id;
    t.style.setProperty('--dur', duration / 1000 + 's');
    t.innerHTML =
      '<div class="toast-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
      (RENARDIER_TOAST_ICONS[type] || RENARDIER_TOAST_ICONS.info) +
      '</svg></div>' +
      '<div class="toast-body"><div class="toast-title"></div><div class="toast-msg"></div></div>' +
      '<button class="toast-dismiss" aria-label="Fermer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="toast-progress"></div>';
    // User-supplied text set via textContent, not innerHTML above --
    // never trusted as markup.
    t.querySelector('.toast-title').textContent = title;
    t.querySelector('.toast-msg').textContent = msg;
    t.querySelector('.toast-dismiss').addEventListener('click', function () {
      renardierCloseToast(id);
    });
    container.prepend(t);
    setTimeout(function () {
      renardierCloseToast(id);
    }, duration);
  };

  /* Publii's real GDPR consent banner sits at z-index:999999 -- Message
     d'alerte's own 9999 stays well below it deliberately (the consent
     banner should always win a stacking fight). Both are bottom-anchored
     by default though, so a bottom-positioned alert can end up visually
     covered. If `.pcb` (Publii's consent-banner root, present in the DOM
     whenever GDPR is enabled) exists, tag <body> so main.css can push
     bottom-positioned alerts clear of it. See docs/architecture.md. */
  if (document.querySelector('.pcb')) {
    document.body.classList.add('has-gdpr-consent');
  }

  /* Message d'alerte's "une seule fois par visiteur" -- always rendered
     server-side, hidden here on load if this exact alert was already
     seen. alertId (or a hash of the title when blank) is the
     localStorage key. */
  function renardierSimpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return 'h' + Math.abs(hash);
  }
  document.querySelectorAll('.alert[data-alert-once="true"]').forEach(function (el) {
    var key =
      'renardier-alert-seen-' +
      (el.getAttribute('data-alert-id') ||
        renardierSimpleHash(el.getAttribute('data-alert-title') || ''));
    try {
      if (localStorage.getItem(key)) {
        el.style.display = 'none';
        return;
      }
    } catch (e) {
      /* localStorage unavailable -- always show */
    }
    var dismissBtn = el.querySelector('.alert-dismiss');
    var markSeen = function () {
      try {
        localStorage.setItem(key, '1');
      } catch (e) {}
    };
    if (dismissBtn) dismissBtn.addEventListener('click', markSeen);
    // Also marked seen on page unload, not only an explicit dismiss click
    // -- "seen once" means "shown once", not "actively closed".
    window.addEventListener('beforeunload', markSeen, { once: true });
  });
  /* Any Message d'alerte instance's dismiss button closes on click
     regardless of displayFrequency -- an exit animation first (matches
     the toast layer's .dismissing pattern), then hidden once finished. */
  document.querySelectorAll('.alert-dismiss').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var alertEl = btn.closest('.alert');
      if (!alertEl || alertEl.classList.contains('dismissing')) return;
      alertEl.classList.add('dismissing');
      setTimeout(function () {
        alertEl.style.display = 'none';
      }, 200);
    });
  });

  /* ─── Contact form: live validation + real submit paths ───
     1. Client-side validation (required Prénom/Nom/Email/Message, an
        email-format check, a minimum length on Message) -- live on
        blur/input, plus a full check at submit time that blocks
        submission and shows a WARNING alert (incomplete, not failed).
     2. Once valid: a real fetch() POST when action="..." is set (a
        formEndpoint from Theme Settings), Accept:application/json --
        2xx shows a SUCCESS alert+toast and resets the form, failure
        shows an ERROR alert+toast. No action= means the mailto:
        fallback, paired with an INFO alert+toast -- never a false
        "success", since a static site can't confirm a mailto: link was
        actually sent. */
  var CONTACT_FORM_VALIDATORS = {
    prenom: function (v) {
      return v.trim().length > 0;
    },
    nom: function (v) {
      return v.trim().length > 0;
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    message: function (v) {
      return v.trim().length >= 20;
    },
  };
  var CONTACT_FORM_REQUIRED = Object.keys(CONTACT_FORM_VALIDATORS);

  document.querySelectorAll('form.contact-form').forEach(function (form) {
    function fieldErrorEl(input) {
      var wrap = input.closest('.contact-form-group');
      return wrap ? wrap.querySelector('.field-error') : null;
    }
    function validateField(name) {
      var input = form.elements[name];
      if (!input) return true;
      var valid = CONTACT_FORM_VALIDATORS[name](input.value);
      input.classList.toggle('is-error', !valid);
      input.classList.toggle('is-success', valid && input.value.trim() !== '');
      var err = fieldErrorEl(input);
      if (err) err.hidden = valid;
      return valid;
    }
    function validateAll() {
      var ok = true;
      CONTACT_FORM_REQUIRED.forEach(function (name) {
        if (!validateField(name)) ok = false;
      });
      return ok;
    }
    CONTACT_FORM_REQUIRED.forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) validateField(name);
      });
      input.addEventListener('input', function () {
        input.classList.remove('is-error', 'is-success');
        var err = fieldErrorEl(input);
        if (err) err.hidden = true;
      });
    });

    var alertWrap = form.parentElement
      ? form.parentElement.querySelector('.form-alert-wrap')
      : null;
    function setFormAlert(type, title, msg) {
      if (!alertWrap) return;
      alertWrap.innerHTML =
        '<div class="alert alert-' +
        type +
        '"><span class="alert-icon"></span>' +
        '<span class="alert-body"><span class="alert-title"></span><span class="alert-msg"></span></span></div>';
      // Icon reuses the same inline paths as the toast API -- see
      // RENARDIER_TOAST_ICONS above.
      alertWrap.querySelector('.alert-icon').innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        (RENARDIER_TOAST_ICONS[type] || RENARDIER_TOAST_ICONS.info) +
        '</svg>';
      alertWrap.querySelector('.alert-title').textContent = title;
      alertWrap.querySelector('.alert-msg').textContent = msg;
      alertWrap.hidden = false;
      alertWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var submitBtn = form.querySelector('.contact-form-submit');
    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.classList.toggle('is-loading', isLoading);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (alertWrap) alertWrap.hidden = true;
      if (!validateAll()) {
        setFormAlert(
          'warning',
          'Formulaire incomplet',
          'Veuillez remplir tous les champs obligatoires avant d’envoyer votre message.'
        );
        return;
      }

      var endpoint = form.getAttribute('action');
      var mailtoEmail = form.getAttribute('data-mailto-fallback');
      var phone = form.getAttribute('data-contact-phone') || '';

      if (endpoint) {
        setLoading(true);
        fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        })
          .then(function (res) {
            setLoading(false);
            if (res.ok) {
              setFormAlert(
                'success',
                'Message envoyé',
                'Merci, votre message a bien été reçu. Nous vous répondons sous 48 heures ouvrées.'
              );
              window.showToast(
                'success',
                'Message envoyé',
                'Votre demande a bien été transmise.',
                5000
              );
              form.reset();
              CONTACT_FORM_REQUIRED.forEach(function (name) {
                var input = form.elements[name];
                if (input) input.classList.remove('is-error', 'is-success');
              });
            } else {
              setFormAlert(
                'error',
                'Erreur d’envoi',
                'Une erreur technique est survenue. Veuillez réessayer' +
                  (phone ? ' ou nous contacter directement par téléphone au ' + phone : '') +
                  '.'
              );
              window.showToast(
                'error',
                'Erreur d’envoi',
                'Impossible d’envoyer le formulaire.',
                5000
              );
            }
          })
          .catch(function () {
            setLoading(false);
            setFormAlert(
              'error',
              'Erreur d’envoi',
              'Une erreur technique est survenue. Veuillez réessayer' +
                (phone ? ' ou nous contacter directement par téléphone au ' + phone : '') +
                '.'
            );
            window.showToast(
              'error',
              'Erreur d’envoi',
              'Impossible d’envoyer le formulaire.',
              5000
            );
          });
        return;
      }

      if (mailtoEmail) {
        setFormAlert(
          'info',
          'Ouverture de votre messagerie',
          'Votre logiciel de messagerie va s’ouvrir avec votre message pré-rempli.'
        );
        window.showToast(
          'info',
          'Ouverture de votre messagerie',
          'Complétez l’envoi depuis votre messagerie.',
          5000
        );
        var get = function (fieldName) {
          var el = form.elements[fieldName];
          return el ? el.value.trim() : '';
        };
        var subject = 'Message de ' + (get('prenom') + ' ' + get('nom')).trim();
        var replyTo = get('email');
        var body = get('message') + (replyTo ? '\n\n(Répondre à : ' + replyTo + ')' : '');
        window.location.href =
          'mailto:' +
          mailtoEmail +
          '?subject=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(body);
      }
    });
  });

  /* ─── "Prendre RDV" modal (client-requested "modal" CTA option) ───
     Opens/closes the one shared #cta-modal (partials/footer.hbs) -- the
     form INSIDE it is a plain form.contact-form, already fully handled by
     the contact-form block above (validation, fetch()-or-mailto submit)
     with zero extra code here. This block only owns the overlay itself:
     open/close, Escape, backdrop click, and a real (if simple) focus trap
     -- a booking modal is exactly the kind of thing a keyboard/screen-
     reader user must not get stuck behind or lose their place around. */
  var ctaModal = document.getElementById('cta-modal');
  if (ctaModal) {
    var ctaModalPanel = ctaModal.querySelector('.cta-modal-panel');
    var ctaModalOpener = null; // focus returns here on close

    function ctaModalFocusable() {
      return Array.prototype.slice.call(
        ctaModalPanel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
        )
      );
    }

    function openCtaModal(opener) {
      ctaModalOpener = opener || null;
      ctaModal.hidden = false;
      document.body.style.overflow = 'hidden';
      var focusable = ctaModalFocusable();
      if (focusable[0]) focusable[0].focus();
    }

    function closeCtaModal() {
      ctaModal.hidden = true;
      document.body.style.overflow = '';
      if (ctaModalOpener) ctaModalOpener.focus();
    }

    // Delegated on `document` (not a static NodeList snapshot) -- opens
    // for ANY current or future element with this data attribute, from
    // one listener, regardless of how many "Prendre RDV" buttons this
    // page actually rendered (topbar/menu/contact-bar/Hero can each have
    // their own).
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-modal="cta-modal"]');
      if (opener) {
        e.preventDefault();
        openCtaModal(opener);
        return;
      }
      if (e.target.closest('[data-close-modal]')) {
        closeCtaModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (ctaModal.hidden) return;
      if (e.key === 'Escape') {
        closeCtaModal();
        return;
      }
      // Real focus trap: Tab past the last focusable element wraps to the
      // first (and vice-versa with Shift+Tab) -- keeps a keyboard user
      // from tabbing out into the page hidden behind the overlay.
      if (e.key === 'Tab') {
        var focusable = ctaModalFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ─── Diaporama d'images (image-slider component) ───
     The HTML/CSS alone already gives a real, swipeable slider (CSS
     scroll-snap on .image-slider-track) with zero JS -- this block only
     adds the real prev/next arrows, the dot indicators (built from
     however many slides actually rendered on this particular row, not a
     fixed 8), and optional autoplay, same "guarded block in the one
     shared main.js" pattern as every other interactive component here. */
  document.querySelectorAll('.image-slider').forEach(function (slider) {
    var track = slider.querySelector('.image-slider-track');
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.image-slider-slide'));
    if (!track || slides.length < 2) return; // one slide (or none): no nav needed

    var dotsWrap = slider.querySelector('.image-slider-dots');
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'image-slider-dot';
      dot.setAttribute('aria-label', 'Aller à l’image ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    var current = 0;
    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('image-slider-dot--active', i === index);
      });
    }
    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setActiveDot(current);
    }
    setActiveDot(0);

    var prevBtn = slider.querySelector('.image-slider-prev');
    var nextBtn = slider.querySelector('.image-slider-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // A real manual swipe/scroll (not one of our own goTo() calls) should
    // still update which dot is active -- approximate "which slide is
    // this" from scrollLeft rather than tracking scroll events per pixel.
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var index = Math.round(track.scrollLeft / track.clientWidth);
        current = Math.max(0, Math.min(slides.length - 1, index));
        setActiveDot(current);
      }, 100);
    });

    if (slider.getAttribute('data-autoplay') === 'true') {
      var interval = parseInt(slider.getAttribute('data-interval'), 10) || 5000;
      var timer = setInterval(function () {
        goTo(current + 1);
      }, interval);
      // A real visitor interacting with the slider should stop autoplay,
      // not fight it on the next tick.
      ['pointerdown', 'keydown'].forEach(function (evt) {
        slider.addEventListener(evt, function () {
          clearInterval(timer);
        }, { once: true });
      });
    }
  });
})();
