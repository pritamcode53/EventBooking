import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_CANCEL_DETAILS } from "../api/apiConstant";

const CancelledBookings = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cancelled bookings
  useEffect(() => {
    const fetchCancelledBookings = async () => {
      try {
        const response = await axios.get(ADMIN_GET_CANCEL_DETAILS, {
          withCredentials: true,
        });
        setCancelledBookings(response.data.cancelDetails || []);
      } catch (err) {
        setError("Failed to fetch cancelled bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledBookings();
  }, []);

  if (loading)
    return <p className="text-center py-6 text-gray-500">Loading cancelled bookings...</p>;
  if (error)
    return <p className="text-center py-6 text-red-500">{error}</p>;
  if (!cancelledBookings.length)
    return <p className="text-center py-6 text-gray-500">No cancelled bookings found</p>;

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {cancelledBookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between 
                       border-2 border-transparent hover:border-red-500 cursor-pointer"
          >
            <div>
              {/* Customer Name */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 truncate">
                {booking.customerName}
              </h3>

              {/* Email */}
              <p className="text-xs sm:text-sm md:text-sm text-gray-500 mb-1 truncate">
                Email: {booking.uEmail}
              </p>

              {/* Total Price */}
              <p className="text-xs sm:text-sm md:text-sm text-gray-500 mb-1">
                Total Price: ₹{booking.totalPrice.toLocaleString()}
              </p>

              {/* Cancel Reason */}
              <p className="text-sm sm:text-sm md:text-sm text-gray-700 mt-2 line-clamp-3">
                <span className="font-semibold">Cancel Reason:</span> {booking.cancelReason}
              </p>
            </div>

            {/* Cancelled Badge */}
            <div className="mt-4 flex justify-end">
              <span className="bg-red-100 text-red-700 text-xs sm:text-xs md:text-sm font-semibold px-3 py-1 rounded-full">
                Cancelled
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancelledBookings;
