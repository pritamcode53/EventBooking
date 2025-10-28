import React, { useState } from "react";
import { Home, BookOpen, Users, PlusCircle, XCircle, DollarSign } from "lucide-react";
import VenueList from "./Venue/VenueList";
import BookingList from "./Booking/BookingList";
import ApprovedList from "./Booking/ApprovedList";
import MultiStepVenueModal from "../../components/MultiStepVenueModal";
import CancelledBookings from "../CancelledBooking";
import RefundManagement from "./Booking/RefundManagement";

const VenueOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Venues");
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { name: "Venues", icon: <Home size={18} /> },
    { name: "Bookings", icon: <BookOpen size={18} /> },
    { name: "Approved", icon: <Users size={18} /> },
    { name: "Cancelled Bookings", icon: <XCircle size={18} /> },
    { name: "Refund Management", icon: <DollarSign size={18} /> },
    // You can add more tabs here if needed
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24 lg:pt-24 p-4 sm:p-6 lg:p-8 transition-all duration-300">
      {/* Header section */}
      <div className="flex flex-row items-center justify-between mb-6 gap-4 flex-nowrap">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
          Venue Owner Dashboard
        </h1>

        <div className="flex">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 shadow transition"
          >
            <PlusCircle size={18} /> Add Venue
          </button>
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        {renderContent()}
      </div>

      {/* Add Venue Modal */}
      {showAddModal && (
        <MultiStepVenueModal
          onClose={() => setShowAddModal(false)}
          onSubmit={async (type, data) => {
            console.log("Submitting", type, data);
            if (type === "venue") return { venueId: 1 }; // step 0
            return { success: true }; // step 1 & 2
          }}
        />
      )}
    </div>
  );
};

export default VenueOwnerDashboard;
