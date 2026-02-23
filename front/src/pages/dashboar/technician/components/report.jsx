import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/report.css";

// Mock tasks
const mockTasks = [
  {
    id: 1,
    title: "Fix AC Unit",
    assignedTo: "tech123",
    reporter: "depStaff01",
    equipment: "AC Model X",
    priority: "high",
    status: "completed",
    description: "Cooling failure in lab 2",
    imageUrl: "/mock/ac_demo.jpg",
    voiceUrl: "/mock/voice_demo.mp3",
    dueDate: "2026-02-20",
    completedDate: "2026-02-21",
    history: [
      { status: "pending", updatedBy: "tech123", date: "2026-02-18" },
      { status: "in-progress", updatedBy: "tech123", date: "2026-02-19" },
      { status: "completed", updatedBy: "tech123", date: "2026-02-21" },
    ],
  },
  {
    id: 2,
    title: "Repair Network Switch",
    assignedTo: "tech123",
    reporter: "depStaff02",
    equipment: "Cisco Switch 2960",
    priority: "medium",
    status: "in-progress",
    description: "Port 4 not working",
    imageUrl: "/mock/switch_demo.jpg",
    voiceUrl: "",
    dueDate: "2026-02-28",
    completedDate: null,
    history: [
      { status: "pending", updatedBy: "tech123", date: "2026-02-20" },
      { status: "in-progress", updatedBy: "tech123", date: "2026-02-21" },
      { status: "completed", updatedBy: "tech123", date: "2026-02-21" },
    ],
  },

    {
    id: 3,
    title: "Repair Network Switch",
    assignedTo: "tech123",
    reporter: "depStaff02",
    equipment: "Cisco Switch 2960",
    priority: "medium",
    status: "pending",
    description: "Port 4 not working",
    imageUrl: "/mock/switch_demo.jpg",
    voiceUrl: "",
    dueDate: "2026-02-28",
    completedDate: null,
    history: [
      { status: "pending", updatedBy: "tech123", date: "2026-02-20" },
      { status: "in-progress", updatedBy: "tech123", date: "2026-02-21" },
      { status: "completed", updatedBy: "tech123", date: "2026-02-21" },
    ],
  },
];

const TechnicianReport = () => {
  const [tasks, setTasks] = useState([]);
  const [backendFailed, setBackendFailed] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Backend failed, using mock tasks:", error.message);
        setTasks(mockTasks);
        setBackendFailed(true);
      }
    };
    fetchTasks();
  }, []);

  const toggleHistory = (taskId) => {
    setExpandedHistory((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const groupedTasks = {
    pending: tasks.filter((t) => t.status === "pending"),
    inProgress: tasks.filter((t) => t.status === "in-progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return (
    <div className="container-fluid py-3">
      {backendFailed && (
        <div className="alert alert-warning">
          Backend failed, using mock data!
        </div>
      )}

      {/* ⚡ Equipment Report Section */}
      <div className="report-equipment-section mb-4 p-3 rounded shadow-sm bg-light">
        <h5>Report Equipment Issue</h5>
        <p className="small text-muted">
          Report equipment that requires replacement or immediate attention to
          the manager.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Mock: Equipment report submitted"); // replace with API later
            alert("Equipment report submitted!");
            e.target.reset();
          }}
        >
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Equipment Name / ID"
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Describe the issue"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary px-3 btn-sm">
            Submit Report
          </button>
        </form>
      </div>
      {/* 👇 reporting tables based on status */}
      {["pending", "inProgress", "completed"].map((statusKey) => (
        <div key={statusKey} className="mb-4">
          <h5 className="text-capitalize mb-2">
            {statusKey === "inProgress" ? "In-Progress" : statusKey} Tasks
          </h5>

          <div className="table-responsive">
            <table className="table report-table">
              <thead className="sticky-top bg-light">
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Technician</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>Media</th>
                  <th>History</th>
                </tr>
              </thead>
              <tbody>
                {groupedTasks[statusKey].map((task) => (
                  <tr
                    key={task.id}
                    className={`report-row ${
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "completed"
                        ? "overdue-row"
                        : ""
                    }`}
                  >
                    <td>{task.title}</td>
                    <td>
                      <span
                        className={`badge priority-${
                          task.priority === "high"
                            ? "high"
                            : task.priority === "medium"
                              ? "medium"
                              : "low"
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>{task.status}</td>
                    <td>{task.reporter}</td>
                    <td>{task.assignedTo}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>
                      {task.completedDate
                        ? new Date(task.completedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="media-cell">
                      {task.imageUrl && (
                        <img
                          src={task.imageUrl}
                          alt="task media"
                          className="media-thumb"
                        />
                      )}
                      {task.voiceUrl && (
                        <audio controls className="audio-thumb">
                          <source src={task.voiceUrl} />
                        </audio>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleHistory(task.id)}
                      >
                        {expandedHistory[task.id] ? "Hide" : "Show"} History
                      </button>
                      <div
                        className={`timeline-container ${
                          expandedHistory[task.id] ? "expanded" : ""
                        }`}
                      >
                        <ul className="timeline-list mt-1">
                          {task.history.map((h, idx) => (
                            <li key={idx}>
                              <strong>{h.status.toUpperCase()}</strong> by{" "}
                              {h.updatedBy} on{" "}
                              {new Date(h.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicianReport;
