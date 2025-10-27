import React from "react";
import { CreditCard, MessageSquare, XCircle } from "lucide-react";

const BookingCard = ({ booking, onCancel, onReview, onPayment }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 flex flex-col">
      <h2 className="text-xl font-semibold mb-2 text-blue-700">
        {booking.venue.name}
      </h2>
      <p className="text-gray-600 text-sm mb-1">📍 {booking.venue.location}</p>
      <p className="text-gray-600 text-sm mb-1">
        📅 {new Date(booking.bookingDate).toLocaleString()}
      </p>
      <p className="text-gray-600 text-sm mb-1">
        ⏱ Duration: {booking.timeDuration}{" "}
        {booking.timeDuration === "PerHour"
          ? `(${booking.durationHours} hr)`
          : booking.timeDuration === "PerDay"
          ? `(${booking.durationDays} day)`
          : ""}
      </p>
      <p className="text-gray-700 font-semibold mb-2">
        💰 ₹{booking.totalPrice.toLocaleString()}
      </p>

      <p
        className={`font-semibold mb-3 px-3 py-1 rounded-full text-center text-sm ${
          booking.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : booking.status === "Approved"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {booking.status}
      </p>

      {booking.status === "Pending" && (
        <>
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all mb-2"
          >
            <XCircle className="w-5 h-5" />
            Cancel Booking
          </button>

          {booking.isPaid ? (
            <button
              disabled
              className="bg-gray-300 cursor-not-allowed text-gray-700 font-medium py-2 rounded-lg transition mb-2"
            >
              Paid
            </button>
          ) : (
            <button
              onClick={onPayment}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition mb-2"
            >
              <CreditCard className="w-5 h-5" />
              Pay Now
            </button>
          )}
        </>
      )}

      <button
        onClick={onReview}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
      >
        <MessageSquare className="w-5 h-5" />
        Give Review
      </button>
    </div>
  );
};

export default BookingCard;
