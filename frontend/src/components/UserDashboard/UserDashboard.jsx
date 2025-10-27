import React, { useEffect, useState } from "react";
import axios from "axios";
import { MY_BOOKINGS } from "../../api/apiConstant";
import BookingCard from "./BookingCard";
import ReviewModal from "./ReviewModal";
import CancelModal from "./CancelModal";
import PaymentModal from "./PaymentModal";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [cancelData, setCancelData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(MY_BOOKINGS, { withCredentials: true });
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching bookings");
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
          Manage your venue reservations and payments
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((b) => (
            <BookingCard
              key={b.bookingId}
              booking={b}
              onCancel={() => {
                setCancelData({ bookingId: b.bookingId });
                setIsCancelModalOpen(true);
              }}
              onReview={() => {
                setReviewData({ venueId: b.venue.venueId });
                setIsReviewModalOpen(true);
              }}
              onPayment={() => {
                setPaymentData({
                  bookingId: b.bookingId,
                  venuename: b.venue.name,
                  totalprice: b.totalPrice,
                });
                setIsPaymentModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {isReviewModalOpen && (
        <ReviewModal
          data={reviewData}
          onClose={() => setIsReviewModalOpen(false)}
          refresh={fetchBookings}
        />
      )}

      {isCancelModalOpen && (
        <CancelModal
          data={cancelData}
          onClose={() => setIsCancelModalOpen(false)}
          refresh={fetchBookings}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          booking={paymentData} // ✅ Correct prop name
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentUpdate={fetchBookings}
        />
      )}
    </div>
  );
};

export default UserDashboard;
