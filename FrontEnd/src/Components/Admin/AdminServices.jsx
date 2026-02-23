import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { servicesAPI, adminAPI } from "../../services/api";
import {
  FaSpinner,
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes
} from "react-icons/fa";

export default function AdminServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    required_documents: "",
    office_type: "",
    fee: "",
    estimated_days: ""
  });

  const officeTypes = [
    "District Administration Office",
    "Land Revenue Office",
    "Municipality Office",
    "Transport Management Office",
    "Passport Office",
    "Ward Office"
  ];

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      title: "",
      description: "",
      required_documents: "",
      office_type: "",
      fee: "",
      estimated_days: ""
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description || "",
      required_documents: service.required_documents?.join(", ") || "",
      office_type: service.office_type || "",
      fee: service.fee?.toString() || "",
      estimated_days: service.estimated_days?.toString() || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        required_documents: form.required_documents
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        office_type: form.office_type,
        fee: form.fee ? parseFloat(form.fee) : null,
        estimated_days: form.estimated_days ? parseInt(form.estimated_days) : null
      };

      if (editingService) {
        await adminAPI.updateService(editingService.id, payload);
      } else {
        await adminAPI.createService(payload);
      }

      await fetchServices();
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await adminAPI.deleteService(serviceId);
      await fetchServices();
    } catch (err) {
      setError(err.message || "Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft /> Back to Dashboard
            </Link>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus /> Add Service
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Services</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">No services found. Add your first service!</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{service.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium">Office:</span> {service.office_type || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Fee:</span> Rs.{" "}
                    {service.fee || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Est. Days:</span>{" "}
                    {service.estimated_days || "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Required Documents (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.required_documents}
                      onChange={(e) =>
                        setForm({ ...form, required_documents: e.target.value })
                      }
                      placeholder="e.g., Citizenship, Photo, Birth Certificate"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Office Type
                    </label>
                    <select
                      value={form.office_type}
                      onChange={(e) => setForm({ ...form, office_type: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select Office</option>
                      {officeTypes.map((office) => (
                        <option key={office} value={office}>
                          {office}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Fee (Rs.)
                      </label>
                      <input
                        type="number"
                        value={form.fee}
                        onChange={(e) => setForm({ ...form, fee: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Est. Days
                      </label>
                      <input
                        type="number"
                        value={form.estimated_days}
                        onChange={(e) =>
                          setForm({ ...form, estimated_days: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin" /> Saving...
                        </span>
                      ) : editingService ? (
                        "Update Service"
                      ) : (
                        "Create Service"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
