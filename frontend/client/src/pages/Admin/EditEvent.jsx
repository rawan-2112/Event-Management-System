import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaHeading, FaSave, FaClock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    date: "",
    time: "",   
    venue: "",
    price: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setEvent({
            title: res.data.title || "",
            date: res.data.date ? res.data.date.substring(0, 10) : "",
            time: res.data.time || "",   
            venue: res.data.venue || "",
            price: res.data.price ?? 0,
          });
        }
      } catch (err) {
        console.error("Error fetching event", err);
        toast.error("❌ Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/events/${id}`, event, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Event updated successfully!");
      setTimeout(() => navigate("/admin/events"), 2000);
    } catch (err) {
      console.error("Error updating event", err);
      toast.error("❌ Failed to update event");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading.. .</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
          ✏️ Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border p-2 rounded focus-within:ring-2 focus-within:ring-purple-500">
            <FaHeading className="text-purple-600" />
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="w-full outline-none"
              placeholder="Event Title"
              required
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded focus-within:ring-2 focus-within:ring-purple-500">
            <FaCalendarAlt className="text-purple-600" />
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded focus-within:ring-2 focus-within:ring-purple-500">
            <FaClock className="text-purple-600" />
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded focus-within:ring-2 focus-within:ring-purple-500">
            <FaMapMarkerAlt className="text-purple-600" />
            <input
              type="text"
              name="venue"
              value={event.venue}
              onChange={handleChange}
              className="w-full outline-none"
              placeholder="Venue"
              required
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded focus-within:ring-2 focus-within:ring-purple-500">
            <FaTag className="text-purple-600" />
            <input
              type="number"
              name="price"
              value={event.price}
              onChange={handleChange}
              className="w-full outline-none"
              placeholder="Price (EGP)"
              required
            />
          </div>

          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-800 flex items-center justify-center gap-2 font-semibold shadow-md transition"
          >
            <FaSave /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
