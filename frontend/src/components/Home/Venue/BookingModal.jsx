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

  // ✅ Helper function: combine date + time
  const combineDateTime = (date, hour, minute, period) => {
    if (!date) return new Date();
    let hours = parseInt(hour, 10) || 0;
    const mins = parseInt(minute, 10) || 0;

    // Convert 12-hour format to 24-hour format
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(mins);
    newDate.setSeconds(0);
    return newDate;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm px-3">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-sm relative shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
            <label className="block mb-2 font-semibold text-gray-700 text-center text-sm">
              Select Booking Date
            </label>
            <div className="flex justify-center">
              <div className="w-full max-w-[250px] text-sm">
                <Calendar
                  onChange={(date) => {
                    const combinedDate = combineDateTime(
                      date,
                      bookingData.checkInHour,
                      bookingData.checkInMinute,
                      bookingData.checkInPeriod
                    );
                    handleBookingChange({
                      target: { name: "bookingDate", value: combinedDate },
                    });
                  }}
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
            <>
              {/* Duration (Hours) */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  name="durationHours"
                  value={bookingData.durationHours || ""}
                  onChange={handleBookingChange}
                  min={1}
                  max={12}
                  className="w-full border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                  placeholder="Enter number of hours"
                />
              </div>

              {/* ✅ Check-In Time - Hour, Minute, AM/PM */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
                  Select Check-In Time
                </label>
                <div className="flex justify-between gap-2">
                  {/* Hour Input */}
                  <input
                    type="number"
                    name="checkInHour"
                    value={bookingData.checkInHour || ""}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const combinedDate = combineDateTime(
                        bookingData.bookingDate || new Date(),
                        hour,
                        bookingData.checkInMinute,
                        bookingData.checkInPeriod
                      );
                      handleBookingChange({
                        target: { name: "checkInHour", value: hour },
                      });
                      handleBookingChange({
                        target: { name: "bookingDate", value: combinedDate },
                      });
                    }}
                    min={1}
                    max={12}
                    placeholder="HH"
                    className="w-1/3 border border-gray-300 px-2 py-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* Minute Input */}
                  <input
                    type="number"
                    name="checkInMinute"
                    value={bookingData.checkInMinute || ""}
                    onChange={(e) => {
                      const minute = e.target.value;
                      const combinedDate = combineDateTime(
                        bookingData.bookingDate || new Date(),
                        bookingData.checkInHour,
                        minute,
                        bookingData.checkInPeriod
                      );
                      handleBookingChange({
                        target: { name: "checkInMinute", value: minute },
                      });
                      handleBookingChange({
                        target: { name: "bookingDate", value: combinedDate },
                      });
                    }}
                    min={0}
                    max={59}
                    placeholder="MM"
                    className="w-1/3 border border-gray-300 px-2 py-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* AM/PM Selector */}
                  <select
                    name="checkInPeriod"
                    value={bookingData.checkInPeriod || "AM"}
                    onChange={(e) => {
                      const period = e.target.value;
                      const combinedDate = combineDateTime(
                        bookingData.bookingDate || new Date(),
                        bookingData.checkInHour,
                        bookingData.checkInMinute,
                        period
                      );
                      handleBookingChange({
                        target: { name: "checkInPeriod", value: period },
                      });
                      handleBookingChange({
                        target: { name: "bookingDate", value: combinedDate },
                      });
                    }}
                    className="w-1/3 border border-gray-300 px-2 py-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {parseInt(bookingData.timeDuration) === 1 && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700 text-center text-sm">
                Duration (Days)
              </label>
              <input
                type="number"
                name="durationDays"
                value={bookingData.durationDays || ""}
                onChange={handleBookingChange}
                min={1}
                className="w-full border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                placeholder="Enter number of days"
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
