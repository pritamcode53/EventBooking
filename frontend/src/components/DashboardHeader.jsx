import React, { useEffect, useState, useRef } from "react";
import { LogOut, Menu, Home } from "lucide-react";
import axios from "axios";
import { USER_LOGOUT, USER_PROFILE } from "../api/apiConstant";
import { useNavigate } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import NotificationBell from "./NotificationBell";
import MobileMenu from "./MobileMenu";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const connectionRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(USER_PROFILE, {
          withCredentials: true,
        });
        if (profileRes.data?.data?.name) {
          setUserName(profileRes.data.data.name);
          setUserId(profileRes.data.data.userId);
        } else navigate("/");
      } catch {
        navigate("/");
      }
    };
    fetchProfile();
  }, [navigate]);

  // ✅ SignalR connection setup
  useEffect(() => {
    if (!userId) return;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    const connectSignalR = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:5232/hubs/notifications?userId=${userId}`, {
            withCredentials: true,
          })
          .withAutomaticReconnect()
          .build();

        connectionRef.current = connection;
        await connection.start();
        console.log("✅ Connected to Notification Hub");

        connection.on("ReceiveNotification", (message) => {
          const newNote = { message, timestamp: Date.now() };
          const stored = JSON.parse(localStorage.getItem("notifications")) || [];
          const updated = [newNote, ...stored].filter(
            (n) => Date.now() - n.timestamp < SEVEN_DAYS_MS
          );
          localStorage.setItem("notifications", JSON.stringify(updated));
          setNotifications(updated.map((n) => n.message));
          setUnreadCount((prev) => prev + 1);
        });
      } catch (err) {
        console.error("SignalR Error:", err);
      }
    };

    connectSignalR();
    return () => connectionRef.current?.stop();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await axios.post(USER_LOGOUT, {}, { withCredentials: true });
      navigate("/");
    } catch {
      alert("Error logging out");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Event<span className="text-indigo-500">Admin</span>
        </div>

        {/* Desktop Section */}
        <div className="hidden md:flex items-center gap-6 relative">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
          >
            <Home size={18} /> Home
          </button>

          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
          />

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

        {/* 🔔 Mobile Icons Section */}
        <div className="md:hidden flex items-center gap-4">
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
          />
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <MobileMenu
        menuOpen={menuOpen}
        navigate={navigate}
        userName={userName}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default DashboardHeader;
