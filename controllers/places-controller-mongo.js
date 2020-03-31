const HttpError = require("../models/http-error.js");
const { validationResult } = require("express-validator");
//import mongo client
const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://fmohd195:EX9cs9u6B5M35CqT@cluster0-y7xyl.mongodb.net/test?retryWrites=true&w=majority";
const uuid = require("uuid/v1");

let dummy_places = [
  {
    placeId: "p1",
    name: "",
    description: "",
    location: {
      latitude: 40.12345,
      longitude: -127.2259
    },
    creator: "u1"
  }
];

// GET ALL PLACES CONTROLLER
const getAllPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ message: "Un-processable entity", errors });
  }
  const client = new MongoClient(url);
  let places = [];
  try {
    await client.connect();
    const db = client.db("places");
    places = await db
      .collection("places")
      .find()
      .toArray();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Unable to fetch places", 500));
  }
  client.close();
  return res
    .status(200)
    .json({ message: "Places fetched successfully", places });
};

//CREATE PLACE CONTROLLER
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors, "error");
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Un-processable data", errors });
  }
  const { name, description, location, creator } = req.body;
  const place = { placeId: uuid(), name, description, location, creator };
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db("places");
    const result = await db.collection("places").insertOne({ ...place });
  } catch (err) {
    return next(
      new HttpError({
        message: "Some error ocurred while creating a place",
        code: 400
      })
    );
  }
  client.close();
  res.status(201).json({ message: "Place created successfully", place });
};

// GET PLACE BY ID CONTROLLER
const getPlaceByID = (req, res, next) => {
  const { pid } = req.params;
  const placeIndex = dummy_places.findIndex(p => pid === p.placeId);
  if (placeIndex !== -1) {
    res.status(200).json({
      message: "place found successfully",
      place: dummy_places.find(p => pid === p.placeId)
    });
  } else {
    return next(
      new HttpError(
        "The requested resource was not found against the provided placeId",
        404
      )
    );
  }
};

//GET PLACE BY USER CONTROLLER
const getPlacesByUser = (req, res, next) => {
  const { uid } = req.params;
  const places = dummy_places.filter(place => {
    return uid === place.creator;
  });
  if (places && places.length > 0) {
    res.status(200).json({ message: "Places found successfully", places });
  } else {
    return next(new HttpError("Resource not found for this user ID", 404));
  }
};

//UPDATE A PLACE CONTROLLER
const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un processable data", errors });
  }
  const { name, description } = req.body;
  const place = dummy_places.find(p => p.pid === placeId);
  const placeIndex = dummy_places.findIndex(p => p.pid === placeId);
  if (placeIndex !== -1) {
    place = { ...place, name, description };
    dummy_places[placeIndex] = place;
    res.status(201).json({ message: "Place updated successfully", place });
  } else {
    return new HttpError("Place not found to be updated", 404);
  }
};

//DELETE PLACE CONTROLLER

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const placeIndex = dummy_places.findIndex(p => p.pid === placeId);
  if (placeIndex !== -1) {
    dummy_places = dummy_places.filter(p => p.pid !== placeId);
    res.status(201).json({ message: "Place deleted successfully" });
  } else {
    return next(new HttpError("Place not found", 404));
  }
};

module.exports.placesController = {
  createPlace,
  getPlaceByID,
  getAllPlaces,
  getPlacesByUser,
  updatePlace,
  deletePlace
};
