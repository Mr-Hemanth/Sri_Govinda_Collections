# Sri Govinda Collections E-Commerce Platform

A fully functional, modern premium e-commerce website for Sri Govinda Collections. Built with React (Vite) and Node.js/Express with Firebase Database integration.

## Features
- **Premium Design**: Gold, Black, and White theme crafted dynamically with Vanilla CSS layout components and Lucide icons.
- **WhatsApp Integration**: Flawlessly connects buyers to administrators via WhatsApp, utilizing pre-filled templates with order variables.
- **Admin Dashboard**: Secure Firebase authentication login. Tools to monitor Revenue, Total Orders, and manage live inventory and statuses.
- **RESTful API**: Node.js/Express backend communicating natively with Firebase Firestore.

## Folder Structure
- `/frontend`: React application using Vite and React Router (`src/pages`, `src/components`).
- `/backend`: Node.js Express server (`routes/productRoutes`, `routes/orderRoutes`).

## Local Setup Instructions

### 1. Firebase Preparation
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Firestore Database** in test/production mode and **Authentication** (Email/Password provider).
3. Under Project Settings -> General -> Your Apps, register a web app and get your **Firebase Client Configuration** keys for the frontend.
4. Under Project Settings -> Service Accounts, generate a new private key JSON to get the **Firebase Admin credentials** for the backend.

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
1. Edit `backend/.env` and replace with your Admin Service Account identifiers:
\`\`\`env
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
PORT=5000
\`\`\`
2. Start the API Server:
\`\`\`bash
npm start
\`\`\`
*(Server will start on http://localhost:5000)*

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
\`\`\`
1. Edit `frontend/.env` and fill the keys from Step 1:
\`\`\`env
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
VITE_API_BASE_URL="http://localhost:5000/api"
\`\`\`
2. Start Vite Developer UI:
\`\`\`bash
npm run dev
\`\`\`
*(Access the platform at http://localhost:5173)*

## Deployment Steps

### Host the Backend API
1. Create a **Web Service** on a provider like [Render](https://render.com) or [Heroku](https://heroku.com).
2. Set the build directory to `/backend` or deploy that subdirectory uniquely.
3. Configure the start command as `node server.js`.
4. Add all environment variables from `backend/.env` into their Dashboard Environment Variables section.
5. Deploy and save the generated Public API URL.

### Host the Frontend
1. Create a New Project on [Vercel](https://vercel.com).
2. During setup, change the **Root Directory** to `frontend`.
3. Vercel automatically detects Vite frameworks.
4. Input all `frontend/.env` keys into the Vercel Environment variables menu.
   - **Crucial:** Change `VITE_API_BASE_URL` to point to the Public API URL generated from your backend host! Example: `https://your-backend.onrender.com/api`
5. Deploy the application.

*Enjoy your premium setup!*
