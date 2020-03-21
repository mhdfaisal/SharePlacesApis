const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResults } = "express-validator";
const users = [
  {
    id: uuid(),
    name: "Faisal",
    email: "test@test.com",
    password: "test"
  }
];
const getAllUsers = (req, res, next) => {
  res.status(200).json({ method: "users fetched successfully", users });
};

const userLogin = (req, res, next) => {
  const { errors } = validationResults(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un-processable entity", errors });
  }
  const { email, password } = req.body;
  const userIndex = users.findIndex(u => email === u.email);
  if (userIndex !== -1 && users[userIndex].password === password) {
    res.status(200).json({ message: "Logged in successfully" });
  } else {
    return next(new HttpError("Login failure", 404));
  }
};

const userSignUp = (req, res, next) => {
  const { errors } = validationResults(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un-processable entity", errors });
  }
  const { name, email, password } = req.body;
  users = [...users, { id: uuid(), name, email, password }];
  res.status(200).json({ message: "User created successfully!", users });
};

module.exports = {
  getAllUsers,
  userLogin,
  userSignUp
};
