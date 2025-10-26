import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";

const UploadImagesModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-4 sm:p-6 shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload Venue Images
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <UploadCloud size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm mb-3">
            Drag & drop images here or click to select
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full cursor-pointer text-gray-700"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
            <ul className="text-xs text-gray-600 max-h-24 overflow-y-auto">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="mt-5 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadImagesModal;
