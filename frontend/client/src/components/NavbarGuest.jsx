import { Link } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";

function NavbarGuest() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white px-6 py-3 flex justify-between items-center shadow-lg font-[Century_Schoolbook]">
      <h1 className="text-2xl font-bold tracking-wide">Event Studio</h1>
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaHome /> Home</Link>
        <Link to="/login" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaSignInAlt /> Login</Link>
        <Link to="/register" className="flex items-center gap-1 hover:text-yellow-200 transition-colors"><FaUserPlus /> Register</Link>
      </div>
    </nav>
  );
}

export default NavbarGuest;
