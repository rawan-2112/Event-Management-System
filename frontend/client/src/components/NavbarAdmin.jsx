import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaChartBar, FaSignOutAlt } from "react-icons/fa";

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white px-6 py-3 flex justify-between items-center shadow-lg font-[Century_Schoolbook]">
      <h1 className="text-2xl font-bold tracking-wide">Admin  </h1>
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaHome /> Home</Link>
        <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaTachometerAlt /> Dashboard</Link>
        <Link to="/admin/events" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaCalendarAlt />  Manage Events</Link>
        <Link to="/admin/analytics" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaChartBar /> Analytics</Link>
        <button
          onClick={handleLogout}
          className="ml-4 flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-purple-100 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
