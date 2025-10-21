import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  USER_CREATE,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PROFILE,
} from "../api/apiConstant";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setFormData({ name: "", email: "", password: "", role: "Customer" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(USER_PROFILE, { withCredentials: true });
        setUserName(res.data.name);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUserName("");
      }
    };
    checkLogin();
  }, []);

  // ✅ Signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        passwordHash: formData.password,
        role: formData.role,
      };
      const res = await axios.post(USER_CREATE, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUserName(res.data.name);
      setIsLoggedIn(true);
      toggleModal();
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error signing up");
    }
  };

  // ✅ Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        USER_LOGIN,
        { email: formData.email.trim(), password: formData.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUserName(res.data.name);
      setIsLoggedIn(true);
      toggleModal();
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid login credentials");
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.post(USER_LOGOUT, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserName("");
      navigate("/");
    } catch {
      alert("Error logging out");
    }
  };

  const handleSubmit = isLoginMode ? handleLogin : handleSignUp;

  return (
    <>
      <header className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div
          className="text-2xl font-bold cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          EventBook
        </div>

        {!isLoggedIn ? (
          <button
            onClick={toggleModal}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Sign In / Sign Up
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-semibold">Welcome, {userName}</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLoginMode ? "Login" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Customer">Customer</option>
                      <option value="VenueOwner">VenueOwner</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
              >
                {isLoginMode ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              {isLoginMode ? "Don't have an account?" : "Already have one?"}{" "}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-blue-600 font-semibold underline"
              >
                {isLoginMode ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
