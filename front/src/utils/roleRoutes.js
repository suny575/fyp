export const roleHomePaths = {
  admin: "/admin",
  depstaff: "/staff",
  maintenancemanager: "/manager",
  pharmacystore: "/pharmacy",
  technician: "/technician",
};

export const roleMainPaths = {
  admin: ["/admin", "/admin/dashboardhome"],
  depstaff: ["/staff", "/staff/overview"],
  maintenancemanager: ["/manager", "/manager/overview"],
  pharmacystore: ["/pharmacy", "/pharmacy/home"],
  technician: ["/technician", "/technician/overview"],
};

export const normalizeRoleKey = (role) => role?.toLowerCase?.() || "";

export const getRoleHomePath = (role) => {
  const roleKey = normalizeRoleKey(role);
  return roleHomePaths[roleKey] || "/";
};
