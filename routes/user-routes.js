const express = require("express");
const router = express.Router();
const { check, withMessage } = require("express-validator");

const { userControllers } = require("../controllers/users-controller");

router.get("/", userControllers.getAllUsers);
router.post(
  "/login",
  [
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Password is required"),
    check("email")
      .normalizeEmail()
      .trim()
      .isEmail()
      .withMessage("Email is invalid")
  ],
  userControllers.userLogin
);
router.post(
  "/signup",
  [
    check("name")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Name is required"),
    check("email")
      .normalizeEmail()
      .trim()
      .escape()
      .isEmail()
      .withMessage("Email is required"),
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Password is required")
  ],
  userControllers.userSignUp
);

module.exports = router;
