import { Router } from "express";
import { Register } from "../controlls/controller.js";
const route =Router();

route.post("/",Register)
route.get("/",(req,res)=>{
    res.json("ok")
})
export default route