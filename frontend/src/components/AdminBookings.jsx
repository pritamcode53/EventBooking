import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_BOOKINGS } from "../api/apiConstant";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Home,
} from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(ADMIN_GET_BOOKINGS, {
          withCredentials: true,
        });
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center text-gray-500 py-10">No bookings found.</div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* List Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
        <span>Venue</span>
        <span>Customer</span>
        <span>Date</span>
        <span>Duration</span>
        <span>Total Price</span>
        <span>Status</span>
      </div>

      {/* List Items */}
      {bookings.map((b) => (
        <div
          key={b.bookingId}
          className="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors"
        >
          {/* Venue */}
          <div className="flex items-center gap-2">
            <Home size={16} className="text-blue-500" />
            {b.venue?.name || "Unknown Venue"}
          </div>

          {/* Customer */}
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            {b.customer?.name || "Anonymous"}
          </div>

          {/* Booking Date */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            {new Date(b.bookingDate).toLocaleDateString()}
          </div>

          {/* Duration */}
          <div>{b.duration_hours || b.duration_days || "-"} hrs</div>

          {/* Total Price */}
          <div>₹{b.totalPrice?.toLocaleString() || "-"}</div>

          {/* Status */}
          <div className="flex items-center gap-1">
            {b.status === "Approved" ? (
              <CheckCircle className="text-green-500" size={18} />
            ) : b.status === "Pending" ? (
              <XCircle className="text-yellow-500" size={18} />
            ) : (
              <XCircle className="text-red-500" size={18} />
            )}
            <span className="capitalize">{b.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;
