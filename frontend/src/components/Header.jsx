import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  USER_CREATE,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PROFILE,
} from "../api/apiConstant";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 backdrop-blur-lg bg-white/60 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
           <h2 className="text-2xl font-bold text-green-700 mb-3">
          Event<span className="text-lime-500">Book</span>
        </h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {!isLoggedIn ? (
              <button
                onClick={toggleModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <span className="font-medium text-gray-700">
                  Welcome, <span className="font-semibold text-blue-600">{userName}</span>
                </span>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-inner flex flex-col items-center py-4 space-y-3">
            {!isLoggedIn ? (
              <button
                onClick={toggleModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <span className="font-medium text-gray-700">
                  Hi, <span className="font-semibold text-blue-600">{userName}</span>
                </span>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Login / Signup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-96 p-6 relative shadow-2xl">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              {isLoginMode ? "Login" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Customer">Customer</option>
                      <option value="VenueOwner">Venue Owner</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-bold shadow hover:opacity-90 transition"
              >
                {isLoginMode ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
              {isLoginMode ? "Don't have an account?" : "Already have one?"}{" "}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-blue-600 font-semibold underline hover:text-indigo-500"
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
