import React, { useEffect, useState } from "react";
import axios from "axios";
import { MY_BOOKINGS, CANCEL_BOOKING } from "../api/apiConstant";
import { CreditCard, MessageSquare, XCircle, CheckCircle } from "lucide-react";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [reviewData, setReviewData] = useState({
    venueId: null,
    rating: 0,
    comment: "",
    image: null,
  });

  const [paymentData, setPaymentData] = useState({
    bookingId: null,
    paymentMethod: "Card",
    amount: 0,
  });

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

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(CANCEL_BOOKING(bookingId), {}, { withCredentials: true });
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Error cancelling booking");
    }
  };

  const openReviewModal = (venueId) => {
    setReviewData({ venueId, rating: 0, comment: "", image: null });
    setIsReviewModalOpen(true);
  };

  const openPaymentModal = (bookingId, totalPrice) => {
    setPaymentData({ bookingId, paymentMethod: "Card", amount: totalPrice });
    setIsPaymentModalOpen(true);
  };

  const handleReviewChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setReviewData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setReviewData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentData((prev) => ({ ...prev, paymentMethod: e.target.value }));
  };

const submitReview = async (e) => {
  e.preventDefault();

  if (!reviewData.comment?.trim()) {
    alert("Please write a comment");
    return;
  }
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    alert("Please select a rating between 1 and 5");
    return;
  }
  if (!reviewData.venueId) {
    alert("Invalid venue");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("VenueId", reviewData.venueId);       // match DTO
    formData.append("Rating", Number(reviewData.rating)); // match DTO
    formData.append("Comment", reviewData.comment);       // match DTO
    if (reviewData.image) formData.append("Image", reviewData.image); // match DTO

    await axios.post("http://localhost:5232/api/review/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    alert("Review submitted successfully!");
    setIsReviewModalOpen(false);
    fetchBookings();
  } catch (error) {
    if (error.response?.data?.errors) {
      console.log("Validation errors:", error.response.data.errors);
      alert(JSON.stringify(error.response.data.errors));
    } else {
      console.error(error);
      alert("Error submitting review");
    }
  }
};

  const submitPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5232/api/payment/create",
        {
          bookingId: paymentData.bookingId,
          paymentMethod: paymentData.paymentMethod,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Payment successful!");
        setIsPaymentModalOpen(false);
        fetchBookings();
      } else {
        alert("Payment failed: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8 pt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-500">Manage your venue reservations and payments</p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((b) => (
            <div
              key={b.bookingId}
              className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{b.venue.name}</h2>
              <p className="text-gray-600 text-sm mb-1">📍 {b.venue.location}</p>
              <p className="text-gray-600 text-sm mb-1">
                📅 {new Date(b.bookingDate).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                ⏱ Duration: {b.timeDuration}{" "}
                {b.timeDuration === "PerHour"
                  ? `(${b.durationHours} hr)`
                  : b.timeDuration === "PerDay"
                  ? `(${b.durationDays} day(s))`
                  : ""}
              </p>
              <p className="text-gray-700 font-semibold mb-2">
                💰 ₹{b.totalPrice.toLocaleString()}
              </p>

              <p
                className={`font-semibold mb-3 px-3 py-1 rounded-full text-center text-sm ${
                  b.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : b.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.status}
              </p>

              {b.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleCancelBooking(b.bookingId)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all mb-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Booking
                  </button>

                  {b.isPaid ? (
                    <button
                      disabled
                      className="bg-gray-300 cursor-not-allowed text-gray-700 font-medium py-2 rounded-lg transition mb-2"
                    >
                      Paid
                    </button>
                  ) : (
                    <button
                      onClick={() => openPaymentModal(b.bookingId, b.totalPrice)}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition mb-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => openReviewModal(b.venue.venueId)}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
              >
                <MessageSquare className="w-5 h-5" />
                Give Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(isReviewModalOpen || isPaymentModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            {isReviewModalOpen && (
              <form onSubmit={submitReview}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Review</h2>

                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={star <= (hoverRating || reviewData.rating) ? "gold" : "none"}
                      stroke="gold"
                      className="w-8 h-8 cursor-pointer"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewData((p) => ({ ...p, rating: star }))}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.95c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.075 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
                    </svg>
                  ))}
                </div>

                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  placeholder="Write your review..."
                  className="border rounded-lg p-2 w-full mb-3"
                  rows={3}
                />

                <input
                  type="file"
                  name="image"
                  onChange={handleReviewChange}
                  className="w-full text-sm mb-3 border
      border-gray-300
      rounded-lg
      p-2
      cursor-pointer
      bg-white
      hover:border-blue-500
      transition
      focus:outline-none
      focus:ring-2
      focus:ring-blue-300"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded border hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {isPaymentModalOpen && (
              <form onSubmit={submitPayment}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Make Payment</h2>
                <p className="font-medium mb-3">Total Amount: ₹{paymentData.amount}</p>
                <select
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  className="border rounded-lg p-2 w-full mb-3"
                >
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Wallet">Wallet</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-4 py-2 rounded border hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
