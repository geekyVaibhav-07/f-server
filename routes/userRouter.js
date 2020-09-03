const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

const paramId = (req, res, next) => {
  console.log(req.user);
  req.params.id = req.user.id;
  next();
};

router
  .route("/me")
  .get(authController.protect, paramId, userController.getUserById);

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(authController.protect, userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/login")
  .post(userController.login, paramId, authController.authToken);

module.exports = router;
