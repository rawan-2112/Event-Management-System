// src/pages/User/MyTickets.jsx
import React, { useEffect, useState } from "react";
import api from "../../api";
import { FaTicketAlt, FaCalendarAlt, FaChair, FaQrcode } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        toast.error("❌ Failed to fetch tickets");
        console.error("❌ Failed to fetch tickets", err.response?.data || err.message);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 p-6 font-poppins flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 flex items-center justify-center gap-3">
          <FaTicketAlt className="text-purple-600" /> My Tickets
        </h2>

        {tickets.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">You have no tickets booked yet.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white p-6 rounded-3xl shadow-lg border-l-8 border-purple-500 flex flex-col items-center gap-4 w-80"
              >
                <h3 className="text-2xl font-semibold text-purple-700 flex items-center gap-2 text-center">
                  <FaTicketAlt /> {ticket.event?.title || "Event Name"}
                </h3>
                <p className="text-gray-700 flex items-center gap-2">
                  <FaChair /> Seat: {ticket.seatNumber || ticket.seatNo || "N/A"}
                </p>
                <p className="text-gray-500 flex items-center gap-2">
                  <FaCalendarAlt />{" "}
                  {new Date(ticket.event?.date || ticket.event?.eventDate).toLocaleDateString()}
                </p>
                <div className="mt-4 flex flex-col items-center">
                  <FaQrcode className="text-purple-500 text-2xl mb-2" />
                  <img
                    src={ticket.qrCode}
                    alt="QR Code"
                    className="w-36 h-36 border rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;
