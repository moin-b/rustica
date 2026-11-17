/* Single piece page: product.html?id=... */
(function () {
  'use strict';
  const { t, S, esc, fmtNum, fmtPrice, imgUrl, icon, contactLinks, videoTile, state } = Core;
  const $ = (id) => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id');

  function render(data) {
    const products = data.products || [];
    Core.chrome('');
    const p = products.find((x) => String(x.id) === id || x.code === id);
    const root = $('piece-root');

    if (!p) {
      if (data.error && !products.length) return;
      root.innerHTML = `<div style="padding:80px 0 120px"><h1 style="font-size:40px;margin-bottom:20px">${esc(t('not_found'))}</h1>
        <a class="btn" href="index.html#collection">${esc(t('see_collection'))}</a></div>`;
      return;
    }

    document.title = p.title + ' | ' + S('siteName');
    setMeta('description', (p.description || '').slice(0, 155));
    const imgs = (p.images || []).filter(Boolean);
    const msg = t('wa_msg', { title: p.title, code: p.code || '', url: location.href });
    const L = contactLinks(msg);
    const igDm = L.instagram ? L.instagram.replace(/instagram\.com\//, 'ig.me/m/') : '';
    const statusCls = p.status || 'available';

    const specs = [
      [t('category'), p.category], [t('wood'), p.wood], [t('finish'), p.finish]
    ].filter((r) => r[1]);

    root.innerHTML = `
      <nav class="crumbs"><a href="index.html#collection">${icon('left', 'flip')}${esc(t('back'))}</a></nav>
      <article class="piece">
        <div class="gallery">
          <div class="gallery-main">
            <div class="slides" tabindex="0" aria-label="${esc(p.title)}">
              ${imgs.map((im, i) => `<button class="slide" type="button" data-i="${i}" aria-label="${esc(t('view_photo'))} ${i + 1}">
                <img src="${esc(imgUrl(im))}" alt="${i === 0 ? esc(p.title) : ''}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></button>`).join('')}
            </div>
            ${imgs.length > 1 ? `
              <button class="icon-btn gal-nav prev" type="button" aria-label="${esc(t('prev'))}">${icon('left', 'flip')}</button>
              <button class="icon-btn gal-nav next" type="button" aria-label="${esc(t('next'))}">${icon('right', 'flip')}</button>
              <div class="dots">${imgs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}
          </div>
          ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((im, i) => `<button type="button" data-i="${i}" aria-current="${i === 0}" aria-label="${esc(t('view_photo'))} ${i + 1}"><img src="${esc(imgUrl(im, 'sm'))}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
        </div>

        <div class="piece-info">
          ${p.code ? `<div class="code">${esc(t('code'))} ${esc(p.code)}</div>` : ''}
          <h1>${esc(p.title)}</h1>
          <div class="piece-price">
            ${p.status === 'sold' ? '' : `<span>${esc(fmtPrice(p.price))}</span>`}
            ${p.price_note && p.status !== 'sold' ? `<small>${esc(p.price_note)}</small>` : ''}
            <span class="status ${statusCls}">${esc(t('status_' + statusCls))}</span>
          </div>
          ${p.status === 'sold' ? `<p class="note">${esc(t('sold_note'))}</p>` : p.status === 'reserved' ? `<p class="note">${esc(t('reserved_note'))}</p>` : ''}

          <div class="order">
            ${L.call ? `<a class="btn" href="${esc(L.call)}">${icon('call')}${esc(t('call_to_order'))}</a>` : ''}
            <div class="order-row">
              ${L.whatsapp ? `<a class="btn btn-ghost" href="${esc(L.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('whatsapp'))}</a>` : ''}
              ${igDm ? `<a class="btn btn-ghost" href="${esc(igDm)}" target="_blank" rel="noopener">${icon('instagram')}${esc(t('instagram'))}</a>`
                : L.telegram ? `<a class="btn btn-ghost" href="${esc(L.telegram)}" target="_blank" rel="noopener">${icon('telegram')}${esc(t('telegram'))}</a>` : ''}
            </div>
          </div>

          ${p.description ? `<p class="desc">${esc(p.description)}</p>` : ''}
          ${measure(p)}
          ${specs.length ? `<dl class="specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
          <button class="btn btn-ghost share-btn" type="button">${icon('share')}${esc(t('share'))}</button>
        </div>
      </article>`;

    wireGallery(root, imgs);
    root.querySelector('.share-btn').onclick = async () => {
      const shareData = { title: p.title, text: p.title + (p.code ? ' (' + p.code + ')' : ''), url: location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else { await navigator.clipboard.writeText(location.href); Core.toast(t('link_copied')); }
      } catch (e) { /* user closed the share sheet */ }
    };

    /* Making-of video */
    const making = $('making');
    if (Core.ytId(p.video_url)) {
      making.hidden = false;
      making.innerHTML = `<h2>${esc(t('making_of'))}</h2>${videoTile(p.video_url, p.title)}`;
    } else making.hidden = true;

    /* More pieces: available first */
    const others = products.filter((x) => x !== p && x.images && x.images.length)
      .sort((a, b) => (a.status === 'sold') - (b.status === 'sold')).slice(0, 3);
    const more = $('more');
    more.hidden = !others.length;
    more.innerHTML = others.length ? `<h2>${esc(t('more_pieces'))}</h2><div class="grid">${others.map(Core.card).join('')}</div>` : '';

    /* Sticky order bar on phones */
    let bar = document.querySelector('.mobile-order');
    if (L.call || L.whatsapp) {
      if (!bar) { bar = document.createElement('div'); bar.className = 'mobile-order'; document.body.appendChild(bar); }
      bar.innerHTML = `${L.call ? `<a class="btn" href="${esc(L.call)}">${icon('call')}${esc(t('call'))}</a>` : ''}
        ${L.whatsapp ? `<a class="btn btn-ghost" href="${esc(L.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('whatsapp'))}</a>` : ''}`;
      document.body.classList.add('has-bar');
    }

    /* Structured data for search engines */
    let ld = document.getElementById('ld');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: p.code || undefined,
      description: p.description || undefined, image: imgs.map((im) => new URL(imgUrl(im), location.href).href),
      offers: p.price ? { '@type': 'Offer', price: p.price, availability: p.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined
    });
  }

  /* An isometric box with the real numbers, like the spec sheets in the workshop. */
  function measure(p) {
    const h = p.height_cm, w = p.width_cm, d = p.depth_cm;
    if (!h && !w && !d) return '';
    const n = h ? Math.round(h / 8) : 0; // an apple is ~8 cm
    const v = (x) => (x ? fmtNum(x) : '');
    return `
      <div class="measure">
        ${box(h, w, d, v)}
        <div>
          <ul>
            ${h ? `<li><span>${esc(t('height'))}</span>${v(h)} ${esc(t('cm'))}</li>` : ''}
            ${w ? `<li><span>${esc(t('width'))}</span>${v(w)} ${esc(t('cm'))}</li>` : ''}
            ${d ? `<li><span>${esc(t('depth'))}</span>${v(d)} ${esc(t('cm'))}</li>` : ''}
          </ul>
          ${n >= 2 ? `<div class="apples">${esc(t('apples', { n: fmtNum(n) }))}</div>` : ''}
        </div>
      </div>`;
  }

  // Box drawn in the piece's real proportions.
  function box(h, w, d, v) {
    const mx = Math.max(h || 0, w || 0, d || 0);
    const W = 20 + 70 * ((w || mx) / mx), H = 18 + 62 * ((h || mx) / mx), D = 8 + 26 * ((d || mx) / mx);
    const dx = D, dy = D * 0.72, x0 = 30, yb = 118, y0 = yb - H, xr = x0 + W;
    const f = (n) => n.toFixed(1);
    return `<svg viewBox="0 0 180 140" role="img" aria-label="${esc(t('dimensions'))}">
      <g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">
        <path d="M${x0} ${f(y0)}h${f(W)}v${f(H)}h-${f(W)}z" fill="#fff"/>
        <path d="M${x0} ${f(y0)}l${f(dx)} -${f(dy)}h${f(W)}l-${f(dx)} ${f(dy)}z" fill="#fff"/>
        <path d="M${f(xr)} ${f(y0)}l${f(dx)} -${f(dy)}v${f(H)}l-${f(dx)} ${f(dy)}z" fill="#efe7de"/>
      </g>
      <g stroke="currentColor" stroke-width=".8" opacity=".45" fill="none">
        <path d="M20 ${f(y0)}v${f(H)}M16 ${f(y0)}h8M16 ${yb}h8"/>
        <path d="M${x0} 128h${f(W)}M${x0} 124v8M${f(xr)} 124v8"/>
        <path d="M${f(xr + 8)} 126l${f(dx)} -${f(dy)}"/>
      </g>
      ${h ? `<text x="10" y="${f((y0 + yb) / 2)}" text-anchor="middle" transform="rotate(-90 10 ${f((y0 + yb) / 2)})">${v(h)}</text>` : ''}
      ${w ? `<text x="${f(x0 + W / 2)}" y="139" text-anchor="middle">${v(w)}</text>` : ''}
      ${d ? `<text x="${f(xr + 12 + dx)}" y="${f(126 - dy + 4)}">${v(d)}</text>` : ''}
    </svg>`;
  }

  function wireGallery(root, imgs) {
    const slides = root.querySelector('.slides');
    if (!slides) return;
    let cur = 0;
    const go = (i) => {
      cur = (i + imgs.length) % imgs.length;
      const el = slides.children[cur];
      slides.scrollTo({ left: el.offsetLeft - slides.offsetLeft, behavior: 'smooth' });
      mark();
    };
    const mark = () => {
      root.querySelectorAll('.dots i').forEach((d, i) => d.classList.toggle('on', i === cur));
      root.querySelectorAll('.thumbs button').forEach((b, i) => b.setAttribute('aria-current', i === cur));
    };
    let raf;
    slides.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(Math.abs(slides.scrollLeft) / slides.clientWidth);
        if (i !== cur) { cur = i; mark(); }
      });
    });
    root.querySelectorAll('.thumbs button').forEach((b) => (b.onclick = () => go(+b.dataset.i)));
    const prev = root.querySelector('.gal-nav.prev'), next = root.querySelector('.gal-nav.next');
    if (prev) prev.onclick = () => go(cur - 1);
    if (next) next.onclick = () => go(cur + 1);
    slides.querySelectorAll('.slide').forEach((s) => (s.onclick = () => lightbox(imgs, +s.dataset.i)));
  }

  function lightbox(imgs, start) {
    let i = start;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = `<img alt="">
      <button class="icon-btn lb-close" type="button" aria-label="${esc(t('close'))}">${icon('close')}</button>
      ${imgs.length > 1 ? `<button class="icon-btn lb-prev" type="button" aria-label="${esc(t('prev'))}">${icon('left', 'flip')}</button>
      <button class="icon-btn lb-next" type="button" aria-label="${esc(t('next'))}">${icon('right', 'flip')}</button><div class="lb-count"></div>` : ''}`;
    const img = box.querySelector('img');
    const rtl = document.documentElement.dir === 'rtl';
    const show = () => { img.src = imgUrl(imgs[i]); const c = box.querySelector('.lb-count'); if (c) c.textContent = fmtNum(i + 1) + ' / ' + fmtNum(imgs.length); };
    const step = (dir) => { i = (i + dir + imgs.length) % imgs.length; show(); };
    const close = () => { box.remove(); document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', key); };
    const key = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    };
    box.querySelector('.lb-close').onclick = close;
    const pv = box.querySelector('.lb-prev'), nx = box.querySelector('.lb-next');
    if (pv) pv.onclick = () => step(-1);
    if (nx) nx.onclick = () => step(1);
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    let x0 = null;
    box.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    box.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) step((dx < 0) !== rtl ? 1 : -1);
    });
    document.addEventListener('keydown', key);
    document.body.appendChild(box); document.body.classList.add('no-scroll');
    show(); box.querySelector('.lb-close').focus();
  }

  function setMeta(name, content) {
    let m = document.querySelector(`meta[name="${name}"]`);
    if (!m) { m = document.createElement('meta'); m.name = name; document.head.appendChild(m); }
    m.content = content;
  }

  Core.boot(render);
})();
