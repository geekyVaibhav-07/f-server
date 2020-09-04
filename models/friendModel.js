const { query } = require("../db");
const userModel = require("./userModel");
const insertFriendData = async (user_id, friend_id) => {
  const data = {
    user_id,
    friend_id,
  };
  let sql = `INSERT INTO friends SET ?`;
  const result = await query(sql, data);
  return result;
};

const getFriends = async (condition) => {
  let sql = `SELECT * FROM friends INNER JOIN users ON users.id = friends.user_id AND ${condition}`;
  console.log(sql);
  const result = await query(sql);
  console.log(result);
  return result;
};
const unFriend = async (user_id, friend_id) => {
  let sql = `DELETE FROM friends WHERE user_id = ${user_id} AND  friend_id = ${friend_id} OR user_id = ${friend_id} AND  friend_id = ${user_id}`;
  console.log(sql);
  const result = await query(sql);
  console.log(result);
  return result;
};

module.exports.insertFriendData = insertFriendData;
module.exports.unFriend = unFriend;
