import React, { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import { CreditCard, MessageSquare, XCircle, Eye } from "lucide-react";

const BookingCard = ({ booking, onCancel, onReview, onPayment }) => {
  const [showModal, setShowModal] = useState(false);

  const renderDuration = () => {
    if (booking.timeDuration === "PerHour") return `(${booking.durationHours} hr)`;
    if (booking.timeDuration === "PerDay")
      return `(${booking.durationDays} day${booking.durationDays > 1 ? "s" : ""})`;
    if (booking.timeDuration === "PerEvent") return "(Full Day - 24 hr)";
    if (booking.timeDuration === "Custom")
      return booking.durationHours
        ? `(${booking.durationHours} hr custom)`
        : booking.durationDays
        ? `(${booking.durationDays} day custom)`
        : "(Custom Duration)";
    return "";
  };

  const isFullyPaid = booking.paidAmount >= booking.totalPrice;
  const isPartiallyPaid =
    booking.paidAmount > 0 && booking.paidAmount < booking.totalPrice;

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition text-sm">
        <td className="px-4 py-3 font-medium text-gray-800">
          {booking.venue?.name}
        </td>
        <td className="px-4 py-3 text-gray-600">{booking.venue?.location}</td>
        <td className="px-4 py-3 text-gray-600">
          {new Date(booking.bookingDate).toLocaleDateString()}
        </td>
        <td className="px-4 py-3 text-gray-600">
          {booking.timeDuration} {renderDuration()}
        </td>
        <td className="px-4 py-3 font-semibold text-gray-800">
          ₹{booking.totalPrice.toLocaleString()}
        </td>

        <td className="px-4 py-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : booking.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {booking.status}
          </span>
        </td>

        <td className="px-4 py-3 text-center">
          {isFullyPaid ? (
            <span className="text-green-600 font-semibold">Paid</span>
          ) : isPartiallyPaid ? (
            <span className="text-yellow-600 font-medium">
              ₹{booking.paidAmount} / ₹{booking.totalPrice}
            </span>
          ) : (
            <span className="text-gray-500">Not Paid</span>
          )}
        </td>

        <td className="px-4 py-3 flex items-center justify-center gap-2 flex-wrap">
          {/* View Details Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-lg transition"
          >
            <Eye className="w-4 h-4" /> View
          </button>

          {/* Cancel Button */}
          {booking.status === "Pending" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          )}

          {/* Payment Button */}
          {(booking.status === "Pending" || booking.status === "Approved") &&
            !isFullyPaid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPayment();
                }}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition"
              >
                <CreditCard className="w-4 h-4" /> Pay
              </button>
            )}

          {/* Review Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReview();
            }}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition"
          >
            <MessageSquare className="w-4 h-4" /> Review
          </button>
        </td>
      </tr>

      {/* Booking Details Modal */}
      {showModal && (
        <BookingDetailsModal
          booking={booking}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default BookingCard;
