import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Logout from "./pages/Logout";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { ACCESS_TOKEN } from "./constants";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const showFooter = !["/login", "/register"].includes(location.pathname);
  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-recipe"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
