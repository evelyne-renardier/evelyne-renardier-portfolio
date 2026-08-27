/* ═══════════════════════════════════════════════════
   RENARDIER THEME — main.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Desktop dropdowns ───
     Hover-only by design (CSS :hover / :focus-within in main.css) - no
     click-to-toggle JS here. An earlier click-toggle implementation was
     removed: it was a workaround for a hover dead-zone bug (see
     docs/CHANGELOG.md), not an intended "click to pin open" feature -
     once the hover gap was fixed directly in CSS, the workaround was no
     longer needed and just added a second, inconsistent way to open the
     same menu. Keyboard users still get it via :focus-within (tabbing
     into a link inside .dd keeps it open, no JS needed for that either). */

  /* ─── Mobile nav ─── */
  var burger  = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('mobile-nav');
  var mobileClose = document.getElementById('mobile-nav-close');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

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
      if (sub) sub.classList.toggle('open');
      this.classList.toggle('open');
    });
  });

})();
