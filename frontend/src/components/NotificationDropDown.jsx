import React from "react";

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 max-h-80 overflow-y-auto">
      <h4 className="text-sm font-semibold mb-2 text-gray-600">Notifications</h4>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-2">
          No new notifications
        </p>
      ) : (
        notifications.map((note, i) => (
          <div
            key={i}
            className="text-sm text-gray-700 border-b border-gray-100 py-2 last:border-0"
          >
            {note}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;
