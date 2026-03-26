import { useState } from "react";

export default function BannerAdminPanel() {
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerData, setBannerData] = useState({
    title: "Welcome to Our Website",
    subtitle: "Best products available here",
    image: "",
  });

  const handleToggle = () => {
    setBannerEnabled(!bannerEnabled);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBannerData({ ...bannerData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerData({ ...bannerData, image: imageUrl });
    }
  };

  const handleSave = () => {
    // ഇവിടെ API call കൊടുക്കാം (backend save)
    console.log("Saved Data:", { bannerEnabled, bannerData });
    alert("Banner settings saved!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Home Banner Settings</h2>

      {/* Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">Enable Banner</span>
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded ${
            bannerEnabled ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          {bannerEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Edit Section */}
      {bannerEnabled && (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={bannerData.subtitle}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Upload Image</label>
            <input type="file" onChange={handleImageUpload} />
          </div>

          {bannerData.image && (
            <img
              src={bannerData.image}
              alt="Preview"
              className="mt-3 rounded-lg h-40 object-cover"
            />
          )}
        </>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
}
