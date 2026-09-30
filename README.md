# Livingstone Rwagatare — Portfolio

Personal site at **[rwagatare.github.io](https://rwagatare.github.io)**. Projects are shown, not described: message the WhatsApp tutor bot, train a model on your webcam, or tour MirrorMe.

**Stack:** React 19, Vite, vanilla CSS. Deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Deploy

```bash
npm run deploy   # builds, then publishes dist/ to the gh-pages branch
```

## Where things live

- `src/data/` holds site copy: profile and experience (`profile.js`) and the reading list (`readings.js`).
- `src/components/Work.jsx` defines the project gallery. Interactive demos are in `src/components/demos/`.
- `public/projects/` has the screenshots. MirrorMe's use demo data only.
- `public/Resume/` has the résumé. When updating it, replace both PDFs: `Livingstone_Rwagatar.pdf` is a copy that keeps old shared links working.

MIT © Livingstone Rwagatare
