// src/pages/Admin/EventDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <p><strong>Total Seats:</strong> {event.seats?.length}</p>
      <p><strong>Available:</strong> {event.seats?.filter(s => !s.isBooked).length}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Seats</h2>
      <div className="grid grid-cols-6 gap-2">
        {event.seats?.map((seat) => (
          <div
            key={seat._id}
            className={`p-2 border rounded text-center ${
              seat.isBooked ? "bg-red-400" : "bg-green-400"
            }`}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <Link
        to="/admin/events"
        className="mt-6 inline-block bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Events
      </Link>
    </div>
  );
}

export default EventDetails;
