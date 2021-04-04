const requestModel = require('./../models/requestModel');
const asyncCatch = require('./../utils/asyncCatch');
const AppError = require('./../utils/appError');

const sendRequest = asyncCatch(async (req, res, next) => {
    console.log(req.params);
    const to = parseInt(req.params.id);
    const from = parseInt(req.user.id);
    if (!to || !from) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }

    const result = await requestModel.createRequest(from, to);
    res.status(201).json({
        status: 'success',
        result,
    });
});

const deleteRequest = asyncCatch(async (req, res, next) => {
    const to = parseInt(req.user.id);
    const from = parseInt(req.params.id);
    if (!to || !from) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }

    const result = await requestModel.deleteRequest(from, to);
    res.status(200).json({
        status: 'success',
    });
});

const acceptRequest = asyncCatch(async (req, res, next) => {
    const to = parseInt(req.user.id);
    const from = parseInt(req.params.id);
    if (!to || !from) {
        return next(new AppError('Please provide sufficient infromation !!!', 400));
    }

    const result = await requestModel.acceptRequest(from, to);
    res.status(201).json({
        status: 'success',
        result,
    });
});

const getAllRequests = asyncCatch(async (req, res, next) => {
    const query = req.query;
    const pagination = {};
    pagination.limit = Number.parseInt(query.count) || 10;

    const page = (Number.parseInt(query.page) - 1) * Number.parseInt(query.count);
    pagination.offset = isNaN(page) ? 0 : page;

    const to = parseInt(req.user.id);
    const filter = { key: 'to_user', value: to, commonColumn: 'from_user' };

    const result = await requestModel.getRequests(filter, pagination);
    res.status(201).json({
        status: 'success',
        result,
    });
});

module.exports.sendRequest = sendRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.getAllRequests = getAllRequests;
