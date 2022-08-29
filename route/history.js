import express from "express";
import jwt from "jsonwebtoken";
import History from "../model/history.js";

const router = express.Router();

// auth token check middleware
router.use((req, resp, next) => {
    const authorization = req.get("authorization");
    if(!authorization  || ! authorization.startsWith("Bearer")) {
        return resp.status(401).json({result : false, message : "unauthorized error"});
    }
    console.log(authorization);
    const token = authorization.split(/\s/)[1];
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.logonEmail = payload.email;
    } catch(e){
        return resp.status(401).json({result : false, message : e.message });
    }
   next(); 
});

router.get("/", async (req, resp)=> {
    const month = req.query.month;   // 2022-08
    const parsed = month.split("-");        //0~11      1~12
    const begin = new Date(parsed[0], parsed[1]-1, 1);    
    const end = new Date(parsed[0], parsed[1], 1);    
    console.log(begin, end);
    try {
        const historys = await History.find({
            account : req.logonEmail, 
            itemDate : {$gte : begin, $lt : end} 
        }).sort("itemDate").lean();
        return resp.status(200).json({ result:true, datas: historys } );
    }catch(err) { 
        console.log(err);
        resp.status(500).send({result:false, "message" :err.message});
    }
});

router.post("/write", async (req, resp)=> {
    console.log(req.logonEmail);
    const account = req.logonEmail;
    try {
        const r = await History.create({...req.body, account});
        console.log(r);
        return resp.status(200).json({ result:true, data: r } );
    }catch(err) {
        console.log(err);
        resp.status(500).send({result:false, "message" :err.message});
    }
});

router.delete("/delete", (req, resp)=> {
    console.log(req.logonEmail);
    return resp.status(200).json({ result:true } );
});


export default router;