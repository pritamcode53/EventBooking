import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_LOGOUT, USER_PROFILE } from "../api/apiConstant";
import { Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";
import NavLinks from "./NavLinks";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

 
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

  // 🚪 Logout
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

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 backdrop-blur-lg bg-white/60 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-green-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Event<span className="text-lime-500">Book</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks navigate={navigate} />
            {!isLoggedIn ? (
              <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-5 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-700 hover:text-blue-600 font-medium"
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
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/90 border-t border-gray-200 flex flex-col items-center py-4 space-y-3">
            <NavLinks navigate={navigate} setMenuOpen={setMenuOpen} />
            {!isLoggedIn ? (
              <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-5 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
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

      {/* Auth Modal */}
      {isOpen && <AuthModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default Header;
