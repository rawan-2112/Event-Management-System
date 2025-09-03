import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList
} from "recharts";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";

const PIE_COLORS = ["#60A5FA", "#A78BFA", "#86EFAC"];
const BAR_COLORS = ["#60A5FA", "#A78BFA", "#86EFAC"];

export default function Analytics() {
  const [ageData, setAgeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { ageGroups, gender, locations } = res.data;

        setAgeData(Object.entries(ageGroups).map(([name, value]) => ({ name, value })));
        setGenderData(Object.entries(gender).map(([name, value]) => ({ name, value })));
        setLocationData(Object.entries(locations).map(([name, attendees]) => ({ name, attendees })));
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleDownloadCSV = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    try {
      const res = await axios.get("http://localhost:5000/api/analytics/download/csv", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download CSV error:", err);
      alert("Failed to download CSV. Check your token.");
    }
  };

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    try {
      const res = await axios.get("http://localhost:5000/api/analytics/download/pdf", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download PDF error:", err);
      alert("Failed to download PDF. Check your token.");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-poppins min-h-screen bg-purple-100">

      <div className="flex gap-4 mb-6 col-span-2">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-purple-200 text-purple-800 rounded-lg shadow hover:bg-purple-300 transition"
        >
          <FaFileCsv /> Download CSV
        </button>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-purple-200 text-purple-800 rounded-lg shadow hover:bg-purple-300 transition"
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Age Groups</h2>
        {ageData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {ageData.map((_, index) => (
                  <Cell key={`cell-age-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} attendees`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No age data available</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Gender</h2>
        {genderData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {genderData.map((_, index) => (
                  <Cell key={`cell-gender-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} attendees`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No gender data available</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg col-span-2">
        <h2 className="text-lg font-semibold mb-4">Top Locations</h2>
        {locationData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} attendees`} />
              <Legend />
              <Bar dataKey="attendees">
                {locationData.map((entry, index) => (
                  <Cell key={`cell-loc-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
                <LabelList dataKey="attendees" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No location data available</p>
        )}
      </div>
    </div>
  );
}
