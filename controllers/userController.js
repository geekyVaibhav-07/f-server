const userModel = require("./../models/userModel");
const asyncCatch = require("./../utils/asyncCatch");
const app = require("../app");
const AppError = require("../utils/appError");

const createUser = asyncCatch(async (req, res, next) => {
  let { firstname, lastname, avatar } = req.body;
  let data = { firstname, lastname, avatar };
  let response = await userModel.createUserInDB(data);
  console.log(response);
  res.status(201).json({
    status: "success",
    user: response,
  });
});

const getAllUsers = asyncCatch(async (req, res, next) => {
  const query = req.query;
  const pagination = {};
  if (query.count) {
    pagination.limit = Number.parseInt(query.count);
  }
  if (query.page) {
    let page = (Number.parseInt(query.page) - 1) * Number.parseInt(query.count);
    pagination.offset = isNaN(page) ? undefined : page;
  }

  let response = await userModel.getAllUsersFromDB(pagination);
  res.status(200).json({
    status: "success",
    user: response,
  });
});

const getUser = asyncCatch(async (req, res, next) => {
  let response = await userModel.getUser(req.params.id);
  if (response.length === 0) {
    throw new AppError("No User Found", 404);
  }
  res.status(200).json({
    status: "success",
    user: response,
  });
});

const updateUser = asyncCatch(async (req, res, next) => {
  const id = req.params.id;
  const { firstname, lastname, avatar } = req.body;
  const data = {};
  if (firstname) data.firstname = firstname;
  if (lastname) data.lastname = lastname;
  if (avatar) data.avatar = avatar;
  if (!data.firstname && !data.lastname && !data.avatar) {
    return next(new AppError("No data to update !!!", 400));
  }
  let response = await userModel.editUserInDB(id, data);
  if (response.affectedRows === 0) {
    throw new AppError("No User Found", 404);
  }
  res.status(200).json({
    status: "success",
    user: response,
  });
});

const deleteUser = asyncCatch(async (req, res, next) => {
  let response = await userModel.deleteUser(req.params.id);
  if (response.affectedRows === 0) {
    throw new AppError("No User Found", 404);
  }
  res.status(200).json({
    status: "success",
    user: response,
  });
});

module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.updateUser = updateUser;
module.exports.getUser = getUser;
module.exports.deleteUser = deleteUser;
