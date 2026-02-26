import Equipment from "../models/equipment.js";

// Create new equipment
export const addEquipment = async (req, res) => {
  try {
    // const newEquipment = new Equipment(req.body);
    const newEquipment = new Equipment({
      ...req.body,
      allocatedBy: req.user._id,   // 👈 comes from auth middleware
      allocationDate: new Date()   // 👈 optional (default also works)
    });
    const saved = await newEquipment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all equipment
export const getAllEquipment = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.status(200).json(equipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update equipment
export const updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete equipment
export const deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};