import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
//api v1 
app.use("/api/v1/auth" , authRoutes);

app.get("/" , (req,res) => {
    res.json({
        message : "welcome to this api"
    });
});


export default app;