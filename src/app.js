const express = require('express')
const dotenv = require('dotenv')

import connectDB from './utils/connectDB';


dotenv.config();


const app = express()



app.listen(process.env.SERVER_PORT, () =>{
   console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
   connectDB()
});