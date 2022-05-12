const helmet = require('helmet')
const express = require("express");
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const userRouter = require("./routers/user");
const projectRouter = require("./routers/project");
const connectDB = require("../db/connectDb");
const notFoundMiddleWare = require("./middleware/not-found");
require('dotenv').config()


const app = express();

const port = process.env.PORT;
const url = process.env.MONGODB_URL;

app.use(express.json());
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(cors({
  origin: ['https://michtaiwo.com'],
  credentials: true
}))
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/project', projectRouter);


app.use(notFoundMiddleWare)

const start = async() =>{
  try {
    await connectDB(url)
    app.listen(port, ()=>{
      console.log('server is running on port: ' + port)
    })
  } catch (error) {
   console.log(error) 
  }
}

start()