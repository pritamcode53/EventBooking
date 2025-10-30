import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPROVED_VENUE, PAYMENT } from "../../../api/apiConstant";
import { CheckCircle, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovedList = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const fetchApprovedBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(APPROVED_VENUE, { withCredentials: true });
      const filtered = res.data.filter((b) => b.status === "Approved");
      setApprovedBookings(filtered);
    } catch (err) {
      console.error("Error fetching approved bookings:", err);
      toast.error("Failed to load approved bookings.");
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setAmount("");
    setPaymentMethod("UPI");
    setShowModal(true);
  };

  const handlePartialPayment = async () => {
    if (!selectedBooking) return;

    const dueAmount = selectedBooking.dueAmount;
    if (isNaN(amount) || amount <= 0 || amount > dueAmount) {
      toast.warn(`⚠️ Please enter a valid amount (max ₹${dueAmount}).`);
      return;
    }

    const payload = {
      bookingId: selectedBooking.bookingId,
      amount: parseFloat(amount),
      paymentMethod,
    };

    try {
      setLoading(true);
      await axios.post(PAYMENT, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Payment updated successfully!");
      setShowModal(false);
      fetchApprovedBookings();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("❌ Failed to update payment. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  if (loading)
    return (
      <p className="text-center py-6 text-gray-500">
        Loading approved bookings...
      </p>
    );

  if (!approvedBookings.length)
    return (
      <p className="text-center py-6 text-gray-500">
        No Approved Bookings Found
      </p>
    );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Approved Bookings
      </h2>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Venue Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Due
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {approvedBookings.map((b, index) => (
              <tr
                key={b.bookingId}
                className="hover:bg-green-50 transition duration-150"
              >
                <td className="px-4 py-3 text-sm text-gray-600">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {b.venue?.name || "Unknown Venue"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {b.customer?.name || "Guest"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(b.bookingDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{b.totalPrice?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                  ₹{b.paidAmount?.toLocaleString() || 0}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                  ₹{b.dueAmount?.toLocaleString() || 0}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      b.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.paymentStatus || "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {b.dueAmount > 0 ? (
                    <button
                      onClick={() => openPaymentModal(b)}
                      className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                  ) : (
                    <CheckCircle className="text-green-500 mx-auto" size={18} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Payment Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Update Payment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Max ₹${selectedBooking.dueAmount}`}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-green-400 outline-none text-gray-800"
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <button
                onClick={handlePartialPayment}
                disabled={loading}
                className="w-full bg-green-500 text-white font-medium py-2 rounded-xl hover:bg-green-600 transition-all duration-300 mt-3"
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ApprovedList;
