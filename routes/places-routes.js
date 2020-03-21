const express = require("express");
const placesController = require("../controllers/places-controller");
const router = express.Router();
const { check } = "express-validator";

router.get("/user/:uid", placesController.getPlacesByUser);
router.get("/:pid", placesController.getPlaceByID);
router.post(
  "/add",
  [
    check("name")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("description")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("location")
      .not()
      .isEmpty(),
    check("creator")
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  placesController.createPlace
);
router.patch(
  "/:pid",
  [
    check("name")
      .trim()
      .escape()
      .not()
      .isEmpty(),
    check("description")
      .trim()
      .escape()
      .isLength({ min: 5 })
  ],
  placesController.updatePlace
);
router.delete("/:pid", placesController.deletePlace);

module.exports = router;
