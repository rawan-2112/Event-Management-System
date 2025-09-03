import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function SeatSelection() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error("❌ Failed to load event", err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    setSelectedSeat(seat.number);
  };

  const handleProceed = () => {
    if (!selectedSeat) {
      alert("Please select a seat!");
      return;
    }
    navigate(`/events/book/${eventId}/payment`, {
      state: { seatNumber: selectedSeat },
    });
  };

  if (loading) return <p className="text-purple-700 font-semibold text-center mt-10">Loading event seats...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!event) return <p className="text-gray-500 text-center mt-10">Event not found.</p>;

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center py-10 font-poppins">
      <h2 className="text-3xl font-bold text-purple-700 mb-8">{event.title} - Select Your Seat</h2>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {event.seats.map((seat, index) => (
          <div
            key={seat._id || index}
            onClick={() => handleSeatClick(seat)}
            className={`flex items-center justify-center h-16 w-16 rounded-lg font-semibold cursor-pointer transition 
              ${
                seat.isBooked
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : selectedSeat === seat.number
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white border border-gray-300 hover:bg-purple-100"
              }`}
          >
            {seat.number}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-400 rounded"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-purple-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-white border border-gray-300 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>

      <button
        onClick={handleProceed}
        className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition shadow-lg"
      >
        Proceed to Payment
      </button>
    </div>
  );
}

export default SeatSelection;
