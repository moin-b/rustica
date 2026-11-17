# Workshop website

A website for handmade wooden pieces, plus a phone-friendly panel to manage it.
Both are in Persian (right-to-left) by default.
Visitors browse the collection and call or message to order. No online payments.

Everything runs on free services. The only cost is the domain name.

| Part | Service | Cost |
| --- | --- | --- |
| Website files | GitHub Pages | Free |
| Database, photos, login | Supabase (free plan) | Free |
| Keeping the database awake | GitHub Actions | Free |
| Domain name | Any registrar | Yearly fee |

## What’s inside

```
index.html            Home page
product.html          One piece (product.html?id=...)
404.html              "Page not found"
css/site.css          Website design (colors and fonts at the top)
js/config.js          ← your Supabase keys go here
js/i18n.js            All website texts (Persian, with English as an option)
js/core.js, home.js, product.js
admin/                The management panel (yoursite.com/admin)
assets/pieces/        Photos of the first three pieces
supabase/schema.sql   Database setup, run once
.github/workflows/    Keeps the free database from sleeping
```

You can preview right away: open a terminal in this folder, run
`python3 -m http.server 8000`, and visit http://localhost:8000.
With `js/config.js` still empty, the site runs in demo mode with the three sample pieces.

---

## 1. Set up Supabase (about 10 minutes)

1. Create a free account at supabase.com and make a **New project**. Pick the region closest to your customers. Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, and press **Run**. This creates the tables, the security rules, the photo storage, and adds the three starter pieces.
3. Create your brother’s login: **Authentication → Users → Add user → Create new user**. Enter his email and a password and tick **Auto Confirm User**.
4. Make that user an admin. In the SQL Editor run (with his email):
   ```sql
   insert into public.admins (user_id)
     select id from auth.users where email = 'his-email@example.com'
   on conflict do nothing;
   ```
5. Turn off public sign-ups so nobody else can create an account: **Authentication → Sign In / Providers → turn off “Allow new users to sign up”**. (Even if someone signed up, they couldn’t change anything, because only users in the `admins` table can. This is a second lock.)
6. Copy your keys from **Project Settings → API Keys**: the **Project URL** and the **Publishable key** (or the legacy **anon public** key). Never use the *secret* or *service_role* key on the website.

## 2. Add the keys

Open `js/config.js` and fill in:

```js
window.SITE_CONFIG = {
  SUPABASE_URL: 'https://abcdefghijkl.supabase.co',
  SUPABASE_KEY: 'sb_publishable_...'
};
```

These two values are meant to be public. The security rules in the database decide who can change what.

## 3. Publish on GitHub Pages

1. Create a GitHub account and a new **public** repository (free GitHub Pages needs a public repo).
2. Upload every file and folder from this project (drag them into **Add file → Upload files**, or use git). Include the hidden `.nojekyll` file and the `.github` folder.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## 4. Connect your domain

1. In the repository: **Settings → Pages → Custom domain**, type your domain (for example `yourworkshop.com`) and save. GitHub adds a `CNAME` file for you.
2. At the company where you bought the domain, add these DNS records:
   - Four **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record for `www` pointing to `YOUR-USERNAME.github.io`
3. When GitHub shows the domain as verified (can take up to a day), tick **Enforce HTTPS**.

## 5. Keep the free database awake

Supabase pauses free projects after 7 days without activity. The included GitHub Action pings it every 3 days.

1. In the repository: **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `SUPABASE_URL` and `SUPABASE_KEY` (the same values as in `config.js`).
3. Open the **Actions** tab, enable workflows if asked, choose **Keep Supabase awake**, and press **Run workflow** once to check it works.

GitHub turns off scheduled actions in repositories that have had no commits for 60 days. If you get an email about that, click the link to turn it back on.

## 6. Hand it over

Send your brother `https://yourdomain.com/admin` and his login.
On his phone, open it in the browser and choose **Add to Home Screen**. It then opens like an app.

What he can do in the panel:

- **Pieces:** add a piece with photos straight from the phone camera, set price, size, wood, finish, a YouTube “making of” link. Photos are shrunk automatically before upload, so storage lasts.
- **Quick actions (⋯):** mark sold or reserved, hide from the website, move to the top, delete.
- **Videos:** paste YouTube links to show them on the home page.
- **Settings:** workshop name, phone, WhatsApp, Instagram, Telegram, YouTube, address, hours, currency (Toman by default), all home page text and photos. The website is in Persian; a **website language** option can switch it to English later if ever needed. The panel is always in Persian.
- New pieces get a code like `D14050826` from today’s Solar Hijri date, the same style as his spec sheets.

## Free plan limits (plenty for this site)

- Supabase: 500 MB database, 1 GB photo storage, 5 GB of downloads per month. Each piece uses roughly 0.5–1 MB of photos, so about 1,000+ pieces fit.
- GitHub Pages: 1 GB site, about 100 GB of traffic per month.

## Customizing

- Colors and fonts: the top of `css/site.css`.
- Default texts: `js/i18n.js`. Anything typed in the panel’s Settings overrides them.
- After changing files on GitHub, the site updates within a minute or two. Visitors’ browsers may show the old version until they refresh.
