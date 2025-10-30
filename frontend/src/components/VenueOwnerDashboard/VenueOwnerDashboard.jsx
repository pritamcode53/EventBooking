import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  PlusCircle,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import VenueList from "./Venue/VenueList";
import BookingList from "./Booking/BookingList";
import ApprovedList from "./Booking/ApprovedList";
import MultiStepVenueModal from "../../components/MultiStepVenueModal";
import CancelledBookings from "../CancelledBooking";
import RefundManagement from "./Booking/RefundManagement";
import BookingCalendar from "./Booking/BookingCalendar";
import { APPROVED_VENUE } from "../../api/apiConstant";

const VenueOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Venues");
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { name: "Venues", icon: <Home size={18} /> },
    { name: "Bookings", icon: <BookOpen size={18} /> },
    { name: "Approved", icon: <Users size={18} /> },
    { name: "Cancelled Bookings", icon: <XCircle size={18} /> },
    { name: "Refund Management", icon: <DollarSign size={18} /> },
    { name: "Calendar", icon: <Calendar size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Venues":
        return <VenueList />;
      case "Bookings":
        return <BookingList />;
      case "Approved":
        return <ApprovedList />;
      case "Cancelled Bookings":
        return <CancelledBookings />;
      case "Refund Management":
        return <RefundManagement />;
      case "Calendar":
        return <BookingCalendar apiUrl={APPROVED_VENUE} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24 px-3 sm:px-6 lg:px-8 pb-8 transition-all duration-300">
      {/* 🔹 Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Venue Owner Dashboard
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 shadow transition w-full sm:w-auto"
        >
          <PlusCircle size={18} /> Add Venue
        </button>
      </div>

      {/* 🔹 Tabs section */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition whitespace-nowrap ${
                activeTab === tab.name
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Content section */}
      <div className="bg-white rounded-xl shadow p-3 sm:p-5 mt-3 sm:mt-6 overflow-x-auto">
        {renderContent()}
      </div>

      {/* 🔹 Add Venue Modal */}
      {showAddModal && (
        <MultiStepVenueModal
          onClose={() => setShowAddModal(false)}
          onSubmit={async (type, data) => {
            console.log("Submitting", type, data);
            if (type === "venue") return { venueId: 1 };
            return { success: true };
          }}
        />
      )}
    </div>
  );
};

export default VenueOwnerDashboard;
