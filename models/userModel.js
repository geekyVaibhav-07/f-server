const db = require("./../db");
const AppError = require("../utils/appError");

const createUserInDB = (data) => {
  return new Promise(function (resolve, reject) {
    let sql = "INSERT INTO users SET ?";
    db.query(sql, data, (err, result) => {
      if (err) {
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        resolve(result);
      }
    });
  });
};

const getAllUsersFromDB = ({ offset, limit }) => {
  console.log(offset);
  return new Promise(function (resolve, reject) {
    let sql = "SELECT * FROM users ";
    if (offset && limit) {
      sql = `${sql}LIMIT ${offset},${limit} `;
    } else if (limit) {
      sql = `${sql}LIMIT ${limit}`;
    }
    console.log(sql);

    db.query(sql, (err, result) => {
      if (err) {
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        resolve(result);
      }
    });
  });
};

const getUser = (id) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM users WHERE id=${id}`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        resolve(result);
      }
    });
  });
};

const editUserInDB = (id, data) => {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE users SET ? WHERE id=${id}`;
    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err);
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        resolve(result);
      }
    });
  });
};

const deleteUser = (id) => {
  return new Promise(function (resolve, reject) {
    let sql = `Delete FROM users  WHERE id=${id}`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.createUserInDB = createUserInDB;
module.exports.getAllUsersFromDB = getAllUsersFromDB;
module.exports.editUserInDB = editUserInDB;
module.exports.getUser = getUser;
module.exports.deleteUser = deleteUser;
