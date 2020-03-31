const HttpError = require("../models/http-error.js");
const { validationResult } = require("express-validator");
//import mongo client
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
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
const getPlaceByID = async (req, res, next) => {
  const { pid } = req.params;
  let place = [];
  const client = new MongoClient(url);
  const _pid = new ObjectId(pid);
  try {
    await client.connect();
    const db = client.db("places");
    place = await db.collection("places").findOne({ _id: _pid });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Some error ocurred while fetching the place", 500)
    );
  }
  client.close();
  if (place) {
    return res
      .status(200)
      .json({ message: "Place fetched successfully", place: place });
  }
  return next(new HttpError("The requested resource was not found", 404));
};

//GET PLACE BY USER CONTROLLER
const getPlacesByUser = async (req, res, next) => {
  const { uid } = req.params;
  let place;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db("places");
    place = await db
      .collection("places")
      .find({ creator: uid })
      .toArray();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Some error ocurred while fetching the place", 500)
    );
  }
  client.close();
  if (place) {
    return res
      .status(200)
      .json({ message: "Place fetched successfully", place });
  }
  return next(new HttpError("The requested resource was not found!", 404));
};

//UPDATE A PLACE CONTROLLER
const updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "un processable data", errors });
  }
  const { name, description } = req.body;
  let modifiedPlace;
  const client = new MongoClient(url);
  const _pid = new ObjectId(placeId);
  try {
    await client.connect();
    const db = client.db("places");
    modifiedPlace = await db
      .collection("places")
      .findOneAndUpdate(
        { _id: _pid },
        { $set: { name, description } },
        { returnOriginal: false }
      );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Some error ocurred while updating the place", 500)
    );
  }
  client.close();
  if (modifiedPlace) {
    return res.json({
      message: "Place updated successfully",
      modifiedPlace: modifiedPlace.value
    });
  }
  return next(new HttpError("The requested resource was not found", 404));
};

//DELETE PLACE CONTROLLER

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const _pid = new ObjectId(placeId);
  let place;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db("places");
    place = db
      .collection("places")
      .findOneAndDelete({ _id: _pid }, { returnOriginal: true });
  } catch (err) {
    return next(
      new HttpError("Some error ocurred while deleting the record", 500)
    );
  }
  client.close();
  if (place) {
    return res
      .status(200)
      .json({ message: "Place deleted successfully", place });
  } else {
    return next(new HttpError("Request resource was not found", 404));
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
