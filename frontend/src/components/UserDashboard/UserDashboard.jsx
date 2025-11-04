import React, { useEffect, useState } from "react";
import axios from "axios";
import { MY_BOOKINGS } from "../../api/apiConstant";
import BookingDetailsModal from "./BookingDetailsModal";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(MY_BOOKINGS, { withCredentials: true });
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading your bookings...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 pt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-500">
          Manage your venue reservations and view booking details
        </p>
      </div>

      {/* ✅ Clean Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-6">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 py-6">
            You have no bookings yet.
          </p>
        ) : (
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.bookingId}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {b.venue?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.venue?.location}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(b.bookingDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.timeDuration === "PerHour"
                      ? `${b.durationHours} hr`
                      : b.timeDuration === "PerDay"
                      ? `${b.durationDays} day${
                          b.durationDays > 1 ? "s" : ""
                        }`
                      : b.timeDuration === "PerEvent"
                      ? "Full Day (24 hr)"
                      : b.timeDuration === "Custom"
                      ? b.durationHours
                        ? `${b.durationHours} hr custom`
                        : `${b.durationDays} day custom`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ₹{b.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* ✅ Beautiful View Details Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setIsViewModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ View Details Modal */}
      {isViewModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedBooking(null);
          }}
          refresh={fetchBookings}
        />
      )}
    </div>
  );
};

export default UserDashboard;
