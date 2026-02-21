
import React, { useState, useEffect } from "react";
import axios from "axios";
// Mock demo tasks with media
const mockTasks = [
  {
    id: 1,
    title: "Fix AC Unit",
    assignedTo: "tech123",
    equipment: "AC Model X",
    priority: "high",
    status: "pending",
    description: "Cooling failure in lab 2",
    imageUrl: "/mock/ac_demo.jpg", // demo image
    voiceUrl: "/mock/voice_demo.mp3", // demo voice
    dueDate: "2026-02-20", // overdue example
  },
  {
    id: 2,
    title: "Repair Network Switch",
    assignedTo: "tech123",
    equipment: "Cisco Switch 2960",
    priority: "medium",
    status: "in-progress",
    description: "Port 4 not working",
    imageUrl: "/mock/switch_demo.jpg",
    voiceUrl: "",
    dueDate: "2026-02-28",
  },

   {
    id: 3,
    title: "Repair Network Switch",
    assignedTo: "tech123",
    equipment: "Cisco Switch 2960",
    priority: "low",
    status: "in-progress",
    description: "Port 4 not working",
    imageUrl: "/mock/switch_demo.jpg",
    voiceUrl: "",
    dueDate: "2026-02-28",
  },
];

const TaskManager = ({ tasks, setTasks }) => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionImage, setCompletionImage] = useState(null);

  // Fetch tasks with backend fallback
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        const filtered = res.data.filter((t) => t.assignedTo === "tech123");
        setTaskList(filtered);
      } catch (error) {
        console.error("Backend failed:", error.message);
        setTaskList(mockTasks.filter((t) => t.assignedTo === "tech123"));
      }
    };
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "completed" && !completionImage) {
      alert("You must upload completion proof image.");
      return;
    }

    const updatedTasks = taskList.map((t) =>
      t.id === selectedTask.id ? { ...t, status: newStatus } : t,
    );
    setTaskList(updatedTasks);
    setSelectedTask({ ...selectedTask, status: newStatus });

    // Notify backend
    try {
      await axios.post("/api/notify", {
        taskId: selectedTask.id,
        status: newStatus,
      });
      console.log(
        `Notification sent to technician & depStaff: Task ${selectedTask.title} updated to ${newStatus}`,
      );
    } catch (error) {
      console.error("Backend notify failed, using mock notification");
      alert(
        `⚠ Mock Notification: Task "${selectedTask.title}" updated to ${newStatus}`,
      );
    }
  };

  const isOverdue = (task) => {
    const today = new Date();
    const due = new Date(task.dueDate);
    return due < today && task.status !== "completed";
  };

  // Grid view
  if (!selectedTask) {
    return (
      <div className="row">
        {taskList.map((task) => (
          <div key={task.id} className="col-md-4 mb-4">
            <div
              className={`card td-card h-100 ${
                isOverdue(task) ? "border-danger border-3" : ""
              }`}
            >
              <div className="card-body d-flex flex-column">
                <h6>{task.title}</h6>
                <p
                  className={`badge bg-${
                    task.priority === "high"
                      ? "danger"
                      : task.priority === "medium"
                        ? "warning"
                        : "success"
                  }`}
                >
                  {task.priority.toUpperCase()}
                </p>
                <p>Status: {task.status}</p>
                <button
                  className="btn btn-outline-primary mt-auto"
                  onClick={() => setSelectedTask(task)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detail view
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
          <p>
            <p>Equipment:</p> {selectedTask.equipment}
          </p>
          <p>{selectedTask.description}</p>
          <p>
            <p>Priority:</p>{" "}
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
          <p>
            <strong>Status:</strong> {selectedTask.status}
          </p>
          <p>
            <strong>Assigned Date:</strong>{" "}
            {new Date(selectedTask.dueDate).toLocaleDateString()}
          </p>

          {/* Media Previews */}
          <div className="my-3">
            {selectedTask.imageUrl ? (
              <img
                src={selectedTask.imageUrl}
                alt="report"
                className="img-fluid rounded mb-3"
              />
            ) : (
              <p className="text-muted">No image provided.</p>
            )}

            {selectedTask.voiceUrl ? (
              <audio controls className="w-100 mb-3">
                <source src={selectedTask.voiceUrl} />
              </audio>
            ) : (
              <p className="text-muted">No voice note provided.</p>
            )}
          </div>

          {/* Status Update */}
          <div className="my-3">
            <select
              className="form-select mb-2"
              value={selectedTask.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
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
};

export default TaskManager;
