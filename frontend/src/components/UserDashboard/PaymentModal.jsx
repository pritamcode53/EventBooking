import React, { useState } from "react";
import { XCircle, CheckCircle, DollarSign } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PAYMENT } from "../../api/apiConstant";

const PaymentModal = ({ booking, onClose, onPaymentUpdate }) => {
  const [amount, setAmount] = useState(booking?.totalprice || 0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const handlePaymentUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        bookingId: booking.bookingId, // ✅ Correct key
        amount: Number(amount),
        paymentMethod,
      };

      await axios.post(PAYMENT, payload, { withCredentials: true });

      toast.success("💰 Payment processed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      onPaymentUpdate(); // refresh parent
      onClose(); // close modal
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("❌ Failed to process payment", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null; // ✅ Prevent render if booking data is missing

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-green-600 w-5 h-5" />
          Make Payment
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Booking ID</p>
            <p className="text-base font-medium text-gray-800">
              {booking.bookingId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Venue</p>
            <p className="text-base font-medium text-gray-800">
              {booking.venuename}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Total Price</p>
            <p className="text-base font-semibold text-green-700">
              ₹{booking.totalprice}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Payment Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              {/* <option value="NetBanking">Net Banking</option> */}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handlePaymentUpdate}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-1 transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
