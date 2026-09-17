# Sillage Perfumery — Next.js Shop

A luxury perfume e-commerce storefront built with **Next.js 14 (App Router)** and **Tailwind CSS**.

## Project Structure

```
sillage/
├── app/
│   ├── globals.css        # Global styles + Tailwind directives
│   ├── layout.tsx         # Root layout (CartProvider + Navbar + CartDrawer)
│   └── page.tsx           # Home page — composes all sections
├── components/
│   ├── Navbar.tsx          # Fixed nav with scroll effect + cart icon
│   ├── Hero.tsx            # Full-screen hero section
│   ├── BottleIllustration.tsx  # SVG perfume bottle
│   ├── ScentStrip.tsx      # Scrolling marquee of scent families
│   ├── ShopSection.tsx     # Filter bar + product grid
│   ├── ProductCard.tsx     # Individual product card
│   ├── CartDrawer.tsx      # Slide-in cart drawer
│   ├── BespokeBanner.tsx   # Bespoke commission section
│   ├── Testimonials.tsx    # Customer quotes
│   └── Footer.tsx          # Footer with newsletter
├── lib/
│   ├── data.ts             # Product data, types, constants
│   └── CartContext.tsx     # Cart state via useReducer + Context
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Cart** — add/remove/adjust qty, live total, slide-in drawer
- **Filter** — filter products by scent family (Floral, Woody, Oriental, Citrus, Aquatic)
- **Responsive** — mobile-first layout
- **Animated** — marquee strip, scroll-fade navbar, hover lifts

## Customising

- **Products** — edit `lib/data.ts` to add/change products, prices, notes
- **Colors** — tweak `tailwind.config.ts` and `app/globals.css` CSS variables
- **Currency** — swap `₵` for your currency symbol in `ProductCard.tsx` and `CartDrawer.tsx`
