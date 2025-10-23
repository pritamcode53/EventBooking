import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_TOTAL_BOOKINGS, ADMIN_TOTAL_COST } from "../api/apiConstant";
import { Users, DollarSign, Loader2 } from "lucide-react";

const AdminAnalytics = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const bookingsRes = await axios.get(ADMIN_TOTAL_BOOKINGS, {
          withCredentials: true,
        });
        const costRes = await axios.get(ADMIN_TOTAL_COST, {
          withCredentials: true,
        });

        setTotalBookings(bookingsRes.data.totalBookings || 0);
        setTotalRevenue(costRes.data.totalCost || 0);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Bookings Card */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-blue-100 p-3 rounded-full">
          <Users className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-gray-500 uppercase text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="bg-green-100 p-3 rounded-full">
          <DollarSign className="text-green-600" size={24} />
        </div>
        <div>
          <p className="text-gray-500 uppercase text-sm">Total Bookings Cost</p>
          <p className="text-2xl font-bold text-gray-800">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
