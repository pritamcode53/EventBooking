// MultiStepVenueModal.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  ADD_VENUE,
  ADD_VENUE_PRICING,
  UPLOAD_VENUE_IMAGES,
} from "../api/apiConstant";

const steps = ["Venue Details", "Pricing", "Upload Images", "Confirm"];

const MultiStepVenueModal = ({ selectedVenue, onClose }) => {
  const [step, setStep] = useState(0);
  const [venueId, setVenueId] = useState(null);
  const [venueForm, setVenueForm] = useState({
    name: selectedVenue?.name || "",
    location: selectedVenue?.location || "",
    capacity: selectedVenue?.capacity || "",
    description: selectedVenue?.description || "",
  });
  const [pricingData, setPricingData] = useState([
    { type: 0, price: "" },
    { type: 1, price: "" },
    { type: 2, price: "" },
  ]);
  const [files, setFiles] = useState([]);

  const postData = async (url, data) => {
    try {
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      return null;
    }
  };

  const nextStep = async () => {
    try {
      if (step === 0) {
        if (!venueForm.name || !venueForm.location || !venueForm.capacity)
          return alert("Fill all fields");

        const res = await postData(ADD_VENUE, venueForm);
        if (!res?.venueId) return alert("Failed to add venue");
        setVenueId(res.venueId);
        setStep(step + 1);
        return;
      }

      if (step === 1) {
        if (!venueId) return alert("Venue ID missing");

        const payload = pricingData.map((p) => ({
          type: p.type,
          price: Number(p.price),
        }));

        const res = await postData(ADD_VENUE_PRICING(venueId), payload);
        if (!res) return alert("Failed to save pricing");
        setStep(step + 1);
        return;
      }

      if (step === 2) {
        if (!venueId) return alert("Venue ID missing");
        if (files.length === 0) return alert("Please select files");

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("venueId", venueId);

        const res = await axios.post(UPLOAD_VENUE_IMAGES(venueId), formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (!res?.data?.imageIds || !Array.isArray(res.data.imageIds)) {
          console.error("Unexpected response:", res.data);
          return alert("Failed to upload images");
        }

        setStep(step + 1);
      }

      if (step === 3) onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const prevStep = () => setStep(Math.max(step - 1, 0));

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-md p-4 overflow-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-fadeIn scale-95 md:scale-100 transition-transform duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {steps[step]}
        </h2>

        {/* Step content */}
        {step === 0 && (
          <div className="space-y-4">
            {["name", "location", "capacity"].map((field) => (
              <input
                key={field}
                type={field === "capacity" ? "number" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={venueForm[field]}
                onChange={(e) =>
                  setVenueForm({ ...venueForm, [field]: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              />
            ))}
            <textarea
              placeholder="Description"
              value={venueForm.description}
              onChange={(e) =>
                setVenueForm({ ...venueForm, description: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm resize-none"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {pricingData.map((p, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-3 items-center"
              >
                <label className="w-full sm:w-1/3 font-medium text-gray-700">
                  {p.type === 0
                    ? "Per Hour"
                    : p.type === 1
                    ? "Per Day"
                    : "Per Event"}
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={p.price}
                  onChange={(e) => {
                    const newData = [...pricingData];
                    newData[i].price = e.target.value;
                    setPricingData(newData);
                  }}
                  className="w-full sm:w-2/3 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition">
              Select Files
              <input
                type="file"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                className="hidden"
              />
            </label>
            {files.length > 0 && (
              <ul className="list-disc pl-5 text-gray-700">
                {files.map((f, idx) => (
                  <li key={idx}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-gray-700">
            <p>Review your details:</p>
            <p>
              <strong>Name:</strong> {venueForm.name}
            </p>
            <p>
              <strong>Location:</strong> {venueForm.location}
            </p>
            <p>
              <strong>Capacity:</strong> {venueForm.capacity}
            </p>
            <p>
              <strong>Description:</strong> {venueForm.description}
            </p>
            <p>
              <strong>Pricing:</strong>{" "}
              {pricingData.map((p) => p.price).join(", ")}
            </p>
            <p>
              <strong>Images:</strong> {files.length} file(s) selected
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="flex-1 py-2 px-4 border rounded-xl hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={nextStep}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {step === steps.length - 1 ? "Add Venue" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepVenueModal;
