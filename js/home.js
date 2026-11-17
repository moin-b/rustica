/* Home page */
(function () {
  'use strict';
  const { t, S, esc, fmtNum, fmtPrice, fmtDims, imgUrl, icon, contactLinks, videoTile, state } = Core;
  const $ = (id) => document.getElementById(id);
  const link = (p) => 'product.html?id=' + encodeURIComponent(p.id);
  let filter = 'all';

  function render(data) {
    const products = data.products || [];
    const videos = data.videos || [];
    const s = state.settings;
    document.title = S('siteName') + ' | ' + S('heroTitle');
    Core.chrome('');

    const featured = products.filter((p) => p.featured && p.images && p.images.length);
    const withImg = products.filter((p) => p.images && p.images.length);
    const picks = (featured.length ? featured : withImg).slice(0, 3);
    const lead = picks[0];
    // A pool of photos to dress the page when the panel has no custom ones.
    const pool = [];
    withImg.forEach((p) => p.images.forEach((im) => pool.push(im)));
    const about = (s.aboutImages || []).filter(Boolean);
    const pick = (i) => about[i] || pool[(i + 2) % Math.max(pool.length, 1)] || '';

    /* ---------- Hero ---------- */
    const heroImg = s.heroImage || (lead && lead.images[0]);
    const links = contactLinks();
    $('hero').innerHTML = `
      <div class="hero-copy">
        <h1>${esc(S('heroTitle'))}</h1>
        <p class="hero-text">${esc(S('heroText'))}</p>
        <div class="hero-actions">
          <a class="btn" href="#collection">${esc(t('see_collection'))}</a>
          ${links.call ? `<a class="btn btn-ghost" href="${esc(links.call)}">${icon('call')}${esc(t('call_to_order'))}</a>` : ''}
        </div>
        ${picks.length ? `<div class="hero-thumbs">${picks.map((p) => `
          <a class="thumb-card" href="${link(p)}" aria-label="${esc(p.title)}">
            <img src="${esc(imgUrl(p.images[0], 'sm'))}" alt="" loading="lazy">
            <span class="go">${icon('arrow', 'flip')}</span>
          </a>`).join('')}</div>` : ''}
      </div>
      <figure class="hero-media">
        ${heroImg ? `<img src="${esc(imgUrl(heroImg))}" alt="${esc(lead ? lead.title : S('siteName'))}" fetchpriority="high">` : ''}
        ${lead && !s.heroImage ? `<a class="specimen" href="${link(lead)}"><b>${esc(lead.title)}</b><span>${esc(lead.code || '')}${lead.code && fmtDims(lead) ? (state.lang === 'fa' ? '، ' : ', ') : ''}${esc(fmtDims(lead))}</span></a>` : ''}
      </figure>`;

    /* ---------- Crafted: intro + numbers ---------- */
    const sold = products.filter((p) => p.status === 'sold').length;
    const years = Number(Core.latinDigits(s.years)) || 0;
    const statB = years ? [years, t('stat_years')] : [sold, t('stat_sold')];
    const newest = [...withImg].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))[0];
    $('crafted').innerHTML = `
      <h2>${esc(t('crafted_in'))} ${esc(S('siteName'))}.</h2>
      <div class="crafted-grid">
        <div class="crafted-intro"><p>${esc(S('introText'))}</p></div>
        <div class="stat"><p>${esc(t('stat_pieces'))}</p><strong>${fmtNum(products.length)}</strong></div>
        <div class="stat b"><p>${esc(statB[1])}</p><strong>${fmtNum(statB[0])}</strong></div>
        <figure class="crafted-photo wide">${pick(0) ? `<img src="${esc(imgUrl(pick(0)))}" alt="" loading="lazy">` : ''}</figure>
        <div class="stat"><p>${esc(t('stat_one'))}</p><strong>${fmtNum(1)}</strong></div>
        ${newest ? `<a class="crafted-photo dark" href="${link(newest)}">
            <img src="${esc(imgUrl(newest.images[0], 'sm'))}" alt="" loading="lazy">
            <figcaption>${esc(newest.title)}<br>${esc(newest.code || '')}</figcaption></a>` : '<div class="crafted-photo dark"></div>'}
      </div>`;

    /* ---------- Collection ---------- */
    renderCollection(products);

    /* ---------- Workshop (dark) ---------- */
    const strip = [pick(1), pick(2), pick(3)].filter(Boolean);
    const ytVideos = videos.filter((v) => Core.ytId(v.url));
    $('workshop').innerHTML = `
      <div class="wrap">
        <h2>${esc(S('detailsTitle'))}</h2>
        <div class="workshop-grid">
          ${pick(4) ? `<div class="workshop-photo"><img src="${esc(imgUrl(pick(4)))}" alt="" loading="lazy"></div>` : ''}
          <div class="workshop-text">
            <p>${esc(S('detailsText'))}</p>
            ${links.youtube ? `<a class="btn btn-light" href="${esc(links.youtube)}" target="_blank" rel="noopener">${icon('youtube')}${esc(t('watch_youtube'))}</a>`
              : links.instagram ? `<a class="btn btn-light" href="${esc(links.instagram)}" target="_blank" rel="noopener">${icon('instagram')}${esc(t('instagram'))}</a>` : ''}
            ${strip.length ? `<div class="workshop-strip">${strip.map((im) => `<div><img src="${esc(imgUrl(im, 'sm'))}" alt="" loading="lazy"></div>`).join('')}</div>` : ''}
          </div>
        </div>
        ${ytVideos.length ? `<div class="videos" id="videos"><h3>${esc(t('from_workshop'))}</h3>
          <div class="video-row">${ytVideos.map((v) => `<div class="video-item">${videoTile(v.url, v.title)}${v.title ? `<p>${esc(v.title)}</p>` : ''}</div>`).join('')}</div></div>` : ''}
      </div>`;

    /* ---------- Quote with wood chunks set into the text ---------- */
    const q = esc(S('quote'));
    const chunk = (i) => pool.length ? `<span class="chunk" style="background-image:url('${esc(imgUrl(pool[i % pool.length], 'sm'))}')" aria-hidden="true"></span>` : '';
    const m = q.match(/^(.*?[,;،؛—–])\s*(.*)$/);
    $('quote').innerHTML = `<p>${chunk(0)} ${m ? m[1] + ' ' + chunk(3) + ' ' + m[2] : q} ${chunk(1)}${chunk(5)}</p>`;

    /* ---------- Contact ---------- */
    $('contact').innerHTML = `
      <div class="contact-grid">
        <div>
          <h2>${esc(S('contactTitle'))}</h2>
          <p class="contact-text">${esc(S('contactText'))}</p>
        </div>
        <div>
          ${s.phone ? `<a class="phone-big" href="${esc(links.call)}">${esc(s.phone)}</a>` : ''}
          <div class="contact-actions">
            ${links.whatsapp ? `<a class="btn" href="${esc(links.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('whatsapp'))}</a>` : ''}
            ${links.instagram ? `<a class="btn btn-ghost" href="${esc(links.instagram)}" target="_blank" rel="noopener">${icon('instagram')}${esc(t('instagram'))}</a>` : ''}
            ${links.telegram ? `<a class="btn btn-ghost" href="${esc(links.telegram)}" target="_blank" rel="noopener">${icon('telegram')}${esc(t('telegram'))}</a>` : ''}
          </div>
        </div>
      </div>`;

    let fab = document.querySelector('.fab-call');
    if (links.call) {
      if (!fab) { fab = document.createElement('a'); fab.className = 'fab-call'; document.body.appendChild(fab); }
      fab.href = links.call; fab.setAttribute('aria-label', t('call_to_order')); fab.innerHTML = icon('call');
    } else if (fab) fab.remove();

    if (location.hash && !render.scrolled) { render.scrolled = true; const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); }
  }

  function renderCollection(products) {
    const cats = [...new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))];
    const hasSold = products.some((p) => p.status === 'sold');
    const chips = [['all', t('filter_all')], ['available', t('filter_available')]];
    if (hasSold) chips.push(['sold', t('filter_sold')]);
    if (cats.length > 1) cats.forEach((c) => chips.push(['cat:' + c, c]));
    if (!chips.some((c) => c[0] === filter)) filter = 'all';

    const list = products.filter((p) => {
      if (filter === 'available') return p.status !== 'sold';
      if (filter === 'sold') return p.status === 'sold';
      if (filter.startsWith('cat:')) return (p.category || '').trim() === filter.slice(4);
      return true;
    });

    const el = $('collection');
    el.innerHTML = `
      <div class="section-head">
        <h2>${esc(t('collection_title'))}</h2>
        ${products.length ? `<div class="chips" role="group">${chips.map(([k, l]) => `<button class="chip" type="button" data-f="${esc(k)}" aria-pressed="${k === filter}">${esc(l)}</button>`).join('')}</div>` : ''}
      </div>
      ${!products.length ? `<p class="empty">${esc(t('empty_catalog'))}</p>`
        : !list.length ? `<p class="empty">${esc(t('empty_filter'))}</p>`
        : `<div class="grid">${list.map(Core.card).join('')}</div>`}`;
    el.querySelectorAll('.chip').forEach((b) => (b.onclick = () => { filter = b.dataset.f; renderCollection(products); }));
  }

  Core.boot(render);
})();
