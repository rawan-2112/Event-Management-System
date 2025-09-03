import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaChair,
  FaCheckCircle,
  FaTrash,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
      toast.error("❌ Failed to fetch events");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(events.filter((event) => event._id !== id));
      toast.success("✅ Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event", err);
      toast.error("❌ Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-purple-50 to-white min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <Link
          to="/admin/add-event"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 flex items-center gap-2"
        >
          <FaPlus /> Add Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:scale-105"
            >
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-500" />
                {new Date(event.date).toDateString()}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-500" /> {event.location}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" /> {event.price} EGP
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaChair className="text-blue-500" /> Total Seats:{" "}
                {event.seats?.length || 0}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> Available:{" "}
                {event.seats?.filter((s) => !s.isBooked).length || 0}
              </p>


              <div className="mt-4 flex gap-2">
                <Link
                  to={`/admin/events/view/${event._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600"
                >
                  <FaEye /> View
                </Link>

                <Link
                  to={`/admin/events/edit/${event._id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600"
                >
                  <FaEdit /> Edit
                </Link>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
}
