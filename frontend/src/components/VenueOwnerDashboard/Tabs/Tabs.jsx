import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex flex-col sm:flex-row gap-2 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        onClick={() => onTabChange(tab.name)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
          activeTab === tab.name
            ? "bg-green-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
      >
        {tab.icon}
        {tab.name}
      </button>
    ))}
  </div>
);

export default Tabs;
