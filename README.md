# AJ District - Event Booking Platform

A modern, responsive web application for booking exhibition spaces at AJ District events in the UAE.

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
├── index.html          # Main application (single-file architecture)
├── photos/            # Venue photography (40 images)
│   ├── DSC04438.jpg  # Entrance gate (featured)
│   ├── DSC04639.jpg  # Hero image
│   └── ...
├── logos/            # Brand assets
│   ├── AJ-white@4x.png
│   └── AJ-color@4x.png
└── README.md
```

## 🚀 Getting Started

1. **Open the file**: Simply open `index.html` in any modern web browser
2. **No build required**: Pure HTML/CSS/JavaScript - works offline
3. **Mobile ready**: Works on phones, tablets, and desktops

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
