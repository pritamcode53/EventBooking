import React, { useEffect, useState } from "react";
import { Calendar as RBCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const localizer = momentLocalizer(moment);

const BookingCalendar = ({ apiUrl }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // ✅ Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(apiUrl, { withCredentials: true });
        const data = res.data;

        const formattedBookings = data.map((b) => {
          const start = moment(b.bookingDate);
          const end =
            b.timeDuration === "PerDay"
              ? moment(b.bookingDate).add(b.durationDays, "days")
              : moment(b.bookingDate).add(b.durationHours, "hours");

          return {
            title: `${b.venue.name} - ${b.status}`,
            start: start.toDate(),
            end: end.toDate(),
            allDay: b.timeDuration === "PerDay",
            resource: b,
          };
        });

        setBookings(formattedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [apiUrl]);

  // ✅ Styling for events
  const eventStyleGetter = (event) => {
    const backgroundColor =
      event.resource.status === "Approved"
        ? "rgba(46, 204, 113, 0.8)"
        : "rgba(231, 76, 60, 0.8)";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        color: "white",
        border: "none",
        fontSize: "0.85rem",
        padding: "2px 4px",
        cursor: "pointer",
      },
    };
  };

  const closeModal = () => setSelectedEvent(null);

  // ✅ Navigation Handlers
  const handleNavigate = (direction) => {
    if (direction === "TODAY") setCurrentDate(new Date());
    else if (direction === "NEXT")
      setCurrentDate(
        moment(currentDate).add(1, view === "month" ? "month" : view).toDate()
      );
    else if (direction === "BACK")
      setCurrentDate(
        moment(currentDate).subtract(1, view === "month" ? "month" : view).toDate()
      );
  };

  return (
    <div className="relative p-3 sm:p-4 bg-white rounded-2xl shadow-lg">
      {/* 🔹 Custom Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        {/* Left: Back, Today, Next */}
        <div className="flex gap-2">
          <button
            onClick={() => handleNavigate("BACK")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={() => handleNavigate("TODAY")}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
          >
            <CalendarDays size={16} /> Today
          </button>
          <button
            onClick={() => handleNavigate("NEXT")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* Middle: Current Month/Year */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {moment(currentDate).format("MMMM YYYY")}
        </h2>

        {/* Right: View Buttons */}
        <div className="flex gap-2">
          {["month", "week", "day"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                view === v
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 🗓️ Calendar */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-100">
        <RBCalendar
          localizer={localizer}
          events={bookings}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: view === "day" ? 450 : view === "week" ? 550 : 650,
            minWidth: "100%",
          }}
          eventPropGetter={eventStyleGetter}
          popup
          date={currentDate}
          view={view}
          onView={setView}
          onNavigate={(date) => setCurrentDate(date)}
          toolbar={false}
          views={["month", "week", "day"]}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </div>

      {/* 🔹 Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 px-2"
          onClick={closeModal}
        >
          <div
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl w-full sm:w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              {selectedEvent.resource.venue.name}
            </h3>

            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p>
                <strong>Status:</strong> {selectedEvent.resource.status}
              </p>
              <p>
                <strong>Booking Date:</strong>{" "}
                {moment(selectedEvent.start).format("LLL")} -{" "}
                {moment(selectedEvent.end).format("LLL")}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {selectedEvent.resource.timeDuration === "PerDay"
                  ? `${selectedEvent.resource.durationDays} day(s)`
                  : `${selectedEvent.resource.durationHours} hour(s)`}
              </p>
              <p>
                <strong>Total Price:</strong> ₹
                {selectedEvent.resource.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedEvent.resource.paymentStatus}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {selectedEvent.resource.venue.location}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
