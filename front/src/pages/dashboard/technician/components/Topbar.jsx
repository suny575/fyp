// import React, { useState, useRef, useEffect } from "react";
// import "../styles/topbar.css";

// const Topbar = ({ toggleSidebar, sidebarOpen, setActiveView, user }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [profileData, setProfileData] = useState(user);
//   const wrapperRef = useRef(null); // profile wrapper

//   const notificationCount = 3;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//         setEditMode(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     console.log("Logging out...");
//     window.location.href = "/login";
//   };

//   const handleProfileUpdate = () => {
//     console.log("Updated profile:", profileData);
//     setEditMode(false);
//     setDropdownOpen(false);
//   };

//   return (
//     <div className="td-topbar d-flex justify-content-between align-items-center px-3">
//       {/* Left: Hamburger + Title */}
//       <div className="d-flex align-items-center">
//         <button
//           className="btn btn-light d-md-none me-3"
//           onClick={toggleSidebar}
//         >
//           ☰
//         </button>
//         <h5 className="mb-0 fw-semibold">Technician Dashboard</h5>
//       </div>

//       {/* Right: Notifications + Profile */}
//       <div className="d-flex align-items-center gap-3">
//         {/* Notifications */}
//         <div className="position-relative">
//           <button
//             className="btn btn-light position-relative"
//             onClick={() => setActiveView("notifications")}
//           >
//             🔔
//             {notificationCount > 0 && (
//               <span className="notification-badge">{notificationCount}</span>
//             )}
//           </button>
//         </div>

//         {/* Profile wrapper with ref */}
//         <div className="position-relative" ref={wrapperRef}>
//           {/* Profile Button */}
//           <div
//             className="profile-initial"
//             onClick={(e) => {
//               e.stopPropagation();
//               setDropdownOpen((prev) => !prev);
//             }}
//           >
//             {profileData.name.charAt(0).toUpperCase()}
//           </div>

//           {/* Dropdown */}
//           {dropdownOpen && (
//             <div className="profile-dropdown shadow">
//               {!editMode ? (
//                 <>
//                   <div className="text-center p-3 border-bottom">
//                     <div className="profile-initial-large mb-2">
//                       {profileData.name.charAt(0).toUpperCase()}
//                     </div>
//                     <h6 className="mb-1">{profileData.name}</h6>
//                     <small className="text-muted">{profileData.phone}</small>
//                   </div>

//                   <button
//                     className="dropdown-item btn-edit"
//                     onClick={() => setEditMode(true)}
//                   >
//                     Edit Profile
//                   </button>
//                   <button
//                     className="dropdown-item btn-logout"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <div className="p-3">
//                   <input
//                     className="form-control mb-2"
//                     value={profileData.name}
//                     onChange={(e) =>
//                       setProfileData({ ...profileData, name: e.target.value })
//                     }
//                   />
//                   <input
//                     className="form-control mb-2"
//                     value={profileData.phone}
//                     onChange={(e) =>
//                       setProfileData({ ...profileData, phone: e.target.value })
//                     }
//                   />
//                   <input
//                     type="file"
//                     className="form-control mb-2"
//                     onChange={(e) =>
//                       setProfileData({
//                         ...profileData,
//                         profilePic: URL.createObjectURL(e.target.files[0]),
//                       })
//                     }
//                   />
//                   <button
//                     className="btn btn-primary w-100 mb-2"
//                     onClick={handleProfileUpdate}
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     className="btn btn-secondary w-100"
//                     onClick={() => setEditMode(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Topbar;

import React, { useState, useRef, useEffect } from "react";
import "../styles/topbar.css";

const Topbar = ({ toggleSidebar, sidebarOpen, setActiveView, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const wrapperRef = useRef(null);

  const notificationCount = 3;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login";
  };

  const handleProfileUpdate = () => {
    console.log("Updated profile:", profileData);
    setEditMode(false);
    setDropdownOpen(false);
  };

  return (
    <div className="td-topbar d-flex justify-content-between align-items-center px-3">
      {/* Left: Hamburger + Title */}
      <div className="d-flex align-items-center">
        <button
          className="btn btn-light d-md-none me-3"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <h5 className="mb-0 fw-semibold">Technician Dashboard</h5>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <div className="position-relative">
          <button
            className="btn btn-light position-relative"
            onClick={() => setActiveView("notifications")}
          >
            🔔
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        </div>

        {/* Profile wrapper */}
        <div className="position-relative" ref={wrapperRef}>
          <div
            className="profile-button"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
          >
            {profileData.profilePic ? (
              <img
                src={profileData.profilePic}
                alt="Profile"
                className="profile-img"
              />
            ) : (
              <div className="profile-initial">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {dropdownOpen && (
            <div
              className="profile-dropdown shadow"
              onClick={(e) => e.stopPropagation()}
            >
              {!editMode ? (
                <>
                  <div className="text-center p-3 border-bottom">
                    {profileData.profilePic ? (
                      <img
                        src={profileData.profilePic}
                        alt="Profile"
                        className="profile-img-large"
                      />
                    ) : (
                      <div className="profile-initial-large mb-2">
                        {profileData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h6 className="mb-1">{profileData.name}</h6>
                    <small className="text-muted">{profileData.phone}</small>
                  </div>
                  <button
                    className="btn-edit w-100 mb-2"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button className="btn-logout w-100" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <div className="p-3">
                  <input
                    className="form-control mb-2"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        profilePic: URL.createObjectURL(e.target.files[0]),
                      })
                    }
                  />
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
