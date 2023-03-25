const express = require('express')
const dotenv = require('dotenv').config();
const time = require('express-timestamp')
const connectDB = require("../utils/connectDB.js");
const ErrorHandler = require("./middleware/errorHandler");


const app = express();

app.use(time.init)


app.use(express.json());


const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const companyRouter = require('./routes/company.route');

const auth = require('./middleware/auth');


app.use('/auth', authRouter);

app.use('/user', auth, userRouter);

app.use('/company', auth, companyRouter);


app.use(ErrorHandler);


app.listen(process.env.SERVER_PORT, () =>{
   console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
   connectDB()
});