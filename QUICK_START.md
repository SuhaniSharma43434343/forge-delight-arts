# Quick Start Guide - NPM Project

## Project Information
- **Name:** tanstack_start_ts (Forge Delight Arts)
- **Package Manager:** npm
- **Build Tool:** Vite
- **Framework:** React 19 + TypeScript

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit: `http://localhost:8080/`

---

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload enabled) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Format code with Prettier |

---

## 📁 Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── lib/            # Utility functions
├── styles/         # CSS/Tailwind styles
└── server.ts       # Server entry point
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
Output: `dist/` directory (ready to deploy)

### Local Preview
```bash
npm run preview
```

### Deployment Platforms
- Vercel
- Netlify
- GitHub Pages
- Any standard Node.js hosting

---

## 📚 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI)
- **Routing:** TanStack Router
- **State:** React Query
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

---

## ✅ Migration Status

This project has been migrated from Bun to npm.

**All files removed:**
- ❌ bun.lock
- ❌ bunfig.toml

**All files present:**
- ✅ package.json (npm format)
- ✅ package-lock.json (npm lock file)
- ✅ All 465 dependencies installed

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Port 8080 already in use
```bash
# Vite will prompt to use a different port
# Or manually specify:
npm run dev -- --port 3000
```

### TypeScript errors
```bash
# Rebuild TypeScript cache
npm run lint
```

---

## 📖 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Status:** ✅ Ready to use with npm
