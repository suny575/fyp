import mongoose from "mongoose";
import Equipment from "../models/equipment.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const addEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment({
      ...req.body,
      hospital: resolveHospitalName(req.user.hospital),
      allocatedBy: req.user._id,
      allocationDate: new Date(),
    });
    const saved = await newEquipment.save();
    res.status(201).json(saved);
  } catch (err) {
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
        { manufacturer: searchRegex },
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
    res.status(200).json(equipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findOneAndUpdate(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
      req.body,
      {
        new: true,
      },
    );

    if (!updated) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findOneAndDelete(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!deleted) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
