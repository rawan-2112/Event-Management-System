import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

function EventDetailsUser() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading)
    return (
      <p className="text-purple-700 font-semibold text-center mt-10 text-lg">
        Loading event details...
      </p>
    );
  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!event)
    return (
      <p className="text-gray-500 text-center mt-10">Event not found</p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-white font-poppins p-6">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-4">{event.title}</h1>

        <div className="flex flex-col gap-3 text-gray-700 mb-4">
          <p className="flex items-center gap-2 text-lg">
            <FaCalendarAlt className="text-purple-500" />
            {new Date(event.date).toLocaleString()}
          </p>
          <p className="flex items-center gap-2 text-lg">
            <FaMapMarkerAlt className="text-purple-500" />
            {event.location || "Location not specified"}
          </p>
          <p className="flex items-center gap-2 text-lg text-purple-600 font-bold">
            <FaDollarSign className="text-purple-500" />
            ${event.price ?? 0}
          </p>
        </div>

       <p className="text-gray-700 mb-6 text-justify">
          <span className="font-semibold text-purple-700">Description:</span> {event.description}
        </p>


        <div className="flex justify-center">
          <Link
            to={`/events/book/${event._id}`}
            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl shadow hover:bg-purple-600 transition"
          >
            Book Now
          </Link>
        </div>

        <div className="flex justify-center mt-4">
          <Link
            to="/events"
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsUser;
