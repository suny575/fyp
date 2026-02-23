import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./components/overview";
import Task from "./components/Task";
import Report from "./components/report";
import Notification from "./components/Notification";
import "./styles/technician.css";

const mockUser = {
  id: "tech123",
  name: "John Technician",
  phone: "+251 912345678",
  profilePic: "",
};

const mockTasks = [
  {
    id: 1,
    title: "Fix AC Unit",
    assignedTo: "tech123",
    equipment: "AC Model X",
    priority: "high",
    status: "pending",
    description: "Cooling failure in lab 2",
    imageUrl: "",
    voiceUrl: "",
    dueDate: "2026-02-25",
  },
  {
    id: 2,
    title: "Repair Network Switch",
    assignedTo: "tech123",
    equipment: "Cisco Switch 2960",
    priority: "medium",
    status: "in-progress",
    description: "Port 4 not working",
    imageUrl: "",
    voiceUrl: "",
    dueDate: "2026-02-28",
  },
];

const TDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    // Simulate backend fetch with mock
    const fetchTasks = async () => {
      try {
        throw new Error("Backend not available");
      } catch (error) {
        setBackendError(true);
        setTasks(mockTasks.filter((task) => task.assignedTo === mockUser.id));
      }
    };
    fetchTasks();
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "tasks":
        return <Task tasks={tasks} setTasks={setTasks} />;
      case "report":
        return <Report />;
      case "notifications":
        return <Notification />;
      default:
        return <Overview tasks={tasks} />;
    }
  };

  return (
    <div className="td-wrapper">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="td-main">

        
        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          setActiveView={setActiveView}
          user={mockUser}
        />
        {backendError && (
          <div className="alert alert-warning m-3">
            ⚠ Backend unavailable. Showing demo data.
          </div>
        )}
        <div className="container-fluid p-4">{renderView()}</div>
      </div>
    </div>
  );
};

export default TDashboard;
