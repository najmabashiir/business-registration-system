# Business Registration System

This project is a full-stack business registration and licensing platform with a React frontend and an Express backend. It supports role-based access for admins and business owners, business registration, license management, and document uploads.

## Features

- User authentication and authorization
- Admin dashboard for managing users, businesses, and licenses
- Business owner dashboard for managing their businesses
- License tracking and document upload workflow
- Responsive UI built with React and Vite

## Project Structure

- Backend: Express.js API with MongoDB and JWT authentication
- Frontend: React + Vite + Tailwind-based UI

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance

## Installation

1. Clone the repository
   ```bash
   git clone <your-repository-url>
   cd business-registration-system
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables

Create a .env file in the backend folder with values such as:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run the Project

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will usually run at http://localhost:5173 and the backend at http://localhost:5000.

## Build for Production

```bash
cd frontend
npm run build
```

## GitHub Notes

This README is prepared so the project can be shared on GitHub with clear setup instructions for collaborators.

