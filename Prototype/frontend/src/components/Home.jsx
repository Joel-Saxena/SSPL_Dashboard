import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [login, setLogin] = useState({ employeeId: "", password: "" });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: login.employeeId,
          password: login.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role);
        console.log("Admin Group ID:", data.group_id);
        if (data.role === "administrator") {
          navigate(`/AdminDashboard?group_id=${data.group_id}`);
        } else if (data.role === "scientist") {
          // Scientist is not supposed to login.
          // navigate(`/scientist/${data.user.id}?group_id=${data.group_id}`);
          alert("A Scientist is not authorized.");
        } else {
          alert("Unknown role. Please contact admin.");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/Bgdrdo.jpeg")',
        minHeight: "100vh",
        minWidth: "100vw"
      }}
    >
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 text-center shadow-md">
        <div className="overflow-hidden whitespace-nowrap">
          <p className="animate-scroll text-3xl font-bold">
            Welcome to DRDO
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10 w-full h-full">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl w-full md:w-3/4 flex flex-col md:flex-row overflow-hidden">
          {/* Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Login</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={login.employeeId}
                  onChange={handleLoginChange}
                  placeholder="Enter Employee ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={login.password}
                  placeholder="Enter Password"
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Optional Welcome Section (Right) */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-blue-800 text-white p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Digital Scientist Portal</h3>
              <p className="text-sm text-blue-100">
                Secure access for DRDO administrators and scientists to manage records, data, and analytics.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-3 text-sm">
        &copy; {new Date().getFullYear()} DRDO. All rights reserved.
      </footer>

      {/* Custom Scroll Animation */}
      <style>
        {`
          .animate-scroll {
            display: inline-block;
            animation: scrollText 10s linear infinite;
          }

          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
