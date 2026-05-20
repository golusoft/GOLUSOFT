# GOLUSOFT — Free Image & PDF Tools

Ultra-fast, production-grade Image & PDF tools platform.

- 100% free, no signup, no watermark
- Client-side processing (privacy-first, infinitely scalable)
- Built with Next.js 15 (App Router), TypeScript, Tailwind CSS
- SEO-optimized, AdSense-ready, mobile-first
- 100 tools registered, 10 fully working

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, Lucide
- **Image processing:** browser-image-compression, Canvas API
- **PDF processing:** pdf-lib (client-side)
- **Utilities:** JSZip, FileSaver, QRCode

## Architecture

All file processing happens in the browser:
- Files never leave the user's device
- Zero server cost — scales to millions of users
- Works offline once loaded
- GDPR-friendly by design

## Adding a new tool

1. Add an entry to `lib/tools.ts`
2. Drop a component in `app/tools/[slug]/page.tsx` route or under `app/tools/<slug>/page.tsx`

## Build

```bash
npm run build
npm start
```

## License

MIT
