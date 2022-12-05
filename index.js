const express = require('express')
const app = express()

const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

const mongoose = require('mongoose');
const CONN_URL = "mongodb://localhost:27017/students-app";
// require('dotenv')

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

//connecting to mongo
mongoose.connect(CONN_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(()=>{
    console.info("MongoDB is connected successfully!!!");
})
.catch((error)=>{
    console.error("Problem with connecting DB")
})

app.get("/", (req, res) => {
    res.status(200).send("Hello This is CSI-Task-1 by Himanshu Shimpi")
})

app.use(adminRoutes);
app.use(studentRoutes);

const port = 5000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})