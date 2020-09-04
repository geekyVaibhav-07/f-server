const friendModel = require("./../models/friendModel");
const asyncCatch = require("./../utils/asyncCatch");
const AppError = require("./../utils/appError");

const getAllMyFriends = asyncCatch(async (req, res, next) => {
  let user_id = req.user.id;
  if (!user_id) {
    return next(new AppError("Please provide sufficient infromation !!!", 400));
  }
  let filter = `friends.user_id=${user_id}`;
  const result = await friendModel.getFriends(filter);
  res.status(200).json({
    status: "success",
    result,
  });
});

const removeFromFriend = asyncCatch(async (req, res, next) => {
  let user_id = req.user.id;
  let friend_id = req.params.id;
  if (!user_id || !friend_id) {
    return next(new AppError("Please provide sufficient infromation !!!", 400));
  }
  const result = await friendModel.unFriend(user_id, friend_id);
  res.status(200).json({
    status: "success",
    result,
  });
});

module.exports.getAllMyFriends = getAllMyFriends;
module.exports.removeFromFriend = removeFromFriend;
