import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cookieParser());
//api v1 
app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications" , applicationRoutes);

app.get("/" , (req,res) => {
    res.json({
        message : "the recuitHub platforme api"
    });
});
app.use(cors({
    origin:  "http://localhost:3000" ,
    credentials:true

}));
app.use(cookieParser());


export default app;