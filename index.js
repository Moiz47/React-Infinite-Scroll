require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Games = require('./Models/games');
const data = require('./data');

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ihb-db.ql3nj.mongodb.net/Infinite-scroll-data?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

let Connection = mongoose.connection;

Connection.once('open', async() => {
  console.log("Connected")
  const gamesExist = await Games.find({});
  if(gamesExist.length)
  return;
  
  Games.insertMany(data).then(res => {
    console.log(res)
  }).catch(err => console.log(err))
})

Connection.on('error', err => {
  console.error('connection error:',err)
})


app.use(express.json())
app.use(cors());




app.get('/game', async(req, res) => {
  const count = +req.query.count;
  const page = +req.query.page;
  try{
    const response = await Games.find().skip(count * (page - 1)).limit(count)
    res.status(200).json({games: response})
  }catch(err){
    console.log(err)
  }
})


app.listen(5000, () => {
    console.log("server is running")
})


