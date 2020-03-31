const express = require("express");
const { placesController } = require("../controllers/places-controller-mongo");
const router = express.Router();
const { check, withMessage } = require("express-validator");

router.get("/", placesController.getAllPlaces);
router.get("/user/:uid", placesController.getPlacesByUser);
router.get("/:pid", placesController.getPlaceByID);
router.post(
  "/add",
  [
    check("name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Name is a required field"),
    check("description")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Message is required"),
    check("location")
      .not()
      .isEmpty(),
    check("creator")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Creator is required")
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
