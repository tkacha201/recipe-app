# Recipe App

A full-stack recipe sharing application built with React and Node.js that allows users to create, share, and discover recipes.

## Features

- User Authentication (Login/Register)
- User Profiles
- CRUD Operations for Recipes
- Recipe Search and Filtering
- Responsive Design
- Modern UI with Tailwind CSS
- Protected Routes
- Toast Notifications
- Recipe Comments

## Tech Stack

### Frontend

- React
- React Router v6
- Axios
- Tailwind CSS
- React Toastify

### Backend

- Node.js
- Express
- MongoDB
- JWT Authentication

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── PrivateRoute.jsx # Route protection
│   │   └── Toast.jsx      # Toast notifications
│   ├── pages/             # Page components
│   │   ├── Home.js        # Landing page
│   │   ├── Login.js       # User login
│   │   ├── Register.js    # User registration
│   │   ├── Profile.js     # User profile
│   │   ├── Dashboard.js   # User dashboard
│   │   ├── Recipes.js     # Recipe listing
│   │   ├── CreateRecipe.js # Recipe creation
│   │   └── EditRecipe.js  # Recipe editing
│   └── App.jsx            # Main app component

server/
├── models/               # MongoDB schema models
├── routes/               # API routes
├── middleware/           # Custom middleware
├── seed.js               # Database seeding script
└── index.js              # Server entry point
```

## Authentication Flow

1. **Protected Routes**

   - Routes like `/create-recipe`, `/profile`, `/edit-recipe/:id` are protected
   - Unauthorized access redirects to login
   - Original destination is saved for post-login redirect

2. **Login/Register**
   - JWT token stored in localStorage
   - Automatic redirect to original destination
   - Toast notifications for success/failure
   - Password must be at least 6 characters

## Component Overview

### PrivateRoute

```jsx
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

- Checks for authentication token
- Redirects unauthorized users
- Preserves attempted URL

### Toast Notifications

```jsx
showSuccess("Action completed successfully");
showError("Something went wrong");
```

- Success messages (green)
- Error messages (red)
- Warning messages (yellow)
- Info messages (blue)

### Form Components

- Consistent styling with Tailwind
- Form validation
- Loading states
- Error handling

## Styling

The app uses Tailwind CSS with custom utility classes:

```css
.btn-primary    // Blue button
.btn-secondary  // Gray button
.btn-danger     // Red button
.form-input     // Input fields
.card          // Container styling;
```

## Route Structure

```jsx
<Routes>
  // Public Routes
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/recipes" element={<Recipes />} />
  // Protected Routes
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />
  <Route
    path="/create-recipe"
    element={
      <PrivateRoute>
        <CreateRecipe />
      </PrivateRoute>
    }
  />
  <Route
    path="/edit-recipe/:id"
    element={
      <PrivateRoute>
        <EditRecipe />
      </PrivateRoute>
    }
  />
</Routes>
```

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file in the server directory
# Add the following environment variables:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# Start the backend server
npm run dev
```

The backend server will start on http://localhost:5000

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file in the client directory
# Add the following:
VITE_API_URL=http://localhost:5000

# Start the frontend development server
npm run dev
```

The frontend application will start on http://localhost:5173

### 3. Seeding the Database (Optional)

To populate your database with sample data for testing:

```bash
# Navigate to server directory
cd server

# Run the seed script
npm run seed
```

This will:

- Create sample users with hashed passwords
- Generate recipes with random ingredients
- Add likes from users to recipes
- Create sample comments for recipes

Default login credentials for seeded users:

- Email: john@example.com, jane@example.com, chef@example.com
- Password: password123

### 4. Verify Setup

1. Both servers should be running simultaneously
2. Backend server should show "Server running on port 5000"
3. Frontend should successfully connect to the backend
4. You can test the connection by trying to register or login

### Troubleshooting Common Issues

1. **JSX Syntax Errors**

   - Make sure `vite.config.js` is properly configured
   - Verify that `@vitejs/plugin-react` is installed
   - Run `npm install` again if needed

2. **API Connection Errors**

   - Verify both servers are running
   - Check that the `VITE_API_URL` in frontend `.env` matches the backend URL
   - Look for CORS errors in browser console

3. **Database Connection Issues**

   - Verify MongoDB connection string in backend `.env`
   - Ensure MongoDB service is running
   - Check server logs for connection errors

4. **Authentication Issues**
   - Clear browser localStorage
   - Verify JWT_SECRET in backend `.env`
   - Check token expiration settings

## Authentication Requirements

- Passwords must be at least 6 characters long for both registration and profile updates
- Email addresses must be in valid format
