# build_dist.ps1 — builds a clean production dist/ folder for FTP upload
# Usage: powershell -ExecutionPolicy Bypass -File tools\build_dist.ps1

$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root "dist"

Write-Host "==> Cleaning dist/ ..." -ForegroundColor Cyan
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item $dist -ItemType Directory | Out-Null

# Folders to copy verbatim
$folders = @("assets","config","css","fonts","icons","includes","js","logos","photos","templates")
foreach ($f in $folders) {
    $src = Join-Path $root $f
    $dst = Join-Path $dist $f
    Write-Host "  Copying $f/ ..."
    Copy-Item $src $dst -Recurse -Force
}

# Root files to copy
$rootFiles = @(
    ".htaccess",
    "web.config",
    "index.php",
    "router.php",
    "manifest.webmanifest",
    "sw.js",
    "AJ_District_Exhibition_Terms_and_Payment_Receipt_Bilingual-v3.pdf"
)
foreach ($f in $rootFiles) {
    $src = Join-Path $root $f
    if (Test-Path $src) {
        Write-Host "  Copying $f ..."
        Copy-Item $src (Join-Path $dist $f) -Force
    }
}

# storage/ skeleton — protection files only, no runtime data
Write-Host "  Creating storage/ skeleton ..."
$storageDist = Join-Path $dist "storage"
New-Item $storageDist -ItemType Directory | Out-Null
New-Item (Join-Path $storageDist "uploads") -ItemType Directory | Out-Null

# Copy storage protection files
foreach ($f in @(".htaccess","web.config")) {
    $src = Join-Path $root "storage\$f"
    if (Test-Path $src) { Copy-Item $src (Join-Path $storageDist $f) -Force }
}
# Gitkeep so uploads/ exists
New-Item (Join-Path $storageDist "uploads\.gitkeep") -ItemType File -Force | Out-Null

# Copy the warm Arabic translation cache (saves API calls on first deploy)
$translationSrc = Join-Path $root "storage\translations_ar.json"
if (Test-Path $translationSrc) {
    Write-Host "  Copying storage/translations_ar.json (warm translation cache) ..."
    Copy-Item $translationSrc (Join-Path $storageDist "translations_ar.json") -Force
}

# Write DEPLOY.md into dist root
$deployMd = @'
# AJ District — Deployment Guide

## What is in this folder
This `dist/` folder is a **ready-to-upload** production build of the AJ District CMS.
No Node.js, no npm, no build step — pure PHP 8.1+ flat-file CMS.

## Server requirements
| Requirement | Version |
|-------------|---------|
| PHP | 8.1 or higher |
| Extensions | `fileinfo`, `gd`, `zip`, `curl`, `openssl` |
| Web server | Apache (mod_rewrite) **or** IIS (web.config included) |
| Writable path | `storage/` and all sub-folders |

## Upload instructions (FTP / cPanel / File Manager)

1. **Upload all files** from this folder to your web root (e.g. `public_html/` or `www/`).
2. **Set permissions** on `storage/` to **755** (or 775 on some hosts):
   ```
   chmod -R 755 storage/
   ```
3. **Enable mod_rewrite** on Apache. The `.htaccess` in the root handles routing.
   - On IIS: `web.config` is already included — no extra setup needed.
4. **First visit** — go to `https://yourdomain.com/admin/setup` to create your admin password.
5. **HTTPS strongly recommended.** The session cookie is flagged `Secure` when `$_SERVER['HTTPS']` is set.

## Folder structure
```
/                       ← web root
├── index.php           ← front controller (all requests route here)
├── router.php          ← PHP dev-server router (not needed on live Apache/IIS)
├── .htaccess           ← Apache rewrite rules
├── web.config          ← IIS rewrite rules
├── manifest.webmanifest
├── sw.js
├── css/
├── js/
├── fonts/
├── assets/             ← default hero images
├── photos/             ← event photos
├── icons/              ← favicons & PWA icons
├── logos/
├── templates/
│   └── public.html     ← single-page public site template
├── config/
│   └── default.php     ← default content schema (read-only)
├── includes/
│   ├── cms.php         ← core CMS helpers
│   ├── actions.php     ← save/upload action handlers
│   ├── auth.php        ← login / setup / logout
│   ├── admin-view.php  ← dashboard UI renderer
│   └── translate.php   ← Arabic translation (MyMemory/Google/OpenAI)
└── storage/            ← WRITABLE by PHP — created automatically on first save
    ├── .htaccess       ← blocks direct HTTP access to storage
    ├── web.config      ← IIS equivalent
    ├── translations_ar.json  ← Arabic cache (warm, pre-populated)
    └── uploads/        ← media uploads (writable)
```

## Runtime-generated files (NOT in this package — created automatically)
| File | Created when |
|------|-------------|
| `storage/admin.json` | First `/admin/setup` visit |
| `storage/site.json` | First content save |
| `storage/ajd_settings.json` | Translation settings saved |

## Arabic translation setup (optional)
The site ships with **MyMemory free API** enabled by default — no key needed.
To switch providers, go to **Admin → Settings → Translation** after deploying.

| Provider | Key needed | Cost |
|----------|-----------|------|
| MyMemory (default) | No | Free up to 10k words/day |
| Google Cloud Translate v3 | Yes | Paid |
| OpenAI gpt-4o-mini | Yes | Paid |

## Updating content
All content is managed via the **Admin dashboard** at `/admin`.
No code changes are needed for text, images, events, or FAQs.

## Backup & restore
Use **Admin → Settings → Site backup** to download a JSON snapshot.
Use the **Import JSON backup** form to restore it.
'@

Set-Content -Path (Join-Path $dist "DEPLOY.md") -Value $deployMd -Encoding UTF8
Write-Host "  Written DEPLOY.md ..."

# Also mirror to deploy/ folder so both dist/ and deploy/ are always 100% in sync
$deploy = Join-Path $root "deploy"
Write-Host "==> Mirroring to deploy/ ..." -ForegroundColor Cyan
if (Test-Path $deploy) { Remove-Item $deploy -Recurse -Force }
Copy-Item $dist $deploy -Recurse -Force

# Summary
Write-Host ""
Write-Host "==> Both dist/ and deploy/ built successfully!" -ForegroundColor Green
$count = (Get-ChildItem $dist -Recurse -File).Count
Write-Host "    $count files ready in: $dist" -ForegroundColor Green
Write-Host "    $count files ready in: $deploy" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. FTP / upload the contents of dist/ (or deploy/) to your web root"
Write-Host "  2. Set storage/ to chmod 755 (or 775)"
Write-Host "  3. Visit https://yourdomain.com/admin/setup to create your password"
