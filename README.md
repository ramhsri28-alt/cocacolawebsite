# Coca-Cola Interactive Scroll Animation Experience 🥤

An interactive, high-performance landing page featuring a **270-frame liquid splash scroll animation** built with HTML5 Canvas, Tailwind CSS, and fluid frame interpolation.

---

## 🌟 Features
- **270-Frame Liquid Splash**: Smooth Apple-style scroll-driven frame scrubbing.
- **High-DPI Canvas Rendering**: Dynamically scales edge-to-edge on any device and screen resolution.
- **Nearest-Frame Fallback**: Seamless playback with zero flickering or black screens while assets stream in.
- **Complete Landing Page Experience**:
  - *The Science of Frost (Sensory Interactive Grid)*
  - *The Chilled Lineup (Original, Zero Sugar, Cherry, Vanilla)*
  - *The 37°F / 3°C Perfect Pour Ritual*
  - *Sustainability & World Without Waste*
  - *Store Locator & Delivery Integration*

---

## 🚀 One-Click Deploy to Vercel

This repository is pre-configured with `vercel.json` for instant, zero-config deployment on Vercel:

1. Push this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import this repository (`cocacolawebsite`).
4. Click **Deploy**.

Vercel will automatically detect the static project and optimize all 270 image frames with global Edge CDN caching (`max-age=31536000, immutable`).

---

## 💻 Local Development

You can preview the site locally using any static web server:

```bash
# Using Node.js
npx serve .

# Or using Python
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.
