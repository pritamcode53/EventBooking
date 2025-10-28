import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GET_REFUND_CANCELLED_BOOKINGS,
  POST_REFUND_PAYMENT,
} from "../../../api/apiConstant";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const RefundManagement = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch cancelled bookings
  const fetchRefundBookings = async () => {
    try {
      const res = await axios.get(GET_REFUND_CANCELLED_BOOKINGS, {
        withCredentials: true,
      });
      setCancelledBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching refund bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundBookings();
  }, []);

  // Handle Refund Submission
  const handleRefund = async () => {
    if (!selected || !refundAmount)
      return alert("Enter refund amount and remarks.");

    setProcessing(true);
    try {
      await axios.post(
        POST_REFUND_PAYMENT,
        {
          CancelledId: selected.cancelled_id,
          refundAmount: parseFloat(refundAmount),
          remarks,
        },
        {
          withCredentials: true,
        }
      );

      setSuccessMsg(`Refund processed for booking ID ${selected.bookingid}`);
      setSelected(null);
      setRefundAmount("");
      setRemarks("");
      fetchRefundBookings(); // refresh list
    } catch (err) {
      console.error("Error processing refund:", err);
      alert("Refund failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Refund Management
      </h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm sm:text-base">
          {successMsg}
        </div>
      )}

      {cancelledBookings.length === 0 ? (
        <p className="text-gray-600 text-center py-10 text-sm sm:text-base">
          No cancelled bookings available for refund.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full text-xs sm:text-sm md:text-base text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-3">#</th>
                <th className="px-3 sm:px-4 py-3">Customer</th>
                <th className="px-3 sm:px-4 py-3">Venue</th>
                <th className="px-3 sm:px-4 py-3">Paid Amount</th>
                <th className="px-3 sm:px-4 py-3">Cancel Reason</th>
                <th className="px-3 sm:px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {cancelledBookings.map((item, index) => (
                <tr
                  key={item.cancelled_id}
                  className="border-b hover:bg-gray-50 text-gray-700"
                >
                  <td className="px-3 sm:px-4 py-3">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-3 break-words">{item.name}</td>
                  <td className="px-3 sm:px-4 py-3 break-words">
                    {item.venuename}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-green-600 font-semibold">
                    ₹{item.paidamount}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-gray-600 break-words max-w-[180px]">
                    {item.cancel_reason}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <button
                      onClick={() => setSelected(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition"
                    >
                      Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Refund Modal */}
      {selected && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 px-3 sm:px-0">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
              Refund Booking #{selected.bookingid}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-green-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Remarks
                </label>
                <textarea
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-green-300 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={processing}
                className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-70"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {processing ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;
