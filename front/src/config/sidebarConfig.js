// src/config/sidebarConfig.js
export const sidebarMenus = {
  technician: [
    { label: "Overview", path: "/technician/overview" },
    { label: "Tasks", path: "/technician/tasks" },
    { label: "Reports", path: "/technician/report" },
    { label: "Notifications", path: "/technician/notifications" },
  ],
  depstaff: [
    { label: "Overview", path: "/staff/overview" },
    { label: "Faults", path: "/staff/faults" },
    { label: "Stock Requests", path: "/staff/stocks" },
    { label: "Notifications", path: "/staff/notifications" },
  ],

  maintenancemanager: [
    { label: "Overview", path: "/manager/overview" },
    { label: "Notifications", path: "/manager/notifications" },
    { label: "Manage users", path: "/manager/users" },
    { label: "Reports", path: "/manager/reports" },
    { label: "Schedules", path: "/manager/Schedules" },
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
    { label: "Dashboard", path: "/admin/dashboardhome" },
    { label: "Managers", path: "/admin/managers" },
    { label: "Notifications", path: "/admin/notifications" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
    { label: "System Log", path: "/admin/system-logs" },
  ],
};
