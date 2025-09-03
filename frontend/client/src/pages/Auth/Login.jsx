import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rolePref = params.get("role");
    if (rolePref) {
      setMessage(`Login as ${rolePref} (use correct credentials)`);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !password) {
      setError(" Please enter email and password ⚠️");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(token, user);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/events");
      }
    } catch (err) {
      setError(" Login failed ❌: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl flex overflow-hidden w-full max-w-4xl">
        <div className="hidden md:block md:w-1/2">
          <img src="/login-banner.png" alt="Event" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-700 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
