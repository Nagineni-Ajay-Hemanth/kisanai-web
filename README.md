# Kisan AI Frontend Website

This folder contains the standalone web version of the Kisan AI application. It is optimized for hosting as a static website and connects to the Kisan AI Backend for real-time analysis and marketplace features.

## 🚀 Quick Start

If you have **Node.js** installed, you can start a local development server with:

```bash
npm start
```

Or for development with live-reloading:

```bash
npm run dev
```

The website will be available at `http://localhost:3000` (or the port specified in your console).

## 📄 Project Structure

- `index.html`: Main dashboard entry point.
- `auth/`: Login and Registration pages.
- `farmer/`: Features specifically for farmers (Upload Product, My Orders).
- `customer/`: Features for buyers (Browse Products, Product Details).
- `disease/`: Plant disease detection interface.
- `shared/`: CSS, JS, and global assets used across multiple pages.
- `shared/api-client.js`: Main logic for communicating with the Backend server.

## ⚙️ Configuration

The website automatically attempts to fetch the latest Backend URL from a Cloudflare Worker. If that fails, it defaults to `http://localhost:8000`.

To manually change the backend URL, edit `shared/api-client.js` and update the `API_BASE_URL` variable.

## 🌐 Deployment

This is a static website and can be hosted on:
- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting
- Any standard web server (Nginx/Apache)
