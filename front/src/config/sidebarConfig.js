// src/config/sidebarConfig.js
export const sidebarMenus = {
  technician: [
    { label: "Overview", path: "/technician" },
    { label: "Tasks", path: "/technician/tasks" },
    { label: "Reports", path: "/technician/report" },
  
  ],
  depstaff: [
    { label: "Overview", path: "/staff" },
    { label: "Faults", path: "/staff/faults" },
    { label: "Stock Requests", path: "/staff/stocks" },
  ],

  maintenancemanager: [
    { label: "Overview", path: "/manager" },
  
    { label: "Manage users", path: "/manager/users" },
    { label: "Reports", path: "/manager/reports" },
    { label: "Schedules", path: "/manager/schedules" },
  ],
  pharmacystore: [
    { label: "Dashboard", path: "/pharmacy" },
    { label: "Equipment", path: "/pharmacy/equipment" },
    { label: "Stock", path: "/pharmacy/stock" },
    { label: "Allocation", path: "/pharmacy/allocation" },
    { label: "Reports", path: "/pharmacy/reports" },
    { label: "Alerts", path: "/pharmacy/alerts" },
  ],

  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Managers", path: "/admin/managers" },
    { label: "Notifications", path: "/admin/notifications" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
    { label: "System Log", path: "/admin/system-logs" },
  ],
};
