# Static Assets

This folder contains only assets used by `/index.html`.

## Structure

- `css/bulma.min.css`: Base layout and utility framework.
- `css/custom.css`: All project-specific styling (the single source of truth for custom UI).
- `js/custom.js`: All project-specific behavior (copy BibTeX, avatar fallback, toast, focus handling).
- `images/`: Favicon, teaser, and author photos.

## Notes

- Template boilerplate files (carousel/slider/index CSS+JS) were removed because this page does not use those components.
- Font Awesome was removed in favor of inline SVG icons to reduce payload and simplify dependencies.
- Keep custom changes in `custom.css` and `custom.js`; avoid splitting behavior/style across multiple project files unless there is a clear need.
- If a new third-party dependency is added, document why it is required and where it is referenced in `index.html`.
