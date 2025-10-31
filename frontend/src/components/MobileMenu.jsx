import React from "react";
import { Home, LogOut } from "lucide-react";

const MobileMenu = ({ menuOpen, navigate, userName, handleLogout }) => {
  if (!menuOpen) return null;

  return (
    <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-inner flex flex-col items-center py-4 space-y-3">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
      >
        <Home size={18} /> Home
      </button>

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
  );
};

export default MobileMenu;
