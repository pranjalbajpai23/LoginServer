const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./Config/corsOptions");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./Config/dbConn");
const verifyJWT = require("./Middleware/verifyJWT");
const PORT = process.env.PORT || 3500;
//Writing steps so that its easier for me to explain

//step 1 -connect to MongoDB Databse
connectDB();

//*****************Middlewares*********************************
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//middleware for cookies
app.use(cookieParser());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());
//***************************************************************

//step 2 - routes
app.use("/register", require("./Routes/register"));
app.use("/auth", require("./Routes/auth"));
app.use("/refresh", require("./Routes/refresh"));
app.use("/logout", require("./Routes/logout"));

app.use(verifyJWT);

app.use("/user", require("./Routes/API/mailToken"));
app.use("/twilio", require("./Routes/API/twilio"));
//step 3 - Starting server only when connection with MongoDB is established
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
