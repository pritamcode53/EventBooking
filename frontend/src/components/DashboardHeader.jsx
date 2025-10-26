import React, { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import axios from "axios";
import { USER_LOGOUT, USER_PROFILE } from "../api/apiConstant";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(USER_PROFILE, {
          withCredentials: true,
        });
        setUserName(profileRes.data.data.name);
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };
    fetchProfile();

    // Optional: Refresh profile every 30s
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(USER_LOGOUT, {}, { withCredentials: true });
      navigate("/");
    } catch {
      alert("Error logging out");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Event<span className="text-indigo-500">Admin</span>
        </div>

        {/* Desktop Section */}
        <div className="hidden md:flex items-center gap-6">
          <span className="font-medium text-gray-700">
            {userName ? `Hi, ${userName}` : "User"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-inner flex flex-col items-center py-4 space-y-3">
          <span className="font-medium text-gray-700">
            {userName ? `Hi, ${userName}` : "User"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
