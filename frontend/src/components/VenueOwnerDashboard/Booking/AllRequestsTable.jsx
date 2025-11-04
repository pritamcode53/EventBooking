import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_RQ_CN, BASE_URL ,PUT_UPDATE_RQ_CN} from "../../../api/apiConstant";
import { Pencil, X } from "lucide-react";
import { toast } from "react-toastify";

const AllRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [ownerReview, setOwnerReview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all custom booking requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(GET_ALL_RQ_CN, { withCredentials: true });
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // ✅ Handle update submission
  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      setLoading(true);
      console.log("bookingId:", selectedRequest.bookingId);
      console.log("Final URL:", PUT_UPDATE_RQ_CN(selectedRequest.bookingId));

      await axios.put(
         PUT_UPDATE_RQ_CN(selectedRequest.bookingId),
        {
          newPrice: parseFloat(newPrice),
          ownerReview,
        },
        { withCredentials: true }
      );
      toast.success("Price updated successfully!");
      setSelectedRequest(null);
      setNewPrice("");
      setOwnerReview("");
      fetchRequests();
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        All Custom Booking Requests
      </h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Request ID</th>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Requirements</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.requestId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{r.requestId}</td>
                <td className="px-4 py-2 border text-center">{r.userId}</td>
                <td className="px-4 py-2 border">{r.requirements}</td>
                <td className="px-4 py-2 border text-center">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => setSelectedRequest(r)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                  >
                    <Pencil size={16} /> Manage
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4 border"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Manage Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            {/* ❌ Close Button */}
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Manage Request #{selectedRequest.requestId}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded-md mt-1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Review
                </label>
                <textarea
                  rows="3"
                  className="w-full border p-2 rounded-md mt-1"
                  value={ownerReview}
                  onChange={(e) => setOwnerReview(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRequestsTable;
