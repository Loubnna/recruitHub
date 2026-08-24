import express from 'express';

const app = express();

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree", "userFour"]});
});

app.get("/api/userTwo", (req, res) => {
    res.json({"users": ["userTwo"]});
});

app.get("/welcome", (req, res) => res.send("welcome to this api!"));

app.listen(5000, () => {
    console.log("server started on port 5000");
});