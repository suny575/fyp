
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/PharmacyTopbar.css";

// const PharmacyTopbar = () => {
//   const navigate = useNavigate();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   // Dummy notifications
//   const notifications = [
//     "New stock added to Inventory",
//     "Equipment maintenance required",
//     "Low stock alert: Paracetamol",
//   ];

//   return (
//     <div className="pharmacy-topbar">
//       <div className="topbar-left">
//       </div>

//       <div className="topbar-right">
//         {/* Notification Icon */}
//         <div
//           className="notification"
//           onClick={() => setShowNotifications(!showNotifications)}
//         >
//           🔔
//           <span className="notification-count">{notifications.length}</span>

//           {showNotifications && (
//             <div className="notification-dropdown">
//               {notifications.length > 0 ? (
//                 notifications.map((note, index) => (
//                   <div key={index} className="notification-item">
//                     {note}
//                   </div>
//                 ))
//               ) : (
//                 <div className="notification-item">No notifications</div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="profile-section">
//           <div
//             className="profile"
//             onClick={() => setShowDropdown(!showDropdown)}
//           >
//             👤  User ▾
//           </div>

//           {showDropdown && (
//             <div className="profile-dropdown">
//               <div onClick={() => navigate("/pharmacy/edit-profile")}>
//                 Edit Profile
//               </div>
//               <div onClick={() => navigate("/")}>Logout</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PharmacyTopbar;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PharmacyTopbar.css";

const PharmacyTopbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    "New stock added to Inventory",
    "Equipment maintenance required",
    "Low stock alert: Paracetamol",
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="pharmacy-topbar">
      <div className="topbar-left">
      </div>

      <div className="topbar-right">
        {/* Notification Icon */}
        <div
          className="notification"
          onClick={() => setShowNotifications(!showNotifications)}
          ref={notifRef}
        >
          🔔
          <span className="notification-count">{notifications.length}</span>

          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((note, index) => (
                  <div key={index} className="notification-item">
                    {note}
                  </div>
                ))
              ) : (
                <div className="notification-item">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}

        <div className="profile-section" ref={dropdownRef}>
          <div
            className="profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            👤  User ▾
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div onClick={() => navigate("/pharmacy/edit-profile")}>
                Edit Profile
              </div>
              <div onClick={() => navigate("/")}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyTopbar;



