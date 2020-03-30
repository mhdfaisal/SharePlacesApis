const express = require("express");
const bodyParser = require("body-parser");
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("api/users", userRoutes);

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

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
