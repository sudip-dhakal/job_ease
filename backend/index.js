const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // Add this line to create an HTTP server
const socketIo = require("socket.io"); // Import socket.io

const connectToMongoDb = require("./utilities/connect.js");
const path = require("path");

// Importing routes
const userRoute = require("./routes/user.route.js");
const companyRoute = require("./routes/company.route.js");
const jobRoute = require("./routes/job.route.js");
const applicationRoute = require("./routes/application.route.js");
const { isAuthenticated } = require("./middlewares/authenticate");

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "static")));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

connectToMongoDb("mongodb://localhost:27017/Jobportal")
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log("MongoDb Connection error"));

app.use(cors(corsOptions));

// collection of APIs here
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/verify", isAuthenticated, async (req, res) => {
  let user = await User.findById(req.id);
  console.log(user);
  return res.json(user);
});
// Create an HTTP server using Express app
const server = http.createServer(app);

// Start the server on port 6466 (Socket.IO port)
const PORT = process.env.PORT || 6466;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
