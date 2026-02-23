import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Safe socket: don't auto-connect to avoid crash if backend down
const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all, technician, depstaff, pharmacy
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // -------------------------------
    // Socket.IO safe connection
    // -------------------------------
    try {
      socket.connect();
      socket.emit("register", userId);

      socket.on("notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });

      socket.on("connect", () => console.log("Socket connected:", socket.id));
      socket.on("disconnect", () => console.log("Socket disconnected"));
    } catch (err) {
      console.warn("Socket.IO connection failed, skipping:", err);
    }

    // -------------------------------
    // Fetch past notifications safely
    // -------------------------------
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // optional if needed
        const res = await fetch("/api/manager/notifications", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setNotifications(data.reverse());
      } catch (err) {
        console.error("Failed to fetch notifications, using mock data", err);

        // -------------------------------
        // Mock fallback
        // -------------------------------
        setNotifications([
          {
            from: "Technician A",
            type: "technician",
            message: "Reported AC issue",
            time: new Date(),
            read: false,
          },
          {
            from: "DepStaff B",
            type: "depstaff",
            message: "Requested new equipment",
            time: new Date(),
            read: false,
          },
          {
            from: "Pharmacy Store",
            type: "pharmacy",
            message: "New inventory logged",
            time: new Date(),
            read: true,
          },
        ]);
      }
    };

    fetchNotifications();

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    const typeMatch = activeTab === "all" ? true : notif.type === activeTab;
    const unreadMatch = showUnreadOnly ? !notif.read : true;
    return typeMatch && unreadMatch;
  });

  const markAsRead = (idx) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="notifications-container container py-4">
      <h5 className="mb-4">Manager Notifications</h5>

      {/* Tabs */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["all", "technician", "depstaff", "pharmacy"].map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm ${
              activeTab === tab ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all"
              ? "All"
              : tab === "technician"
                ? "Technician"
                : tab === "depstaff"
                  ? "DepStaff"
                  : "Pharmacy"}
          </button>
        ))}

        <button
          className={`btn btn-sm ms-auto ${
            showUnreadOnly ? "btn-warning" : "btn-outline-warning"
          }`}
          onClick={() => setShowUnreadOnly((prev) => !prev)}
        >
          {showUnreadOnly ? "Showing Unread" : "Unread Only"}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <p className="text-muted">No notifications.</p>
      ) : (
        <ul className="list-group">
          {filteredNotifications.map((notif, idx) => (
            <li
              key={idx}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                !notif.read ? "unread-notif" : ""
              }`}
            >
              <div>
                <strong>{notif.from}</strong>: {notif.message}
                <div>
                  <small className="text-muted">
                    {new Date(notif.time).toLocaleString()}
                  </small>
                </div>
              </div>
              {!notif.read && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => markAsRead(idx)}
                >
                  Mark Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
