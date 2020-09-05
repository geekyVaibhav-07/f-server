const { query } = require("./../db");
const bcrypt = require("bcrypt");

const createUserInDB = async (data) => {
  data.password = await bcrypt.hash(data.password, 12);
  let sql = "INSERT INTO users SET ?";
  const result = await query(sql, data);
  return result;
};

const getAllUsersFromDB = async ({ offset, limit }) => {
  let sql = `SELECT id, email, firstname, lastname, avatar FROM users ORDER BY id ASC LIMIT ${offset},${limit} `;
  const result = await query(sql);
  return result;
};

const getUser = async (field, value) => {
  let sql = `SELECT  id, email, firstname, lastname, avatar  FROM users WHERE ${field}=${value}`;
  const result = await query(sql);
  result.forEach((element) => {
    element.password = undefined;
  });
  return result;
};

const getUserById = async (id) => {
  return await getUser("id", id);
};

const editUserInDB = async (id, data) => {
  let sql = `UPDATE users SET ? WHERE id=${id}`;
  const result = await query(sql, data);
  return result;
};

const deleteUser = async (id) => {
  let sql = `Delete FROM users  WHERE id=${id}`;
  const result = await query(sql);
  return result;
};

const login = async (email, candidatePassword) => {
  const sql = `SELECT * FROM users WHERE email='${email}'`;
  const result = await query(sql);
  if (result.length < 1) {
    return false;
  }
  const status = await bcrypt.compare(candidatePassword, result[0].password);
  if (status) {
    result[0].password = undefined;
    return result[0];
  } else {
    return false;
  }
};

module.exports.createUserInDB = createUserInDB;
module.exports.getAllUsersFromDB = getAllUsersFromDB;
module.exports.editUserInDB = editUserInDB;
module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
module.exports.deleteUser = deleteUser;
module.exports.login = login;
