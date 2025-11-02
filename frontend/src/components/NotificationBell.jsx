import React, { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const NotificationBell = ({
  notifications,
  unreadCount,
  setUnreadCount,
  userId,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = async () => {
    setShowDropdown((prev) => !prev);

    // ✅ When opening dropdown, mark all as read
    if (!showDropdown && unreadCount > 0) {
      try {
        await axios.put(
          `http://localhost:5232/api/notification/read/all/${userId}`,
          {},
          { withCredentials: true }
        );
        setUnreadCount(0);
      } catch (error) {
        console.error(
          "❌ Error marking notifications as read:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <div className="relative bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200 transition">
      {/* 🔔 Notification Button */}
      <button
        onClick={toggleDropdown}
        className="relative text-gray-700 hover:text-green-600 transition"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🧾 Dropdown Notifications */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 max-h-96 overflow-y-auto">
          <h4 className="text-sm font-semibold mb-2 text-gray-600">
            Notifications
          </h4>

          {!notifications || notifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">
              No notifications yet
            </p>
          ) : (
            notifications
              // ✅ Sort newest on top
              .sort(
                (a, b) =>
                  new Date(b.createdAt || b.timestamp) -
                  new Date(a.createdAt || a.timestamp)
              )
              .map((note, i) => (
                <div
                  key={note.notificationId || i}
                  className={`text-sm border-b border-gray-100 py-2 last:border-0 transition ${
                    note.isRead
                      ? "text-gray-600"
                      : "text-gray-800 font-semibold bg-gray-50 rounded-lg px-2"
                  }`}
                >
                  {note.message}
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(
                      note.createdAt || note.timestamp
                    ).toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
