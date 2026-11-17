/* Shared code for the public website (home + product pages). */
(function () {
  'use strict';

  const CFG = window.SITE_CONFIG || {};
  const DEMO = !CFG.SUPABASE_URL || !CFG.SUPABASE_KEY;
  const sb = !DEMO && window.supabase ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY) : null;
  const BUCKET = 'media';

  /* ---------- Demo content (used only when config.js is empty) ---------- */
  const DEMO_DATA = {
    settings: { phone: '0912 000 0000', whatsapp: '989120000000', instagram: 'yourworkshop', youtube: '', years: 9 },
    videos: [],
    products: [
      { id: 'demo-1', code: 'D14040827', title: 'جام ریشه', category: 'مجسمه', status: 'available', featured: true, height_cm: 54, width_cm: 41, depth_cm: 40, price: null,
        description: 'یک تکه چوب ریشه که به شکل کاسه‌ای عمیق و باز روی پایه‌ای پهن تراشیده شده. یک طرف آن، ریشه‌ی خام همان‌طور که درخت رشد کرده دست‌نخورده مانده و درست کنار رگه‌های صاف و صیقلی نشسته است.',
        images: ['assets/pieces/burl-chalice-1.webp', 'assets/pieces/burl-chalice-2.webp'] },
      { id: 'demo-2', code: 'D14040959', title: 'کاسه‌ی موج آتشین', category: 'کاسه', status: 'available', featured: true, height_cm: 34, width_cm: 57, depth_cm: 34, price: null,
        description: 'کاسه‌ای کشیده و کم‌ارتفاع با لبه‌ای موج‌دار که در دو سر به شکل دو شاخ بلند بالا می‌رود. چوب تیره‌ی مغز و چوب روشن بیرونی در تک‌تک موج‌های لبه به هم می‌رسند.',
        images: ['assets/pieces/ember-bowl-1.webp', 'assets/pieces/ember-bowl-2.webp'] },
      { id: 'demo-3', code: 'D14040949', title: 'کاسه‌ی پادار', category: 'کاسه', status: 'sold', featured: true, height_cm: 15, width_cm: 32, depth_cm: 23, price: null,
        description: 'کاسه‌ی میوه‌ی کوچکی که روی پایه‌هایی ایستاده که از ریشه‌های اصلی درخت تراشیده شده‌اند. حلقه‌های رشد درخت هنوز داخل کاسه دیده می‌شوند.',
        images: ['assets/pieces/walker-bowl-1.webp', 'assets/pieces/walker-bowl-2.webp'] }
    ]
  };

  const I18N = window.SITE_I18N;

  const state = { lang: 'fa', settings: {} };

  function t(key, vars) {
    let s = (I18N[state.lang] && I18N[state.lang][key]) ?? I18N.en[key] ?? key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k] ?? '');
    return s;
  }
  // A setting, falling back to the default text for the current language.
  function S(key) {
    const v = state.settings[key];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    return t('def_' + key) === 'def_' + key ? '' : t('def_' + key);
  }

  /* ---------- Small helpers ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const latinDigits = (s) => String(s ?? '').replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const locale = () => (state.lang === 'fa' ? 'fa-IR' : 'en-US');
  const fmtNum = (n) => new Intl.NumberFormat(locale(), { maximumFractionDigits: 1 }).format(Number(n));

  function fmtPrice(p) {
    if (p === null || p === undefined || p === '') return t('price_on_request');
    const cur = (state.settings.currency || (state.lang === 'fa' ? 'تومان' : '$')).trim();
    const n = fmtNum(p);
    return cur.length <= 1 ? cur + n : n + ' ' + cur;
  }
  function fmtDims(p) {
    const d = [p.height_cm, p.width_cm, p.depth_cm].filter((x) => x !== null && x !== undefined && x !== '');
    return d.length ? d.map(fmtNum).join(' × ') + ' ' + t('cm') : '';
  }
  function imgUrl(path, size) {
    if (!path) return '';
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    if (path.startsWith('assets/')) return (window.ASSET_BASE || '') + path;
    const p = size === 'sm' ? path.replace(/(\.\w+)$/, '-sm$1') : path;
    return CFG.SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + p.split('/').map(encodeURIComponent).join('/');
  }
  function ytId(url) {
    if (!url) return '';
    const m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  function contactLinks(message) {
    const s = state.settings, out = {};
    if (s.phone) out.call = 'tel:' + latinDigits(s.phone).replace(/[^\d+]/g, '');
    if (s.whatsapp) out.whatsapp = 'https://wa.me/' + latinDigits(s.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(message || t('wa_general'));
    if (s.instagram) out.instagram = 'https://instagram.com/' + s.instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/.*$/, '');
    if (s.telegram) out.telegram = 'https://t.me/' + s.telegram.replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
    if (s.youtube) out.youtube = /^https?:/.test(s.youtube) ? s.youtube : 'https://youtube.com/@' + s.youtube.replace(/^@/, '');
    if (s.email) out.email = 'mailto:' + s.email;
    return out;
  }

  /* ---------- Icons (stroke icons, inherit currentColor) ---------- */
  const P = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h12"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    whatsapp: '<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.1-1.1z"/><path d="M9 8.5c0 3 2.5 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.5-2-1.5-2.4-2.4l.8-1-1-2z"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    telegram: '<path d="M21 4L3 11l6 2.5M21 4l-4 16-8-6.5M21 4L9 13.5V19l3-3.5"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>'
  };
  const icon = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- Data loading with an instant local cache ---------- */
  async function fetchAll() {
    if (DEMO) return JSON.parse(JSON.stringify(DEMO_DATA));
    const [s, p, v] = await Promise.all([
      sb.from('settings').select('data').eq('id', 1).maybeSingle(),
      sb.from('products').select('*').eq('published', true).order('sort', { ascending: true }).order('created_at', { ascending: false }),
      sb.from('videos').select('*').order('sort', { ascending: true }).order('created_at', { ascending: false })
    ]);
    if (s.error || p.error || v.error) throw (s.error || p.error || v.error);
    return { settings: (s.data && s.data.data) || {}, products: p.data || [], videos: v.data || [] };
  }

  // Renders cached data immediately, then re-renders when fresh data differs.
  async function boot(render) {
    const KEY = 'site-cache-v1';
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage blocked */ }
    if (cached && !DEMO) { apply(cached); render(cached); }
    try {
      const fresh = await fetchAll();
      try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (e) { /* ignore */ }
      if (!cached || JSON.stringify(fresh) !== JSON.stringify(cached) || DEMO) { apply(fresh); render(fresh); }
    } catch (err) {
      console.error(err);
      if (!cached) { apply({ settings: {} }); render({ settings: {}, products: [], videos: [], error: true }); }
    }
  }

  function apply(data) {
    state.settings = data.settings || {};
    state.lang = state.settings.lang === 'en' ? 'en' : 'fa'; // Persian unless English is picked in the panel
    const html = document.documentElement;
    html.lang = state.lang;
    html.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  }

  /* ---------- Header, mobile menu, footer ---------- */
  function chrome(base) {
    base = base || '';
    const name = esc(S('siteName'));
    const links = contactLinks();
    const header = document.getElementById('site-header');
    if (header) {
      header.innerHTML = `
        <div class="wrap header-row">
          <button class="icon-btn menu-btn" type="button" aria-label="${esc(t('menu'))}" aria-expanded="false">${icon('menu')}</button>
          <nav class="main-nav" aria-label="Main">
            <a href="${base}index.html#collection">${esc(t('nav_catalog'))}</a>
            <a href="${base}index.html#workshop">${esc(t('nav_workshop'))}</a>
            <a href="${base}index.html#contact">${esc(t('nav_contact'))}</a>
          </nav>
          <a class="logo" href="${base}index.html">${name}</a>
        </div>
        <div class="drawer" hidden>
          <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="${esc(t('menu'))}">
            <div class="drawer-top"><span class="logo">${name}</span>
              <button class="icon-btn drawer-close" type="button" aria-label="${esc(t('close'))}">${icon('close')}</button></div>
            <nav class="drawer-nav">
              <a href="${base}index.html#collection">${esc(t('nav_catalog'))}</a>
              <a href="${base}index.html#workshop">${esc(t('nav_workshop'))}</a>
              <a href="${base}index.html#contact">${esc(t('nav_contact'))}</a>
            </nav>
            <div class="drawer-social">${socialRow(links)}</div>
          </div>
        </div>`;
      const btn = header.querySelector('.menu-btn'), drawer = header.querySelector('.drawer');
      const open = (v) => {
        drawer.hidden = !v; btn.setAttribute('aria-expanded', v);
        document.body.classList.toggle('no-scroll', v);
        if (v) header.querySelector('.drawer-close').focus();
      };
      btn.onclick = () => open(true);
      header.querySelector('.drawer-close').onclick = () => open(false);
      drawer.addEventListener('click', (e) => { if (e.target === drawer || e.target.closest('.drawer-nav a')) open(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) open(false); });
    }

    const footer = document.getElementById('site-footer');
    if (footer) {
      const s = state.settings;
      footer.innerHTML = `
        <div class="wrap footer-row">
          <div><div class="logo">${name}</div><p class="muted small">${esc(t('footer_note'))}</p></div>
          <div class="footer-info small">
            ${s.address ? `<p><span class="muted">${esc(t('address'))}</span><br>${esc(s.address)}</p>` : ''}
            ${s.hours ? `<p><span class="muted">${esc(t('hours'))}</span><br>${esc(s.hours)}</p>` : ''}
          </div>
          <div class="footer-social">${socialRow(links)}</div>
        </div>
        <div class="wrap small muted footer-base">© ${fmtNum(new Date().getFullYear()).replace(/[٬,]/g, '')} ${name}</div>
        ${DEMO ? `<div class="demo-flag">${esc(t('demo'))}</div>` : ''}`;
    }
  }

  function socialRow(links) {
    return ['call', 'whatsapp', 'instagram', 'telegram', 'youtube', 'email']
      .filter((k) => links[k])
      .map((k) => `<a class="social" href="${esc(links[k])}" ${k === 'call' || k === 'email' ? '' : 'target="_blank" rel="noopener"'} aria-label="${esc(t(k))}">${icon(k)}</a>`)
      .join('');
  }

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Lazy YouTube: show the thumbnail, load the player only when tapped.
  function videoTile(url, title) {
    const id = ytId(url);
    if (!id) return '';
    return `<button class="yt" type="button" data-yt="${id}" aria-label="${esc(t('play_video'))}${title ? ': ' + esc(title) : ''}">
      <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="yt-play">${icon('play')}</span></button>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.yt[data-yt]');
    if (!b) return;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.title = b.getAttribute('aria-label');
    f.className = 'yt-frame';
    b.replaceWith(f);
  });

  function card(p) {
    const img = (p.images || [])[0], alt = (p.images || [])[1];
    const badge = p.status === 'sold' ? `<span class="badge sold">${esc(t('status_sold'))}</span>`
      : p.status === 'reserved' ? `<span class="badge">${esc(t('status_reserved'))}</span>` : '';
    return `
      <a class="card ${p.status === 'sold' ? 'is-sold' : ''}" href="product.html?id=${encodeURIComponent(p.id)}">
        <div class="card-img">
          ${img ? `<img src="${esc(imgUrl(img, 'sm'))}" alt="${esc(p.title)}" loading="lazy">` : ''}
          ${alt ? `<img class="alt" src="${esc(imgUrl(alt, 'sm'))}" alt="" loading="lazy">` : ''}
          ${badge}
        </div>
        <div class="card-meta"><h3>${esc(p.title)}</h3><span class="code">${esc(p.code || '')}</span></div>
        ${fmtDims(p) ? `<div class="dims">${esc(fmtDims(p))}</div>` : ''}
        <div class="price">${p.status === 'sold' ? esc(t('status_sold')) : esc(fmtPrice(p.price))}</div>
      </a>`;
  }

  window.Core = { card, DEMO, state, t, S, esc, fmtNum, fmtPrice, fmtDims, imgUrl, ytId, contactLinks, icon, boot, chrome, socialRow, toast, videoTile, latinDigits };
})();
