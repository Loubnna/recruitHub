import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.jason());
app.use(cookieParser());



app.get("/", (req, res) => res.send("welcome to this api!"));

const PORT=process.env.Port || 5000;



app.listen(PORT, () => {
    console.log("server started on port 5000");
});