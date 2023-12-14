import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { DashBoardController } from "../controlls/controller.js";
const route =Router();

route.get("/",authenticateToken,DashBoardController)
export default route