import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_BOOKINGS } from "../../api/apiConstant";
import { Loader2, CheckCircle, XCircle, Calendar, User, Home } from "lucide-react";

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
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!bookings.length) {
    return <div className="text-center text-gray-500 py-10">No bookings found.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-4">
      {/* Table container */}
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="min-w-[700px] grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
          <span>Venue</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Total Price</span>
          <span>Status</span>
        </div>

        {/* Table Rows */}
        {bookings.map((b) => (
          <div
            key={b.bookingId}
            className="min-w-[700px] grid grid-cols-6 gap-4 items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors"
          >
            {/* Venue */}
            <div className="flex items-center gap-2">
              <Home size={16} className="text-blue-500" />
              {b.venueName || "Unknown Venue"}
            </div>

            {/* Customer */}
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              {b.customerName || "Anonymous"}
            </div>

            {/* Booking Date */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              {new Date(b.bookingDate).toLocaleDateString()}
            </div>

            {/* Duration */}
            <div>
              {b.durationDays
                ? `${b.durationDays} day(s)`
                : b.durationHours
                ? `${b.durationHours} hr`
                : "-"}
            </div>

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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-3">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {pageNumber} of {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
