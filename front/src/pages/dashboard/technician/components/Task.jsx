import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskList(res.data);
      } catch (error) {
        console.error("Backend fetch failed:", error.message);
        setTaskList([]);
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
    waiting: taskList.filter((t) => t.status === "waiting"),
    in_progress: taskList.filter((t) => t.status === "inProgress"),
    completed: taskList.filter((t) => t.status === "completed"),
  };

  // Render full task details
  if (selectedTask) {
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
              {selectedTask.equipment?.name || selectedTask.name}
            </h5>
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

            {selectedTask.media?.images?.length > 0 && (
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

            {selectedTask.media?.voiceNote && (
              <audio
                controls
                src={selectedTask.media.voiceNote} // backend path is fixed
                className="mt-2"
              />
            )}

            {!selectedTask.media?.images?.length &&
              !selectedTask.media?.voiceNote && (
                <small className="text-muted">No media available</small>
              )}

            <p>Status: {selectedTask.status}</p>

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
          </div>
        </div>
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
                          className={`badge bg-${
                            task.status === "waiting"
                              ? "warning text-dark"
                              : task.status === "in_progress"
                                ? "primary"
                                : "success"
                          }`}
                        >
                          {task.status.replace("_", " ")}
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
                      console.log("TASK OBJECT:", task);
                      console.log("EQUIPMENT:", task.equipment);

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
                          <td>{task.status.replace("_", " ")}</td>
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
    </div>
  );
};

export default Task;
