import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, DollarSign } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PAYMENT } from "../../api/apiConstant";

const PaymentModal = ({ booking, onClose, onPaymentUpdate }) => {
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const totalPrice = booking.totalPrice || 0;
  const paidAmount = booking.paidAmount || 0;
  const dueAmount = booking.dueAmount ?? totalPrice - paidAmount;

  useEffect(() => {
    setAmount(dueAmount);
  }, [dueAmount]);

  const handlePaymentUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        bookingId: booking.bookingId,
        amount: Number(amount),
        paymentMethod,
      };

      await axios.post(PAYMENT, payload, { withCredentials: true });

      toast.success("💰 Payment processed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      onPaymentUpdate();
      onClose();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("❌ Failed to process payment", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3">
      <div
        className="
          bg-white rounded-2xl w-full max-w-md shadow-xl relative animate-fadeIn
          flex flex-col
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="text-green-600 w-5 h-5" />
            Make Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-3">
          {/* <div>
            <p className="text-sm text-gray-500 mb-1">Booking ID :  {booking.bookingId} </p>
            <p className="text-base font-medium text-gray-800">
             {booking.bookingcode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Venue</p>
            <p className="text-base font-medium text-gray-800">
              {booking.venuename}
            </p>
          </div> */}

          {/* <div>
            <p className="text-sm text-gray-500 mb-1">Total Price</p>
            <p className="text-base font-semibold text-green-700">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div> */}

          {paidAmount > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Already Paid</p>
              <p className="text-base font-semibold text-blue-600">
                ₹{paidAmount.toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-1">Due Amount</p>
            <p
              className={`text-base font-semibold ${
                dueAmount > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹{dueAmount.toLocaleString()}
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
              disabled={dueAmount <= 0}
            />
            {dueAmount > 0 && (
              <p className="text-xs text-gray-500 italic mt-1">
                💡 You can pay in installments (partial payments allowed).
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={dueAmount <= 0}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentUpdate}
            disabled={loading || dueAmount <= 0}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-1 transition ${
              loading || dueAmount <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {loading
              ? "Processing..."
              : dueAmount <= 0
              ? "Fully Paid"
              : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
