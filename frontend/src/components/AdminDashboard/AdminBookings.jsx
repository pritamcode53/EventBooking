import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_BOOKINGS } from "../../api/apiConstant";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Home,
  Clock,
} from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch bookings with pagination
  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${ADMIN_GET_BOOKINGS}?pageNumber=${page}&pageSize=${pageSize}`,
        { withCredentials: true }
      );
      setBookings(response.data.bookings || []);
      setTotalPages(response.data.pagination?.TotalPages || 1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(pageNumber);
  }, [pageNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-green-500" size={32} />
      </div>
    );
  }

  if (!bookings.length) {
    return <div className="text-center text-gray-500 py-10">No bookings found.</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-4">
      {/* Table container */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="min-w-[800px] grid grid-cols-6 gap-4 px-4 py-3 
                        bg-green-100
                         font-semibold uppercase tracking-wide text-sm">
          <span>Venue</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Total Price</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        {bookings.map((b, i) => (
          <div
            key={b.bookingId || i}
            className="min-w-[800px] grid grid-cols-6 gap-4 items-center px-4 py-3 
                       border-b border-gray-100 text-gray-700
                       hover:bg-green-50 transition-all duration-200 ease-in-out"
          >
            {/* Venue */}
            <div className="flex items-center gap-2 font-medium">
              <Home size={16} className="text-green-600" />
              {b.venueName || "Unknown Venue"}
            </div>

            {/* Customer */}
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              {b.customerName || "Anonymous"}
            </div>

            {/* Booking Date */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              {new Date(b.bookingDate).toLocaleDateString()}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-500" />
              {b.durationDays
                ? `${b.durationDays} day(s)`
                : b.durationHours
                ? `${b.durationHours} hr`
                : "-"}
            </div>

            {/* Total Price */}
            <div className="font-semibold text-gray-800">
              ₹{b.totalPrice?.toLocaleString() || "-"}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1">
              {b.status === "Approved" ? (
                <CheckCircle className="text-green-500" size={18} />
              ) : b.status === "Pending" ? (
                <XCircle className="text-yellow-500" size={18} />
              ) : (
                <XCircle className="text-red-500" size={18} />
              )}
              <span
                className={`capitalize font-medium ${
                  b.status === "Approved"
                    ? "text-green-600"
                    : b.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-5 gap-4">
        <button
          className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 
                     disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {pageNumber} of {totalPages}
        </span>

        <button
          className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 
                     disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
          disabled={pageNumber >= totalPages}
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminBookings;
