// src/pages/Admin/AddEvent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState(8); 
  const [seatsPerRow, setSeatsPerRow] = useState(12); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Please login first.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/events",
        {
          title,
          description,
          date,
          time,
          location,
          price,
          rows,
          seatsPerRow,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Event added successfully!");

      setTimeout(() => {
        navigate(`/admin/events/view/${res.data._id}`);
      }, 1500);
    } catch (error) {
      console.error("❌ Error adding event:", error);
      toast.error("❌ Failed to add event, check your data or permissions.");
    }
  };

  const renderSeatPreview = () => {
    const seatRows = [];
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i); 
      const rowSeats = [];
      for (let j = 1; j <= seatsPerRow; j++) {
        rowSeats.push(
          <div
            key={`${rowLetter}${j}`}
            className="w-8 h-8 flex items-center justify-center text-xs border rounded-md bg-white text-gray-700"
          >
            {rowLetter}{j}
          </div>
        );
      }
      seatRows.push(
        <div key={rowLetter} className="flex gap-2 justify-center mb-2">
          {rowSeats}
        </div>
      );
    }
    return seatRows;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white p-6">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          ➕ Add New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              type="time"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Number of Rows"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Seats per Row"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={seatsPerRow}
              onChange={(e) => setSeatsPerRow(Number(e.target.value))}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">Seats Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner overflow-x-auto">
              {renderSeatPreview()}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition mt-4"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
