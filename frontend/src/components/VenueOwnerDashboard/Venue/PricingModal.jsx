import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PricingModal = ({ isOpen, onClose, currentPricing, onSave }) => {
  const [pricing, setPricing] = useState({
    perHour: "",
    perDay: "",
    perEvent: "",
  });

  useEffect(() => {
    if (currentPricing && Array.isArray(currentPricing)) {
      setPricing({
        perHour:
          currentPricing.find((p) => p.type === 0)?.price?.toString() || "",
        perDay:
          currentPricing.find((p) => p.type === 1)?.price?.toString() || "",
        perEvent:
          currentPricing.find((p) => p.type === 2)?.price?.toString() || "",
      });
    }
  }, [currentPricing]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setPricing({ ...pricing, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(pricing); // ✅ Pass data back to parent
    onClose();       // ✅ Close modal after saving
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full sm:w-80 md:w-96 lg:w-1/3 p-4 sm:p-6 shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Pricing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            name="perHour"
            placeholder="Price per Hour (₹)"
            value={pricing.perHour}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="number"
            name="perDay"
            placeholder="Price per Day (₹)"
            value={pricing.perDay}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="number"
            name="perEvent"
            placeholder="Price per Event (₹)"
            value={pricing.perEvent}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
          >
            Save Pricing
          </button>
        </form>
      </div>
    </div>
  );
};

export default PricingModal;
