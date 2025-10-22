import { useState } from "react";
import { BookOpen, Home, BarChart2, Users } from "lucide-react";

const tabs = [
    { name: "Analytics", icon: <BarChart2 size={18} /> },
    { name: "Bookings", icon: <BookOpen size={18} /> },
    { name: "Venues", icon: <Home size={18} /> },
    { name: "Venue Owners", icon: <Users size={18} /> },
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("Analytics");

    const renderTabContent = () => {
        switch (activeTab) {
            case "Analytics":
                return <div className="p-4">Analytics dashboard</div>;
            case "Bookings":
                return <div className="p-4">Manage all Bookings here</div>;
            case "Venues":
                return <div className="p-4">Manage all Venues here</div>;
            case "Venue Owners":
                return <div className="p-4">Manage Venue Owners here</div>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
              ${activeTab === tab.name
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow p-6">{renderTabContent()}</div>
        </div>
    );
};

export default AdminDashboard;
