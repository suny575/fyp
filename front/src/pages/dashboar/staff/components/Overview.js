// Overview.js
import React from "react";

const Overview = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-4">
        <h3 className="fw-bold">Department Overview</h3>
        <p className="text-muted">
          Monitor faults, stock requests, and equipment health in one place.
        </p>
      </div>

      {/*
      LATER I'LL REPLACE THIS 3  2, 1 WITH
With real data from:

GET /api/faults

GET /api/stock-requests

GET /api/consumables?expiring=true
*/}

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Pending Faults</h6>
              <h2 className="fw-bold text-warning">3</h2>
              <small className="text-muted">
                Awaiting technician assignment
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Stock Requests</h6>
              <h2 className="fw-bold text-primary">2</h2>
              <small className="text-muted">Currently under review</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Expiring Items</h6>
              <h2 className="fw-bold text-danger">1</h2>
              <small className="text-muted">Needs immediate attention</small>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry Alert Section */}
      <div className="alert alert-danger shadow-sm mb-4">
        <strong>Expiry Alert:</strong> Surgical Gloves batch #SG-102 will expire
        in 5 days.
      </div>

      {/* Recent Activity Section */}
      <div className="row g-4">
        {/* Recent Faults */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">
              Recent Fault Reports
            </div>
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
                  <tr>
                    <td>ECG Machine</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    </td>
                    <td>2026-02-15</td>
                  </tr>
                  <tr>
                    <td>X-Ray Unit</td>
                    <td>
                      <span className="badge bg-success">Completed</span>
                    </td>
                    <td>2026-02-10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Stock Requests */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">
              Recent Stock Requests
            </div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Face Masks</td>
                    <td>
                      <span className="badge bg-primary">In Review</span>
                    </td>
                    <td>2026-02-14</td>
                  </tr>
                  <tr>
                    <td>Syringes</td>
                    <td>
                      <span className="badge bg-success">Delivered</span>
                    </td>
                    <td>2026-02-08</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
