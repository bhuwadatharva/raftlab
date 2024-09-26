import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        minLength: [3, "First name must contain 3 characters!"]
    },
    due_date: {
        type:String,
        required: true,
    },
    priority:{
        type: String,
        enum: ["Higher Priority", "Less Priority"],
        default: "Less Priority",
        required: true,
    },
    status:{
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress",
    },
});

export const Task = mongoose.model("Task", taskSchema); // this will create the database schema for the appointment
