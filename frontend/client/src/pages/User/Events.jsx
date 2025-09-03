import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch events", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <p className="text-center text-purple-700 mt-10 font-semibold">Loading events...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-purple-50 to-white min-h-screen font-poppins">
      <h1 className="text-3xl font-extrabold text-purple-700 mb-8 flex items-center gap-2">
        <FaTicketAlt className="text-purple-600" /> Available Events
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-600 text-center">No upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                {event.title}
              </h2>

              <p className="text-gray-600 flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-purple-500" />
                {new Date(event.date).toLocaleString()}
              </p>

              <p className="text-gray-600 flex items-center gap-2 mb-1">
                <FaMapMarkerAlt className="text-purple-500" /> {event.location}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to={`/events/book/${event._id}`}
                  className="px-4 py-2 bg-purple-300 text-purple-800 font-semibold rounded-lg shadow hover:bg-purple-400 transition flex items-center gap-2"
                >
                  <FaTicketAlt /> Book Now
                </Link>
                <Link
                  to={`/events/${event._id}`}
                  className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg shadow hover:bg-purple-200 transition flex items-center gap-2"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
