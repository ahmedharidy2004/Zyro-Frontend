# Zyro

Zyro is a game-store frontend built with React and TypeScript. Users can browse a game catalog, read news, view game ratings and reviews, manage a cart, place orders, and maintain their account.

## Features

- Game catalog with search and individual game pages
- News listing and article pages
- Account registration, login, profile editing, and password management
- JWT-authenticated reviews, cart, and order workflows
- Order history and order cancellation
- Responsive interface with reusable game, navigation, button, grid, and footer components

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Lucide React icons
- ESLint 10

## Prerequisites

- Node.js 20 or newer
- npm
- A running Zyro backend API

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root if the API is not running at the default URL:

   ```env
   VITE_API_URL=http://localhost:5183/api
   ```

   `VITE_API_URL` defaults to `http://localhost:5183/api` when it is not set.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page |
| `/games` | Authenticated | Browse games |
| `/game/:id` | Authenticated | View game details and reviews |
| `/news` | Public | Browse news |
| `/news/:id` | Public | Read a news article |
| `/support` | Public | Contact and support page |
| `/signup` | Public | Create an account |
| `/login` | Public | Sign in |
| `/profile` | Authenticated | Manage profile details |
| `/change-password` | Authenticated | Change password |
| `/cart` | Authenticated | Review cart items |
| `/order-placement` | Authenticated | Place an order |
| `/my-orders` | Authenticated | View and manage orders |
| `/reset-password/:userId/:token` | Public | Reset password using a token |

Protected routes redirect unauthenticated users to `/login`. The frontend stores the signed-in user in `localStorage` under `zyroUser` and uses `isLoggedIn` for route protection.

## API Integration

API requests are centralized in [`src/services/api.ts`](src/services/api.ts). The client communicates with endpoints for:

- Authentication and password management
- Games, ratings, and news
- Game reviews
- User profiles
- Shopping carts
- Orders

Authenticated requests send the JWT returned by the login or registration endpoint as a Bearer token.

## Project Structure

```text
src/
├── components/       Reusable page sections and UI components
├── Pages/            Route-level page components
├── services/         API client functions
├── types/            Shared TypeScript models
├── App.tsx           Application routes and protected-route handling
└── index.css         Global styles and theme variables
```

## Production Build

Build the application with:

```bash
npm run build
```

The generated files are written to `dist/`. Set `VITE_API_URL` to the deployed backend URL before building for production.
