import express from "express";

import bcrypt from "bcrypt";
import Account from "../model/account.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/valid", async (req, resp)=>{
    console.log(req.body);
    try{
        const data = jwt.verify(req.body.token, process.env.SECRET_KEY);
        resp.status(200).json({result : true, owner : data.email});
    }catch(e) {
        resp.status(401).json({result : false, message : e.message });
    }
});


router.post("/register", async (req, resp)=>{
    console.log(req.body);
    const one = {...req.body, password : bcrypt.hashSync(req.body.password, 10)};
    try{
        const data = await Account.create(one);
        resp.status(201).json({result : true, message : data});
    } catch(e) {
        resp.status(409).json({result : false, message : e.message});
    }
});

router.post("/auth", async (req, resp)=>{
    console.log(req.body);
    try{
        const {email, password} =  req.body;
        const data = await Account.findOne({email});
        console.log(data);
        if(data &&  bcrypt.compareSync(password, data.password)) {
            // ===========================================================
            const token = jwt.sign({email : data.email}, process.env.SECRET_KEY , { expiresIn : 60*60*12 });
            resp.status(200).json({result : true, message : data, token});

        } else {
            throw new Error("invalid username / password");
        }
    }catch(e) {
        resp.status(401).json({result : false, message : e.message});
    }
});






export default router;