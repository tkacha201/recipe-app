# Recipe App

A full-stack recipe sharing application built with React and Node.js.

## Features

- User authentication
- User profiles
- CRUD operations for recipes
- Recipe search and filtering
- Responsive design
- Recipe comments

## Tech Stack

**Frontend:** React, React Router, Axios, Tailwind CSS

**Backend:** Node.js, Express, MongoDB, JWT Authentication

## Authentication

- Protected routes redirect unauthorized users to login
- JWT token stored in localStorage
- Password requirements: minimum 6 characters

## Setup Instructions

### Backend Setup

```bash
cd server
npm install

# Create .env with:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

```bash
cd client
npm install

# Create .env with:
VITE_API_URL=http://localhost:5000

npm run dev
```

Frontend runs on http://localhost:5173

### Database Seeding (Optional)

```bash
cd server
npm run seed
```

Seed data includes:

- Sample users with hashed passwords
- Generated recipes
- Sample comments

Default credentials:

- Email: john@example.com, jane@example.com, chef@example.com
- Password: password123

### Verification

1. Run both servers simultaneously
2. Verify backend shows "Server running on port 5000"
3. Confirm frontend connects to backend
4. Test by registering or logging in

## Troubleshooting

1. **JSX Syntax Errors**

   - Check `vite.config.js` configuration
   - Verify `@vitejs/plugin-react` is installed

2. **API Connection Errors**
   - Ensure both servers are running
   - Verify `VITE_API_URL` matches backend URL
