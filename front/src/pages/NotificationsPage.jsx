import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";
import { connectSocket } from "../socket.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getStoredToken } from "../utils/authStorage.js";

const API_URL = "http://localhost:5000/api/notifications";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getStoredToken()}`,
        },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // clear notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete(API_URL, {
        headers: {
          Authorization: `Bearer ${getStoredToken()}`,
        },
      });

      setNotifications([]);
    } catch (err) {
      console.error("Clear failed", err);
    }
  };

  const fetchNotifications = async () => {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getStoredToken()}`,
      },
    });
    return res.data;
  };

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("newNotification");
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
      console.log("Joined socket room:", user._id);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        loading,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const navigate = useNavigate();

  const handleClick = (notification) => {
    const { type, metadata } = notification;

    switch (type) {
      case "WORKORDER_ASSIGNED":
        navigate(`/workorders/${metadata?.workOrderId}`);
        break;

      case "TASK_CREATED":
        navigate(`/tasks/${metadata?.taskId}`);
        break;

      case "SCHEDULE_CREATED":
        navigate(`/schedules/${metadata?.scheduleId}`);
        break;

      case "WORKORDER_CREATED":
        navigate(`/workorders/${metadata?.workOrderId}`);
        break;

      case "FAULT_REPORTED":
        navigate(`/faults/${metadata?.faultId}`);
        break;

      case "NEW_USER_REGISTERED":
        navigate(`/users`);
        break;

      default:
        navigate("/");
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div
      style={{
        padding: "30px",
        margin: "70px 20px",
        fontWeight: "600",
        maxWidth: "850px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Notifications</h2>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            style={{
              border: "none",
              background: "#f3f3f3",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "60px",
            background: "#fafafa",
            borderRadius: "10px",
            border: "1px dashed #ddd",
          }}
        >
          No notifications available
        </p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleClick(n)}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #eee",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
              padding: "15px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              background: n.read ? "#fff" : "#eef6ff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f9ff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = n.read ? "#fff" : "#eef6ff")
            }
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4>{n.title}</h4>

                <p
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  {n.message}
                </p>

                <small
                  style={{
                    color: "#888",
                    fontSize: "12px",
                  }}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#888",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
