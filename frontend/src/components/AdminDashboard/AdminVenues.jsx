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
        setVenues(response.data || []);
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
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (!venues.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No venues found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px] grid grid-cols-3 gap-4 px-4 py-3 bg-green-100  font-semibold text-sm uppercase tracking-wide">
          <span>Venue Name</span>
          <span>Location</span>
          <span>Capacity</span>
        </div>

        {/* Rows */}
        {venues.map((v, index) => (
          <div
            key={v.venueId}
            className={`min-w-[500px] grid grid-cols-3 gap-4 items-center px-4 py-3 text-sm transition-all duration-200 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-green-50 hover:shadow-sm`}
          >
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <Home size={16} className="text-green-500" />
              {v.name || "Unknown Venue"}
            </div>
            <div className="text-gray-700">{v.location || "-"}</div>
            <div className="text-gray-700">{v.capacity || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVenues;
