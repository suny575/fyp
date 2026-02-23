import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ScheduledMaintenance.css";

const ScheduledMaintenance = () => {
  const [maintenances, setMaintenances] = useState([]);

  useEffect(() => {
    fetchScheduled();
  }, []);

  const fetchScheduled = async () => {
    try {
      const res = await axios.get("/api/scheduledMaintenance");
      setMaintenances(res.data);
    } catch (err) {
      console.error("Error fetching scheduled maintenance");
    }
  };

  return (
    <div className="container mt-5 scheduled-page">
      <h2 className="mb-4 text-center fw-bold">
        Upcoming Scheduled Maintenance
      </h2>

      <div className="row">
        {maintenances.length === 0 && (
          <p className="text-center text-muted">No upcoming maintenance.</p>
        )}

        {maintenances.map((item) => (
          <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
            <div className="card shadow-sm h-100 maintenance-card">
              <div className="card-body">
                <h5 className="card-title fw-semibold">
                  {item.equipment?.name || "Equipment"}
                </h5>

                <p className="mb-1">
                  <strong>Interval:</strong> {item.interval}
                </p>

                <p className="mb-1">
                  <strong>Next Date:</strong>{" "}
                  {new Date(item.nextDate).toLocaleDateString()}
                </p>

                <span
                  className={`badge ${
                    item.status === "upcoming"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMaintenance;
