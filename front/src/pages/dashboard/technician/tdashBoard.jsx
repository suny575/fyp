import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "./components/overview";
import Task from "./components/Task";
import Report from "./components/report";
// import Notification from "./components/Notification";
import Layout from "../../../layout/layout.jsx";
import "./styles/technician.css";

const TDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="tasks" element={<Task />} />
        <Route path="report" element={<Report />} />
        {/* <Route path="notifications" element={<Notification />} /> */}
        <Route path="*" element={<Navigate to="/technician" replace />} />
      </Routes>
    </Layout>
  );
};

export default TDashboard;
