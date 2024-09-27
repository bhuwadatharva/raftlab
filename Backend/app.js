import express from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./router/taskRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddleware.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();




config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  

app.use("/api/v1/task", taskRouter);





dbConnection();


  
app.use(errormiddleWare);
export default app;
