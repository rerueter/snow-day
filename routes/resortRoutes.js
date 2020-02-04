const express = require("express");
// const fetch = require('node-fetch');
const router = express.Router();
const DB = require("../models");

//———————————————————————————— Index ————————————————————————————//

router.get("/", (req, res) => {
  DB.Resort.find({}, (err, foundResorts) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "something went wrong", err: err });
    }
    res.status(200).json({ foundResorts });
  });
});

//————————————————————————————— Show —————————————————————————————//

router.get("/:id", async (req, res) => {
  try {
    const foundResort = await DB.Resort.findById(req.params.id);
    const resObj = {
      status: 200,
      data: foundResort,
      requestedAt: new Date().toLocaleString()
    };
    res.status(200).json(resObj);
  } catch (err) {
    return res.status(400).json({ message: "something went wrong!", err: err });
  }
});

//———————————————————————————— Create ————————————————————————————//

router.post("/", (req, res) => {
  DB.Resort.create(req.body, (err, createdResort) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "something went wrong!", err: err });
    }
    const resObj = {
      status: 200,
      data: createdResort,
      requestedAt: new Date().toLocaleString()
    };
    res.status(200).json(resObj);
  });
});

//————————————————————————————— Update —————————————————————————————//

router.post("/:id/reviews", async (req, res) => {
  try {
    const foundResort = await DB.Resort.findById(req.params.id);
    foundResort.reviews.push(req.body);
    foundResort.save();
    const resObj = {
      status: 200,
      data: foundResort,
      requestedAt: new Date().toLocaleString()
    };
    res.status(200).json(resObj);
  } catch (err) {
    return res.status(500).json({ message: "something went wrong", err: err });
  }
});

// //————————————————————————————— Delete (For Testing) —————————————————————————————//

// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedResort = await DB.Resort.findByIdAndDelete(req.params.id);
//     const resObj = {
//       status: 200,
//       data: deletedResort,
//       requestedAt: new Date().toLocaleString()
//     };
//     res.status(200).json(resObj);
//   } catch (err) {
//     return res.status(400).json({ message: "something went wrong!", err: err });
//   }
// });

//—————————————————————————————Export—————————————————————————————//

module.exports = router;
