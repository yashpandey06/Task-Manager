import { Router } from "express";
import { BoardController1 } from "../controlls/controller.js";
import { BoardController2 } from "../controlls/controller.js";
import { BoardController3 } from "../controlls/controller.js";
import { authenticateToken } from "../middleware/auth.js";
const route = Router();

route.get("/", authenticateToken, BoardController1);
route.post("/", authenticateToken, BoardController2);
route.delete("/:author/:id", authenticateToken, BoardController3);

export default route;
