import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Task } from "../models/taskSchema.js";

// POST: Create tasks
export const postTask = catchAsyncErrors(async(req, res, next)=> {
    const {
        taskName,
        due_date,
        priority,
        status,
    } = req.body;

    if(!taskName ||
        !due_date ||
        !priority) {
            return next(new ErrorHandler("Please fill full form!", 400));
        }
       
        const tasks = await Task.create({
        taskName,
        due_date,
        priority,
        status,
        });
        res.status(200).json({
            success: true,
            message: "Task is successfully submited!" ,
            tasks,
        });

});
export const getAllTasks = catchAsyncErrors(async (req, res, next) => {
    // Fetch all tasks from the database
    const tasks = await Task.find();

    // Sort tasks using JavaScript's array sorting function
    const sortedTasks = tasks.sort((a, b) => {
        // First, compare due_date
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB; // Sort by earliest date
        }

        // If dates are the same, compare priority
        if (a.priority === "Higher Priority" && b.priority === "Less Priority") {
            return -1; // "Higher Priority" comes first
        } else if (a.priority === "Less Priority" && b.priority === "Higher Priority") {
            return 1; // "Less Priority" comes later
        }

        // If both have the same date and priority, no change
        return 0;
    });

    // Send the sorted tasks as response
    res.status(200).json({
        success: true,
        tasks: sortedTasks, // Return sorted tasks
    });
});
export const updateTask = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { taskName, due_date, priority, status } = req.body; // Add status here

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskName, due_date, priority, status }, // Include status in the update object
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }

        res.status(200).send({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send({ message: 'Error updating task' });
    }
});


export const deleteTask = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the task by its ID
    let tasks = await Task.findById(id);

    // If the task does not exist, return a 404 error
    if (!tasks) {
        return next(new ErrorHandler("Task not found", 404));
    }

    // Delete the task
    await tasks.deleteOne();  // Mongoose method to delete the task

    // Respond with success message
    res.status(200).json({
        success: true,
        message: "Task deleted successfully!",
    });
});

export const searchTaskByTaskName = catchAsyncErrors(async (req, res, next) => {
    console.log(req.query); // Debugging log
    const { taskName } = req.query; // Destructure taskName from req.query
    
    if (!taskName) {
        return next(new ErrorHandler("Please provide a task name to search", 400));
    }

    // Perform a case-insensitive search using regex
    const tasks = await Task.find({ taskName: { $regex: taskName, $options: 'i' } });

    res.status(200).json({
        success: true,
        tasks
    });
});

