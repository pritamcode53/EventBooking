import React from "react";
import { Calendar, User, CheckCircle, XCircle, MapPin } from "lucide-react";

const BookingCard = ({ booking, onUpdate }) => {
  const { bookingId, venue, bookingDate, totalPrice, status, customer } =
    booking;

  const formattedDate = new Date(bookingDate).toLocaleString();

  const statusColor =
    status === "Approved"
      ? "text-green-600 bg-green-100"
      : status === "Rejected"
      ? "text-red-600 bg-red-100"
      : "text-yellow-600 bg-yellow-100";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {venue?.name || "Unknown Venue"}
        </h3>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Calendar size={16} /> {formattedDate}
        </p>
        <p className="flex items-center gap-2">
          <User size={16} /> {customer?.name || "Guest User"}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {venue?.location || "Location not available"}
        </p>
        <p className="font-semibold text-gray-900">
          ₹{totalPrice?.toLocaleString()}
        </p>
      </div>

      {status === "Pending" && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => onUpdate(bookingId, "Approved")}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
          >
            <CheckCircle size={18} /> Approve
          </button>
          <button
            onClick={() => onUpdate(bookingId, "Rejected")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            <XCircle size={18} /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
