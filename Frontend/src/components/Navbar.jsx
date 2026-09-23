import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 fixed w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-emerald-600 tracking-tight">
          SmartLibrary
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link className="hover:text-emerald-600 transition-colors" to="/">
            Home
          </Link>
          <Link className="hover:text-emerald-600 transition-colors" to={user ? "/books" : "/register"}>
            Books
          </Link>
          <Link className="hover:text-emerald-600 transition-colors" to="/student/dashboard">
            Dashboard
          </Link>
          <a className="hover:text-emerald-600 transition-colors cursor-pointer" href="#footer">
            About
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/register"
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            Register
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all"
          >
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 space-y-3">
          <Link to="/" className="block">
            Home
          </Link>
          <Link to={user ? "/books" : "/register"} className="block">
            Books
          </Link>
          <Link to="/student/dashboard" className="block">
            Dashboard
          </Link>
          <a href="#footer" className="block" onClick={() => setOpen(false)}>
            About
          </a>

          <div className="flex gap-3 pt-2">
            <Link to="/login" className="border px-4 py-2 rounded-lg">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
