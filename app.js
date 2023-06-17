const express = require('express');
require('dotenv').config();
const time = require('express-timestamp');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./utils/connectDB');
const ErrorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(time.init);

app.use(express.json());

const authRouter = require('./src/routes/auth.route');
const userRouter = require('./src/routes/user.route');
const activityRouter = require('./src/routes/activity.route');
const menuRouter = require('./src/routes/menu.route');

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/activity', activityRouter);
app.use('/menu', menuRouter);

app.use(ErrorHandler);

app.get('/', (req, res) => {
  const { NODE_ENV } = process.env;
  let text = 'local';
  if (NODE_ENV != null) {
    switch (NODE_ENV) {
      case 'stage':
        text = 'Stage env';
        break;
      case 'production':
        text = 'Production env';
        break;
      case 'local':
        text = 'Local env';
        break;
      default:
        text = 'Local env';
        process.env.NODE_ENV = 'local';
        break;
    }
  }
  res.send(`<h1>Node.js CRUD API</h1><h1>${text}</h1> <h4>Message: Success</h4><p>Version: 1.0</p>`);
});
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is runnign on port: ${process.env.SERVER_PORT}`);
  connectDB();
});

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Express API with Swagger',
      version: '0.1.0',
      description:
             'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'AppName',
        url: '',
        email: 'info@email.com',
      },
    },
    components: {
      securitySchemes: {
        Authentication: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3010',
      },
    ],
  },
  apis: ['src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
const apiDocs = '/api-docs';
app.use(
  apiDocs,
  swaggerUi.serve,
  swaggerUi.setup(specs),
);
console.log(`Swagger docs available at http://localhost:${process.env.SERVER_PORT}${apiDocs}`);
