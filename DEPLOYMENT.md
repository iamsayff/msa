# AMUSU Elections - Deployment & GoDaddy Custom Domain Setup

This guide details how to host **AMUSU Elections** on **GitHub Pages** using your custom domain **`amusuelections.in`** managed by **GoDaddy**.

---

## 1. Push Code to GitHub

If you haven't initialized Git yet on your local machine or workspace:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "Initial commit for AMUSU Elections portal"

# 4. Rename main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 2. Configure GitHub Pages

1. In your GitHub repository, click on **Settings** (top navigation).
2. On the left sidebar, click on **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (the repository already includes `.github/workflows/deploy.yml` which automatically builds and deploys on every push).
4. Under **Custom domain**:
   - Enter: `amusuelections.in`
   - Click **Save**.
5. Once your DNS has propagated (see Step 3 below), check the box **Enforce HTTPS** (GitHub provides a free TLS/SSL certificate).

---

## 3. Configure DNS in GoDaddy

Log into your [GoDaddy Account](https://dcc.godaddy.com/manage/dns) -> **My Products** -> **Domains** -> Select **`amusuelections.in`** -> Click **DNS** or **Manage DNS**.

### A. Remove Default GoDaddy Parking Records
- Look for any existing **A** record with Name `@` pointing to `34.102.136.180` or "Parked". **Delete or edit it**.

### B. Add GitHub Pages IP Addresses (Apex Domain `amusuelections.in`)
Add four **A** records:

| Type | Name | Value (Points to) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | 1/2 Hour (or Default) |
| **A** | `@` | `185.199.109.153` | 1/2 Hour (or Default) |
| **A** | `@` | `185.199.110.153` | 1/2 Hour (or Default) |
| **A** | `@` | `185.199.111.153` | 1/2 Hour (or Default) |

### C. Add CNAME for `www.amusuelections.in`
Add or update the **CNAME** record for `www`:

| Type | Name | Value (Points to) | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `<YOUR_GITHUB_USERNAME>.github.io.` | 1/2 Hour (or Default) |

*(Note: Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username. Notice the trailing period `.` if required by GoDaddy).*

---

## 4. Authorize Domain in Firebase Authentication

Because your app uses Firebase Google Sign-In for voter support authentication, Firebase will block sign-ins from unrecognized domains until authorized:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`gen-lang-client-0453401300`**.
3. In the left menu, go to **Build** -> **Authentication**.
4. Click on the **Settings** tab at the top.
5. Click **Authorized domains**.
6. Click **Add domain** and add:
   - `amusuelections.in`
   - `www.amusuelections.in`
   - `<YOUR_GITHUB_USERNAME>.github.io` (optional, for testing)

---

## 5. What Was Pre-Configured in the Code

1. **`public/CNAME`**: Contains `amusuelections.in`. When Vite runs `npm run build`, it outputs directly to `dist/CNAME` so GitHub Pages never loses your custom domain on updates.
2. **`public/404.html` & `index.html`**: Configured with single-page application redirect handlers. If users directly access `/candidates`, `/manifesto`, `/privacy`, or `/support`, they won't hit a 404 error on GitHub Pages.
3. **`.github/workflows/deploy.yml`**: Official GitHub Action pipeline that runs on every `git push` to `main`, compiles Vite, and publishes the site automatically.
