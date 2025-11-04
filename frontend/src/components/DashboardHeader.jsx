import React, { useEffect, useState, useRef } from "react";
import { LogOut, Menu, Home } from "lucide-react";
import axios from "axios";
import { USER_LOGOUT, USER_PROFILE , LIVE_HUB_API , GET_UNREAD_NOTIFICATIONS ,GET_ALL_NOTFICIATIONS} from "../api/apiConstant";
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

  // ✅ Fetch all notifications (previous + unread)
  const fetchAllNotifications = async (userId) => {
    try {
      const res = await axios.get(
        GET_ALL_NOTFICIATIONS(userId)
      );
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead);
        setUnreadCount(unread.length);
      }
    } catch (err) {
      console.error("Error fetching all notifications:", err);
    }
  };

  // ✅ Fetch only unread notifications
  const fetchUnreadNotifications = async (uid) => {
    try {
      const res = await axios.get(
        GET_UNREAD_NOTIFICATIONS(userId)
      );
      if (Array.isArray(res.data)) {
        setUnreadCount(res.data.length);
      }
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  // ✅ SignalR connection setup (real-time)
  useEffect(() => {
    if (!userId) return;

    const connectSignalR = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(
            LIVE_HUB_API(userId),
            { withCredentials: true }
          )
          .withAutomaticReconnect()
          .build();

        connectionRef.current = connection;
        await connection.start();
        console.log("✅ Connected to Notification Hub");

        // when new notification arrives
        connection.on("ReceiveNotification", (message) => {
          const newNote = {
            message,
            timestamp: Date.now(),
            isRead: false,
          };
          setNotifications((prev) => [newNote, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      } catch (err) {
        console.error("SignalR Error:", err);
      }
    };

    connectSignalR();
    return () => connectionRef.current?.stop();
  }, [userId]);

  // ✅ Initial + periodic fetch
  useEffect(() => {
    if (!userId) return;

    fetchAllNotifications(userId);
    fetchUnreadNotifications(userId);

    const interval = setInterval(() => {
      fetchUnreadNotifications(userId);
    }, 30000);

    return () => clearInterval(interval);
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
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition"
          >
            <Home size={18} /> Home
          </button>

          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            userId={userId}
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
            userId={userId}
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
