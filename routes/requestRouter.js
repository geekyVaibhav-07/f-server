const express = require("express");
const requestController = require("./../controllers/requestController");
const authController = require("./../controllers/authController");

const router = express.Router();

const paramId = (req, res, next, key) => {
  console.log(req.user);
  req.params[key] = req.user.id;
  next();
};

router.route("/").get(authController.protect, requestController.getAllRequests);

router
  .route("/:id")
  .post(authController.protect, requestController.sendRequest)
  .delete(authController.protect, requestController.deleteRequest)
  .put(authController.protect, requestController.acceptRequest);

module.exports = router;
