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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading venues...</p>
      </div>
    );
  }

  return (
    <>
      {venues.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No venues found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard
              key={venue.venueId}
              venue={venue}
              images={venue.venueImages || []}
              onEdit={() => setEditingVenue(venue)}
              onDelete={fetchVenues}
              onUpload={() => setUploadingVenue(venue)}
              onPrice={() => setPricingVenue(venue)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditVenueModal
        isOpen={!!editingVenue}
        venueData={editingVenue}
        onClose={() => setEditingVenue(null)}
        onSave={handleUpdateVenue}
      />

      {/* Upload Images Modal */}
      <UploadImagesModal
        isOpen={!!uploadingVenue}
        venueData={uploadingVenue}
        onClose={() => setUploadingVenue(null)}
        onUpload={(images) =>
          handleUploadImages(uploadingVenue.venueId, images)
        }
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={!!pricingVenue}
        currentPricing={pricingVenue?.venuePricings || []}
        onClose={() => setPricingVenue(null)}
        onSave={(pricingData) => {
          // Convert from modal format to backend array format
          const payload = [
            { type: 0, price: Number(pricingData.perHour) },
            { type: 1, price: Number(pricingData.perDay) },
            { type: 2, price: Number(pricingData.perEvent) },
          ];

          handleUpdatePricing(pricingVenue.venueId, payload);
        }}
      />
    </>
  );
};

export default VenueList;
