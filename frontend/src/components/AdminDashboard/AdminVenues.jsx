import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_VENUES } from "../../api/apiConstant";
import { Loader2, Home } from "lucide-react";

const AdminVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(ADMIN_GET_VENUES, { withCredentials: true });
        setVenues(response.data || []); // assuming API returns an array of venues
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!venues.length) {
    return <div className="text-center text-gray-500 py-10">No venues found.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="min-w-[500px] grid grid-cols-3 gap-4 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
          <span>Venue Name</span>
          <span>Location</span>
          <span>Capacity</span>
        </div>

        {/* Rows */}
        {venues.map((v) => (
          <div
            key={v.venueId}
            className="min-w-[500px] grid grid-cols-3 gap-4 items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Home size={16} className="text-blue-500" />
              {v.name || "Unknown Venue"}
            </div>
            <div>{v.location || "-"}</div>
            <div>{v.capacity || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVenues;
