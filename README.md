# Truventory-web

Public marketing site + Privacy Policy for [Truventory](https://github.com/roguespark-04/Truventory).

**Live:** https://roguespark-04.github.io/Truventory-web/

## Pages

- `/` — product marketing (interactive mockups, pricing, Coming soon store buttons)
- `/privacy.html` — store-ready Privacy Policy

## Update App Store / Play links

Edit `app.js`:

```js
window.TRUVENTORY_STORE = {
  appStoreUrl: "https://apps.apple.com/app/idXXXXXXXX",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.truventory.truventory",
};
```

Empty strings keep the buttons as **Coming soon** (aria-disabled).

## Stack

Static HTML / CSS / JS only. No build step. GitHub Pages serves from `main` (root).

## Mirror

A copy also lives in the private app repo at `website/` for versioning with the Flutter project.
