import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ALL_VENUE,
  DELETE_VENUE,
  UPDATE_VENUE,
  UPLOAD_VENUE_IMAGES,
  UPDATE_VENUE_PRICING,
} from "../../../api/apiConstant";
import VenueCard from "./VenueCard";
import EditVenueModal from "./EditVenueModal";
import UploadImagesModal from "./UploadImagesModal";
import PricingModal from "./PricingModal";

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [editingVenue, setEditingVenue] = useState(null);
  const [uploadingVenue, setUploadingVenue] = useState(null);
  const [pricingVenue, setPricingVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(ALL_VENUE, { withCredentials: true });
      if (Array.isArray(res.data)) {
        setVenues(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setVenues(res.data.data);
      } else {
        console.error("Unexpected API response:", res.data);
        setVenues([]);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleUpdateVenue = async (updatedVenue) => {
    try {
      await axios.put(UPDATE_VENUE(updatedVenue.venueId), updatedVenue, {
        withCredentials: true,
      });
      setEditingVenue(null);
      fetchVenues();
    } catch (err) {
      console.error("Failed to update venue:", err);
    }
  };

  const handleUploadImages = async (venueId, images) => {
    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("files", img));

      await axios.post(UPLOAD_VENUE_IMAGES(venueId), formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadingVenue(null);
      fetchVenues();
    } catch (err) {
      console.error("Failed to upload images:", err);
    }
  };

  const handleUpdatePricing = async (venueId, pricingData) => {
    try {
      await axios.put(UPDATE_VENUE_PRICING(venueId), pricingData, {
        withCredentials: true,
      });
      setPricingVenue(null);
      fetchVenues();
    } catch (err) {
      console.error("Failed to update pricing:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center py-6 text-gray-500">Loading venues...</p>
    );

  if (!venues.length)
    return (
      <p className="text-center py-6 text-gray-500">No venues found</p>
    );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Venue List
      </h2>

      {/* ✅ Responsive Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Prices
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {venues.map((venue, index) => (
              <VenueCard
                key={venue.venueId}
                venue={{
                  ...venue,
                  perHour: venue.perHour ?? 0,
                  perDay: venue.perDay ?? 0,
                  perEvent: venue.perEvent ?? 0,
                }}
                images={
                  Array.isArray(venue.venueImages) && venue.venueImages.length > 0
                    ? venue.venueImages
                    : venue.images
                    ? venue.images.split(",")
                    : []
                }
                onEdit={() => setEditingVenue(venue)}
                onDelete={fetchVenues}
                onUpload={() => setUploadingVenue(venue)}
                onPrice={() => setPricingVenue(venue)}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modals */}
      <EditVenueModal
        isOpen={!!editingVenue}
        venueData={editingVenue}
        onClose={() => setEditingVenue(null)}
        onSave={handleUpdateVenue}
      />

      <UploadImagesModal
        isOpen={!!uploadingVenue}
        venueData={uploadingVenue}
        onClose={() => setUploadingVenue(null)}
        onUpload={(images) =>
          handleUploadImages(uploadingVenue.venueId, images)
        }
      />

      <PricingModal
        isOpen={!!pricingVenue}
        currentPricing={pricingVenue?.venuePricings || []}
        onClose={() => setPricingVenue(null)}
        onSave={(pricingData) => {
          const payload = [
            { type: 0, price: Number(pricingData.perHour) },
            { type: 1, price: Number(pricingData.perDay) },
            { type: 2, price: Number(pricingData.perEvent) },
          ].filter((p) => !isNaN(p.price) && p.price > 0);
          handleUpdatePricing(pricingVenue.venueId, payload);
        }}
      />
    </div>
  );
};

export default VenueList;
