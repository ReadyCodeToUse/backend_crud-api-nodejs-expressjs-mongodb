const express = require('express')
const dotenv = require('dotenv').config();



const connectDB = require("../utils/connectDB.js");


const app = express();

app.use(express.json());


const authRouter = require('./routes/auth');


app.use('/auth', authRouter);






app.listen(process.env.SERVER_PORT, () =>{
   console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
   connectDB()
});