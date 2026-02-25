# QR Generator

A fast, free, and privacy-friendly QR Code generator built with **React**, **TypeScript**, and **Vite**.

## ✨ Features

- Generate QR codes instantly from any text or URL
- Download QR codes as **PNG** or **SVG**
- Dark / Light mode toggle
- Responsive design — works on desktop and mobile
- Add or contribute custom QR templates via the Contribute page

## 🛠️ Tech Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | React 18 + TypeScript                          |
| Build Tool    | Vite                                           |
| Styling       | Tailwind CSS                                   |
| UI Components | Radix UI + shadcn/ui                           |
| QR Library    | [qrcode](https://www.npmjs.com/package/qrcode) |
| Routing       | React Router v6                                |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## 📦 Build for Production

```bash
npm run build
```

## 🧪 Run Tests

```bash
npm test
```

## 📁 Project Structure

```
src/
├── components/    # Reusable UI components
│   └── ui/        # shadcn/ui primitives
├── pages/         # Route-level page components
├── hooks/         # Custom React hooks
└── lib/           # Utility helpers
```

## 📄 License

MIT
