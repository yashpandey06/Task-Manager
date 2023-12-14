import { Router } from "express";
import { Login } from "../controlls/controller.js";

const route = Router();

route.post("/", Login);

export default route;
