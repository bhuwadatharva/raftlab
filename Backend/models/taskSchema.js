import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    taskName: {
        type: String, // Add the type property
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
{/*
taskSchema.pre('save', function (next) {
    if (this.due_date && typeof this.due_date === 'string') {
        const [day, month, year] = this.due_date.split('-');
        this.due_date = new Date(`${year}-${month}-${day}`);  // Convert string date to Date object
    }
    next();
});
*/}
export const Task = mongoose.model("Task", taskSchema); // this will create the database schema for the appointment