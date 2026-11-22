// Realm of Steez — swaps each inner page's old top bar for the homepage's pill nav and adds the house footer
(function () {
  const links = [['Work', '/#films'], ['3D', '/#three-d'], ['The House', '/#about'], ['Journal', '/journal']];
  const social = (window.RS_SOCIAL || []).map(([n, h]) => `<a href="${h}" target="_blank" rel="noopener">${n}</a>`).join('');
  function run() {
    document.querySelectorAll('body > nav.nav, header > nav.nav, nav.nav').forEach(n => n.remove());
    const pill = document.createElement('nav'); pill.className = 'rs-pill'; pill.setAttribute('aria-label', 'Main');
    pill.innerHTML = `<a href="/" class="rs-pill__logo">REALM OF STEEZ</a><div class="rs-pill__links">${links.map(([n, h]) => `<a href="${h}">${n}</a>`).join('')}</div><a href="/#contact" class="rs-pill__cta">Start a brief</a>`;
    document.body.prepend(pill);
    const foot = document.createElement('footer'); foot.className = 'rs-foot';
    foot.innerHTML = `<span class="rs-foot__logo">REALM OF STEEZ</span><nav>${links.map(([n, h]) => `<a href="${h}">${n}</a>`).join('')}<a href="/press">Press</a><a href="/#contact">Contact</a>${social}</nav><p>&copy; 2026 Realm of Steez</p>`;
    document.body.appendChild(foot);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
