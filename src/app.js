const express = require('express')
const dotenv = require('dotenv').config();
const time = require('express-timestamp')
const connectDB = require("../utils/connectDB.js");
const ErrorHandler = require("./middleware/errorHandler");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();

app.use(time.init)


app.use(express.json());


const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');


app.use('/auth', authRouter);

app.use('/user', userRouter);


app.use(ErrorHandler);


app.listen(process.env.SERVER_PORT, () =>{
   console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
   connectDB()
});

const options = {
   definition: {
      openapi: "3.0.3",
      info: {
         title: "Express API with Swagger",
         version: "0.1.0",
         description:
             "This is a simple CRUD API application made with Express and documented with Swagger",
         license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
         },
         contact: {
            name: "AppName",
            url: "",
            email: "info@email.com",
         },
      },
      components: {
         securitySchemes: {
            Authentication: {
               type:   'http',
               scheme: 'bearer',
               bearerFormat: 'JWT',
            }
         }
      },
      servers: [
         {
            url: "http://localhost:3010",
         },
      ],
   },
   apis: ["src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);
