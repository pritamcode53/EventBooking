import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPROVED_VENUE, PAYMENT } from "../../../api/apiConstant";
import { Calendar, User, MapPin, CheckCircle, X } from "lucide-react";
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
      const res = await axios.get(APPROVED_VENUE, { withCredentials: true });
      const filtered = res.data.filter((b) => b.status === "Approved");
      setApprovedBookings(filtered);
    } catch (err) {
      console.error("Error fetching approved bookings:", err);
      toast.error("Failed to load approved bookings.");
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

  return (
    <div className="px-3 sm:px-6 lg:px-10 py-6 min-h-screen bg-green-50">
      <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-6 text-center">
        Approved Bookings
      </h2>

      {approvedBookings.length === 0 ? (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No Approved Bookings Found
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-green-100">
          <table className="min-w-full text-sm sm:text-base text-gray-700">
            <thead className="bg-green-100 text-green-800 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Venue Name</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Total Price</th>
                <th className="py-3 px-4 text-left">Paid</th>
                <th className="py-3 px-4 text-left">Due</th>
                <th className="py-3 px-4 text-left">Payment Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedBookings.map((b, index) => (
                <tr
                  key={b.bookingId}
                  className={`border-b hover:bg-green-50 transition-all ${
                    index % 2 === 0 ? "bg-white" : "bg-green-50/50"
                  }`}
                >
                  <td className="py-3 px-4 font-medium">
                    {b.venue?.name || "Unknown Venue"}
                  </td>
                  <td className="py-3 px-4">{b.customer?.name || "Guest User"}</td>
                  <td className="py-3 px-4">
                    {new Date(b.bookingDate).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-500">
                      {new Date(b.bookingDate).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">{b.venue?.location || "-"}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    ₹{b.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    ₹{b.paidAmount?.toLocaleString() || 0}
                  </td>
                  <td className="py-3 px-4 text-red-600 font-semibold">
                    ₹{b.dueAmount?.toLocaleString() || 0}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        b.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.paymentStatus || "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.dueAmount > 0 ? (
                      <button
                        onClick={() => openPaymentModal(b)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                      >
                        Update
                      </button>
                    ) : (
                      <CheckCircle className="text-green-500 mx-auto" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Payment Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-6 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
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
