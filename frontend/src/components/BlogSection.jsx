import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_ALL_VENUES } from "../api/apiConstant";

const categories = [
  { key: "latest", label: "Latest" },
  { key: "bridal", label: "Bridal Fashion" },
  { key: "weddingPlanning", label: "Wedding Planning" },
  { key: "photoVideo", label: "Photo & Video Ideas" },
  { key: "celebrity", label: "Celebrity" },
  { key: "decorating", label: "Decorating Ideas" },
  { key: "preWedding", label: "Pre Wedding Planning" },
  { key: "weddingDay", label: "Wedding Day" },
  { key: "hindu", label: "Hindu" },
];

const BlogSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("latest");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (category) => {
    setLoading(true);
    try {
      const res = await axios.get(
        GET_ALL_VENUES
      );
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="px-6 py-10 bg-gray-50">
      {/* Category Selector */}
      <div className="flex overflow-x-auto gap-4 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex flex-col items-center cursor-pointer ${
              selectedCategory === cat.key ? "border-b-2 border-pink-500" : ""
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {/* Placeholder image: you can replace with actual category images */}
              <img
                src={`/images/${cat.key}.jpg`}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center">Loading posts...</div>
      ) : posts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-xs text-gray-500">{post.category}</p>
                <p className="text-xs text-gray-400">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No posts found</div>
      )}
    </div>
  );
};

export default BlogSection;
