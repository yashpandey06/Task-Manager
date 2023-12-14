import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import HomeRoute from "./routes/Home.js";
import RegisterRoute from "./routes/register.js";
import LoginRoute from "./routes/login.js";
import DashboarRoute from "./routes/kanban.js";
import BoardRoute from "./routes/board.js";
import cors from "cors";
import cluster from "cluster";
import os from "os";
const numOfCPU = os.cpus().length;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const URI = process.env.URI;
mongoose
  .connect(URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use("/", HomeRoute);
app.use("/register", RegisterRoute);
app.use("/login", LoginRoute);
app.use("/kanban", DashboarRoute);
app.use("/board", BoardRoute);

// ! Scalling the Nodejs application
if (cluster.isPrimary) {
  for (let i = 0; i < numOfCPU; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`Server is listening => ${port} : worker => ${process.pid}`);
  });
}
