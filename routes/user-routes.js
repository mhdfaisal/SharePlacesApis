const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users-controller");

router.get("/", userControllers.getAllUsers);
router.post("/login", userControllers.userLogin);
router.post("/signup", userControllers.userSignUp);

module.exports = router;
