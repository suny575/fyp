import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getStoredToken } from "../../../../utils/authStorage.js";

const normalizeTaskStatus = (status) => {
  const normalized = status?.trim();

  if (normalized === "in_progress") return "inProgress";

  return normalized;
};

const getScrollParent = (element) => {
  let current = element?.parentElement;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);

    if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

const Task = () => {
  const [taskList, setTaskList] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduledStatusSaving, setScheduledStatusSaving] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState(null);

  const location = useLocation();
  const waitingSectionRef = useRef(null);
  const inProgressSectionRef = useRef(null);
  const completedSectionRef = useRef(null);
  const scheduledSectionRef = useRef(null);

  const token = getStoredToken();
  const focusSection = location.state?.focusSection || null;

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

  const formatScheduledStatusLabel = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Scheduled";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED_OK":
        return "Completed OK";
      case "COMPLETED_WITH_ISSUES":
        return "Completed with Issues";
      case "NEEDS_REPAIR":
        return "Needs Repair";
      default:
        return status;
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
          axios.get("https://fyp-dle0.onrender.com/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://fyp-dle0.onrender.com/api/workOrder", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTaskList(
          Array.isArray(faultTasksRes.data) ? faultTasksRes.data : [],
        );
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

  useEffect(() => {
    setHighlightedSection(focusSection);
  }, [focusSection]);

  useEffect(() => {
    if (loading || selectedTask || !focusSection) return undefined;

    const targetSection =
      focusSection === "waiting"
        ? waitingSectionRef.current
        : focusSection === "inProgress"
          ? inProgressSectionRef.current
          : focusSection === "completed"
            ? completedSectionRef.current
            : focusSection === "scheduled"
              ? scheduledSectionRef.current
              : null;
    if (!targetSection) return undefined;

    const timeoutId = window.setTimeout(() => {
      const scrollParent = getScrollParent(targetSection);

      if (!scrollParent) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const targetTop =
        targetSection.getBoundingClientRect().top -
        scrollParent.getBoundingClientRect().top +
        scrollParent.scrollTop -
        16;

      scrollParent.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [
    focusSection,
    loading,
    selectedTask,
    taskList.length,
    scheduledTasks.length,
  ]);

  // Update task status
  const handleStatusUpdate = async (newStatus) => {
    // Prevent updating if task is already completed
    if (normalizeTaskStatus(selectedTask.status) === "completed") {
      alert("Completed tasks cannot be changed.");
      return;
    }

    // Ask for confirmation when marking as completed
    if (newStatus === "completed") {
      const confirmed = window.confirm(
        "Are you sure this task is completed? You cannot change it later.",
      );
      if (!confirmed) return;
    }

    try {
      await axios.put(
        `https://fyp-dle0.onrender.com/api/tasks/${selectedTask._id}/status`,
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
  const taskSections = [
    {
      key: "waiting",
      label: "Waiting",
      tasks: taskList.filter((t) => normalizeTaskStatus(t.status) === "waiting"),
    },
    {
      key: "inProgress",
      label: "In Progress",
      tasks: taskList.filter(
        (t) => normalizeTaskStatus(t.status) === "inProgress",
      ),
    },
    {
      key: "completed",
      label: "Completed",
      tasks: taskList.filter(
        (t) => normalizeTaskStatus(t.status) === "completed",
      ),
    },
  ];

  const getSectionHighlightColor = (sectionKey) => {
    switch (sectionKey) {
      case "waiting":
        return "#f59e0b";
      case "inProgress":
        return "#2563eb";
      case "completed":
        return "#16a34a";
      case "scheduled":
        return "#0ea5e9";
      default:
        return "#2563eb";
    }
  };

  const getSectionHighlightStyles = (sectionKey) => {
    const color = getSectionHighlightColor(sectionKey);

    return {
      "--td-highlight-color": color,
      "--td-highlight-bg": `${color}12`,
      "--td-highlight-border": `${color}66`,
      "--td-highlight-ring": `${color}22`,
    };
  };

  const handleScheduledStatusUpdate = async (newStatus) => {
    if (!selectedTask || selectedTask.__source !== "scheduled") return;

    const currentStatus = selectedTask.status;

    const terminalStatuses = [
      "COMPLETED_OK",
      "COMPLETED_WITH_ISSUES",
      "NEEDS_REPAIR",
    ];
    if (terminalStatuses.includes(currentStatus)) {
      alert("Completed scheduled tasks cannot be changed.");
      return;
    }

    if (terminalStatuses.includes(newStatus)) {
      const confirmed = window.confirm(
        "Are you sure this scheduled task is completed? You cannot change it later.",
      );
      if (!confirmed) return;
    }

    setScheduledStatusSaving(true);
    try {
      await axios.put(
        `https://fyp-dle0.onrender.com/api/workOrder/status/${selectedTask._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setScheduledTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? { ...task, status: newStatus } : task,
        ),
      );
      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
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

  const handleScheduledStatusUpdateForTable = async (taskId, newStatus) => {
    const terminalStatuses = [
      "COMPLETED_OK",
      "COMPLETED_WITH_ISSUES",
      "NEEDS_REPAIR",
    ];
    const task = scheduledTasks.find((t) => t._id === taskId);
    if (!task) return;

    if (terminalStatuses.includes(task.status)) {
      alert("Completed scheduled tasks cannot be changed.");
      return;
    }

    try {
      await axios.put(
        `https://fyp-dle0.onrender.com/api/workOrder/status/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setScheduledTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
      );
    } catch (error) {
      console.error(
        "Scheduled task status update failed:",
        error.response?.data?.message || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Failed to update scheduled task status.",
      );
    }
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
              {selectedTask.equipment?.name ||
                selectedTask.name ||
                "Scheduled Task"}
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
                <p>Source: Scheduled Maintenance</p>
                <div className="my-3">
                  <select
                    className="form-select mb-2"
                    value={selectedTask.status}
                    disabled={
                      [
                        "COMPLETED_OK",
                        "COMPLETED_WITH_ISSUES",
                        "NEEDS_REPAIR",
                      ].includes(selectedTask.status) || scheduledStatusSaving
                    }
                    onChange={(e) =>
                      handleScheduledStatusUpdate(e.target.value)
                    }
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED_OK">Completed OK</option>
                    <option value="COMPLETED_WITH_ISSUES">
                      Completed with Issues
                    </option>
                    <option value="NEEDS_REPAIR">Needs Repair</option>
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
                  disabled={
                    normalizeTaskStatus(selectedTask.status) === "completed"
                  }
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
      {taskSections.map((section) => (
        <div
          key={section.key}
          ref={
            section.key === "waiting"
              ? waitingSectionRef
              : section.key === "inProgress"
                ? inProgressSectionRef
                : completedSectionRef
          }
          className={`mb-4 td-focus-section ${
            highlightedSection === section.key ? "is-highlighted" : ""
          }`}
          style={getSectionHighlightStyles(section.key)}
        >
          <h5 className="mb-2">{section.label}</h5>
          {section.tasks.length === 0 ? (
            <div className="card p-2 mb-2 text-center small">
              <small>No tasks in this status.</small>
            </div>
          ) : (
            <>
              {/* Small screen cards */}
              <div className="row g-2 d-md-none">
                {section.tasks.map((task) => (
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
                    {section.tasks.map((task) => {
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

      <div
        ref={scheduledSectionRef}
        className={`mb-4 td-focus-section ${
          highlightedSection === "scheduled" ? "is-highlighted" : ""
        }`}
        style={getSectionHighlightStyles("scheduled")}
      >
        <h4 className="mb-3">Scheduled Tasks</h4>
        {scheduledTasks.length === 0 ? (
          <div className="card p-2 mb-2 text-center small">
            <small>No scheduled tasks.</small>
          </div>
        ) : (
          <>
            <div className="row g-2 d-md-none">
              {scheduledTasks.map((task) => (
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
                  {scheduledTasks.map((task) => (
                    <tr
                      key={task._id}
                      onClick={() =>
                        setSelectedTask({ ...task, __source: "scheduled" })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{task.equipment?.name || "Scheduled Task"}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="form-select form-select-sm"
                          value={task.status}
                          disabled={[
                            "COMPLETED_OK",
                            "COMPLETED_WITH_ISSUES",
                            "NEEDS_REPAIR",
                          ].includes(task.status)}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            const confirmed = [
                              "COMPLETED_OK",
                              "COMPLETED_WITH_ISSUES",
                              "NEEDS_REPAIR",
                            ].includes(newStatus)
                              ? window.confirm(
                                  "Are you sure this scheduled task is completed? You cannot change it later.",
                                )
                              : true;
                            if (confirmed) {
                              handleScheduledStatusUpdateForTable(
                                task._id,
                                newStatus,
                              );
                            }
                          }}
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED_OK">Completed OK</option>
                          <option value="COMPLETED_WITH_ISSUES">
                            Completed with Issues
                          </option>
                          <option value="NEEDS_REPAIR">Needs Repair</option>
                        </select>
                      </td>
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
    </div>
  );
};

export default Task;

