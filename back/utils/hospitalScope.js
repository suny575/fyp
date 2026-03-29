const normalizeSpaces = (value) => value.replace(/\s+/g, " ").trim();

export const DEFAULT_HOSPITAL_NAME = normalizeSpaces(
  process.env.DEFAULT_HOSPITAL_NAME || "Main Hospital",
);

export const normalizeHospitalName = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return normalizeSpaces(value);
};

export const resolveHospitalName = (...values) => {
  for (const value of values) {
    const normalized = normalizeHospitalName(value);
    if (normalized) {
      return normalized;
    }
  }

  return DEFAULT_HOSPITAL_NAME;
};

export const withHospitalScope = (filter = {}, hospital) => {
  const normalizedHospital = resolveHospitalName(hospital);
  const hasFilter = Object.keys(filter).length > 0;

  const scope =
    normalizedHospital === DEFAULT_HOSPITAL_NAME
      ? {
          $or: [
            { hospital: normalizedHospital },
            { hospital: { $exists: false } },
            { hospital: null },
            { hospital: "" },
          ],
        }
      : { hospital: normalizedHospital };

  if (!hasFilter) {
    return scope;
  }

  return { $and: [filter, scope] };
};

export const hasHospitalAccess = (resourceHospital, hospital) => {
  const normalizedResourceHospital = normalizeHospitalName(resourceHospital);
  const normalizedUserHospital = resolveHospitalName(hospital);

  if (normalizedUserHospital === DEFAULT_HOSPITAL_NAME) {
    return (
      !normalizedResourceHospital ||
      normalizedResourceHospital === DEFAULT_HOSPITAL_NAME
    );
  }

  return normalizedResourceHospital === normalizedUserHospital;
};

export const ensureUserHospital = async (user) => {
  if (!user) {
    return DEFAULT_HOSPITAL_NAME;
  }

  const normalizedHospital = resolveHospitalName(user.hospital);

  if (user.hospital !== normalizedHospital) {
    user.hospital = normalizedHospital;
    await user.save();
  }

  return normalizedHospital;
};
