import React, { useState, useEffect } from "react";
import axios from "axios";
import { getStoredToken } from "../../../../utils/authStorage.js";

const normalizeTaskStatus = (status) => {
  const normalized = status?.trim();

  if (normalized === "in_progress") return "inProgress";

  return normalized;
};

const Task = () => {
  const [taskList, setTaskList] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduledStatusSaving, setScheduledStatusSaving] = useState(false);

  const token = getStoredToken();

  const formatStatusLabel = (status) => {
    switch (normalizeTaskStatus(status)) {
      case "inProgress":
        return "In Progress";
      case "waiting":
        return "Waiting";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const normalizeWorkOrderStatus = (status) => {
    const normalized = (status || "").toString().trim();
    if (normalized === "inProgress") return "in_progress";
    return normalized;
  };

  const mapWorkOrderStatusToTechnicianStatus = (status) => {
    switch (normalizeWorkOrderStatus(status)) {
      case "pending":
      case "assigned":
        return "waiting";
      case "in_progress":
        return "inProgress";
      case "completed":
        return "completed";
      default:
        return "waiting";
    }
  };

  const mapTechnicianStatusToWorkOrderStatus = (status) => {
    switch (status) {
      case "waiting":
        return "assigned";
      case "inProgress":
        return "in_progress";
      case "completed":
        return "completed";
      default:
        return "assigned";
    }
  };

  const formatScheduledStatusLabel = (status) => {
    switch (mapWorkOrderStatusToTechnicianStatus(status)) {
      case "waiting":
        return "Waiting";
      case "inProgress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Waiting";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (normalizeTaskStatus(status)) {
      case "waiting":
        return "warning text-dark";
      case "inProgress":
        return "primary";
      case "completed":
        return "success";
      default:
        return "secondary";
    }
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const [faultTasksRes, scheduledTasksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/workOrder", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTaskList(Array.isArray(faultTasksRes.data) ? faultTasksRes.data : []);
        setScheduledTasks(
          Array.isArray(scheduledTasksRes.data) ? scheduledTasksRes.data : [],
        );
      } catch (error) {
        console.error("Backend fetch failed:", error.message);
        setTaskList([]);
        setScheduledTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  // Update task status
  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${selectedTask._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTaskList((prev) =>
        prev.map((t) =>
          t._id === selectedTask._id ? { ...t, status: newStatus } : t,
        ),
      );
      setSelectedTask({ ...selectedTask, status: newStatus });
    } catch (error) {
      console.error(
        "Status update failed:",
        error.response?.data?.message || error.message,
      );
      alert("Failed to update status");
    }
  };

  // Group tasks by status
  const tasksByStatus = {
    waiting: taskList.filter(
      (t) => normalizeTaskStatus(t.status) === "waiting",
    ),
    in_progress: taskList.filter(
      (t) => normalizeTaskStatus(t.status) === "inProgress",
    ),
    completed: taskList.filter(
      (t) => normalizeTaskStatus(t.status) === "completed",
    ),
  };

  const handleScheduledStatusUpdate = async (newStatus) => {
    if (!selectedTask || selectedTask.__source !== "scheduled") return;

    const currentStatus = mapWorkOrderStatusToTechnicianStatus(
      selectedTask.status,
    );

    if (currentStatus === "completed") {
      alert("Completed scheduled tasks cannot be changed.");
      return;
    }

    if (newStatus === "completed") {
      const confirmed = window.confirm(
        "Are you sure this scheduled task is completed? You cannot change it later.",
      );
      if (!confirmed) return;
    }

    setScheduledStatusSaving(true);
    try {
      const mappedStatus = mapTechnicianStatusToWorkOrderStatus(newStatus);
      await axios.put(
        `http://localhost:5000/api/workOrder/status/${selectedTask._id}`,
        { status: mappedStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setScheduledTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? { ...task, status: mappedStatus } : task,
        ),
      );
      setSelectedTask((prev) => ({ ...prev, status: mappedStatus }));
      alert("Scheduled task status updated.");
    } catch (error) {
      console.error(
        "Scheduled task status update failed:",
        error.response?.data?.message || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Failed to update scheduled task status.",
      );
    } finally {
      setScheduledStatusSaving(false);
    }
  };

  const scheduledTasksByStatus = {
    waiting: scheduledTasks.filter(
      (task) =>
        mapWorkOrderStatusToTechnicianStatus(task.status) === "waiting",
    ),
    in_progress: scheduledTasks.filter(
      (task) =>
        mapWorkOrderStatusToTechnicianStatus(task.status) === "inProgress",
    ),
    completed: scheduledTasks.filter(
      (task) =>
        mapWorkOrderStatusToTechnicianStatus(task.status) === "completed",
    ),
  };

  // Render full task details
  if (selectedTask) {
    const isScheduledTask = selectedTask.__source === "scheduled";
    return (
      <div>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setSelectedTask(null)}
        >
          ← Back to Tasks
        </button>
        <div className="card td-card shadow-sm p-3">
          <div className="card-body">
            <h5 className="fw-bold">
              {selectedTask.equipment?.name || selectedTask.name || "Scheduled Task"}
            </h5>
            {isScheduledTask ? (
              <>
                <p>
                  Scheduled Date:{" "}
                  {selectedTask.scheduledDate
                    ? new Date(selectedTask.scheduledDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  Status:{" "}
                  <span className="badge bg-primary">
                    {formatScheduledStatusLabel(selectedTask.status)}
                  </span>
                </p>
                <p>
                  Source: Scheduled Maintenance
                </p>
                <div className="my-3">
                  <select
                    className="form-select mb-2"
                    value={mapWorkOrderStatusToTechnicianStatus(
                      selectedTask.status,
                    )}
                    disabled={
                      mapWorkOrderStatusToTechnicianStatus(selectedTask.status) ===
                        "completed" || scheduledStatusSaving
                    }
                    onChange={(e) => handleScheduledStatusUpdate(e.target.value)}
                  >
                    <option value="waiting">Waiting</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {scheduledStatusSaving ? (
                    <small className="text-muted">Updating status...</small>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <p>
                  Priority:{" "}
                  <span
                    className={`badge bg-${
                      selectedTask.priority === "high"
                        ? "danger"
                        : selectedTask.priority === "medium"
                          ? "warning"
                          : "success"
                    }`}
                  >
                    {selectedTask.priority.toUpperCase()}
                  </span>
                </p>
                <p>{selectedTask.description}</p>
              </>
            )}

            {!isScheduledTask && selectedTask.media?.images?.length > 0 && (
              <div className="mt-2">
                {selectedTask.media.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  />
                ))}
              </div>
            )}

            {!isScheduledTask && selectedTask.media?.voiceNote && (
              <audio
                controls
                src={selectedTask.media.voiceNote} // backend path is fixed
                className="mt-2"
              />
            )}

            {!isScheduledTask &&
              !selectedTask.media?.images?.length &&
              !selectedTask.media?.voiceNote && (
                <small className="text-muted">No media available</small>
              )}

            {!isScheduledTask && <p>Status: {selectedTask.status}</p>}

            {!isScheduledTask && (
              <div className="my-3">
                <select
                  className="form-select mb-2"
                  value={selectedTask.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="waiting">Waiting</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="td-page-loading">
        <div className="td-dotted-loader" />
        <p className="td-loading-text">Loading tasks...</p>
      </div>
    );
  }

  // Render task overview
  return (
    <div className="container">
      {Object.keys(tasksByStatus).map((status) => (
        <div key={status} className="mb-4">
          <h5 className="mb-2 text-capitalize">{status.replace("_", " ")}</h5>
          {tasksByStatus[status].length === 0 ? (
            <div className="card p-2 mb-2 text-center small">
              <small>No tasks in this status.</small>
            </div>
          ) : (
            <>
              {/* Small screen cards */}
              <div className="row g-2 d-md-none">
                {tasksByStatus[status].map((task) => (
                  <div key={task._id} className="col-12">
                    <div
                      className="card p-2 td-card shadow-sm"
                      style={{ cursor: "pointer", fontSize: "0.9rem" }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                          {task.equipment?.name || task.name}
                        </span>
                        <span
                          className={`badge bg-${getStatusBadgeClass(task.status)}`}
                        >
                          {formatStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Large screen table */}
              <div className="d-none d-md-block table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasksByStatus[status].map((task) => {
                      return (
                        <tr
                          key={task._id}
                          onClick={() => setSelectedTask(task)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {task.equipment?.name || "NO EQUIPMENT FOUND"}
                          </td>
                          <td>{task.priority}</td>
                          <td>{formatStatusLabel(task.status)}</td>
                          <td>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="mb-4">
        <h4 className="mb-3">Scheduled Tasks</h4>
        {Object.keys(scheduledTasksByStatus).map((status) => (
          <div key={status} className="mb-3">
            <h6 className="mb-2 text-capitalize">{status.replace("_", " ")}</h6>
            {scheduledTasksByStatus[status].length === 0 ? (
              <div className="card p-2 mb-2 text-center small">
                <small>No scheduled tasks in this status.</small>
              </div>
            ) : (
              <>
                <div className="row g-2 d-md-none">
                  {scheduledTasksByStatus[status].map((task) => (
                    <div key={task._id} className="col-12">
                      <div
                        className="card p-2 td-card shadow-sm"
                        style={{ cursor: "pointer", fontSize: "0.9rem" }}
                        onClick={() =>
                          setSelectedTask({ ...task, __source: "scheduled" })
                        }
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">
                            {task.equipment?.name || "Scheduled Task"}
                          </span>
                          <span className="badge bg-info text-dark">
                            {formatScheduledStatusLabel(task.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-none d-md-block table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Equipment</th>
                        <th>Status</th>
                        <th>Scheduled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledTasksByStatus[status].map((task) => (
                        <tr
                          key={task._id}
                          onClick={() =>
                            setSelectedTask({ ...task, __source: "scheduled" })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{task.equipment?.name || "Scheduled Task"}</td>
                          <td>{formatScheduledStatusLabel(task.status)}</td>
                          <td>
                            {task.scheduledDate
                              ? new Date(task.scheduledDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
