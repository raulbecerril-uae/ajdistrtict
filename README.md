# AJ District - Event Booking Platform

A modern, responsive web application for booking exhibition spaces at AJ District events in the UAE.

## CMS dashboard

The public site is served through the extensionless PHP front controller at `/` (`index.php`). The CMS dashboard is a separate, protected page at `/admin`. Apache uses `.htaccess`; IIS uses `web.config` and requires the URL Rewrite module. Use PHP 8.1 or newer.

On first launch, visit `/admin/setup` from the server computer to create the administrator. For remote setup, configure the server environment variable `AJD_SETUP_KEY` and open `/admin/setup?key=YOUR-SECRET`; keep that key private and remove it after creating the account. Behind a reverse proxy on loopback, set `AJD_TRUSTED_PROXIES` to the proxy's IP (comma-separated) so forwarded client headers are honored; otherwise loopback requests carrying `X-Forwarded-For` are treated as remote. The dashboard stores site data in `storage/site.json`, administrator credentials as a password hash in `storage/admin.json`, and uploaded images in `storage/uploads/`. Ensure PHP can write to `storage/`; keep that directory private and deploy over HTTPS.

For a local Windows preview, open PowerShell and run `D:\php\php.exe -S 127.0.0.1:8000 -t D:\dev\ajdistrict D:\dev\ajdistrict\router.php`, then visit `http://127.0.0.1:8000/`. The router script provides the extensionless routes for PHP's built-in server.

The dashboard edits homepage copy, event details and upcoming cards, theme colors and images, homepage section visibility and order, sponsor packages, FAQs, bilingual terms, contact links, and navigation. Site settings can export and restore a JSON content backup. The files in `config/` provide the initial content; saved dashboard data is kept outside the public template.

This project is no longer served as a static `index.html` site. Use a PHP capable web server with URL rewriting enabled.

## 🧪 Development checks

No Composer install is required (there are no dependencies). With PHP 8.1+ on your PATH:

```powershell
php tests/run.php    # unit tests for the CMS core (also: composer test)
php tests/lint.php   # php -l syntax check across all PHP files (also: composer lint)
```

## 🎯 Features

### Core Functionality
- **Interactive 3D Space Viewer**: Rotate and explore the venue in 3D
- **Multiple View Modes**: 3D, 2D floor plan, Grid, and List views
- **Real-time Availability**: See which spaces are free, on hold, or booked
- **Smart Selection**: Up to 3 spaces per booking
- **Live Price Calculator**: Running total updates as you select spaces

### Design & UX
- **7 Color Themes**: Teal (default), Plum, Night, Forest, Sand, Terracotta, Dune
- **Fully Responsive**: Optimized for all devices (320px - 4K)
- **Professional Photography**: Real venue photos integrated
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation

### Booking Features
- **Space Types**: White booths (AED 2,000) and Empty spaces (AED 1,100)
- **Smart Filters**: Filter by space type
- **Quick Find**: "Closest to entrance" and "Best price" shortcuts
- **Booking Bar**: Appears only when spaces are selected
- **Receipt Generator**: Professional PDF receipts with printer animation

### Location & Information
- **Google Maps Integration**: Al Safia Park, Dubai with directions
- **Event Details**: Dates, times, and venue information
- **Sponsor Showcase**: Featured sponsors on event cards
- **FAQ Section**: Common questions answered

## 🎨 Themes

Switch between 7 carefully crafted color themes:
- **Teal**: Deep teal with warm gold accents (default)
- **Plum**: Purple tones with lavender highlights
- **Night**: Deep blue with sky blue accents
- **Forest**: Dark green with mint accents
- **Sand**: Beige with dark text (light theme)
- **Terracotta**: Warm brown with peachy accents
- **Dune**: Sandy beige with cream highlights

Theme preference is saved locally in your browser.

## 🗂️ Project Structure

```
ajdistrict/
├── index.php           # Front controller: routing, media, auth guard, action dispatch
├── templates/
│   └── public.html     # Public site template (config injected at the __AJ_CONFIG__ placeholder)
├── includes/
│   ├── cms.php         # Storage, CSRF/session helpers, media validation
│   ├── auth.php        # Setup / login / logout handlers
│   ├── actions.php     # Dashboard save handlers (pure functions, unit-tested)
│   └── admin-view.php  # Dashboard UI
├── tests/
│   ├── run.php         # Dependency-free test runner
│   └── lint.php        # Syntax checker
├── js/                 # Public app (3D viewer, i18n, CMS hydration) + admin UI
├── css/                # styles.css (public) and admin.css (dashboard)
├── config/default.php  # Seed content shipped with the code
├── storage/            # Live JSON data + uploads (private, never deploy over it)
├── photos/             # Venue photography
└── logos/              # Brand assets
```

## 🚀 Getting Started

1. Run the folder under PHP 8.1+ with Apache `mod_rewrite` or IIS URL Rewrite enabled.
2. Open `/` for the public site and `/admin` for administrator sign in.
3. Complete the first administrator setup at `/admin/setup` as described in [CMS dashboard](#cms-dashboard).

## 🔧 Customization

### Update Event Location
Find the `EVENTS` array in the JavaScript:
```javascript
const EVENTS=[{
  id:'yi',
  name:'Young Inventor',
  place:'Al Safia Park',
  addr:'Al Safia Park, Al Nahda, Dubai, UAE',
  date:'20–22 November 2026',
  time:'4 to 10 pm',
  note:'Parking is available...'
}];
```

### Add/Update Photos
Replace images in the `photos/` folder. Update references in HTML:
```html
<img src="photos/YOUR_IMAGE.jpg" alt="Description">
```

### Modify Space Prices
Find the space data in JavaScript:
```javascript
{n:1,type:'booth',price:2000,row:'A',st:'free'}
```

### Update Colors
Themes are defined in CSS custom properties:
```css
[data-theme=custom]{
  --panel:#123456;
  --acc:#abcdef;
  /* ... */
}
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Event Information

**Young Inventor 2026**
- **Dates**: 20–22 November 2026
- **Time**: 4:00 PM – 10:00 PM
- **Location**: Al Safia Park, Al Nahda, Dubai, UAE
- **Spaces**: 40 total (22 in Row A, 18 in Row B)
- **Types**: White booths and Empty spaces

## 📞 Contact

- **WhatsApp**: +971 50 162 3878
- **Instagram**: [@younginventor.ae](https://www.instagram.com/younginventor.ae/)

## 📄 License

© 2026 AJ District · Ajman, UAE

---

Built with ❤️ for makers, creators, and innovators
