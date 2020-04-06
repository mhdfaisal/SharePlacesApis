const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/users");

const getAllUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors) {
    return res.status(422).json({ message: "Input fields are wrong", errors });
  }
  let users;
  try {
    users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No user found", users: [] });
    }
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }
  const usersArrayToSend = users.map((user) =>
    user.toObject({ getters: true })
  );
  res
    .status(200)
    .json({ message: "users fetched successfully", users: usersArrayToSend });
};

const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid form data", errors });
  }
  const { name, email, password } = req.body;
  const createdUser = new User({
    name,
    email,
    password,
    image: "https://i.picsum.photos/id/998/200/300.jpg",
  });
  try {
    await createdUser.save();
    return res
      .status(200)
      .json({ message: "user signup success", user: createdUser });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong :(", 500));
  }
};

const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "invalid form data", user: {} });
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ message: "User does not exists", user: {} });
    } else if (user.password !== password) {
      return res
        .status(422)
        .json({ message: "Invalid username / password", user: {} });
    }
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  return res.status(200).json({ message: "User logged in successfully", user });
};

module.exports.userControllers = {
  getAllUsers,
  userLogin,
  userSignUp,
};
