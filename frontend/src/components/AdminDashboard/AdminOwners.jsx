import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_OWNERS } from "../../api/apiConstant";
import { Loader2, Users } from "lucide-react";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get(ADMIN_GET_OWNERS, { withCredentials: true });
        setOwners(response.data || []);
      } catch (error) {
        console.error("Error fetching owners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-green-500" size={32} />
      </div>
    );
  }

  if (!owners.length) {
    return <div className="text-center text-gray-500 py-10">No owners found.</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="min-w-[700px] grid grid-cols-5 gap-4 px-4 py-3 
                        bg-green-100 
                         font-semibold text-sm uppercase tracking-wide">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Registered At</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {owners.map((o, index) => (
          <div
            key={o.ownerId || index}
            className="min-w-[700px] grid grid-cols-5 gap-4 items-center px-4 py-3
                       border-b border-gray-100 text-gray-700
                       hover:bg-green-50 transition-all duration-200 ease-in-out"
          >
            <div className="flex items-center gap-2 font-medium">
              <Users size={16} className="text-green-600" />
              {o.name || "Unknown"}
            </div>
            <div>{o.email || "-"}</div>
            <div>{o.phone || "-"}</div>
            <div>{new Date(o.registeredAt).toLocaleDateString()}</div>
            <div>
              <button className="px-3 py-1 text-sm text-white bg-green-600 rounded-full 
                                 hover:bg-green-700 transition-colors duration-150">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOwners;
