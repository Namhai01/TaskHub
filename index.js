const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Auth_router = require("./Routers/Auth");
const List_router = require("./Routers/List");
const User_router = require("./Routers/User");
const Group_router = require("./Routers/Group");
const passport = require("passport");
const cookieParser = require("cookie-parser");
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.SERECT));
// app.use(cookieParser(process.env.SERECTCOOKIE))
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors());
app.use(
  session({
    name: "sessionName",
    secret: process.env.SERECT,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
      dbName: "Session_db",
      stringify: false,
    }),
    cookie: {
      maxAge: 1000 * 90000,
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/api/auth", Auth_router);
app.use("/api/list", List_router);
app.use("/api/user", User_router);
app.use("/api/group", Group_router);

//Check Connect to Mongodb
const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const db = await mongoose.connect(process.env.MONGODB);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});
// Port listening
const port = process.env.PORT || 5000;
app.listen(port, function () {
  connect();
  console.log("Connected to databse");
  console.log("Server linstening in " + port);
});
