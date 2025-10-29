import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookingModal = ({
  isOpen,
  onClose,
  bookingData,
  handleBookingChange,
  handleBookNow,
  loading,
}) => {
  if (!isOpen) return null;

  const durationOptions = [
    { label: "Per Hour", value: 0 },
    { label: "Per Day", value: 1 },
    { label: "Per Event", value: 2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-sm p-4 relative shadow-xl animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
          Book Venue
        </h2>

        <div className="space-y-5">
          {/* Calendar */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
              Select Booking Date
            </label>
            <div className="flex justify-center">
              <div className="w-full max-w-[250px] text-sm">
                <Calendar
                  onChange={(date) =>
                    handleBookingChange({
                      target: { name: "bookingDate", value: date },
                    })
                  }
                  value={
                    bookingData.bookingDate
                      ? new Date(bookingData.bookingDate)
                      : new Date()
                  }
                  className="rounded-2xl border border-gray-200 shadow-sm p-1 text-sm"
                  minDate={new Date()}
                />
              </div>
            </div>
          </div>

          {/* Time Duration */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
              Time Duration
            </label>
            <select
              name="timeDuration"
              value={bookingData.timeDuration}
              onChange={handleBookingChange}
              className="w-full border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Inputs */}
          {parseInt(bookingData.timeDuration) === 0 && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
                Duration (Hours)
              </label>
              <input
                type="number"
                name="durationHours"
                value={bookingData.durationHours}
                onChange={handleBookingChange}
                className="w-full border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {parseInt(bookingData.timeDuration) === 1 && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
                Duration (Days)
              </label>
              <input
                type="number"
                name="durationDays"
                value={bookingData.durationDays}
                onChange={handleBookingChange}
                className="w-full border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleBookNow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
