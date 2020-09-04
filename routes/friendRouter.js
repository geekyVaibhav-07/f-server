const express = require("express");
const friendController = require("./../controllers/friendController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(authController.protect, friendController.getAllMyFriends);
router
  .route("/:id")
  .delete(authController.protect, friendController.removeFromFriend);

module.exports = router;
