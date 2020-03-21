const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const userControllers = require("../controllers/users-controller");

router.get("/", userControllers.getAllUsers);
router.post(
  "/login",
  [
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .trim()
      .isEmail()
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
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .trim()
      .escape()
      .isEmail(),
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
  ],
  userControllers.userSignUp
);

module.exports = router;
