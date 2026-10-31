# Annaprasan / Mukhebhaat Invitation

A responsive, beige-themed, single-page invitation website built with plain HTML, CSS and JavaScript.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser. For best results, serve the folder with a local static server (for example, VS Code Live Server).

## Project structure
```text
annaprasan-invitation/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   └── app.js
└── assets/
    └── images/
        └── README.txt
```

## Personalize the invitation
Open `js/config.js` and update:
- `venueName`, `venueAddress`, and `mapQuery`
- `eventDate` (the date shown to guests)
- `eventDateTime` (the local date/time used by the countdown; format: `YYYY-MM-DDTHH:MM:SS`)
- `eventTime`
- `watermarkImage`
- `galleryImages` (an array of image objects)

Example gallery entry:
```js
{ src: "assets/images/family-1.jpg", alt: "Our family", caption: "A family moment" }
```

Put your actual image files in `assets/images/`. The watermark image is optional; replace `watermark.png` with your chosen image, or set `watermarkImage: ""` to disable it.

## Translation
The header button switches the page between English and Bengali. Bengali copy is intentionally placeholder text for now. Replace each `data-bn` value in `index.html` with the final Bengali translation. The button itself switches back to English.

## Map
The map is embedded from Google Maps using `mapQuery`. Replace the placeholder `Test` with the full venue name/address for an accurate map pin. An internet connection is required for the embedded map.

## Notes
- The initial date is **13th December 2026 (Sunday)**.
- The initial venue is **Test**.
- The sample event time is configured as **11:00 AM – 5:00 PM**; change it in `js/config.js` if needed.
- No build tools or external JavaScript libraries are required.
