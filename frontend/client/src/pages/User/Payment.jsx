import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payment() {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { seatNumber } = location.state || {};

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!seatNumber) {
      toast.error("⚠️ No seat selected. Please go back.");
      navigate(`/events/${eventId}`);
    }
  }, [seatNumber, eventId, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      toast.success(`✅ Payment Successful via ${method.toUpperCase()}`);

      const token = localStorage.getItem("token");
      const res = await api.post(
        "/tickets/book",
        { eventId, seatNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTicket(res.data);
      console.log("🎟️ Ticket booked:", res.data);
    } catch (err) {
      console.error("❌ Booking failed", err.response?.data || err.message);
      toast.error("❌ Booking Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <div className="bg-white shadow-md rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Payment
        </h2>

        {!ticket ? (
          <form onSubmit={handlePayment} className="space-y-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>

            {method === "card" && (
              <>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
            >
              Pay Now
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-600">
              🎉 Ticket Booked!
            </h3>
            <p className="text-sm mt-2">Seat: {ticket.seatNumber}</p>
            <p className="text-sm">Event: {ticket.event.title}</p>
            <img
              src={ticket.qrCode}
              alt="QR Code"
              className="mx-auto mt-4 w-40 h-40"
            />
            <button
              onClick={() => navigate("/my-tickets")}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Go to My Tickets
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Payment;
