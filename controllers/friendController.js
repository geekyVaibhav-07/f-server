const friendModel = require('./../models/friendModel');
const asyncCatch = require('./../utils/asyncCatch');
const AppError = require('./../utils/appError');

const getAllMyFriends = asyncCatch(async (req, res, next) => {
    const query = req.query;
    const pagination = {};
    pagination.limit = Number.parseInt(query.count) || 10;
    const page = (Number.parseInt(query.page) - 1) * Number.parseInt(query.count);
    pagination.offset = isNaN(page) ? 0 : page;

    const user_id = req.user.id;
    if (!user_id) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }
    const users = await friendModel.getFriends(user_id, pagination);
    res.status(200).json({
        status: 'success',
        users,
    });
});

const getMyFriendsFriends = asyncCatch(async (req, res, next) => {
    const query = req.query;
    const pagination = {};
    pagination.limit = Number.parseInt(query.count) || 10;
    const page = (Number.parseInt(query.page) - 1) * Number.parseInt(query.count);
    pagination.offset = isNaN(page) ? 0 : page;

    const user_id = req.user.id;
    const friend_id = req.params.id;
    if (!user_id) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }
    const users = await friendModel.freindsFriend(user_id, friend_id, pagination);
    res.status(200).json({
        status: 'success',
        users,
    });
});

const removeFromFriend = asyncCatch(async (req, res, next) => {
    const user_id = req.user.id;
    const friend_id = req.params.id;
    if (!user_id || !friend_id) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }
    const result = await friendModel.unFriend(user_id, friend_id);
    res.status(200).json({
        status: 'success',
        result,
    });
});

module.exports.getAllMyFriends = getAllMyFriends;
module.exports.removeFromFriend = removeFromFriend;
module.exports.getMyFriendsFriends = getMyFriendsFriends;
