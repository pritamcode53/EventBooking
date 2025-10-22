import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Edit3, Image as ImageIcon, DollarSign } from "lucide-react";
import { BookOpen, Home, Users } from "lucide-react";
import {
  VENUE_BOOKINGS,
  UPDATE_BOOKING_STATUS,
  ALL_VENUE,
  ADD_VENUE,
  DELETE_VENUE,
  UPDATE_VENUE,
  UPLOAD_VENUE_IMAGES,
  APPROVED_VENUE,
} from "../api/apiConstant";

const ADD_VENUE_PRICING = (venueId) =>
  `http://localhost:5232/api/booking/admin/venue/${venueId}/pricing/add`;

const tabs = [
  { name: "Venues", icon: <Home size={18} /> },
  { name: "Bookings", icon: <BookOpen size={18} /> },
  { name: "Approved", icon: <Users size={18} /> },
];

const VenueOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Venues");

  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [approved, setApproved] = useState([]);
  const [modalType, setModalType] = useState(null); // "add" | "edit" | "pricing"
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [venueForm, setVenueForm] = useState({ name: "", location: "", capacity: "", description: "" });
  const [pricingData, setPricingData] = useState([{ type: 0, price: "" }, { type: 1, price: "" }, { type: 2, price: "" }]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // ------------------- Fetch Data -------------------
  const fetchVenues = async () => {
    try {
      const res = await axios.get(ALL_VENUE, { withCredentials: true });
      setVenues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(VENUE_BOOKINGS, { withCredentials: true });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApprovedBookings = async () => {
    try {
      const res = await axios.get(APPROVED_VENUE, { withCredentials: true });
      setApproved(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchBookings();
    fetchApprovedBookings();
  }, []);

  // ------------------- Venue Operations -------------------
  const handleAddOrEditVenue = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        const res = await axios.post(ADD_VENUE, venueForm, { withCredentials: true });
        setSelectedVenue(res.data);
      } else if (modalType === "edit") {
        await axios.put(UPDATE_VENUE(selectedVenue.venueId), venueForm, { withCredentials: true });
      }
      setVenueForm({ name: "", location: "", capacity: "", description: "" });
      setModalType(null);
      fetchVenues();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      await axios.delete(DELETE_VENUE(venueId), { withCredentials: true });
      fetchVenues();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadImages = async (venueId) => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    try {
      await axios.post(UPLOAD_VENUE_IMAGES(venueId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPricing = async (e) => {
    e.preventDefault();
    if (!selectedVenue) return;
    try {
      await axios.post(ADD_VENUE_PRICING(selectedVenue.venueId), pricingData, { withCredentials: true });
      setModalType(null);
      setPricingData([{ type: 0, price: "" }, { type: 1, price: "" }, { type: 2, price: "" }]);
      fetchVenues();
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(UPDATE_BOOKING_STATUS(bookingId), { status }, { withCredentials: true });
      fetchBookings();
      fetchApprovedBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------- Modals -------------------
  const openAddModal = () => {
    setModalType("add");
    setVenueForm({ name: "", location: "", capacity: "", description: "" });
    setSelectedVenue(null);
  };
  const openEditModal = (venue) => {
    setModalType("edit");
    setSelectedVenue(venue);
    setVenueForm({ name: venue.name, location: venue.location, capacity: venue.capacity, description: venue.description });
  };
  const openPricingModal = (venue) => {
    setModalType("pricing");
    setSelectedVenue(venue);
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedVenue(null);
    setSelectedFiles([]);
  };

  // ------------------- Render Tab Content -------------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "Venues":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => (
              <div key={v.venueId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p>{v.location}</p>
                <p>Capacity: {v.capacity}</p>
                <p className="text-gray-600">{v.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => openEditModal(v)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"><Edit3 className="w-4 h-4" /> Edit</button>
                  <button onClick={() => handleDeleteVenue(v.venueId)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
                  <button onClick={() => openPricingModal(v)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Pricing</button>
                  <button onClick={() => handleUploadImages(v.venueId)} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Upload</button>
                </div>
                <input type="file" multiple onChange={(e) => setSelectedFiles([...e.target.files])} className="mt-2 border border-gray-300 rounded-lg p-2 w-full" />
              </div>
            ))}
          </div>
        );

      case "Bookings":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-gray-500 text-center">No Pending Requests</p>
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.bookingId} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-lg">{b.venue.name}</h3>
                  <p>Date: {new Date(b.bookingDate).toLocaleString()}</p>
                  <p>Customer: {b.customer.name}</p>
                  <p>Status: {b.status}</p>
                  {b.status === "Pending" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => updateBookingStatus(b.bookingId, "Approved")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.bookingId, "Rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

          </div>
        );

      case "Approved":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map((b) => (
              <div key={b.bookingId} className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
                <h3 className="font-bold text-lg">{b.venue.name}</h3>
                <p>Customer: {b.customer.name}</p>
                <p>📅 {new Date(b.bookingDate).toLocaleString()}</p>
                <p className="text-gray-600">
                  Duration:{" "}
                  {[
                    b.durationDays > 0 && `${b.durationDays} ${b.durationDays === 1 ? "day" : "days"}`,
                    b.durationHours > 0 && `${b.durationHours} ${b.durationHours === 1 ? "hour" : "hours"}`
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>

                <p>Status: <span className={`px-2 py-1 rounded-full text-sm font-semibold ${b.status === "Approved" ? "bg-green-100 text-green-800" : b.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{b.status}</span></p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Venue Owner Dashboard</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <PlusCircle className="w-5 h-5" /> Add Venue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
              ${activeTab === tab.name
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">{renderTabContent()}</div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start p-4 overflow-auto z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
            {(modalType === "add" || modalType === "edit") && (
              <form onSubmit={handleAddOrEditVenue} className="space-y-3">
                <h2 className="text-xl font-semibold">{modalType === "add" ? "Add New Venue" : "Edit Venue"}</h2>
                <input type="text" placeholder="Name" value={venueForm.name} onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })} className="w-full border p-2 rounded" required />
                <input type="text" placeholder="Location" value={venueForm.location} onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })} className="w-full border p-2 rounded" required />
                <input type="number" placeholder="Capacity" value={venueForm.capacity} onChange={(e) => setVenueForm({ ...venueForm, capacity: e.target.value })} className="w-full border p-2 rounded" required />
                <textarea placeholder="Description" value={venueForm.description} onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })} className="w-full border p-2 rounded" required />
                <div className="flex justify-end gap-2 flex-wrap">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
              </form>
            )}
            {modalType === "pricing" && (
              <form onSubmit={handleAddPricing} className="space-y-3">
                <h2 className="text-xl font-semibold">Add Pricing for {selectedVenue?.name}</h2>
                {pricingData.map((p, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-2 items-center">
                    <label className="w-full sm:w-1/3">{p.type === 0 ? "Per Hour" : p.type === 1 ? "Per Day" : "Per Event"}</label>
                    <input type="number" placeholder="Enter price" value={p.price} onChange={(e) => { const newData = [...pricingData]; newData[i].price = e.target.value; setPricingData(newData); }} className="border p-2 rounded w-full sm:w-2/3" required />
                  </div>
                ))}
                <div className="flex justify-end gap-2 flex-wrap">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Pricing</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueOwnerDashboard;
