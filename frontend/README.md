# ChitChat Frontend

## 🚀 Project Overview
ChitChat is a real-time chat application built using React and Material-UI for a modern and responsive user interface.

## 📌 Tech Stack
- **Framework:** React (with TypeScript)
- **UI Library:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **API Handling:** RTK Query
- **Authentication:** JWT-based auth

## 📂 Folder Structure
```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application pages (Login, Chat, etc.)
│   ├── services/     # API services using RTK Query
│   ├── store/        # Redux store and slices
│   ├── hooks/        # Custom hooks
│   ├── assets/       # Images and static files
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # React entry point
│   └── index.css     # Global styles
├── public/           # Static assets
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/chitchat-frontend.git
cd chitchat-frontend
```

### 2️⃣ Install Dependencies
```sh
yarn install  # or npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4️⃣ Start the Development Server
```sh
yarn dev  # or npm run dev
```

## 🔗 API Integration
ChitChat communicates with the backend through RTK Query. API endpoints are managed inside `services/api.ts`.

## ✨ Features
- User authentication (Login & Logout)
- Real-time chat
- Profile management
- Responsive design

## 🚀 Deployment
To deploy the frontend, build the project and serve it using Vercel, Netlify, or another hosting service:
```sh
yarn build  # or npm run build
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

## 📜 License
This project is licensed under the MIT License.

