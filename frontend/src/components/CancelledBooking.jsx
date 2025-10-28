import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_CANCEL_DETAILS } from "../api/apiConstant";

const CancelledBookings = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return (
      <p className="text-center py-6 text-gray-500">
        Loading cancelled bookings...
      </p>
    );
  if (error)
    return <p className="text-center py-6 text-red-500">{error}</p>;
  if (!cancelledBookings.length)
    return (
      <p className="text-center py-6 text-gray-500">
        No cancelled bookings found
      </p>
    );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Cancelled Bookings
      </h2>

      {/* Responsive table container */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cancel Reason
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {cancelledBookings.map((booking, index) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-red-50 transition duration-150"
              >
                <td className="px-4 py-3 text-sm text-gray-600">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 truncate">
                  {booking.customerName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 truncate">
                  {booking.uEmail}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  ₹{booking.totalPrice?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {booking.cancelReason || "Not specified"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Cancelled
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelledBookings;
