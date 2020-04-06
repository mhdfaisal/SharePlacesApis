const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Places = require("../models/places");

//Create a place
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Un-processable inputs", errors });
  }
  const { name, description, location, creator } = req.body;
  const createdPlace = new Places({
    name,
    description,
    location,
    creator,
    image: "https://i.picsum.photos/id/998/200/300.jpg",
  });
  try {
    await createdPlace.save();
  } catch (err) {
    return next(
      new HttpError("Some error ocurred while creating a place", 500)
    );
  }
  return res
    .status(200)
    .json({ message: "Place created successfully!", createdPlace });
};

//Get place by ID
const getPlaceByID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json;
  }
  const placeId = req.params.pid;
  try {
    const place = await Places.findById(placeId);
    if (!place) {
      return next(new HttpError("Requested resource was not found", 404));
    }
    return res.status(200).json({
      message: "Place fetched successfully",
      place: place.toObject({ getters: true }),
    });
  } catch (err) {
    return next(new HttpError("Some error ocurred", 500));
  }
};

//Get all places
const getAllPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "malformed request body", errors });
  }
  try {
    const places = await Places.find();
    if (!places || places.length === 0) {
      return next(new HttpError("No places found", 404));
    }
    const placesResponseArray = places.map((place) =>
      place.toObject({ getters: true })
    );
    return res.status(200).json({
      message: "Places fetched successfully",
      places: placesResponseArray,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong", 500));
  }
};
//Get places by user id
const getPlacesByUser = async (req, res, next) => {
  const userId = req.params.uid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "malformed request body", errors });
  }
  try {
    const places = await Places.find({ creator: userId });
    if (!places || places.length === 0) {
      return next(new HttpError("Places not found", 404));
    }
    const placesResponseArray = places.map((place) =>
      place.toObject({ getters: true })
    );
    return res.status(200).json({
      message: "Places fetched successfully",
      places: placesResponseArray,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Some error ocurred", 500));
  }
};

//Update a place
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "malformed query data", errors });
  }
  const { name, description } = req.body;
  const placeId = req.params.pid;
  try {
    const place = await Places.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    place.name = name;
    place.description = description;
    await place.save();
    return res.status(200).json({
      message: "Place updated successfully",
      place: place.toObject({ getters: true }),
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Some error ocurred", 500));
  }
};

//Delete a place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const errors = validationResult(req);
  let place;
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "malformed request body", errors });
  }
  try {
    place = await Places.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    await place.remove();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Some error ocurred", 500));
  }
  res.status(200).json({ message: "Place was deleted successfully", place });
};

module.exports.placesController = {
  createPlace,
  getPlaceByID,
  getAllPlaces,
  getPlacesByUser,
  updatePlace,
  deletePlace,
};
