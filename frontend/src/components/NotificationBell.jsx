import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

const NotificationBell = ({ notifications, unreadCount, setUnreadCount }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  // ✅ Load from localStorage when mounted or updated
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setDisplayedNotifications(stored.map((n) => n.message));
  }, [notifications]); // updates whenever parent updates notifications

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setUnreadCount(0);
  };

  return (
    <div className="relative bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200 transition">
      <button
        onClick={toggleDropdown}
        className="relative text-gray-700 hover:text-blue-600 transition"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 max-h-80 overflow-y-auto">
          <h4 className="text-sm font-semibold mb-2 text-gray-600">
            Notifications
          </h4>

          {displayedNotifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">
              No new notifications
            </p>
          ) : (
            displayedNotifications.map((note, i) => (
              <div
                key={i}
                className="text-sm text-gray-700 border-b border-gray-100 py-2 last:border-0"
              >
                {note}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
