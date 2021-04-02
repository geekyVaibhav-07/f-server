const { query } = require('../db');
const userModel = require('./userModel');
const insertFriendData = async (user_id, friend_id) => {
  const data = {
    user_id,
    friend_id,
  };
  let sql = 'INSERT INTO friends SET ?';
  const result = await query(sql, data);
  return result;
};

const getFriends = async (user_id, pagination) => {
  let sql = `SELECT users.id as id, users.email as email, users.firstname as firstname, users.lastname as lastname, users.avatar as avatar, friends.friend_id as friend_id  FROM friends INNER JOIN users ON users.id = friends.friend_id AND friends.user_id=${user_id}  ORDER BY friends.friend_id ASC LIMIT ${pagination.offset},${pagination.limit}`;
  const result = await query(sql);
  result.forEach((element, index, result) => {
    delete result[index].password;
  });
  return result;
};
const unFriend = async (user_id, friend_id) => {
  let sql = `DELETE FROM friends WHERE user_id = ${user_id} AND  friend_id = ${friend_id} OR user_id = ${friend_id} AND  friend_id = ${user_id}`;
  const result = await query(sql);
  return result;
};

const freindsFriend = async (user_id, friend_id, pagination) => {
  let sql = `SELECT  a.user_id as user, a.friend_id as friend, b.friendship_id as user_friend_friendship_id, b.friend_id as friends_friend_friendship_id, users.id as id, users.email as email, users.firstname as firstname, users.lastname as lastname, users.avatar as avatar FROM friends a INNER JOIN friends b ON a.user_id=${user_id} and a.friend_id= ${friend_id} and b.user_id = a.friend_id INNER JOIN users on users.id = b.friend_id ORDER BY  user_friend_friendship_id ASC LIMIT ${pagination.offset},${pagination.limit}`;
  const result = await query(sql);
  return result;
};

module.exports.insertFriendData = insertFriendData;
module.exports.unFriend = unFriend;
module.exports.getFriends = getFriends;
module.exports.freindsFriend = freindsFriend;
