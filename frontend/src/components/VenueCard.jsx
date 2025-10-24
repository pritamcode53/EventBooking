import React, { useState } from "react";
import axios from "axios";
import { IMAGE_BASE_URL, BASE_URL } from "../api/apiConstant";
import VenueDetails from "./VenueDetails";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// --- BookingModal Subcomponent ---
const BookingModal = ({
  isOpen,
  onClose,
  venue,
  bookingData,
  setBookingData,
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
        handleBookingChange({ target: { name: "bookingDate", value: date } })
      }
      value={bookingData.bookingDate ? new Date(bookingData.bookingDate) : new Date()}
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

// --- VenueCard Component ---
const VenueCard = ({ venue }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    bookingDate: new Date().toISOString().slice(0, 16),
    timeDuration: 2,
    durationHours: 1,
    durationDays: 1,
  });

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookNow = async () => {
    try {
      setLoading(true);
      const timeDuration = parseInt(bookingData.timeDuration);
      const payload = {
        venueId: venue.venueId,
        bookingDate: bookingData.bookingDate,
        timeDuration,
        durationHours:
          timeDuration === 0 ? parseInt(bookingData.durationHours) : 0,
        durationDays:
          timeDuration === 1 ? parseInt(bookingData.durationDays) : 0,
      };

      const res = await axios.post(`${BASE_URL}/booking/create`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      alert("Booking created successfully!");
      console.log(res.data);
      setIsBookingOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="
          backdrop-blur-sm 
          bg-white/80 
          border border-gray-200 
          rounded-2xl 
          shadow-md 
          hover:shadow-2xl 
          transition-all 
          duration-300 
          overflow-hidden 
          transform 
          hover:-translate-y-1 
          flex 
          flex-col 
          w-full
        "
      >
        {/* Venue Image */}
        {venue.images && venue.images.length > 0 ? (
          <img
            src={`${IMAGE_BASE_URL}${venue.images[0]}`}
            alt={venue.name}
            className="w-full h-52 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
            No Image Available
          </div>
        )}

        {/* Venue Info */}
        <div className="p-5 flex-1 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 truncate">
            {venue.name}
          </h2>
          <p className="text-gray-500 text-sm mb-2">{venue.location}</p>
          <p className="text-gray-700 text-sm font-medium mb-2">
            Capacity:{" "}
            <span className="text-gray-900 font-semibold">
              {venue.capacity}
            </span>
          </p>

          {/* Pricing Section */}
          {venue.pricings && venue.pricings.length > 0 ? (
            (() => {
              const latestPrices = {};
              venue.pricings.forEach((p) => (latestPrices[p.type] = p));

              const getTypeLabel = (type) => {
                switch (type) {
                  case "PerHour":
                    return "Per Hour";
                  case "PerDay":
                    return "Per Day";
                  case "PerEvent":
                    return "Per Event";
                  default:
                    return "Unknown";
                }
              };

              return (
                <div className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">Pricing</p>
                  {Object.values(latestPrices).map((p) => (
                    <p key={p.type} className="flex justify-between">
                      <span>{getTypeLabel(p.type)}</span>
                      <span className="font-semibold text-green-700">
                        ₹{p.price.toLocaleString()}
                      </span>
                    </p>
                  ))}
                </div>
              );
            })()
          ) : (
            <p className="text-gray-400 text-sm mb-2 italic">
              No pricing available
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              onClick={() => setIsDetailsOpen(true)}
            >
              View Details
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isDetailsOpen && (
        <VenueDetails venue={venue} onClose={() => setIsDetailsOpen(false)} />
      )}

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        venue={venue}
        bookingData={bookingData}
        setBookingData={setBookingData}
        handleBookingChange={handleBookingChange}
        handleBookNow={handleBookNow}
        loading={loading}
      />
    </>
  );
};

export default VenueCard;
