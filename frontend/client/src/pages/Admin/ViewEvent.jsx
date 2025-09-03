import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaTicketAlt,
  FaDownload,
} from "react-icons/fa";

function ViewEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const qrRef = useRef();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("❌ Error fetching event", err);
      }
    };
    fetchEvent();
  }, [id]);

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title}-qrcode.png`;
    link.click();
  };

  const renderSeats = (seats) => {
    const seatsPerRow = 6;
    const rows = [];

    for (let i = 0; i < seats.length; i += seatsPerRow) {
      const rowSeats = seats.slice(i, i + seatsPerRow);
      const rowLetter = String.fromCharCode(65 + i / seatsPerRow);

      rows.push(
        <div key={rowLetter} className="flex gap-3 justify-center mb-3">
          {rowSeats.map((seat, index) => (
            <div
              key={seat._id}
              className={`w-12 h-12 flex items-center justify-center rounded-lg font-semibold border shadow-sm 
                ${seat.isBooked ? "bg-gray-400 text-white" : "bg-white text-gray-800"}`}
            >
              {rowLetter}{index + 1}
            </div>
          ))}
        </div>
      );
    }

    return rows;
  };

  if (!event) return <p className="p-4 text-white">Loading...</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-purple-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6">📄 Event Details</h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          <p className="flex items-center gap-2 text-gray-700">
            <FaTicketAlt className="text-purple-600" /> 
            <strong>Title:</strong> {event.title}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-purple-600" /> 
            <strong>Location:</strong> {event.location}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-purple-600" /> 
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaClock className="text-purple-600" /> 
            <strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-gray-700">
            <strong>Description:</strong> {event.description}
          </p>

          {Array.isArray(event.seats) && event.seats.length > 0 && (
            <div className="mt-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-purple-700">
                <FaChair /> Seat Map
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                {renderSeats(event.seats)}
              </div>

              <div className="flex justify-center gap-6 mt-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FaChair className="text-gray-400" /> <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChair className="text-purple-600" /> <span>Available</span>
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 text-gray-700">
            <strong>Available Seats:</strong> {event.availableSeats}
          </p>

          <div
            ref={qrRef}
            className="flex flex-col items-center bg-gray-50 p-6 rounded-xl shadow-md mt-6"
          >
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-700">
              <FaTicketAlt /> Event QR Code
            </h2>
            <QRCodeCanvas
              value={`http://localhost:3000/admin/events/view/${event._id}`}
              size={180}
            />
            <p className="mt-2 text-gray-600">Scan to view event details</p>
            <button
              onClick={downloadQR}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 flex items-center gap-2"
            >
              <FaDownload /> Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEvent;
