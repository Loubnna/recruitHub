import express from "express"
import { generalLimiter } from "./middleware/rateLimiter.js";
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import companyRoutes from "./modules/companies/companie.router.js"
import applicationRoutes from "./modules/applications/application.routes.js";
import { errorHandler  } from "./middleware/errorMiddleware.js";
import cors from "cors";
const app = express();
app.use(cors({
    origin:  "http://localhost:3000" ,
    credentials:true

}));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

//api v1 
app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications" , applicationRoutes);
app.use ("/api/v1/companies" , companyRoutes);
//Errir handling 
app.use(errorHandler);

app.get("/" , (req,res) => {
    res.json({
        message : "the recuitHub platforme api"
    });
});


export default app;