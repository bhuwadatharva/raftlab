import express from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./router/taskRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddleware.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();

const allowedOrigins = ['https://raftlab-1txb.vercel.app/', 'https://raftlab.onrender.com/']; // Add your deployed frontend URL here

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));



config({ path: "./config/config.env" });




app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  

app.use("/api/v1/task", taskRouter);





dbConnection();


  
app.use(errormiddleWare);
export default app;
