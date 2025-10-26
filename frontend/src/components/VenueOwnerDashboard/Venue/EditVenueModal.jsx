import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditVenueModal = ({ isOpen, onClose, venueData, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    description: "",
  });

  useEffect(() => {
    if (venueData) setFormData(venueData);
  }, [venueData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full sm:w-3/4 md:w-1/2 lg:w-2/5 p-4 sm:p-6 shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Edit Venue Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Venue Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVenueModal;
