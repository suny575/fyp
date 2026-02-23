import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Notifications</h4>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((note) => (
            <li
              key={note._id}
              className={`list-group-item ${
                note.read ? "" : "list-group-item-warning"
              }`}
            >
              <div className="d-flex justify-content-between">
                <span>{note.message}</span>
                <small>{new Date(note.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
