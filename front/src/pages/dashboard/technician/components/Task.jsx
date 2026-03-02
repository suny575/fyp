import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionImage, setCompletionImage] = useState(null);

  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const TECH_ID = loggedInUser?._id;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
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
    pending: taskList.filter((t) => t.status === "pending"),
    in_progress: taskList.filter((t) => t.status === "in_progress"),
    completed: taskList.filter((t) => t.status === "completed"),
  };

  // Render single task detail
  if (selectedTask) {
    return (
      <div>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setSelectedTask(null)}
        >
          ← Back to Tasks
        </button>
        <div className="card td-card">
          <div className="card-body">
            <h4>{selectedTask.title}</h4>
            <p>{selectedTask.description}</p>
            <p>
              Priority:{" "}
              <span
                className={`badge bg-${selectedTask.priority === "high" ? "danger" : selectedTask.priority === "medium" ? "warning" : "success"}`}
              >
                {selectedTask.priority.toUpperCase()}
              </span>
            </p>
            <p>Status: {selectedTask.status}</p>

            <div className="my-3">
              <select
                className="form-select mb-2"
                value={selectedTask.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                <option value="waiting">Waiting</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {selectedTask.status === "completed" && (
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setCompletionImage(e.target.files[0])}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render tasks overview as cards (small screen) and table (large)
  return (
    <div className="container">
      {Object.keys(tasksByStatus).map((status) => (
        <div key={status} className="mb-4">
          <h5 className="mb-2 text-capitalize">{status.replace("_", " ")}</h5>
          {tasksByStatus[status].length === 0 ? (
            <div className="card p-2 mb-2 text-center">
              <small>No tasks in this status.</small>
            </div>
          ) : (
            <div className="row g-3 d-md-none">
              {tasksByStatus[status].map((task) => (
                <div key={task._id} className="col-12">
                  <div
                    className="card td-card p-2"
                    onClick={() => setSelectedTask(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <h6>{task.title}</h6>
                    <p>Status: {task.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Large screen table */}
          {tasksByStatus[status].length > 0 && (
            <div className="d-none d-md-block table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksByStatus[status].map((task) => (
                    <tr
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{task.title}</td>
                      <td>{task.priority}</td>
                      <td>{task.status}</td>
                      <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Task;
