import React, { useEffect, useState } from "react";
import api from "../../api";
import { FaUser, FaBirthdayCake, FaVenusMars, FaMapMarkerAlt, FaStar, FaLock, FaKey } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        toast.error("❌ Failed to load profile");
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleInterestsChange = (e) => setForm({ ...form, interests: e.target.value.split(",") });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.put("/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      toast.success(" Profile updated successfully!✅");
    } catch (err) {
      toast.error(" Failed to update profile ❌");
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.put("/profile/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswords({ oldPassword: "", newPassword: "" });
      toast.success(" Password updated successfully!✅");
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.error || "Failed to update password"));
      console.error(err);
    }
  };

  if (!profile)
    return (
      <p className="p-6 text-center text-purple-700 font-semibold">Loading profile...</p>
    );

  return (
    <div className="min-h-screen bg-purple-50 flex justify-center items-start py-10 font-poppins">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-8 text-center flex items-center justify-center gap-2">
          <FaUser /> My Profile
        </h1>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3">
            <FaUser className="text-purple-500 text-xl" />
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Name"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaBirthdayCake className="text-purple-500 text-xl" />
            <input
              type="number"
              name="age"
              value={form.age || ""}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Age"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaVenusMars className="text-purple-500 text-xl" />
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-purple-500 text-xl" />
            <input
              type="text"
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Location"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaStar className="text-purple-500 text-xl" />
            <input
              type="text"
              name="interests"
              value={form.interests?.join(",") || ""}
              onChange={handleInterestsChange}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Interests (comma separated)"
            />
          </div>

          <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition">
            Save Profile
          </button>
        </form>

        <hr className="my-8 border-purple-200" />

        {/* Password Form */}
        <h2 className="text-2xl font-semibold text-purple-600 mb-5 text-center flex items-center justify-center gap-2">
          <FaKey /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="flex items-center gap-3">
            <FaLock className="text-purple-500 text-xl" />
            <input
              type="password"
              placeholder="Old Password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaLock className="text-purple-500 text-xl" />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full p-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
