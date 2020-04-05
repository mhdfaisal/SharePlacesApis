const express = require("express");
const bodyParser = require("body-parser");
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const app = express();
const mongoose = require("mongoose");
const url =
  "mongodb+srv://fmohd195:EX9cs9u6B5M35CqT@cluster0-y7xyl.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  //to execute in case of not a valid path
  throw new HttpError("Resource not found", 404);
});

//To handle errors with express, we need to create a middleware with four arguments as shown below:
app.use((error, req, res, next) => {
  // if the response was already sent and their was no error
  console.log(error);
  if (res.headerSent) {
    next();
  }
  //else send error in response
  else {
    res.status(error.code || 404).json({
      message: error.message || "Some error ocurred"
    });
  }
});

mongoose
  .connect(url)
  .then(res => {
    app.listen(5000, () => {
      console.log("Listening on port 5000");
    });
  })
  .catch(err => {
    console.log(err);
  });
