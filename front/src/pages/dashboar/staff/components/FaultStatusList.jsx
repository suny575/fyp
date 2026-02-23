import React, { useState } from "react";
//track faults page 
const FaultStatusList = () => {
  const [filter, setFilter] = useState("all");

  const faults = [
    { id: 1, equipment: "ECG Machine", status: "pending", date: "2026-02-15" },
    { id: 2, equipment: "X-Ray Unit", status: "completed", date: "2026-02-10" },
    {
      id: 3,
      equipment: "Ventilator",
      status: "in-progress",
      date: "2026-02-12",
    },
  ];

  const filteredFaults =
    filter === "all" ? faults : faults.filter((f) => f.status === filter);

  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "in-progress":
        return "bg-primary";
      case "completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Track Fault Reports</h3>

      {/* Filter Buttons */}
      <div className="mb-3 d-flex gap-2">
        {["all", "pending", "in-progress", "completed"].map((status) => (
          <button
            key={status}
            className={`btn ${
              filter === status ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Equipment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaults.map((fault) => (
                <tr key={fault.id}>
                  <td>{fault.equipment}</td>
                  <td>
                    <span className={`badge ${getBadge(fault.status)}`}>
                      {fault.status}
                    </span>
                  </td>
                  <td>{fault.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaultStatusList;
