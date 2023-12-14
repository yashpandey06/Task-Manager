import { Router } from "express";
import { Homeresponse } from "../controlls/controller.js";
const route = Router();

route.get("/", Homeresponse);
export default route;
