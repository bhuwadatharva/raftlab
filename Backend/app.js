import express from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./router/taskRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddleware.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();

header('Access-Control-Allow-Origin: https://raftlab-1txb.vercel.app/');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');



config({ path: "./config/config.env" });




app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  

app.use("/api/v1/task", taskRouter);





dbConnection();


  
app.use(errormiddleWare);
export default app;
