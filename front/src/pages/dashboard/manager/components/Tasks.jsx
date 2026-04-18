import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";

const Tasks = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [tasksRes, techRes] = await Promise.all([
          fetch("http://localhost:5000/api/tasks/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/manager/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const tasksData = await tasksRes.json();
        const techData = await techRes.json();

        if (tasksRes.ok) {
          setTasks(tasksData);
        } else {
          setError(tasksData.message || "Failed to fetch tasks");
        }

        if (techRes.ok) {
          const techList = techData.filter((u) => u.role === "technician");
          setTechnicians(techList);
        }
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOverrideTechnician = async () => {
    if (!selectedTask || !selectedTechnicianId) return;

    setUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${selectedTask._id}/assign-technician`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ technicianId: selectedTechnicianId }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTask._id ? data.task : t)),
        );
        setShowModal(false);
        setSelectedTask(null);
        setSelectedTechnicianId("");
        alert("Technician reassigned successfully");
      } else {
        alert(data.message || "Failed to reassign technician");
      }
    } catch (err) {
      alert("Error reassigning technician");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h4>Tasks Overview</h4>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Reported By</th>
              <th>Assigned Technician</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.equipment?.name || "N/A"}</td>
                <td>{task.reportedBy?.name || "N/A"}</td>
                <td>
                  {task.assignedTechnician?.name || "N/A"}
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={() => {
                      setSelectedTask(task);
                      setSelectedTechnicianId("");
                      setShowModal(true);
                    }}
                  >
                    Override
                  </button>
                </td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for overriding technician */}
      {showModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Override Technician</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-3">
                    <strong>Equipment:</strong>{" "}
                    {selectedTask?.equipment?.name || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>Current Technician:</strong>{" "}
                    {selectedTask?.assignedTechnician?.name || "None"}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="technicianSelect" className="form-label">
                      Select New Technician:
                    </label>
                    <select
                      id="technicianSelect"
                      className="form-select"
                      value={selectedTechnicianId}
                      onChange={(e) => setSelectedTechnicianId(e.target.value)}
                      disabled={updating}
                    >
                      <option value="">Choose a technician...</option>
                      {technicians.map((tech) => (
                        <option key={tech._id} value={tech._id}>
                          {tech.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {updating && (
                    <div className="text-center">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Updating...</span>
                      </div>
                      <span className="ms-2">Reassigning technician...</span>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedTask(null);
                      setSelectedTechnicianId("");
                    }}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOverrideTechnician}
                    disabled={!selectedTechnicianId || updating}
                  >
                    Assign Technician
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;
