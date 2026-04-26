import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket.js";
import { connectSocket } from "../socket.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getStoredToken } from "../utils/authStorage.js";
import "../styles/NotificationsPage.css";

const API_URL = "https://fyp-dle0.onrender.com/api/notifications";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const fetchNotifications = async () => {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getStoredToken()}`,
      },
    });
    return res.data;
  };

  useEffect(() => {
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
        markNotificationAsRead,
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
    unreadCount,
    deleteNotification,
    clearAllNotifications,
    markNotificationAsRead,
  } = useNotifications();

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-shell notifications-shell-loading">
          <div className="notifications-loading-orb" />
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-shell">
        <section className="notifications-hero">
          <div>
            <p className="notifications-eyebrow">Notification Center</p>
            <h1>Track important updates in one place</h1>
            <p className="notifications-subtitle">
              Review assignments, alerts, and system activity with a cleaner
              app-style view.
            </p>
          </div>

          <div className="notifications-summary">
            <div className="notifications-stat-card">
              <span>Total</span>
              <strong>{notifications.length}</strong>
            </div>
            <div className="notifications-stat-card unread">
              <span>Unread</span>
              <strong>{unreadCount}</strong>
            </div>
          </div>
        </section>

        <section className="notifications-panel">
          <div className="notifications-toolbar">
            <div>
              <h2>Notifications</h2>
              <p>
                {notifications.length > 0
                  ? `${notifications.length} item${notifications.length > 1 ? "s" : ""} available`
                  : "No recent activity"}
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="notifications-clear-button"
              >
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notifications-empty-state">
              <div className="notifications-empty-icon">N</div>
              <h3>No notifications yet</h3>
              <p>New updates and alerts will appear here.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((n) => (
                <article
                  key={n._id}
                  className={`notifications-card ${n.read ? "" : "is-unread"}`}
                >
                  <div className="notifications-card-accent" />

                  <div className="notifications-card-body">
                    <div className="notifications-card-top">
                      <div className="notifications-card-copy">
                        <div className="notifications-card-meta">
                          <span
                            className={`notifications-read-dot ${
                              n.read ? "" : "is-unread"
                            }`}
                          />
                          <span className="notifications-type-pill">
                            {n.type?.replaceAll("_", " ") || "Notification"}
                          </span>
                        </div>

                        <h3>{n.title}</h3>
                        <p>{n.message}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                        className="notifications-delete-button"
                        aria-label="Delete notification"
                      >
                        ×
                      </button>
                    </div>

                    <div className="notifications-card-footer">
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                      {!n.read ? (
                        <div className="notifications-card-actions">
                          <span className="notifications-status-badge">
                            New
                          </span>
                          <button
                            type="button"
                            className="notifications-mark-read-button"
                            onClick={() => markNotificationAsRead(n._id)}
                          >
                            Mark as read
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NotificationsPage;

