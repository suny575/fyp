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

  useEffect(() => {
    fetchSchedules();
    fetchEquipments();
    fetchTechnicians();
  }, [token]);

  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/schedules/upcoming", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const data = await res.json();
      setTechnicians(data);
    } catch (err) {
      console.error("Failed to fetch technicians", err);
    }
  };

  const assignTechnician = async (scheduleId, techId) => {
    if (!techId) return;
    try {
      await fetch(
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
      alert("Technician assigned!");
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Failed to assign technician");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "badge-upcoming";
      case "paused":
        return "badge-paused";
      case "completed":
        return "badge-completed";
      default:
        return "badge-upcoming";
    }
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
              <th>Maintenance Type</th>
              <th>Next Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules
              .filter(
                (sch) =>
                  !selectedEquipment || sch.equipment._id === selectedEquipment,
              )
              .map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.equipment.name}</td>
                  <td>{schedule.maintenanceType}</td>
                  <td>
                    {new Date(
                      schedule.nextMaintenanceDate,
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusColor(schedule.status)}`}
                    >
                      {schedule.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        assignTechnician(schedule._id, e.target.value)
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Assign Technician
                      </option>
                      {technicians.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="d-md-none row row-cols-1 g-3">
        {schedules
          .filter(
            (sch) =>
              !selectedEquipment || sch.equipment._id === selectedEquipment,
          )
          .map((schedule) => (
            <div key={schedule._id} className="col">
              <div className="card card-shadow">
                <div className="card-body">
                  <h5 className="card-title">{schedule.equipment.name}</h5>
                  <p className="card-text">
                    {schedule.maintenanceType} maintenance
                  </p>
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
                      {schedule.status}
                    </span>
                  </p>
                  <select
                    className="form-select form-select-sm mt-2"
                    onChange={(e) =>
                      assignTechnician(schedule._id, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Assign Technician
                    </option>
                    {technicians.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScheduledMaintenance;
