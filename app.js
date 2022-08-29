import dotenv from "dotenv"
import express, { application } from "express";  
import morgan from "morgan";
import cors from "cors";
import account from "./route/account.js"
import history from "./route/history.js"
import mongoose from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, { dbName : "moneybook" });

const app = express();

app.use(cors());
app.use(morgan("[Server] :method :url :status (:response-time ms | :date[iso]) "));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// app.use("/test", (req, resp,next)=>{
//     req.choon ="kekekekekeke";
//     req.query.ho= "mememememem";
//     next();
// });

// app.get("/test", (req, resp)=>{
//     console.log("query " , req.query);
//     console.log("choon " , req.choon);
//     resp.sendStatus(200);
// });

app.use("/api/account", account);
app.use("/api/history", history);




app.listen(8080, ()=>{
    console.log("[Server] start.");
});

/*
    cors - 
    morgan
    express
    mongoose
    mongodb
    dotenv
    jsonwebtoken

    bcrypt - 
*/