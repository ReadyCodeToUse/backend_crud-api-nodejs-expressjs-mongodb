const express = require('express')
const dotenv = require('dotenv').config();

const time = require('express-timestamp')

const connectDB = require("../utils/connectDB.js");


const app = express();

app.use(time.init)


app.use(express.json());


const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');


const auth = require('./middleware/auth');


app.use('/auth', authRouter);

app.use('/user', auth, userRouter);


app.listen(process.env.SERVER_PORT, () =>{
   console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
   connectDB()
});