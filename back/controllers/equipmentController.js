import Equipment from "../models/equipment.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

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
    const equipments = await Equipment.find(withHospitalScope({}, req.user.hospital));
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
