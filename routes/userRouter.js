const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

const paramId = (req, res, next) => {
  console.log(req.user);
  req.params.id = req.user.id;
  next();
};

// users routes => protected by login
router
  .route("/me")
  .get(authController.protect, paramId, userController.getUserById)
  .put(authController.protect, paramId, userController.updateUser);

router.route("/me/:id").get(authController.protect, userController.getUserById);

// unprotected => will be protected by role => will be used by admin
router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

//unprotected routes

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/login")
  .post(userController.login, paramId, authController.authToken);

module.exports = router;
