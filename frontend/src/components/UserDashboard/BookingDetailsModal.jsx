import React, { useState } from "react";
import axios from "axios";
import {
  X,
  CreditCard,
  MessageSquare,
  FileText,
  PlusCircle,
  Eye,
  CheckCircle,
} from "lucide-react";
import {
  GET_INVOICE,
  GET_CUSTOM_REQUEST_BY_ID,
  PUT_UPDATED_RQ_CN,
} from "../../api/apiConstant";
import ReviewModal from "./ReviewModal";
import PaymentModal from "./PaymentModal";
import CustomBookingModal from "./CustomBookingModal";

const BookingDetailsModal = ({ booking, onClose, refresh }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [customRequest, setCustomRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [error, setError] = useState(null);
  const [showCustomRequest, setShowCustomRequest] = useState(false);

  const isFullyPaid = booking.paidAmount >= booking.totalPrice;
  const isPartiallyPaid =
    booking.paidAmount > 0 && booking.paidAmount < booking.totalPrice;

  // ✅ Handle invoice download
  const handleInvoiceDownload = async () => {
    try {
      const res = await axios.get(GET_INVOICE(booking.bookingId), {
        responseType: "blob",
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${booking.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Error downloading invoice.");
    }
  };

  // ✅ Toggle Custom Request View
  const toggleCustomRequest = async () => {
    if (showCustomRequest) {
      setShowCustomRequest(false);
      return;
    }

    try {
      setLoadingRequest(true);
      setError(null);
      const res = await axios.get(GET_CUSTOM_REQUEST_BY_ID(booking.bookingId), {
        withCredentials: true,
      });
      setCustomRequest(res.data);
      setShowCustomRequest(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load custom booking request.");
    } finally {
      setLoadingRequest(false);
    }
  };

  // ✅ Approve Custom Request
  const handleApproveRequest = async () => {
    if (!customRequest) return alert("No custom request found.");
    const confirm = window.confirm(
      "Are you sure you want to approve this custom request?"
    );
    if (!confirm) return;

    try {
      await axios.put(
        PUT_UPDATED_RQ_CN(customRequest.requestId),
        { isApproved: true },
        { withCredentials: true }
      );
      alert("Custom request approved successfully!");
      refresh();
      setShowCustomRequest(false);
    } catch (error) {
      console.error(error);
      alert("Failed to approve custom request.");
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {booking.venue?.name}
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.bookingDate).toLocaleString()}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {booking.timeDuration === "PerHour"
                ? `${booking.durationHours} hr`
                : booking.timeDuration === "PerDay"
                ? `${booking.durationDays} day(s)`
                : booking.timeDuration === "PerEvent"
                ? "Full Day (24 hr)"
                : "Custom"}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <p>
              <strong>Total Price:</strong> ₹
              {booking.totalPrice.toLocaleString()}
            </p>
            <p>
              <strong>Paid Amount:</strong> ₹{booking.paidAmount}
            </p>
            <p>
              <strong>Location:</strong> {booking.venue?.location}
            </p>
          </div>

          {/* ✅ Action Buttons */}
          <div className="mt-5 flex flex-col gap-2">
            {(booking.status === "Pending" || booking.status === "Approved") && (
              <>
                {isFullyPaid ? (
                  <button
                    disabled
                    className="bg-gray-300 cursor-not-allowed text-gray-700 py-2 rounded-lg"
                  >
                    Paid
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                  >
                    <CreditCard className="w-5 h-5" />
                    {isPartiallyPaid
                      ? `Pay Remaining ₹${
                          booking.totalPrice - booking.paidAmount
                        }`
                      : "Pay Now"}
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Give Review
            </button>

            <button
              onClick={handleInvoiceDownload}
              className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
            >
              <FileText className="w-5 h-5" />
              Get Invoice
            </button>

            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Custom Booking Request
            </button>

            {/* ✅ View Custom Request Button (toggle) */}
            <button
              onClick={toggleCustomRequest}
              className={`flex items-center justify-center gap-2 ${
                showCustomRequest
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } py-2 rounded-lg`}
            >
              <Eye className="w-5 h-5" />
              {showCustomRequest ? "Hide Custom Request" : "View Custom Request"}
            </button>
          </div>

          {/* ✅ Custom Request Display Section */}
          {loadingRequest && (
            <p className="text-sm text-gray-500 mt-3">
              Loading custom request...
            </p>
          )}
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          {showCustomRequest && customRequest && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Custom Request Details
              </h3>
              <p>
                <strong>Request ID:</strong> {customRequest.requestId}
              </p>
              <p>
                <strong>Type:</strong> {customRequest.type}
              </p>
              <p>
                <strong>Requirements:</strong> {customRequest.requirements}
              </p>
              <p>
                <strong>New Price:</strong> ₹{customRequest.newPrice}
              </p>
              <p>
                <strong>Owner Review:</strong> {customRequest.ownerReview}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(customRequest.createdAt).toLocaleString()}
              </p>

              {/* ✅ Approve Button */}
              <button
                onClick={handleApproveRequest}
                className="flex items-center justify-center gap-2 mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg w-full"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          data={{ venueId: booking.venue.venueId }}
          onClose={() => setIsReviewModalOpen(false)}
          refresh={refresh}
        />
      )}

      {/* ✅ Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          booking={{
            bookingId: booking.bookingId,
            bookingcode: booking.bookingcode,
            venuename: booking.name,
            totalprice: booking.totalPrice,
            paidAmount: booking.paidAmount,
            dueAmount: booking.totalPrice - booking.paidAmount,
          }}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentUpdate={refresh}
        />
      )}

      {/* ✅ Custom Booking Modal */}
      {isCustomModalOpen && (
        <CustomBookingModal
          bookingId={booking.bookingId}
          onClose={() => setIsCustomModalOpen(false)}
          refresh={refresh}
        />
      )}
    </>
  );
};

export default BookingDetailsModal;
