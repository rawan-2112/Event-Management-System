import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaTicketAlt, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function NavbarUser() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/notifications/upcoming", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("❌ Failed to fetch unread notifications", err);
      }
    };
    fetchUnread();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white px-6 py-3 flex justify-between items-center shadow-lg font-[Century_Schoolbook]">
      <h1 className="text-2xl font-bold tracking-wide">Event Studio</h1>
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaHome /> Home</Link>
        <Link to="/events" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaCalendarAlt /> Events</Link>
        <Link to="/my-tickets" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaTicketAlt /> My Tickets</Link>
        <Link to="/notifications" className="relative flex items-center gap-1 hover:text-yellow-200 transition-colors">
          <FaBell /> Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/profile" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaUser /> Profile</Link>
        <button
          onClick={handleLogout}
          className="ml-2 flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-purple-100 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default NavbarUser;
