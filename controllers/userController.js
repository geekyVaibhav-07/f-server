const userModel = require("./../models/userModel");
const asyncCatch = require("./../utils/asyncCatch");
const AppError = require("./../utils/appError");

const createUser = asyncCatch(async (req, res, next) => {
  let { firstname, lastname, avatar, password, email } = req.body;
  if (!firstname || !lastname || !password || !email) {
    return next(new AppError("Please provide sufficient infromation !!!", 400));
  }
  let data = { firstname, lastname, avatar, password, email };
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

const getUserById = asyncCatch(async (req, res, next) => {
  let response = await userModel.getUserById(req.params.id);
  if (response.length === 0) {
    return next(new AppError("No User Found", 404));
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
    return next(new AppError("No User Found", 404));
  }
  res.status(200).json({
    status: "success",
    user: response,
  });
});

const deleteUser = asyncCatch(async (req, res, next) => {
  let response = await userModel.deleteUser(req.params.id);
  if (response.affectedRows === 0) {
    return next(new AppError("No User Found", 404));
  }
  res.status(200).json({
    status: "success",
    user: response,
  });
});

const login = asyncCatch(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError("Please provide email address !!!", 400));
  }
  let response = await userModel.login(req.body.email, req.body.password);
  console.log(response);
  if (!response) {
    return next(new AppError("Wrong Password !!!", 404));
  }
  req.user = response;
  next();
});

module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.updateUser = updateUser;
module.exports.getUserById = getUserById;
module.exports.deleteUser = deleteUser;
module.exports.login = login;
