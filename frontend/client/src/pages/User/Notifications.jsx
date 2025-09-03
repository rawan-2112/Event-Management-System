import React, { useEffect, useState } from "react";
import api from "../../api";
import { FaBell, FaRegEye, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/upcoming");
        
        const data = res.data.map((n) => ({ ...n, isRead: false }));
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: !n.isRead } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 flex justify-center items-start p-6 font-poppins">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-purple-700 flex items-center gap-3 justify-center">
          <FaBell className="text-purple-600" /> Upcoming Events
        </h2>

        {notifications.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">No upcoming events 🎉</p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${
                  n.isRead ? "border-green-500" : "border-purple-500"
                } flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                    <FaBell className="text-purple-500" />
                    {n.title}
                  </h3>
                  <p className="text-gray-700 text-md">📍 {n.location}</p>
                  <p className="text-gray-500 text-sm font-medium">🕒 {new Date(n.date).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-xl text-gray-500 hover:text-purple-600 transition"
                  >
                    {n.isRead ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaRegEye />
                    )}
                  </button>

                  <Link
                    to={`/events/${n._id}`}
                    className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
                  >
                    View Event
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notifications;
