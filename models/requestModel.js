const { query } = require("./../db");
const userModel = require("./userModel");
const AppError = require("./../utils/appError");
const friendModel = require("./friendModel");

const createRequest = async (from, to) => {
  const fromUser = await userModel.getUserById(from);
  const toUser = await userModel.getUserById(to);
  if (!toUser) {
    return next(new AppError("recipient not found !!!", 400));
  }
  const data = {
    from_user: from,
    to_user: to,
  };
  let sql = `INSERT INTO requests SET ?`;
  const result = await query(sql, data);
  return result;
};

const deleteRequest = async (from, to) => {
  let sql = `Delete FROM requests WHERE from_user=${from} AND to_user=${to}`;
  const result = await query(sql);
  return result;
};

const acceptRequest = async (from, to) => {
  let sql = `INSERT INTO friends (user_id, friend_id) VALUES (${from}, ${to}), (${to}, ${from})`;
  const result = await query(sql);
  const result1 = await deleteRequest(from, to);
  return result;
};

const getRequests = async (filter, pagination) => {
  let sql = `SELECT users.id as id, users.email as email, users.firstname as firstname, users.lastname as lastname, users.avatar as avatar FROM requests INNER JOIN users on users.id=requests.${filter.commonColumn} AND requests.${filter.key}=${filter.value} ORDER BY requests.request_id ASC LIMIT ${pagination.offset},${pagination.limit} `;
  const result = await query(sql);
  return result;
};

module.exports.createRequest = createRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.getRequests = getRequests;
