import React, { useState, useEffect } from "react";
import UserDetailsPanel from "./UserDetails";
import "./UserManagementPage.css";

const UserManagementPage = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Mock fallback data
  const mockUsers = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      department: "Maintenance",
      status: "Active",
      tasks: 5,
      joined: "2024-01-10",
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Electrical",
      status: "Inactive",
      tasks: 2,
      joined: "2023-11-03",
    },
  ];

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users?role=${role}`);
        const data = res.ok ? await res.json() : mockUsers;
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Using mock data", err);
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      }
    };

    fetchUsers();
  }, [role]);

  // Search & Filter Logic
  useEffect(() => {
    let temp = [...users];

    if (search) {
      temp = temp.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "All") {
      temp = temp.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(temp);
  }, [search, statusFilter, users]);

  const openPanel = (user) => {
    setSelectedUser(user);
    setPanelOpen(true);
  };

  return (
    <div className="user-management container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{role} Management</h4>

        <button className="btn btn-primary">+ Invite {role}</button>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={`Search ${role}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "Active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.tasks}</td>
                  <td>{user.joined}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openPanel(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide Panel */}
      {panelOpen && (
        <UserDetailsPanel
          user={selectedUser}
          close={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
