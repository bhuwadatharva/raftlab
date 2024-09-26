import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Task } from "../models/taskSchema.js";


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
  
    const tasks = await Task.find();

   
    const sortedTasks = tasks.sort((a, b) => {
        
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB; 
        }

       
        if (a.priority === "Higher Priority" && b.priority === "Less Priority") {
            return -1; 
        } else if (a.priority === "Less Priority" && b.priority === "Higher Priority") {
            return 1;
        }

        
        return 0;
    });

   
    res.status(200).json({
        success: true,
        tasks: sortedTasks, 
    });
});
export const updateTask = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { taskName, due_date, priority, status } = req.body; 
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskName, due_date, priority, status }, 
            { new: true } 
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

    let tasks = await Task.findById(id);

   
    if (!tasks) {
        return next(new ErrorHandler("Task not found", 404));
    }

   
    await tasks.deleteOne();  

    
    res.status(200).json({
        success: true,
        message: "Task deleted successfully!",
    });
});

export const searchTaskByTaskName = catchAsyncErrors(async (req, res, next) => {
    console.log(req.query); 
    const { taskName } = req.query; 
    
    if (!taskName) {
        return next(new ErrorHandler("Please provide a task name to search", 400));
    }

    
    const tasks = await Task.find({ taskName: { $regex: taskName, $options: 'i' } });

    res.status(200).json({
        success: true,
        tasks
    });
});

