import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { POST_CREATE_CN } from "../../api/apiConstant";

const CustomBookingModal = ({ bookingId, onClose, refresh }) => {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!requirements.trim()) {
      toast.error("Please enter your requirements.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        POST_CREATE_CN,
        {
          bookingId,
          requirements,
        },
        { withCredentials: true }
      );

      toast.success("🎉 Custom booking request submitted successfully!");
      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to create custom booking request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Custom Booking Request
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Booking ID
            </label>
            <input
              type="text"
              value={bookingId}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Requirements
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              placeholder="Describe your custom requirements (e.g., sound setup, decorations, catering, etc.)"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 mt-3 text-white rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomBookingModal;
