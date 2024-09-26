import express from "express"
import {postTask, getAllTasks, updateTask, deleteTask, searchTaskByTaskName} from "../controller/taskController.js";

const router = express.Router();
router.post("/post",  postTask);
router.get("/getAllTask", getAllTasks);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/search", searchTaskByTaskName);

export default router;