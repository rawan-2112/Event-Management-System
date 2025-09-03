import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaChair,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const eventsRes = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ticketsRes = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalEvents = eventsRes.data.length;
      const totalSeats = eventsRes.data.reduce(
        (a, e) => a + (e.seats?.length || 0),
        0
      );
      const bookedSeats = eventsRes.data.reduce(
        (a, e) => a + (e.seats?.filter((s) => s.isBooked).length || 0),
        0
      );

      const revenue = ticketsRes.data.reduce(
        (a, t) => a + (t.event?.price || 0),
        0
      );

      setStats({ totalEvents, totalSeats, bookedSeats, revenue });
      setUpcoming(eventsRes.data.filter((e) => e.status === "upcoming"));
      setTickets(ticketsRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-purple-50 to-white min-h-screen font-[Century_Schoolbook]">
      <h1 className="text-4xl font-extrabold text-purple-600 mb-10 drop-shadow">
         Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card title="Total Events" value={stats.totalEvents} icon={<FaCalendarAlt />} />
        <Card title="Total Seats" value={stats.totalSeats} icon={<FaChair />} />
        <Card title="Booked Seats" value={stats.bookedSeats} icon={<FaCheckCircle />} />
        <Card
          title="Revenue"
          value={`${stats.revenue || 0} EGP`}
          icon={<FaMoneyBillWave />}
        />
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
          <FaChair className="text-purple-500" /> Seat Allocation
        </h2>
        <div className="w-full bg-purple-100 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-6 text-xs text-white flex items-center justify-center transition-all"
            style={{
              width: `${((stats.bookedSeats || 0) / (stats.totalSeats || 1)) * 100}%`,
            }}
          >
            {(
              ((stats.bookedSeats || 0) / (stats.totalSeats || 1)) *
              100
            ).toFixed(1)}
            %
          </div>
        </div>
        <p className="mt-3 text-gray-600">
          {stats.bookedSeats || 0} / {stats.totalSeats || 0} seats booked
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-purple-600 mb-6">
          <FaCalendarAlt className="inline text-purple-500 mr-2" />
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcoming.map((e) => (
            <div
              key={e._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:scale-105 transition transform duration-300"
            >
              <h3 className="text-lg font-bold text-purple-600">{e.title}</h3>
              <p className="text-gray-600">
                {new Date(e.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">📍 {e.location}</p>
              <p className="mt-3 text-green-600 font-semibold">
                Price: {e.price} EGP
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
          <FaCheckCircle className="text-purple-500" /> All Tickets
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th className="p-3 border">User</th>
                <th className="p-3 border">Event</th>
                <th className="p-3 border">Seat</th>
                <th className="p-3 border">QR</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={t._id}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3 border">{t.user?.name}</td>
                  <td className="p-3 border">{t.event?.title}</td>
                  <td className="p-3 border">{t.seatNumber}</td>
                  <td className="p-3 border">
                    {t.qrCode ? (
                      <img src={t.qrCode} alt="QR" className="w-16 h-16 rounded" />
                    ) : (
                      <span className="text-gray-400">No QR</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-500 rounded-2xl p-6 shadow-lg text-center text-white hover:scale-105 transition duration-300">
      <div className="text-4xl mb-2 flex justify-center">{icon}</div>
      <h2 className="text-lg">{title}</h2>
      <p className="text-2xl font-bold">{value || 0}</p>
    </div>
  );
}

export default Dashboard;
