# Rex Huang · Personal Portfolio

My personal homepage: a single profile card with a live Discord status, typing role text, links, and an interactive particle background.

**Live site:** https://rexouo.github.io/Personal-Portfolio/

## Features

- Live Discord status on the avatar (online / idle / do not disturb / offline) via [Lanyard](https://github.com/Phineas/lanyard), with a profile card on hover (tap on phones)
- Typewriter effect cycling through roles
- Particle network background that moves away from the cursor (desktop only)
- 3D card tilt that follows the mouse, with parallax layers (desktop only)
- Dark / light theme, dark by default, remembers the visitor's choice
- Responsive layout; respects the "reduce motion" accessibility setting

## Tech

React 19 · TypeScript · Vite · GitHub Actions → GitHub Pages

## Editing content

All text and links live in [`src/content.ts`](src/content.ts). The avatar is `public/avatar.jpg`.

## Run locally

```bash
npm install
npm run dev      # local preview with live reload
npm run build    # production build into dist/
```

Pushing to `main` builds and deploys automatically (`.github/workflows/deploy.yml`).
