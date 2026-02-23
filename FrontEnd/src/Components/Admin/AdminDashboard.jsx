import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import {
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaBell,
  FaSpinner,
  FaPlus,
  FaChartBar,
  FaSignOutAlt
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-blue-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">JanaSewa Admin Portal</h1>
            <p className="text-blue-200 text-sm">Government Service Management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-200">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.total_users || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.total_applications || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaFileAlt className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Applications</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.pending_applications || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClipboardList className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Complaints</p>
                <p className="text-3xl font-bold text-red-600">{stats?.pending_complaints || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaBell className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/applications"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <FaFileAlt className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Applications</h3>
              <p className="text-gray-500 text-sm">Review and process citizen applications</p>
            </div>
          </Link>

          <Link
            to="/admin/services"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <FaPlus className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Services</h3>
              <p className="text-gray-500 text-sm">Add or edit government services</p>
            </div>
          </Link>

          <Link
            to="/admin/complaints"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-orange-100 p-4 rounded-full">
              <FaClipboardList className="text-2xl text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Complaints</h3>
              <p className="text-gray-500 text-sm">Respond to citizen complaints</p>
            </div>
          </Link>

          <Link
            to="/admin/notices"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-purple-100 p-4 rounded-full">
              <FaBell className="text-2xl text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Publish Notices</h3>
              <p className="text-gray-500 text-sm">Create and manage government notices</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-teal-100 p-4 rounded-full">
              <FaUsers className="text-2xl text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Users</h3>
              <p className="text-gray-500 text-sm">View and manage registered users</p>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-full">
              <FaChartBar className="text-2xl text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Analytics</h3>
              <p className="text-gray-500 text-sm">View detailed reports and statistics</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Services Available</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.total_services || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats?.approved_today || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Total Complaints</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.total_complaints || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Active Notices</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.total_notices || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
