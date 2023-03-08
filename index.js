const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Auth_router = require('./Routers/Auth')
const List_router = require('./Routers/List');
const passport = require('passport');
const { Cookie } = require('express-session');
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
// app.use(cors());
app.use(session({
  secret: process.env.SERECT,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB,
    dbName: "Session_db",
    stringify: false,
  }),
  // cookie:{
  //   maxAge: 1000 * 900
  // }
}));
app.use(passport.initialize());
app.use(passport.session());
// Router
app.use('/api/auth', Auth_router)
app.use('/api/list', List_router)










//Check Connect to Mongodb
const connect = async () => {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGODB);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});
// Port listening
const port = process.env.PORT || 3001
app.listen(port, function () {
  connect();
  console.log("Connected to databse");
  console.log("Server linstening in "+ port)
})