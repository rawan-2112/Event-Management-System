import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";

// Navbars
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarUser from "./components/NavbarUser";
import NavbarGuest from "./components/NavbarGuest";

// Pages
import Home from "./components/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Events from "./pages/User/Events";
import MyTickets from "./pages/User/MyTickets";
import Notifications from "./pages/User/Notifications";
import EventDetailsUser from "./pages/User/EventDetailsUser";
import SeatSelection from "./components/SeatSelection";
import Payment from "./pages/User/Payment";
import Profile from "./pages/User/Profile"; 
// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import EventsDashboard from "./pages/Admin/EventsDashboard";
import AddEventForm from "./pages/Admin/AddEvent";
import EventDetails from "./pages/Admin/AdminEventDetails";
import ViewEvent from "./pages/Admin/ViewEvent";
import EditEvent from "./pages/Admin/EditEvent";
import Analytics from "./pages/Admin/Analytics";

import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const { role } = useAuth();

  return (
    <Router>
      {role === "admin" ? (
        <NavbarAdmin />
      ) : role === "user" ? (
        <NavbarUser />
      ) : (
        <NavbarGuest />
      )}

      <Routes>
        {/*  Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  User Routes */}
        <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
        <Route path="/events/:eventId" element={<PrivateRoute><EventDetailsUser /></PrivateRoute>} />
        <Route path="/events/book/:eventId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
        <Route path="/events/book/:eventId/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> 

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><EventsDashboard /></AdminRoute>} />
        <Route path="/admin/add-event" element={<AdminRoute><AddEventForm /></AdminRoute>} />
        <Route path="/admin/events/details/:id" element={<AdminRoute><EventDetails /></AdminRoute>} />
        <Route path="/admin/events/view/:id" element={<AdminRoute><ViewEvent /></AdminRoute>} />
        <Route path="/admin/events/edit/:id" element={<AdminRoute><EditEvent /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
