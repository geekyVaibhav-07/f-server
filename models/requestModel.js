const { query } = require("./../db");
const userModel = require("./userModel");
const AppError = require("./../utils/appError");
const friendModel = require("./friendModel");

const createRequest = async (from, to) => {
  const fromUser = await userModel.getUserById(from);
  if (!fromUser) {
    return next(new AppError("Sender not found !!!", 400));
  }
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
  const result1 = await friendModel.insertFriendData(from, to);
  const result2 = await friendModel.insertFriendData(to, from);
  const result3 = await deleteRequest(from, to);
  return result1;
};

const getRequests = async (filter) => {
  let sql = "SELECT * FROM requests WHERE ";
  let filterArray = [];
  filter.forEach((element) => {
    filterArray.push(`${element.key}=${element.value}`);
  });
  let filterString = filterArray.join(" AND ");
  sql += filterString;
  const result = await query(sql);
  return result;
};

module.exports.createRequest = createRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.getRequests = getRequests;
