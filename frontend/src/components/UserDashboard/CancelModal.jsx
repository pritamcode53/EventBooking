import React, { useState } from "react";
import axios from "axios";
import { CANCEL_BOOKING } from "../../api/apiConstant";
import { XCircle } from "lucide-react";

const CancelModal = ({ data, onClose, refresh }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert("Please provide a reason");

    try {
      await axios.post(
        CANCEL_BOOKING(data.bookingId),
        { cancelReason: reason },
        { withCredentials: true }
      );
      alert("Booking cancelled!");
      onClose();
      refresh();
    } catch {
      alert("Error cancelling booking");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <XCircle className="text-red-500" /> Cancel Booking
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for cancellation"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Confirm Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelModal;
