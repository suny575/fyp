import mongoose from "mongoose";
import Equipment from "../models/equipment.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sanitizeEquipmentPayload = (payload = {}) => {
  const { manufacturer, vendor, ...cleanPayload } = payload;
  return cleanPayload;
};

const sanitizeEquipmentResponse = (equipment) => {
  if (!equipment) return equipment;

  const plainEquipment =
    typeof equipment.toObject === "function" ? equipment.toObject() : equipment;

  const { manufacturer, vendor, ...cleanEquipment } = plainEquipment;
  return cleanEquipment;
};

export const addEquipment = async (req, res) => {
  try {
    console.log("[MongoDB][Equipment][Create] Request received", {
      userId: req.user?._id?.toString(),
      hospital: resolveHospitalName(req.user?.hospital),
      name: req.body?.name,
    });

    const newEquipment = new Equipment({
      ...sanitizeEquipmentPayload(req.body),
      hospital: resolveHospitalName(req.user.hospital),
      allocatedBy: req.user._id,
      allocationDate: new Date(),
    });
    const saved = await newEquipment.save();
    console.log("[MongoDB][Equipment][Create] Insert successful", {
      id: saved?._id?.toString(),
      hospital: saved?.hospital,
      name: saved?.name,
    });
    res.status(201).json(sanitizeEquipmentResponse(saved));
  } catch (err) {
    console.error("[MongoDB][Equipment][Create] Insert failed", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllEquipment = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const parsedLimit = Number(req.query.limit);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 25)
      : 12;
    const query = withHospitalScope({}, req.user.hospital);

    if (search) {
      const safeSearch = escapeRegExp(search);
      const searchRegex = new RegExp(safeSearch, "i");
      const searchFilters = [
        { name: searchRegex },
        { model: searchRegex },
        { serial: searchRegex },
        { department: searchRegex },
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        searchFilters.unshift({ _id: search });
      }

      query.$or = searchFilters;
    }

    let equipmentQuery = Equipment.find(query);

    if (search) {
      equipmentQuery = equipmentQuery
        .sort({ name: 1, serial: 1 })
        .limit(limit);
    } else {
      equipmentQuery = equipmentQuery.sort({ createdAt: -1 });
    }

    const equipments = await equipmentQuery;
    res
      .status(200)
      .json(equipments.map((equipment) => sanitizeEquipmentResponse(equipment)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findOneAndUpdate(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
      {
        ...sanitizeEquipmentPayload(req.body),
        $unset: { manufacturer: "", vendor: "" },
      },
      {
        new: true,
      },
    );

    if (!updated) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json(sanitizeEquipmentResponse(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    console.log("[MongoDB][Equipment][Delete] Request received", {
      id: req.params.id,
      hospital: resolveHospitalName(req.user?.hospital),
      userId: req.user?._id?.toString(),
    });

    const deleted = await Equipment.findOneAndDelete(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!deleted) {
      console.log("[MongoDB][Equipment][Delete] Record not found", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Equipment not found" });
    }

    console.log("[MongoDB][Equipment][Delete] Delete successful", {
      id: deleted?._id?.toString(),
      name: deleted?.name,
      hospital: deleted?.hospital,
    });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("[MongoDB][Equipment][Delete] Delete failed", err.message);
    res.status(500).json({ error: err.message });
  }
};
