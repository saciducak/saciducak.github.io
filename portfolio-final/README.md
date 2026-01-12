# Sacid Uçak — AI Engineer Portfolio

Modern, sophisticated portfolio website with interactive elements and smooth animations.

## ✨ Features

- **Rotating Typewriter** — Dynamic phrases in hero section
- **Cursor Follower** — Subtle interactive cursor on desktop
- **Scroll Progress** — Top progress indicator
- **Expandable Project Cards** — Click to reveal details
- **Interactive Timeline** — Hover states on experience
- **Smooth Animations** — Intersection Observer reveals

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Deploy to GitHub Pages

### Option 1: Automatic (Recommended)

Just push to `main` branch — GitHub Actions handles deployment automatically.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/saciducak/saciducak.github.io.git
git branch -M main
git push -u origin main
```

Then go to **Settings → Pages → Source: GitHub Actions**

### Option 2: Manual

```bash
npm run build
npm run deploy
```

## 🎨 Customization

1. **Profile Photo** — Add `public/photos/profile.jpg`
2. **Projects** — Edit `WorkSection` in `src/App.jsx`
3. **Experience** — Edit `ExperienceSection`
4. **Social Links** — Update `ContactSection`
5. **OG Image** — Create `public/og-image.png` (1200×630px)

## 📁 Structure

```
├── src/
│   ├── App.jsx        # Main components
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── public/
│   └── favicon.svg    # Site icon
├── index.html         # HTML template
└── package.json       # Dependencies
```

## 🔧 Tech Stack

- React 18
- Tailwind CSS 3
- Vite 5

---

© 2025 Sacid Uçak
