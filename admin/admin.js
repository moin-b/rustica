/* Workshop management panel */
(function () {
  'use strict';

  const CFG = window.SITE_CONFIG || {};
  const DEMO = !CFG.SUPABASE_URL || !CFG.SUPABASE_KEY;
  const BUCKET = 'media';
  const sb = DEMO ? null : window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY);
  const SITE = window.SITE_I18N || { en: {}, fa: {} };
  const app = document.getElementById('app');

  /* ===================== Texts ===================== */
  const L = {
    en: {
      other_lang: 'فارسی',
      panel: 'Workshop panel', sign_in_title: 'Manage your website', sign_in_text: 'Sign in with the email and password you were given.',
      email: 'Email', password: 'Password', sign_in: 'Sign in', signing_in: 'Signing in…',
      wrong_login: 'Email or password is incorrect.', not_admin: 'This account can’t manage the website. The site owner needs to add it as an admin.',
      sign_out: 'Sign out', view_site: 'View website', back: 'Back',
      tab_pieces: 'Pieces', tab_videos: 'Videos', tab_settings: 'Settings',
      add_piece: 'Add piece', new_piece: 'New piece', edit_piece: 'Edit piece',
      search: 'Search by name or code', pieces_count: '{n} pieces',
      no_pieces: 'No pieces yet. Add the first one and it appears on the website right away.', no_results: 'No piece matches “{q}”.',
      hidden: 'Hidden', home: 'Home page', price_on_request: 'Price on request',
      photos: 'Photos', photos_hint: 'The first photo is the cover. Photos are made smaller automatically before uploading.',
      add_photos: 'Add photos', choose_photo: 'Choose photo', upload_failed: 'A photo didn’t upload. Check the connection and try again.',
      move_earlier: 'Move earlier', move_later: 'Move later', remove_photo: 'Remove photo', cover: 'Cover',
      title: 'Name', title_ph: 'e.g. Burl chalice',
      code: 'Piece code', code_hint: 'Made from today’s date, like your spec sheets. You can change it.',
      price: 'Price', price_hint: 'Leave empty to show “Price on request”.',
      price_note: 'Note next to the price', price_note_ph: 'e.g. Negotiable',
      status: 'Status', st_available: 'Available', st_reserved: 'Reserved', st_sold: 'Sold',
      show_on_site: 'Show on website', feature: 'Show on home page',
      size: 'Size in centimeters', height: 'Height', width: 'Width', depth: 'Depth',
      details: 'Details', wood: 'Wood', wood_ph: 'e.g. Walnut burl', finish: 'Finish', finish_ph: 'e.g. Natural oil',
      category: 'Type', category_ph: 'e.g. Bowl', description: 'Description', description_ph: 'What makes this piece special? Where did the wood come from?',
      video: 'YouTube video of making it', video_ph: 'Paste a YouTube link', invalid_youtube: 'That doesn’t look like a YouTube link.',
      save: 'Save', saving: 'Saving…', saved: 'Saved', save_failed: 'Couldn’t save. Check the connection and try again.',
      need_title: 'Give the piece a name first.', code_taken: 'Another piece already uses the code {code}.', wait_photos: 'Wait until the photos finish uploading.',
      delete_piece: 'Delete piece', delete_q: 'Delete “{title}”?', delete_text: 'Its photos are deleted too. This can’t be undone. To keep it but take it off the website, use “Hide from website” instead.',
      deleted: 'Deleted', cancel: 'Cancel', delete: 'Delete',
      unsaved_q: 'Leave without saving?', unsaved_text: 'Your changes to this page will be lost.', leave: 'Leave without saving', stay: 'Keep editing',
      mark_available: 'Mark as available', mark_reserved: 'Mark as reserved', mark_sold: 'Mark as sold',
      hide: 'Hide from website', show: 'Show on website', pin_top: 'Move to top of the list', edit: 'Edit', open_page: 'Open on website', updated: 'Updated',
      videos_title: 'Workshop videos', videos_hint: 'Shown on the home page under “From the workshop”.',
      video_link: 'YouTube link', video_title: 'Title (optional)', add_video: 'Add video', added: 'Added',
      no_videos: 'No videos yet. Paste a YouTube link above.', delete_video_q: 'Remove this video from the website?', remove: 'Remove', removed: 'Removed',
      sec_brand: 'Workshop', site_name: 'Workshop name', lang: 'Website language', currency: 'Currency', currency_ph: 'e.g. Toman, $, €', currency_hint: 'A single symbol like $ goes before the price, a word goes after it.',
      years: 'Years of woodworking', years_hint: 'Shown as a number on the home page. Leave empty to show how many pieces were sold instead.',
      sec_contact: 'Contact', contact_hint: 'Empty fields are hidden on the website.',
      phone: 'Phone number', phone_hint: 'Used for every “Call” button.', whatsapp: 'WhatsApp number', whatsapp_hint: 'Country code first, digits only, e.g. 989121234567',
      instagram: 'Instagram username', telegram: 'Telegram username', youtube: 'YouTube channel', youtube_ph: '@channel or full link', email_c: 'Email',
      address: 'Workshop address', hours: 'Opening hours', hours_ph: 'e.g. Sat–Thu, 10:00–19:00',
      sec_texts: 'Home page text', texts_hint: 'The light grey text is what shows now. Type to replace it, or leave empty to keep it.',
      hero_title: 'Main headline', hero_text: 'Text under the headline', intro_text: 'About the workshop', details_title: 'Dark section title', details_text: 'Dark section text', quote: 'Big quote', contact_title: 'Contact title', contact_text: 'Contact text',
      sec_images: 'Home page photos', hero_image: 'Main photo', hero_image_hint: 'If empty, the cover of the first “Home page” piece is used.',
      about_images: 'Workshop photos', about_images_hint: 'Up to 5 photos of the workshop, tools or hands at work. If empty, piece photos are used.',
      sec_account: 'Account', signed_in_as: 'Signed in as {email}', new_password: 'New password', change_password: 'Change password', password_changed: 'Password changed', password_short: 'Use at least 8 characters.',
      demo_title: 'Connect Supabase first', demo_text: 'Add your Supabase URL and key to js/config.js, upload the change, then reload this page. The README file explains each step.',
      load_failed: 'Couldn’t load the data. Check the internet connection.', retry: 'Try again'
    },
    fa: {
      other_lang: 'English',
      panel: 'پنل کارگاه', sign_in_title: 'مدیریت سایت', sign_in_text: 'با ایمیل و رمزی که به شما داده شده وارد شوید.',
      email: 'ایمیل', password: 'رمز عبور', sign_in: 'ورود', signing_in: 'در حال ورود…',
      wrong_login: 'ایمیل یا رمز عبور اشتباه است.', not_admin: 'این حساب اجازه‌ی مدیریت سایت را ندارد. صاحب سایت باید آن را به‌عنوان مدیر اضافه کند.',
      sign_out: 'خروج', view_site: 'دیدن سایت', back: 'بازگشت',
      tab_pieces: 'آثار', tab_videos: 'ویدیوها', tab_settings: 'تنظیمات',
      add_piece: 'افزودن اثر', new_piece: 'اثر جدید', edit_piece: 'ویرایش اثر',
      search: 'جستجو با نام یا کد', pieces_count: '{n} اثر',
      no_pieces: 'هنوز اثری ثبت نشده. اولین اثر را اضافه کنید تا فوراً در سایت دیده شود.', no_results: 'اثری با «{q}» پیدا نشد.',
      hidden: 'مخفی', home: 'صفحه‌ی اصلی', price_on_request: 'قیمت با تماس',
      photos: 'عکس‌ها', photos_hint: 'عکس اول، عکس اصلی است. عکس‌ها قبل از آپلود خودکار کم‌حجم می‌شوند.',
      add_photos: 'افزودن عکس', choose_photo: 'انتخاب عکس', upload_failed: 'یک عکس آپلود نشد. اینترنت را بررسی کنید و دوباره امتحان کنید.',
      move_earlier: 'جابه‌جایی به قبل', move_later: 'جابه‌جایی به بعد', remove_photo: 'حذف عکس', cover: 'عکس اصلی',
      title: 'نام اثر', title_ph: 'مثلاً جام ریشه',
      code: 'کد اثر', code_hint: 'از تاریخ امروز ساخته شده، مثل برگه‌های مشخصات شما. می‌توانید تغییرش دهید.',
      price: 'قیمت', price_hint: 'اگر خالی بماند «قیمت با تماس» نمایش داده می‌شود.',
      price_note: 'توضیح کنار قیمت', price_note_ph: 'مثلاً قابل مذاکره',
      status: 'وضعیت', st_available: 'موجود', st_reserved: 'رزرو', st_sold: 'فروخته شد',
      show_on_site: 'نمایش در سایت', feature: 'نمایش در صفحه‌ی اصلی',
      size: 'ابعاد به سانتی‌متر', height: 'ارتفاع', width: 'عرض', depth: 'عمق',
      details: 'جزئیات', wood: 'نوع چوب', wood_ph: 'مثلاً ریشه‌ی گردو', finish: 'پوشش', finish_ph: 'مثلاً روغن طبیعی',
      category: 'دسته', category_ph: 'مثلاً کاسه', description: 'توضیحات', description_ph: 'چه چیزی این اثر را خاص می‌کند؟ چوبش از کجا آمده؟',
      video: 'ویدیوی ساخت در یوتیوب', video_ph: 'لینک یوتیوب را اینجا بگذارید', invalid_youtube: 'این لینک یوتیوب نیست.',
      save: 'ذخیره', saving: 'در حال ذخیره…', saved: 'ذخیره شد', save_failed: 'ذخیره نشد. اینترنت را بررسی کنید و دوباره امتحان کنید.',
      need_title: 'اول یک نام برای اثر بنویسید.', code_taken: 'کد {code} قبلاً برای اثر دیگری ثبت شده.', wait_photos: 'صبر کنید آپلود عکس‌ها تمام شود.',
      delete_piece: 'حذف اثر', delete_q: '«{title}» حذف شود؟', delete_text: 'عکس‌هایش هم پاک می‌شوند و قابل برگشت نیست. اگر فقط می‌خواهید از سایت برداشته شود، «مخفی کردن» را بزنید.',
      deleted: 'حذف شد', cancel: 'انصراف', delete: 'حذف',
      unsaved_q: 'بدون ذخیره خارج می‌شوید؟', unsaved_text: 'تغییرات این صفحه از بین می‌رود.', leave: 'خروج بدون ذخیره', stay: 'ادامه‌ی ویرایش',
      mark_available: 'علامت «موجود»', mark_reserved: 'علامت «رزرو»', mark_sold: 'علامت «فروخته شد»',
      hide: 'مخفی کردن از سایت', show: 'نمایش در سایت', pin_top: 'انتقال به بالای فهرست', edit: 'ویرایش', open_page: 'باز کردن در سایت', updated: 'به‌روز شد',
      videos_title: 'ویدیوهای کارگاه', videos_hint: 'در صفحه‌ی اصلی، بخش «از کارگاه» نمایش داده می‌شوند.',
      video_link: 'لینک یوتیوب', video_title: 'عنوان (اختیاری)', add_video: 'افزودن ویدیو', added: 'اضافه شد',
      no_videos: 'هنوز ویدیویی نیست. لینک یوتیوب را بالا وارد کنید.', delete_video_q: 'این ویدیو از سایت حذف شود؟', remove: 'حذف', removed: 'حذف شد',
      sec_brand: 'کارگاه', site_name: 'نام کارگاه', lang: 'زبان سایت', currency: 'واحد پول', currency_ph: 'مثلاً تومان', currency_hint: 'نماد تک‌حرفی مثل $ قبل از قیمت و کلمه بعد از قیمت می‌آید.',
      years: 'سال‌های کار با چوب', years_hint: 'به‌صورت عدد در صفحه‌ی اصلی می‌آید. اگر خالی باشد تعداد آثار فروخته‌شده نمایش داده می‌شود.',
      sec_contact: 'راه‌های تماس', contact_hint: 'فیلدهای خالی در سایت نمایش داده نمی‌شوند.',
      phone: 'شماره تلفن', phone_hint: 'برای همه‌ی دکمه‌های «تماس» استفاده می‌شود.', whatsapp: 'شماره واتس‌اپ', whatsapp_hint: 'با کد کشور و فقط عدد، مثلاً 989121234567',
      instagram: 'نام کاربری اینستاگرام', telegram: 'نام کاربری تلگرام', youtube: 'کانال یوتیوب', youtube_ph: '@channel یا لینک کامل', email_c: 'ایمیل',
      address: 'آدرس کارگاه', hours: 'ساعت کاری', hours_ph: 'مثلاً شنبه تا پنجشنبه، ۱۰ تا ۱۹',
      sec_texts: 'متن‌های صفحه‌ی اصلی', texts_hint: 'متن کم‌رنگ همان چیزی است که الان نمایش داده می‌شود. برای تغییر، متن جدید بنویسید یا خالی بگذارید.',
      hero_title: 'تیتر اصلی', hero_text: 'متن زیر تیتر', intro_text: 'درباره‌ی کارگاه', details_title: 'تیتر بخش تیره', details_text: 'متن بخش تیره', quote: 'جمله‌ی بزرگ', contact_title: 'تیتر تماس', contact_text: 'متن تماس',
      sec_images: 'عکس‌های صفحه‌ی اصلی', hero_image: 'عکس اصلی', hero_image_hint: 'اگر خالی باشد، عکس اول اولین اثرِ «صفحه‌ی اصلی» استفاده می‌شود.',
      about_images: 'عکس‌های کارگاه', about_images_hint: 'حداکثر ۵ عکس از کارگاه، ابزار یا دست‌ها هنگام کار. اگر خالی باشد از عکس آثار استفاده می‌شود.',
      sec_account: 'حساب کاربری', signed_in_as: 'وارد شده با {email}', new_password: 'رمز جدید', change_password: 'تغییر رمز', password_changed: 'رمز تغییر کرد', password_short: 'حداقل ۸ کاراکتر وارد کنید.',
      demo_title: 'اول Supabase را وصل کنید', demo_text: 'آدرس و کلید Supabase را در فایل js/config.js وارد کنید، تغییر را آپلود کنید و این صفحه را دوباره باز کنید. فایل README همه‌ی مراحل را توضیح داده.',
      load_failed: 'اطلاعات بارگذاری نشد. اینترنت را بررسی کنید.', retry: 'تلاش دوباره'
    }
  };

  // The panel is in Persian. (The English texts above stay as a fallback.)
  const st = { lang: 'fa', user: null, products: [], videos: [], settings: {}, loaded: false };

  const t = (k, v) => { let s = (L[st.lang] || L.en)[k] ?? L.en[k] ?? k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const latin = (s) => String(s ?? '').replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const num = (s) => { const v = latin(s).replace(/[,\s٬،]/g, '').trim(); return v === '' || isNaN(+v) ? null : +v; };
  const fmt = (n) => new Intl.NumberFormat(st.lang === 'fa' ? 'fa-IR' : 'en-US').format(n);
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const ytId = (u) => { const m = String(u || '').match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/); return m ? m[1] : ''; };

  const P = {
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9v6l5-3z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', back: '<path d="M15 5l-7 7 7 7"/>', left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>', more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>', camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    check: '<path d="M5 12l5 5 9-10"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', eyeoff: '<path d="M3 3l18 18M10.6 6.1A9.7 9.7 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.8M6.3 6.8C3.6 8.6 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>'
  };
  const icon = (n, c) => `<svg class="ic ${c || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  function imgUrl(path, size) {
    if (!path) return '';
    if (/^(https?:|blob:|data:)/.test(path)) return path;
    if (path.startsWith('assets/')) return '../' + path;
    const p = size === 'sm' ? path.replace(/(\.\w+)$/, '-sm$1') : path;
    return CFG.SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + p.split('/').map(encodeURIComponent).join('/');
  }

  function applyLang() {
    document.documentElement.lang = st.lang;
    document.documentElement.dir = st.lang === 'fa' ? 'rtl' : 'ltr';
    document.title = t('panel');
  }

  /* ===================== Toast & sheets ===================== */
  function toast(msg, err) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.toggle('err', !!err); el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), err ? 4000 : 2200);
  }
  // options: [{label, value, icon, danger}]
  function sheet({ title, text, options }) {
    return new Promise((resolve) => {
      const bg = document.createElement('div');
      bg.className = 'sheet-bg';
      bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">
        ${title ? `<div class="sheet-title">${esc(title)}</div>` : ''}${text ? `<div class="sheet-text">${esc(text)}</div>` : ''}
        ${options.map((o, i) => `<button type="button" data-i="${i}" class="${o.danger ? 'danger' : ''}">${o.icon ? icon(o.icon) : ''}${esc(o.label)}</button>`).join('')}
        <button type="button" class="cancel" data-i="-1">${esc(t('cancel'))}</button></div>`;
      const done = (v) => { bg.remove(); document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', key); resolve(v); };
      const key = (e) => { if (e.key === 'Escape') done(null); };
      bg.addEventListener('click', (e) => {
        if (e.target === bg) return done(null);
        const b = e.target.closest('button[data-i]');
        if (b) done(+b.dataset.i < 0 ? null : options[+b.dataset.i].value);
      });
      document.addEventListener('keydown', key);
      document.body.appendChild(bg); document.body.classList.add('no-scroll');
      bg.querySelector('button').focus();
    });
  }
  const confirmSheet = (title, text, label, danger = true) => sheet({ title, text, options: [{ label, value: true, danger }] });

  /* ===================== Photos ===================== */
  async function decode(file) {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) {
      return await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    }
  }
  async function encode(src, max, quality, type) {
    const w0 = src.width, h0 = src.height, k = Math.min(1, max / Math.max(w0, h0));
    const c = document.createElement('canvas');
    c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, c.width, c.height);
    return await new Promise((r) => c.toBlob(r, type, quality));
  }
  // Uploads a large (1800px) and a small (640px) copy. Returns the storage path.
  async function uploadPhoto(file, folder) {
    const src = await decode(file);
    let big = await encode(src, 1800, 0.82, 'image/webp');
    let type = 'image/webp';
    if (!big || big.type !== 'image/webp') { type = 'image/jpeg'; big = await encode(src, 1800, 0.84, type); }
    const small = await encode(src, 640, 0.78, type);
    const ext = type === 'image/webp' ? 'webp' : 'jpg';
    const id = uid(), path = `${folder}/${id}.${ext}`, smallPath = `${folder}/${id}-sm.${ext}`;
    const opt = { contentType: type, cacheControl: '31536000', upsert: false };
    const a = await sb.storage.from(BUCKET).upload(path, big, opt);
    if (a.error) throw a.error;
    const b = await sb.storage.from(BUCKET).upload(smallPath, small, opt);
    if (b.error) { await sb.storage.from(BUCKET).remove([path]); throw b.error; }
    return path;
  }
  async function removePhotos(paths) {
    const list = [];
    paths.filter((p) => p && !p.startsWith('assets/') && !/^(https?:|blob:)/.test(p)).forEach((p) => list.push(p, p.replace(/(\.\w+)$/, '-sm$1')));
    if (list.length) { const r = await sb.storage.from(BUCKET).remove(list); if (r.error) console.warn(r.error); }
  }

  // A reusable photo picker: grid of tiles + "Add photos".
  function PhotoField({ images, max, folder, single, onChange }) {
    const items = (images || []).filter(Boolean).map((p) => ({ path: p, url: imgUrl(p, 'sm') }));
    const uploaded = [], removed = [];
    const el = document.createElement('div');
    el.className = 'photos' + (single ? ' single' : '');

    function render() {
      el.innerHTML = items.map((it, i) => `
        <div class="ph ${it.busy ? 'busy' : ''}">
          <img src="${esc(it.url)}" alt="">
          ${it.busy ? '<span class="spin"></span>' : `
            ${!single && i === 0 && items.length > 1 ? `<span class="cover">${esc(t('cover'))}</span>` : ''}
            <div class="ph-tools">
              ${!single && i > 0 ? `<button type="button" data-a="l" data-i="${i}" aria-label="${esc(t('move_earlier'))}">${icon('left', 'flip')}</button>` : '<span></span>'}
              <button type="button" data-a="x" data-i="${i}" aria-label="${esc(t('remove_photo'))}">${icon('close')}</button>
              ${!single && i < items.length - 1 ? `<button type="button" data-a="r" data-i="${i}" aria-label="${esc(t('move_later'))}">${icon('right', 'flip')}</button>` : '<span></span>'}
            </div>`}
        </div>`).join('') + (items.length < max ? `
        <label class="ph-add">${icon('camera')}<span>${esc(single ? t('choose_photo') : t('add_photos'))}</span>
          <input type="file" accept="image/*" ${single ? '' : 'multiple'}></label>` : '');
      const input = el.querySelector('input[type=file]');
      if (input) input.onchange = () => { add([...input.files]); input.value = ''; };
    }

    el.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-a]');
      if (!b) return;
      const i = +b.dataset.i, a = b.dataset.a;
      if (a === 'x') { const [it] = items.splice(i, 1); if (it.path) removed.push(it.path); }
      if (a === 'l' && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
      if (a === 'r' && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
      render(); onChange && onChange();
    });

    async function add(files) {
      files = files.slice(0, max - items.length);
      const fresh = files.map((f) => ({ busy: true, url: URL.createObjectURL(f), file: f }));
      items.push(...fresh); render(); onChange && onChange();
      for (const it of fresh) { // one at a time keeps phones from running out of memory
        try { it.path = await uploadPhoto(it.file, folder); uploaded.push(it.path); }
        catch (err) { console.error(err); items.splice(items.indexOf(it), 1); toast(t('upload_failed'), true); }
        it.busy = false; delete it.file; render(); onChange && onChange();
      }
    }

    render();
    return {
      el,
      paths: () => items.filter((i) => i.path && !i.busy).map((i) => i.path),
      busy: () => items.some((i) => i.busy),
      // After a successful save: really delete the photos that were removed.
      commit: async () => { const r = removed.splice(0); uploaded.splice(0); await removePhotos(r); },
      // Leaving without saving: delete photos uploaded in this visit.
      discard: async () => { const u = uploaded.splice(0); removed.splice(0); await removePhotos(u); }
    };
  }

  /* ===================== Data ===================== */
  async function loadAll() {
    const [p, v, s] = await Promise.all([
      sb.from('products').select('*').order('sort', { ascending: true }).order('created_at', { ascending: false }),
      sb.from('videos').select('*').order('sort', { ascending: true }).order('created_at', { ascending: false }),
      sb.from('settings').select('data').eq('id', 1).maybeSingle()
    ]);
    if (p.error || v.error || s.error) throw (p.error || v.error || s.error);
    st.products = p.data || []; st.videos = v.data || []; st.settings = (s.data && s.data.data) || {};
    st.loaded = true;
  }

  // Code like D14040827 = "D" + Solar Hijri year/month/day, the way the spec sheets are numbered.
  function newCode() {
    let y, m, d;
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      y = parts.find((x) => x.type === 'year').value.replace(/\D/g, '');
      m = parts.find((x) => x.type === 'month').value; d = parts.find((x) => x.type === 'day').value;
    } catch (e) { const n = new Date(); y = n.getFullYear(); m = String(n.getMonth() + 1).padStart(2, '0'); d = String(n.getDate()).padStart(2, '0'); }
    const base = 'D' + y + m + d;
    const taken = new Set(st.products.map((p) => p.code));
    if (!taken.has(base)) return base;
    for (let i = 2; ; i++) if (!taken.has(base + '-' + i)) return base + '-' + i;
  }

  /* ===================== Shell ===================== */
  let leaveGuard = null; // set by editors: async () => true if OK to leave

  function shell({ title, back, content, tabs = true, actions = '' }) {
    app.innerHTML = `
      <header class="top"><div class="top-row ${back ? 'has-back' : ''}">
        ${back ? `<button class="icon-btn" type="button" data-back aria-label="${esc(t('back'))}">${icon('back', 'flip')}</button>` : ''}
        <h1>${esc(title)}</h1>
        ${actions}
      </div></header>
      <main class="main" id="main"></main>
      ${tabs ? `<nav class="tabs"><div class="tabs-row">
        ${tab('pieces', 'grid', t('tab_pieces'))}${tab('videos', 'play', t('tab_videos'))}${tab('settings', 'gear', t('tab_settings'))}
      </div></nav>` : ''}`;
    const main = app.querySelector('#main');
    if (typeof content === 'string') main.innerHTML = content; else if (content) main.appendChild(content);
    const b = app.querySelector('[data-back]');
    if (b) b.onclick = () => { location.hash = back; };
    window.scrollTo(0, 0);
    return main;
  }
  function tab(id, ic, label) {
    const cur = (location.hash.slice(1) || 'pieces').split('/')[0];
    return `<a class="tab" href="#${id}" ${cur === id || (cur === 'piece' && id === 'pieces') ? 'aria-current="page"' : ''}>${icon(ic)}<span>${esc(label)}</span></a>`;
  }

  /* ===================== Router ===================== */
  let lastHash = location.hash;
  let ignoreNext = false;
  async function route(force) {
    applyLang();
    if (DEMO) return viewDemo();
    if (!st.user) return viewLogin();
    if (ignoreNext) { ignoreNext = false; return; }
    if (leaveGuard && !force) {
      const ok = await leaveGuard();
      if (!ok) { ignoreNext = true; location.hash = lastHash; return; }
    }
    if (!force) leaveGuard = null;
    lastHash = location.hash;
    if (!st.loaded) {
      app.innerHTML = '<div class="loading"><span class="spin"></span></div>';
      try { await loadAll(); }
      catch (e) {
        console.error(e);
        app.innerHTML = `<div class="loading"><div class="empty"><p>${esc(t('load_failed'))}</p><button class="btn" type="button" id="retry">${esc(t('retry'))}</button></div></div>`;
        app.querySelector('#retry').onclick = () => route(true);
        return;
      }
    }
    const [view, arg] = (location.hash.slice(1) || 'pieces').split('/');
    if (view === 'piece') return viewEditor(arg);
    if (view === 'videos') return viewVideos();
    if (view === 'settings') return viewSettings();
    return viewPieces();
  }
  window.addEventListener('hashchange', () => route(false));

  /* ===================== Views ===================== */
  function viewDemo() {
    app.innerHTML = `<div class="login"><div class="login-card">
      <img class="login-mark" src="../assets/favicon.svg" alt="">
      <h1>${esc(t('demo_title'))}</h1><p class="muted">${esc(t('demo_text'))}</p>
      <a class="btn ghost" href="../index.html">${esc(t('view_site'))}</a></div></div>`;
  }

  function viewLogin(errorMsg) {
    app.innerHTML = `<div class="login"><form class="login-card" novalidate>
      <img class="login-mark" src="../assets/favicon.svg" alt="">
      <h1>${esc(t('sign_in_title'))}</h1><p class="muted">${esc(t('sign_in_text'))}</p>
      <label class="field"><span>${esc(t('email'))}</span><input type="email" name="email" class="ltr" autocomplete="username" required inputmode="email"></label>
      <label class="field"><span>${esc(t('password'))}</span><input type="password" name="password" class="ltr" autocomplete="current-password" required></label>
      ${errorMsg ? `<p class="error" role="alert">${esc(errorMsg)}</p>` : ''}
      <button class="btn block" type="submit">${esc(t('sign_in'))}</button>
    </form></div>`;
    const f = app.querySelector('form');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = t('signing_in');
      const { data, error } = await sb.auth.signInWithPassword({ email: f.elements.email.value.trim(), password: f.elements.password.value });
      if (error) return viewLogin(t('wrong_login'));
      await onSignedIn(data.user);
    };
  }

  async function onSignedIn(user) {
    const { data } = await sb.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (!data) { await sb.auth.signOut(); st.user = null; return viewLogin(t('not_admin')); }
    st.user = user; route(true);
  }

  /* ----- Pieces list ----- */
  let query = '';
  function viewPieces() {
    const main = shell({
      title: t('tab_pieces'),
      actions: `<a class="icon-btn" href="../index.html" target="_blank" rel="noopener" aria-label="${esc(t('view_site'))}">${icon('ext')}</a>`
    });
    const list = () => {
      const q = query.trim().toLowerCase();
      return st.products.filter((p) => !q || (p.title || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q));
    };
    const draw = () => {
      const items = list();
      const box = main.querySelector('#plist');
      if (!st.products.length) {
        box.innerHTML = `<div class="empty"><p>${esc(t('no_pieces'))}</p><a class="btn" href="#piece/new">${icon('plus')}${esc(t('add_piece'))}</a></div>`;
        return;
      }
      box.innerHTML = `<p class="count">${esc(t('pieces_count', { n: fmt(items.length) }))}</p>` + (items.length ? `<div class="list">${items.map((p) => `
        <div class="item">
          <a class="item-main" href="#piece/${esc(p.id)}">
            ${p.images && p.images[0] ? `<img class="item-img" src="${esc(imgUrl(p.images[0], 'sm'))}" alt="" loading="lazy">` : '<span class="item-img"></span>'}
            <span class="item-text">
              <span class="item-title" style="display:block">${esc(p.title)}</span>
              <span class="item-sub"><span>${esc(p.code || '')}</span><span>${p.price != null ? esc(fmt(p.price)) : esc(t('price_on_request'))}</span></span>
              <span class="tags">
                ${p.status === 'sold' ? `<span class="tag sold">${esc(t('st_sold'))}</span>` : p.status === 'reserved' ? `<span class="tag reserved">${esc(t('st_reserved'))}</span>` : ''}
                ${!p.published ? `<span class="tag hidden-tag">${esc(t('hidden'))}</span>` : ''}
                ${p.featured ? `<span class="tag">${esc(t('home'))}</span>` : ''}
              </span>
            </span>
          </a>
          <button class="icon-btn" type="button" data-more="${esc(p.id)}" aria-label="${esc(p.title)}">${icon('more')}</button>
        </div>`).join('')}</div>` : `<p class="empty">${esc(t('no_results', { q: query }))}</p>`);
    };
    main.innerHTML = `${st.products.length > 4 ? `<input type="search" class="search" placeholder="${esc(t('search'))}" value="${esc(query)}" aria-label="${esc(t('search'))}">` : ''}<div id="plist"></div>`;
    const s = main.querySelector('.search');
    if (s) s.oninput = () => { query = s.value; draw(); };
    draw();

    const fab = document.createElement('a');
    fab.className = 'btn fab'; fab.href = '#piece/new';
    fab.innerHTML = icon('plus') + esc(t('add_piece'));
    if (st.products.length) app.appendChild(fab);

    main.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-more]');
      if (!b) return;
      const p = st.products.find((x) => x.id === b.dataset.more);
      const opts = [];
      if (p.status !== 'sold') opts.push({ label: t('mark_sold'), value: { status: 'sold' }, icon: 'check' });
      if (p.status !== 'reserved') opts.push({ label: t('mark_reserved'), value: { status: 'reserved' }, icon: 'check' });
      if (p.status !== 'available') opts.push({ label: t('mark_available'), value: { status: 'available' }, icon: 'check' });
      opts.push(p.published ? { label: t('hide'), value: { published: false }, icon: 'eyeoff' } : { label: t('show'), value: { published: true }, icon: 'eye' });
      opts.push({ label: t('pin_top'), value: 'top', icon: 'up' });
      opts.push({ label: t('edit'), value: 'edit', icon: 'pencil' });
      if (p.published) opts.push({ label: t('open_page'), value: 'open', icon: 'ext' });
      opts.push({ label: t('delete_piece'), value: 'delete', icon: 'trash', danger: true });
      const v = await sheet({ title: p.title, options: opts });
      if (!v) return;
      if (v === 'edit') { location.hash = 'piece/' + p.id; return; }
      if (v === 'open') { window.open('../product.html?id=' + encodeURIComponent(p.id), '_blank', 'noopener'); return; }
      if (v === 'delete') { if (await deletePiece(p)) draw(); return; }
      const patch = v === 'top' ? { sort: Math.min(0, ...st.products.map((x) => x.sort || 0)) - 1 } : v;
      const { data, error } = await sb.from('products').update(patch).eq('id', p.id).select().single();
      if (error) return toast(t('save_failed'), true);
      Object.assign(p, data);
      if (v === 'top') st.products.sort((a, b2) => (a.sort - b2.sort) || String(b2.created_at).localeCompare(String(a.created_at)));
      toast(t('updated')); draw();
    });
  }

  async function deletePiece(p) {
    const ok = await confirmSheet(t('delete_q', { title: p.title }), t('delete_text'), t('delete'));
    if (!ok) return false;
    const { error } = await sb.from('products').delete().eq('id', p.id);
    if (error) { toast(t('save_failed'), true); return false; }
    await removePhotos(p.images || []);
    st.products = st.products.filter((x) => x.id !== p.id);
    toast(t('deleted'));
    return true;
  }

  /* ----- Piece editor ----- */
  function viewEditor(id) {
    const isNew = id === 'new';
    const p = isNew ? { title: '', code: newCode(), status: 'available', published: true, featured: false, images: [] }
      : st.products.find((x) => x.id === id);
    if (!p) { location.hash = 'pieces'; return; }

    const main = shell({ title: isNew ? t('new_piece') : t('edit_piece'), back: 'pieces', tabs: false });
    main.classList.add('with-savebar');
    const val = (x) => (x === null || x === undefined ? '' : esc(x));
    const seg = (v) => ['available', 'reserved', 'sold'].map((s) => `<input type="radio" name="status" id="st-${s}" value="${s}" ${v === s ? 'checked' : ''}><label for="st-${s}">${esc(t('st_' + s))}</label>`).join('');

    main.innerHTML = `<form id="pf" novalidate>
      <section class="card"><h2>${esc(t('photos'))}</h2><p class="hint">${esc(t('photos_hint'))}</p><div id="ph"></div></section>
      <section class="card">
        <label class="field"><span>${esc(t('title'))}</span><input type="text" name="title" value="${val(p.title)}" placeholder="${esc(t('title_ph'))}" required></label>
        <label class="field"><span>${esc(t('price'))}</span><input type="text" name="price" inputmode="decimal" class="ltr" value="${p.price != null ? esc(p.price) : ''}" autocomplete="off">
          <span class="price-preview" id="pp"></span><small>${esc(t('price_hint'))}</small></label>
        <label class="field"><span>${esc(t('price_note'))}</span><input type="text" name="price_note" value="${val(p.price_note)}" placeholder="${esc(t('price_note_ph'))}"></label>
        <div class="field"><span>${esc(t('status'))}</span><div class="seg" role="radiogroup">${seg(p.status)}</div></div>
      </section>
      <section class="card" style="padding-bottom:4px">
        <label class="switch"><span>${esc(t('show_on_site'))}</span><input type="checkbox" name="published" ${p.published ? 'checked' : ''}></label>
        <label class="switch"><span>${esc(t('feature'))}</span><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''}></label>
      </section>
      <section class="card">
        <div class="field"><span>${esc(t('size'))}</span><div class="row3">
          <label>${esc(t('height'))}<input type="text" inputmode="decimal" name="height_cm" class="ltr" value="${val(p.height_cm)}"></label>
          <label>${esc(t('width'))}<input type="text" inputmode="decimal" name="width_cm" class="ltr" value="${val(p.width_cm)}"></label>
          <label>${esc(t('depth'))}<input type="text" inputmode="decimal" name="depth_cm" class="ltr" value="${val(p.depth_cm)}"></label>
        </div></div>
        <label class="field"><span>${esc(t('description'))}</span><textarea name="description" placeholder="${esc(t('description_ph'))}">${val(p.description)}</textarea></label>
        <label class="field"><span>${esc(t('category'))}</span><input type="text" name="category" value="${val(p.category)}" placeholder="${esc(t('category_ph'))}" list="cats"></label>
        <datalist id="cats">${[...new Set(st.products.map((x) => x.category).filter(Boolean))].map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
        <label class="field"><span>${esc(t('wood'))}</span><input type="text" name="wood" value="${val(p.wood)}" placeholder="${esc(t('wood_ph'))}"></label>
        <label class="field"><span>${esc(t('finish'))}</span><input type="text" name="finish" value="${val(p.finish)}" placeholder="${esc(t('finish_ph'))}"></label>
        <label class="field"><span>${esc(t('video'))}</span><input type="url" name="video_url" class="ltr" value="${val(p.video_url)}" placeholder="${esc(t('video_ph'))}"></label>
        <label class="field"><span>${esc(t('code'))}</span><input type="text" name="code" class="ltr" value="${val(p.code)}">${isNew ? `<small>${esc(t('code_hint'))}</small>` : ''}</label>
      </section>
      ${isNew ? '' : `<button class="btn danger block" type="button" id="del">${icon('trash')}${esc(t('delete_piece'))}</button>`}
    </form>`;

    const f = main.querySelector('#pf');
    const photos = PhotoField({ images: p.images, max: 12, folder: 'pieces', onChange: () => {} });
    main.querySelector('#ph').appendChild(photos.el);

    const pp = main.querySelector('#pp');
    const showPrice = () => { const n = num(f.elements.price.value); pp.textContent = n != null ? fmt(n) + ' ' + (st.settings.currency || 'تومان') : ''; };
    f.elements.price.oninput = showPrice; showPrice();

    const bar = document.createElement('div');
    bar.className = 'savebar';
    bar.innerHTML = `<button class="btn" type="button">${esc(t('save'))}</button>`;
    app.appendChild(bar);
    const saveBtn = bar.querySelector('button');

    const read = () => ({
      title: f.elements.title.value.trim(), code: f.elements.code.value.trim() || null,
      price: num(f.elements.price.value), price_note: f.elements.price_note.value.trim() || null,
      status: f.elements.status.value, published: f.elements.published.checked, featured: f.elements.featured.checked,
      height_cm: num(f.elements.height_cm.value), width_cm: num(f.elements.width_cm.value), depth_cm: num(f.elements.depth_cm.value),
      description: f.elements.description.value.trim() || null, category: f.elements.category.value.trim() || null,
      wood: f.elements.wood.value.trim() || null, finish: f.elements.finish.value.trim() || null,
      video_url: f.elements.video_url.value.trim() || null, images: photos.paths()
    });
    const snapshot = JSON.stringify(read());
    let saved = false;

    leaveGuard = async () => {
      if (saved) return true;
      if (JSON.stringify(read()) === snapshot && !photos.busy()) { await photos.discard(); return true; }
      const ok = await confirmSheet(t('unsaved_q'), t('unsaved_text'), t('leave'));
      if (ok) { photos.discard(); bar.remove(); }
      return !!ok;
    };

    saveBtn.onclick = async () => {
      const row = read();
      if (!row.title) { toast(t('need_title'), true); f.elements.title.focus(); return; }
      if (photos.busy()) { toast(t('wait_photos'), true); return; }
      if (row.video_url && !ytId(row.video_url)) { toast(t('invalid_youtube'), true); f.elements.video_url.focus(); return; }
      saveBtn.disabled = true; saveBtn.textContent = t('saving');
      const q = isNew ? sb.from('products').insert(row).select().single() : sb.from('products').update(row).eq('id', p.id).select().single();
      const { data, error } = await q;
      saveBtn.disabled = false; saveBtn.textContent = t('save');
      if (error) { console.error(error); toast(error.code === '23505' ? t('code_taken', { code: row.code }) : t('save_failed'), true); return; }
      await photos.commit();
      if (isNew) st.products.unshift(data); else Object.assign(p, data);
      saved = true; leaveGuard = null; bar.remove();
      toast(t('saved'));
      location.hash = 'pieces';
    };

    const del = main.querySelector('#del');
    if (del) del.onclick = async () => {
      if (await deletePiece(p)) { saved = true; leaveGuard = null; bar.remove(); location.hash = 'pieces'; }
    };
  }

  /* ----- Videos ----- */
  function viewVideos() {
    const main = shell({ title: t('videos_title') });
    const draw = () => {
      main.querySelector('#vlist').innerHTML = st.videos.length ? `<div class="list">${st.videos.map((v) => `
        <div class="item">
          <a class="item-main" href="${esc(v.url)}" target="_blank" rel="noopener">
            <img class="item-img wide" src="https://i.ytimg.com/vi/${esc(ytId(v.url))}/mqdefault.jpg" alt="" loading="lazy">
            <span class="item-text"><span class="item-title" style="display:block">${esc(v.title || v.url)}</span></span>
          </a>
          <button class="icon-btn" type="button" data-del="${esc(v.id)}" aria-label="${esc(t('remove'))}">${icon('trash')}</button>
        </div>`).join('')}</div>` : `<p class="empty">${esc(t('no_videos'))}</p>`;
    };
    main.innerHTML = `
      <form class="card" id="vf" novalidate>
        <p class="hint" style="margin-top:0">${esc(t('videos_hint'))}</p>
        <label class="field"><span>${esc(t('video_link'))}</span><input type="url" name="url" class="ltr" placeholder="https://youtube.com/watch?v=…"></label>
        <label class="field"><span>${esc(t('video_title'))}</span><input type="text" name="title"></label>
        <button class="btn block" type="submit" style="margin-bottom:14px">${icon('plus')}${esc(t('add_video'))}</button>
      </form>
      <div id="vlist"></div>`;
    draw();
    const f = main.querySelector('#vf');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const url = f.elements.url.value.trim();
      if (!ytId(url)) { toast(t('invalid_youtube'), true); f.elements.url.focus(); return; }
      const btn = f.querySelector('button'); btn.disabled = true;
      const { data, error } = await sb.from('videos').insert({ url, title: f.elements.title.value.trim() || null }).select().single();
      btn.disabled = false;
      if (error) return toast(t('save_failed'), true);
      st.videos.unshift(data); f.reset(); draw(); toast(t('added'));
    };
    main.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      if (!(await confirmSheet(t('delete_video_q'), '', t('remove')))) return;
      const { error } = await sb.from('videos').delete().eq('id', b.dataset.del);
      if (error) return toast(t('save_failed'), true);
      st.videos = st.videos.filter((v) => v.id !== b.dataset.del); draw(); toast(t('removed'));
    });
  }

  /* ----- Settings ----- */
  function viewSettings() {
    const s = st.settings;
    const main = shell({ title: t('tab_settings') });
    main.classList.add('with-tabs-save');
    const siteLang = s.lang === 'en' ? 'en' : 'fa';
    const def = (k) => (SITE[siteLang] && SITE[siteLang]['def_' + k]) || '';
    const inp = (key, label, opts = {}) => `<label class="field"><span>${esc(label)}</span>
      ${opts.area ? `<textarea name="${key}" placeholder="${esc(opts.ph || '')}" ${opts.rows ? `rows="${opts.rows}" style="min-height:0"` : ''}>${esc(s[key] || '')}</textarea>`
        : `<input type="${opts.type || 'text'}" name="${key}" value="${esc(s[key] || '')}" placeholder="${esc(opts.ph || '')}" ${opts.ltr ? 'class="ltr"' : ''} ${opts.mode ? `inputmode="${opts.mode}"` : ''}>`}
      ${opts.hint ? `<small>${esc(opts.hint)}</small>` : ''}</label>`;

    main.innerHTML = `<form id="sf" novalidate>
      <section class="card"><h2>${esc(t('sec_brand'))}</h2><div style="height:12px"></div>
        ${inp('siteName', t('site_name'), { ph: def('siteName') })}
        <label class="field"><span>${esc(t('lang'))}</span><select name="lang">
          <option value="fa" ${siteLang === 'fa' ? 'selected' : ''}>فارسی</option>
          <option value="en" ${siteLang === 'en' ? 'selected' : ''}>English</option></select></label>
        ${inp('currency', t('currency'), { ph: t('currency_ph'), hint: t('currency_hint') })}
        ${inp('years', t('years'), { mode: 'numeric', ltr: true, hint: t('years_hint') })}
      </section>
      <section class="card"><h2>${esc(t('sec_contact'))}</h2><p class="hint">${esc(t('contact_hint'))}</p>
        ${inp('phone', t('phone'), { type: 'tel', ltr: true, hint: t('phone_hint') })}
        ${inp('whatsapp', t('whatsapp'), { type: 'tel', ltr: true, hint: t('whatsapp_hint') })}
        ${inp('instagram', t('instagram'), { ltr: true, ph: '@' })}
        ${inp('telegram', t('telegram'), { ltr: true, ph: '@' })}
        ${inp('youtube', t('youtube'), { ltr: true, ph: t('youtube_ph') })}
        ${inp('email', t('email_c'), { type: 'email', ltr: true })}
        ${inp('address', t('address'), { area: true, rows: 2 })}
        ${inp('hours', t('hours'), { ph: t('hours_ph') })}
      </section>
      <section class="card"><h2>${esc(t('sec_images'))}</h2><div style="height:12px"></div>
        <div class="field"><span>${esc(t('hero_image'))}</span><div id="hero-ph"></div><small>${esc(t('hero_image_hint'))}</small></div>
        <div class="field"><span>${esc(t('about_images'))}</span><div id="about-ph"></div><small>${esc(t('about_images_hint'))}</small></div>
      </section>
      <section class="card"><h2>${esc(t('sec_texts'))}</h2><p class="hint">${esc(t('texts_hint'))}</p>
        ${inp('heroTitle', t('hero_title'), { ph: def('heroTitle') })}
        ${inp('heroText', t('hero_text'), { area: true, rows: 3, ph: def('heroText') })}
        ${inp('introText', t('intro_text'), { area: true, ph: def('introText') })}
        ${inp('detailsTitle', t('details_title'), { ph: def('detailsTitle') })}
        ${inp('detailsText', t('details_text'), { area: true, ph: def('detailsText') })}
        ${inp('quote', t('quote'), { ph: def('quote') })}
        ${inp('contactTitle', t('contact_title'), { ph: def('contactTitle') })}
        ${inp('contactText', t('contact_text'), { area: true, rows: 3, ph: def('contactText') })}
      </section>
    </form>
    <section class="card" id="acct"><h2>${esc(t('sec_account'))}</h2>
      <p class="hint">${esc(t('signed_in_as', { email: st.user.email }))}</p>
      <label class="field"><span>${esc(t('new_password'))}</span><input type="password" id="npw" class="ltr" autocomplete="new-password"></label>
      <button class="btn ghost block" type="button" id="cpw" style="margin-bottom:10px">${esc(t('change_password'))}</button>
      <button class="btn danger block" type="button" id="out" style="margin-bottom:12px">${esc(t('sign_out'))}</button>
    </section>`;

    const hero = PhotoField({ images: s.heroImage ? [s.heroImage] : [], max: 1, folder: 'site', single: true });
    const about = PhotoField({ images: s.aboutImages || [], max: 5, folder: 'site' });
    main.querySelector('#hero-ph').appendChild(hero.el);
    main.querySelector('#about-ph').appendChild(about.el);

    const f = main.querySelector('#sf');
    const KEYS = ['siteName', 'lang', 'currency', 'years', 'phone', 'whatsapp', 'instagram', 'telegram', 'youtube', 'email', 'address', 'hours',
      'heroTitle', 'heroText', 'introText', 'detailsTitle', 'detailsText', 'quote', 'contactTitle', 'contactText'];
    const read = () => {
      const d = {};
      KEYS.forEach((k) => { const v = (f.elements[k].value || '').trim(); if (v) d[k] = v; });
      if (d.years) d.years = latin(d.years);
      const h = hero.paths()[0]; if (h) d.heroImage = h;
      const a = about.paths(); if (a.length) d.aboutImages = a;
      return d;
    };
    let snapshot = JSON.stringify(read());

    // Placeholders follow the website language picked in this form.
    f.elements.lang.onchange = () => {
      const l = f.elements.lang.value;
      ['siteName', 'heroTitle', 'heroText', 'introText', 'detailsTitle', 'detailsText', 'quote', 'contactTitle', 'contactText']
        .forEach((k) => (f.elements[k].placeholder = (SITE[l] && SITE[l]['def_' + k]) || ''));
    };

    const bar = document.createElement('div');
    bar.className = 'savebar above-tabs';
    bar.innerHTML = `<button class="btn" type="button">${esc(t('save'))}</button>`;
    app.appendChild(bar);
    const btn = bar.querySelector('button');

    leaveGuard = async () => {
      if (JSON.stringify(read()) === snapshot && !hero.busy() && !about.busy()) { hero.discard(); about.discard(); return true; }
      const ok = await confirmSheet(t('unsaved_q'), t('unsaved_text'), t('leave'));
      if (ok) { hero.discard(); about.discard(); }
      return !!ok;
    };

    btn.onclick = async () => {
      if (hero.busy() || about.busy()) return toast(t('wait_photos'), true);
      const data = read();
      btn.disabled = true; btn.textContent = t('saving');
      const { error } = await sb.from('settings').upsert({ id: 1, data });
      btn.disabled = false; btn.textContent = t('save');
      if (error) { console.error(error); return toast(t('save_failed'), true); }
      await hero.commit(); await about.commit();
      st.settings = data; snapshot = JSON.stringify(data);
      toast(t('saved'));
    };

    main.querySelector('#cpw').onclick = async () => {
      const pw = main.querySelector('#npw').value;
      if (pw.length < 8) return toast(t('password_short'), true);
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) return toast(error.message, true);
      main.querySelector('#npw').value = ''; toast(t('password_changed'));
    };
    main.querySelector('#out').onclick = async () => {
      if (leaveGuard && !(await leaveGuard())) return;
      leaveGuard = null;
      await sb.auth.signOut();
      st.user = null; st.loaded = false; location.hash = ''; viewLogin();
    };
  }

  /* ===================== Start ===================== */
  applyLang();
  if (DEMO) { viewDemo(); return; }
  app.innerHTML = '<div class="loading"><span class="spin"></span></div>';
  sb.auth.getSession().then(async ({ data }) => {
    if (data.session && data.session.user) await onSignedIn(data.session.user);
    else viewLogin();
  });
  sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' && st.user) { st.user = null; st.loaded = false; viewLogin(); }
  });
})();
