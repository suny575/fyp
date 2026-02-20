import Fault from "../models/Fault.js";
import Equipment from "../models/Equipment.js";

// Submit a fault
export const submitFault = async (req, res) => {
  const { equipmentId, description, priority } = req.body;
  try {
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    const fault = await Fault.create({
      equipment: equipmentId,
      reportedBy: req.user._id,
      description,
      priority,
    });

    res.status(201).json({ message: "Fault reported", fault });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get faults reported by user
export const getUserFaults = async (req, res) => {
  try {
    const faults = await Fault.find({ reportedBy: req.user._id })
      .populate("equipment", "name serialNumber status")
      .sort({ createdAt: -1 });
    res.json(faults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
