import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_GET_CANCEL, ADMIN_TOTAL_BOOKINGS, ADMIN_TOTAL_COST,ADMIN_TOTAL_DUE  } from "../../api/apiConstant";
import { Users, DollarSign, Loader2,XCircle  } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalCancel, setTotalCancel] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const bookingsRes = await axios.get(ADMIN_TOTAL_BOOKINGS, { withCredentials: true });
        const costRes = await axios.get(ADMIN_TOTAL_COST, { withCredentials: true });
        const cancelRes = await axios.get(ADMIN_GET_CANCEL, { withCredentials: true });
        const costDue = await axios.get(ADMIN_TOTAL_DUE, { withCredentials: true });

        setTotalBookings(bookingsRes.data.totalBookings || 0);
        setTotalRevenue(costRes.data.totalCost || 0);
        setTotalDue(costDue.data.totalDue || 0);
        setTotalCancel(cancelRes.data.totalCancelledBookings || 0);
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

  // Bar chart for total stats
  const statsData = {
    labels: ["Total Bookings", "Cancelled Bookings"],
    datasets: [
      {
        label: "Analytics",
        data: [totalBookings, totalCancel],
        backgroundColor: ["#3B82F6", "#10B981", "#EF4444"],
      },
    ],
  };

  const statsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Booking Analytics Overview", font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Doughnut chart for cancellation vs completed bookings
  const cancellationRate = totalBookings > 0 ? Math.round((totalCancel / totalBookings) * 100) : 0;

  const doughnutData = {
    labels: ["Booked - Paid Amount", "Booked Due Amount"],
    datasets: [
      {
        data: [totalRevenue, totalDue],
        backgroundColor: ["#3B82F6", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: " Amount Insights", font: { size: 16 } },
    },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Summary Cards */}
   <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 uppercase text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{totalBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 uppercase text-sm">Total Paid Amount</p>
            <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 uppercase text-sm">Total Due Amount</p>
            <p className="text-2xl font-bold text-gray-800">₹{totalDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
            <XCircle  className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 uppercase text-sm">Cancelled Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{totalCancel}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col overflow-hidden">
    <div className="relative w-full h-72 sm:h-96">
      <Bar data={statsData} options={statsOptions} />
    </div>
  </div>

  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col overflow-hidden">
    <div className="relative w-full h-72 sm:h-96">
      <Doughnut data={doughnutData} options={doughnutOptions} />
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminAnalytics;
