import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/index";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { checkAdmin, admin } = useAdminAuth();

  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginAdmin(form);

      if (response.success) {
        if (response.token) {
          localStorage.setItem("adminToken", response.token);
        }
        await checkAdmin();
      } else {
        setError(response.message || "Failed to login");
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-emerald-900 flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gray-900 text-white border-r border-gray-800">
          <h2 className="text-5xl font-bold mb-3">Admin Portal</h2>
          <p className="text-gray-300 font-medium">
            Manage the entire library system.
          </p>

          <ul className="mt-6 space-y-2 text-xl font-medium">
            <li> Manage Books</li>
            <li> Manage Students</li>
            <li> Library Reports</li>
            <li> Fine Management</li>
          </ul>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-1 text-gray-800">Admin Login</h3>

          <p className="text-gray-500 mb-6 text-sm">
            Login to access admin dashboard
          </p>

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Admin Email"
              className="input"
              onChange={handleChange}
              value={form.email}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              onChange={handleChange}
              value={form.password}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <button
            onClick={async () => {
              try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/register?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`);
                const data = await res.json();
                alert(data.message || "Admin initialized successfully!");
              } catch (e) {
                alert("Failed to initialize admin: " + e.message);
              }
            }}
            className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition-all duration-300"
          >
            Initialize Admin Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
