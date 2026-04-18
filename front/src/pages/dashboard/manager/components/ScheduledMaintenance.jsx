import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import SetSchedule from "./SetSchedule";
import "../styles/sm.css";

const ScheduledMaintenance = () => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [assigningScheduleId, setAssigningScheduleId] = useState(null);

  useEffect(() => {
    fetchSchedules();
    fetchEquipments();
    fetchTechnicians();

    const interval = setInterval(() => {
      fetchSchedules();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/schedules/upcoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await res.json();
      setSchedules(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch equipments");
      }
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      console.error("Failed to fetch equipments:", err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/manager/users?role=technician",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch technicians");
      }
      const data = await res.json();
      const normalizedTechnicians = (Array.isArray(data) ? data : [])
        .map((technician) => ({
          ...technician,
          _id: technician._id || technician.id || "",
        }))
        .filter(
          (technician) =>
            technician._id &&
            technician.status === "active" &&
            technician.role === "technician",
        );
      setTechnicians(normalizedTechnicians);
    } catch (err) {
      console.error("Failed to fetch technicians", err);
    }
  };

  const assignTechnician = async (scheduleId, techId) => {
    if (!techId) return;
    setAssigningScheduleId(scheduleId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/schedules/${scheduleId}/assign-technician`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ technicianId: techId }),
        },
      );

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.message || "Failed to assign technician");
      }

      alert("Technician assigned!");
      setEditingScheduleId(null);
      await fetchSchedules();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to assign technician");
    } finally {
      setAssigningScheduleId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-pending";
      case "assigned":
        return "badge-assigned";
      case "in_progress":
      case "inProgress":
        return "badge-in-progress";
      case "completed":
        return "badge-completed";
      default:
        return "badge-pending";
    }
  };

  const formatStatusLabel = (status) => {
    if (!status) return "Pending";

    switch (status) {
      case "in_progress":
        return "In Progress";
      case "inProgress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredSchedules = schedules.filter(
    (sch) => !selectedEquipment || sch.equipment?._id === selectedEquipment,
  );

  const getScheduleTechnicianId = (schedule) => {
    if (!schedule?.technician) return "";
    if (typeof schedule.technician === "string") return schedule.technician;
    return schedule.technician?._id || schedule.technician?.id || "";
  };

  const getScheduleTechnicianName = (schedule) => {
    if (
      schedule?.technician &&
      typeof schedule.technician === "object" &&
      schedule.technician.name
    ) {
      return schedule.technician.name;
    }

    const technicianId = getScheduleTechnicianId(schedule);
    if (!technicianId) return "";

    const technician = technicians.find((t) => t._id === technicianId);
    return technician?.name || "Assigned Technician";
  };

  if (loading) return <p className="text-center mt-10">Loading schedules...</p>;

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4 dashboard-title">
        Scheduled Maintenance
      </h1>

      {/* Set Maintenance Schedule Form */}
      <SetSchedule onScheduleCreated={fetchSchedules} equipments={equipments} />

      {/* Equipment Filter */}
      <div className="mb-4 d-flex align-items-center flex-wrap gap-2">
        <label className="fw-bold me-2">Filter by Equipment:</label>
        <select
          className="form-select w-auto"
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
        >
          <option value="">All Equipments</option>
          {equipments.map((eq) => (
            <option key={eq._id} value={eq._id}>
              {eq.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table for large screens */}
      <div className="d-none d-md-block overflow-auto">
        <table className="table table-striped table-hover table-bordered bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Equipment</th>
              <th>Next Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.equipment?.name || "Unknown equipment"}</td>
                  <td>
                    {new Date(
                      schedule.nextMaintenanceDate,
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusColor(schedule.status)}`}
                    >
                      {formatStatusLabel(schedule.status)}
                    </span>
                  </td>
                  <td>
                    {getScheduleTechnicianId(schedule) &&
                    editingScheduleId !== schedule._id ? (
                      <button
                        type="button"
                        className="btn btn-link p-0 assigned-technician-link"
                        onClick={() => setEditingScheduleId(schedule._id)}
                        disabled={assigningScheduleId === schedule._id}
                      >
                        {getScheduleTechnicianName(schedule)}
                      </button>
                    ) : (
                      <div className="d-flex align-items-center gap-2">
                        <select
                          className="form-select form-select-sm"
                          value={getScheduleTechnicianId(schedule)}
                          onChange={(e) =>
                            assignTechnician(schedule._id, e.target.value)
                          }
                          disabled={assigningScheduleId === schedule._id}
                        >
                          <option value="" disabled>
                            {assigningScheduleId === schedule._id
                              ? "Saving..."
                              : "Assign Technician"}
                          </option>
                          {technicians.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                        {editingScheduleId === schedule._id && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setEditingScheduleId(null)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="d-md-none row row-cols-1 g-3">
        {filteredSchedules.map((schedule) => (
            <div key={schedule._id} className="col">
              <div className="card card-shadow">
                <div className="card-body">
                  <h5 className="card-title">
                    {schedule.equipment?.name || "Unknown equipment"}
                  </h5>
                  <p className="card-text">
                    Next:{" "}
                    {new Date(
                      schedule.nextMaintenanceDate,
                    ).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    Status:{" "}
                    <span
                      className={`badge ${getStatusColor(schedule.status)}`}
                    >
                      {formatStatusLabel(schedule.status)}
                    </span>
                  </p>
                  {getScheduleTechnicianId(schedule) &&
                  editingScheduleId !== schedule._id ? (
                    <button
                      type="button"
                      className="btn btn-link p-0 assigned-technician-link"
                      onClick={() => setEditingScheduleId(schedule._id)}
                      disabled={assigningScheduleId === schedule._id}
                    >
                      {getScheduleTechnicianName(schedule)}
                    </button>
                  ) : (
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <select
                        className="form-select form-select-sm"
                        value={getScheduleTechnicianId(schedule)}
                        onChange={(e) =>
                          assignTechnician(schedule._id, e.target.value)
                        }
                        disabled={assigningScheduleId === schedule._id}
                      >
                        <option value="" disabled>
                          {assigningScheduleId === schedule._id
                            ? "Saving..."
                            : "Assign Technician"}
                        </option>
                        {technicians.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      {editingScheduleId === schedule._id && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setEditingScheduleId(null)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMaintenance;
