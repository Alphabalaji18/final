import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 min-h-screen flex items-center justify-center pt-24 overflow-y-auto">

      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
          <p className="text-lg text-gray-500 mt-2">Manage your personal information</p>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-600 shadow-xl transition-all duration-300 hover:scale-105"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-indigo-600 p-3 rounded-full cursor-pointer 
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-gray-50 rounded-lg border text-gray-700">{authUser?.fullName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-gray-50 rounded-lg border text-gray-700">{authUser?.email}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b border-gray-300">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center space-x-4">
          <button
            onClick={() => {}}
            className="w-full bg-blue-600 text-white py-2 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
