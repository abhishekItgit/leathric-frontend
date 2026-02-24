# Leathric Frontend

Premium React ecommerce frontend for **Leathric** built with Vite + Tailwind.

## Tech
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios with JWT interceptor
- Context API for auth + cart state

## Setup
```bash
cp .env.example .env
npm install
npm run dev
```

## Environment
```env
VITE_API_BASE_URL=/api
```

## Features
- Luxury dark-theme UI with responsive mobile-first layout
- Home, product listing, product details, auth, cart, checkout, and dashboard pages
- Reusable components (`Button`, `Input`, `Card`, `ProductCard`)
- Protected routes via JWT token from localStorage
- Axios service layer for auth/products/cart APIs
- Loading skeletons and error-state fallback UI
