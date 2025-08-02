import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFENCORE_LOGO_URL = "/DrdoLogo.png"; // Use your actual logo path

const Home = () => {
  const [login, setLogin] = useState({ employeeId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: login.employeeId,
          password: login.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("emp_id", data.emp_id);
        if (data.group_id) localStorage.setItem("group_id", data.group_id);
        if (data.role === "admin") {
          navigate("/AdminDashboard");
        } else if (data.role === "super_admin") {
          navigate("/SupervisorDashboard");
        } else {
          setErrorMsg("Unauthorized role. Access denied.");
        }
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col bg-[#e7ecf3]">
      {/* Header */}
      <header className="bg-[#1b2940] text-white shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto py-3 px-3">
          <div className="flex items-center space-x-3">
            <img src={DEFENCORE_LOGO_URL}
                 alt="DEFENCORE Logo"
                 className="h-12 w-12 rounded-full border border-blue-100 shadow"
            />
            <span className="font-extrabold tracking-widest text-xl lg:text-2xl uppercase"
                  style={{ letterSpacing: "2.5px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
            >
              DefenCore
            </span>
          </div>
          <div className="hidden sm:block font-semibold text-sm tracking-wide text-slate-200">
            Ministry of Defence, Govt. of India
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-[#0a58aa] via-[#1464c8] to-[#00a3db]" />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-12 px-3">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-[#c5d4e9] flex flex-col md:flex-row overflow-hidden">
          {/* Login Card */}
          <section className="w-full md:w-1/2 px-8 py-10 flex flex-col justify-center">
            <h2 className="text-blue-900 text-2xl font-bold mb-2 text-center" style={{ fontFamily: "inherit" }}>
              <span className="border-b-2 border-blue-800 pb-0.5">DefenCore Login</span>
            </h2>
            <p className="mb-6 text-center text-gray-500 text-sm font-medium">
              Authorized Access Only
            </p>
            <form onSubmit={handleLoginSubmit} className="space-y-6" aria-label="Login form">
              <div>
                <label htmlFor="employeeId" className="block text-base font-semibold text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  autoComplete="username"
                  maxLength={30}
                  value={login.employeeId}
                  onChange={handleLoginChange}
                  placeholder="e.g., 123456"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-400 text-gray-900 bg-gray-50 shadow-sm transition"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  maxLength={30}
                  value={login.password}
                  onChange={handleLoginChange}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-400 text-gray-900 bg-gray-50 shadow-sm transition"
                  required
                  aria-required="true"
                />
              </div>
              {errorMsg &&
                <div className="bg-red-50 border border-red-200 text-red-800 rounded px-3 py-2 text-sm font-medium" role="alert">
                  {errorMsg}
                </div>
              }
              <button
                type="submit"
                className="w-full bg-[#1b2940] text-white py-2.5 rounded font-semibold hover:bg-blue-900 transition tracking-wide shadow-sm flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && (
                  <svg aria-hidden="true" className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3l4-4-4-4v3c-5.523 0-10 4.477-10 10h3z"
                    />
                  </svg>
                )}
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </section>
          {/* Right Info Panel */}
          <aside className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-tr from-[#1b2940]  to-[#2550A6] text-white p-6">
            <img src={DEFENCORE_LOGO_URL} alt="DEFENCORE Logo" className="mb-4 h-16 w-16 rounded-full shadow border border-blue-200 bg-white p-1" />
            <h3 className="font-bold text-lg text-center mb-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              Digital Scientist Portal
            </h3>
            <div className="w-9 h-0.5 rounded-full bg-blue-300 mb-2"></div>
            <p className="text-xs text-blue-50 text-center leading-snug">
              Ministry of Defence, Government of India <br />
              <span className="font-medium text-gray-100">Empowering scientists and administrators</span>
            </p>
          </aside>
        </div>
      </main>
<p style={{ fontSize: '20px', color: 'black' }}><b>NOTE: Use credentials provided in resume to log in as Supervisor or Admin.</b></p>
      {/* Footer */}
      <footer className="bg-[#1b2940] text-white text-center py-2 border-t border-blue-900 text-xs">
        &copy; {new Date().getFullYear()} DefenCore, India. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
