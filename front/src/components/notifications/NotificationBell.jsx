import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../pages/NotificationsPage";
import { useNavigate } from "react-router-dom";
const NotificationBell = () => {
  const { notifications, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef();

  const handleNotificationClick = (notification) => {
    navigate("/notifications", { state: { selected: notification._id } });
    setOpen(false);
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={bellRef}
      style={{
        position: "relative",
        marginTop: "3px",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#ff3b30",
              color: "white",
              borderRadius: "50%",
              fontSize: "11px",
              padding: "3px 6px",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "320px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "1px solid #eee",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "12px 15px",
              borderBottom: "1px solid #eee",
              fontWeight: "600",
              background: "#fafafa",
            }}
          >
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p style={{ padding: "15px", textAlign: "center" }}>
              No notifications
            </p>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #f1f1f1",
                  cursor: "pointer",
                  background: n.read ? "#fff" : "#eef6ff",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f8ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = n.read
                    ? "#fff"
                    : "#eef6ff")
                }
              >
                <strong style={{ fontSize: "14px" }}>{n.title}</strong>
                <p
                  style={{
                    fontSize: "13px",
                    margin: "3px 0",
                    color: "#555",
                  }}
                >
                  {n.message}
                </p>
              </div>
            ))
          )}

          <button
            onClick={() => {
              navigate("/notifications");
              setOpen(false);
            }}
            style={{
              width: "100%",
              padding: "10px",
              border: "none",
              background: "#f7f7f7",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
