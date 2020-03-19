const express = require("express");
const placesController = require("../controllers/places-controller");
const router = express.Router();

router.get("/user/:uid", placesController.getPlacesByUser);
router.get("/:pid", placesController.getPlaceByID);
router.post("/add", placesController.createPlace);
router.patch("/:pid", placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);

module.exports = router;
