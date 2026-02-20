import React, { useState } from "react";

const StockRequestForm = () => {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    reason: "",
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      item: "Syringes",
      quantity: 50,
      status: "pending",
      date: "2026-02-14",
    },
    {
      id: 2,
      item: "Face Masks",
      quantity: 100,
      status: "delivered",
      date: "2026-02-10",
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      id: requests.length + 1,
      ...formData,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };

    setRequests([newRequest, ...requests]);
    setFormData({ item: "", quantity: "", reason: "" });
  };

  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "delivered":
        return "bg-success";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Request Stock Materials</h3>

      {/* Request Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Item</label>
                <select
                  name="item"
                  className="form-control"
                  value={formData.item}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select item</option>
                  <option value="Syringes">Syringes</option>
                  <option value="Face Masks">Face Masks</option>
                  <option value="Gloves">Gloves</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">Reason</label>
                <input
                  type="text"
                  name="reason"
                  className="form-control"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button type="submit" className="btn btn-primary px-4">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Request Tracking Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">Request History</div>

        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.item}</td>
                  <td>{req.quantity}</td>
                  <td>
                    <span className={`badge ${getBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockRequestForm;
