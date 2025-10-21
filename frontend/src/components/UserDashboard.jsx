import React, { useEffect, useState } from "react";
import axios from "axios";
import { MY_BOOKINGS, CANCEL_BOOKING } from "../api/apiConstant";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(MY_BOOKINGS, {
        withCredentials: true,
      });
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(
        CANCEL_BOOKING(bookingId),
        {},
        { withCredentials: true }
      );
      alert("Booking cancelled successfully!");
      fetchBookings(); // refresh bookings after cancellation
    } catch (error) {
      console.error(error);
      alert("Error cancelling booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-1">
                {booking.venue.name}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                Location: {booking.venue.location}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Date: {new Date(booking.bookingDate).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Duration: {booking.timeDuration}{" "}
                {booking.timeDuration === "PerHour"
                  ? `(${booking.durationHours} hr)`
                  : booking.timeDuration === "PerDay"
                  ? `(${booking.durationDays} day(s))`
                  : ""}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Total Price: ₹{booking.totalPrice}
              </p>
              <p
                className={`font-semibold mb-2 ${
                  booking.status === "Pending"
                    ? "text-yellow-500"
                    : booking.status === "Approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {booking.status}
              </p>
              {booking.status === "Pending" && (
                <button
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition mt-auto"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
