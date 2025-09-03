import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError(" All fields are required ⚠️");
      return;
    }
    if (password.length < 6) {
      setError(" Password must be at least 6 characters ⚠️");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role, 
      });

      const { token, user } = res.data;
      login(token, user);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/events");
      }
    } catch (err) {
      console.error(" Registration error ❌", err);
      setError(err.response?.data?.message || " Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl flex overflow-hidden w-full max-w-4xl">
        <div className="hidden md:block md:w-1/2">
          <img
            src="/login-banner.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Register;
