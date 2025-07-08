## Excellency files structures

```
excellency-food-ts/
│── public/
    │── assets/         # Static assets like images, icons, fonts
│── src/                # Source files for the application
│   │── app/            # Next.js App Router (if using App Router)
│   │── components/     # Reusable UI components
│   │── hooks/          # Custom React hooks
│   │── data/           # Static Data for using for UI.
│   │── helpers/        # Global Helpers for helping functionalities.
│   │── hooks/          # Global Hooks for helping or better UI functionalities.
│   │── redux/          # Redux store and slices (if using Redux)
│   │── services/       # API calls and business logic
│   │── styles/         # Global and module styles
│   │── types/          # TypeScript types and interfaces
│   └── utils/          # Utils for helping the application with global helper function
│   └── i18n /          # next-intl request handler function
│   └── messages /      # en.json and ar.json for transaltion
│── .env.local          # Environment variables (not committed to Git)
│── .gitignore          # Git ignore file
│── next.config.js      # Next.js configuration file
│── package.json        # Project dependencies and scripts
│── tsconfig.json       # TypeScript configuration (if using TypeScript)
└── README.md           # Documentation
```

🚀 Features
✅ Modern stack with Next.js (App Router) & TypeScript
✅ Redux Toolkit for robust state management
✅ Framer Motion & GSAP for smooth, performant animations
✅ Swiper.js for elegant sliders and carousels
✅ React Leaflet for interactive maps and live location tracking
✅ Multilingual support using next-intl with en.json and ar.json for English and Arabic translations
✅ Fully responsive design with Tailwind CSS
✅ Static assets organized under public/assets

## Explanation

- **`public/`**: Stores static assets like images, fonts, and favicons.
- **`src/app/`**: The main directory for Next.js **App Router** (used in Next.js 13+ with Server Components).
- **`src/components/`**: Stores reusable UI components to keep the code modular.
- **`src/hooks/`**: Custom React hooks to encapsulate logic.
- **`src/redux/`**: Redux store, slices, and state management logic (if using Redux Toolkit).
- **`src/services/`**: Handles API requests and business logic to keep API calls separate from components.
- **`src/styles/`**: Global styles, module styles, and Tailwind CSS configurations.
- **`src/types/`**: Stores TypeScript type definitions and interfaces.
- **`src/utils/`**: Utility functions used across the project.
- **`src/i18n/`**: Next intl request for transaltion handler
- **`src/messages/`**: Next intl en.json and ar.json for translation file

🌍 Internationalization
We use next-intl for seamless language support:

All translatable strings are organized in src/messages/en.json and src/messages/ar.json

Supports RTL for Arabic with proper layout adjustments

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/kaziahosunhabibripon/excellency.git
   cd excellency-food-ts
   ```
2. Install dependencies:
   ```sh
   npm install   # or yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev   # or yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

🗺️ Technologies Used
| ---Technology ----| --------------------Purpose ----------------- |

| **Next.js** | React framework with SSR, SSG, and App Router |
| **TypeScript** | Static typing for maintainable code |
| **Redux Toolkit** | Scalable state management |
| **Framer Motion** | Declarative animations |
| **GSAP** | Advanced scroll and timeline animations |
| **Swiper.js** | Mobile-friendly sliders & carousels |
| **React Leaflet** | Interactive maps & live location tracking |
| **next-intl** | Internationalization for multilingual support |
| **Tailwind CSS** | Utility-first responsive styling |

## Scripts

| -----Script---- | ---------Description -------- |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server  |
| `npm run build` | Build for production          |
| `npm run start` | Start production server       |
| `npm run lint`  | Run ESLint to catch errors    |

## ✨ Contribution

```We welcome contributions!
   Feel free to fork this repository, create a branch, and submit pull requests with improvements or fixes.
```

## License

This project is licensed under the MIT License.

# excellency-catering-resturent

## 🏢 About This Project

This project is owned by **RapidSmartERP**.  
As an employee, I developed the **frontend** part of the **Excellency Catering Restaurant** application using **Next.js**, **TypeScript**, and modern frontend tools.

The frontend is fully integrated with the **Laravel API** and backend POS software maintained by RapidSmartERP for managing orders, inventory, and catering operations.

---

## 🔗 Live Link

Excellency Catering Restaurant  
Your ultimate online food ordering and catering experience.

🌐 [Excellency Catering Restaurant Live](https://excellency-catering-restaurant-sweets.com/)
# food
