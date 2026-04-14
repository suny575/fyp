import React from "react";

const tones = {
  info: {
    background: "#fff8db",
    border: "#facc15",
    color: "#8a5a00",
  },
  success: {
    background: "#e8fff1",
    border: "#86efac",
    color: "#166534",
  },
  error: {
    background: "#fee2e2",
    border: "#fca5a5",
    color: "#991b1b",
  },
};

const ActionStatus = ({ status, message, style }) => {
  if (!message) return null;

  const tone = tones[status] || tones.info;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: tone.background,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        borderRadius: "12px",
        padding: "0.8rem 1rem",
        marginBottom: "1rem",
        fontWeight: 600,
        ...style,
      }}
    >
      {message}
    </div>
  );
};

export default ActionStatus;
