import mongoose from "mongoose";

const maintenanceScheduleSchema = new mongoose.Schema(
{
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true
    },

    maintenanceType: {
        type: String,
        enum: ["preventive", "inspection", "calibration"],
        default: "preventive"
    },

    frequency: {
        type: String,
        enum: ["weekly", "monthly", "yearly", "custom"],
        required: true
    },

    intervalDays: {
        type: Number
    },

    startDate: {
        type: Date,
        required: true
    },

    nextMaintenanceDate: {
        type: Date,
        required: true
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },

    status: {
        type: String,
        enum: ["upcoming", "paused", "completed"],
        default: "upcoming"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{ timestamps: true }
);

const maintenanceSchedule =  mongoose.model("MaintenanceSchedule", maintenanceScheduleSchema);

export default maintenanceSchedule;