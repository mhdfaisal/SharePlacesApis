const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://fmohd195:EX9cs9u6B5M35CqT@cluster0-y7xyl.mongodb.net/test?retryWrites=true&w=majority";

const users = [
  {
    name: "Faisal",
    email: "test@test.com",
    password: "test",
    image: "https://i.picsum.photos/id/998/200/300.jpg",
  },
];
const getAllUsers = async (req, res, next) => {
  const client = new MongoClient(url);
  let users;
  try {
    await client.connect();
    const db = client.db("users");
    users = await db.collection("users").find().toArray();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Some error ocurred while fetching user", 500));
  }
  client.close();
  if (users) {
    return res
      .status(200)
      .json({ message: "Users were fetched successfully!", users });
  }
  return next(new HttpError("Requested resource was not found!", 404));
};

const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un-processable entity", errors });
  }
  const { email, password } = req.body;
  const client = new MongoClient(url);
  let user;
  try {
    await client.connect();
    const db = client.db("users");
    user = await db.collection("users").findOne({ email });
  } catch {
    console.log(err);
    return next(new HttpError("Some error ocurred", 500));
  }
  client.close();
  if (user) {
    if (user.password === password) {
      return res
        .status(200)
        .json({ message: "User logged in successfully!", user });
    }
  }
  return next(new HttpError("Incorrect email/password", 404));
};

const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un-processable entity", errors });
  }
  const { name, email, password } = req.body;
  const client = new MongoClient(url);
  let user;
  try {
    await client.connect();
    const db = client.db("users");
    user = await db.collection("users").insertOne({
      name,
      email,
      password,
      image: "https://i.picsum.photos/id/998/200/300.jpg",
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Some error ocurred while registration", 500));
  }
  client.close();
  return res.status(201).json({ message: "User created successfully!", user });
};

module.exports.userControllers = {
  getAllUsers,
  userLogin,
  userSignUp,
};
