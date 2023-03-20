
# Backend crud api using node.js, express.js, MongodDB

This repo is a boilerplate that help you to start coding a CRUD API using node.js with express.js and mongodb





## Run Locally

Clone the project

```bash
  git clone https://github.com/ReadyCodeToUse/backend_crud-api-nodejs-expressjs-mongodb.git
```

Go to the project directory

```bash
  cd backend_crud-api-nodejs-expressjs-mongodb
```

Install dependencies

```bash
  npm install
```

Run docker

```bash
  docker compose up
```

Start the server

```bash
  npm start
```



## API Reference

### Auth System
#### Register User

```http
  POST /auth/register

```
##### Request

````
{
    "name" : "Marco",
    "surname" : "Rossi",
    "email" : "marco.rossi@gmail.com",
    "password" : "password",
    "role" : "user"
}
````

##### Response

````
{
    "timestamp": "2023-03-20T20:40:20+01:00",
    "method": "POST",
    "path": "/auth/register",
    "status": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kb21Vc2VySWQiOiI0MDZhZDRhZDYzNDU1NWYzIiwiZW1haWwiOiJtYXJjby5yb3NzaUBnbWFpbC5jb20iLCJpYXQiOjE2NzkzNDEyMjAsImV4cCI6MTY3OTM0ODQyMH0.ISVpi4Sq3bbQ88UBWgsZf7F0tQ47FOx43HTfvJJuIHU",
        "expiresIn": "2h"
    }
}
````



#### Login

```http
  POST /auth/login
```

##### Request
````
{
    "email" : "marco.rossi@gmail.com",
    "password" : "password"
}
````

##### Response

````
{
    "timestamp": "2023-03-20T20:46:17+01:00",
    "method": "POST",
    "path": "/auth/login",
    "status": 200,
    "data": {
        "responseMessage": "Success User logged in",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE4YjZhNDllZGVjZjY0ZWZmMGE1ZmMiLCJlbWFpbCI6Im1hcmNvLnJvc3NpQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM0MTU3NywiZXhwIjoxNjc5MzQ4Nzc3fQ.8zVShr5cTHsWT3ppPr-c74gB6QRq5JsY7mgPSJJaDeM",
        "expiresIn": "2h"
    }
}
````

