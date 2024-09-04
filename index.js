import express from 'express';
import mongoose from "mongoose";
import songsRoutes from "./routes/songsRoute.js";
import cors from "cors";
import dotenv from 'dotenv';

// const express = require(express());
require('dotenv').config();

// const app = express();

app.use(cors());

app.use(express.json());

app.use('/songs', songsRoutes);

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use(
  cors({
      origin:"http://localhost:3000",
      methods:['GET','POST','PUT','DELETE'],
      allowedHeaders:['Content-Type'],
  })
)

app.get('/',(req,res) => {
  return res.status(201).send('Welcome to my music App!')
})

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/musicapp';
const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(()=>{
console.log('App is connected to the database');

app.listen(PORT,() => {
  console.log(`App is listening on port: ${PORT}`);
});

})
.catch((err) => {
  console.error('Error connecting to database');
})
