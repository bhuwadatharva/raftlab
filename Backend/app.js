import express from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./router/taskRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddleware.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();

// Load environment variables from config.env file
config({ path: "./config/config.env" });

// Configure CORS to allow requests from your frontend (on Vercel)
app.use(cors({
  origin: 'https://raftlab-1txb.vercel.app', // Allow only this domain
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization'] // Specify allowed headers
}));

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Task routes
app.use("/api/v1/task", taskRouter);

// Connect to the database
dbConnection();

// Error handling middleware
app.use(errormiddleWare);

// Export the app for use in server.js
export default app;
