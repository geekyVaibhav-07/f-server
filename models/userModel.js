const db = require("./../db");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

const createUserInDB = async (data) => {
  data.password = await bcrypt.hash(data.password, 12);
  return new Promise(function (resolve, reject) {
    let sql = "INSERT INTO users SET ?";
    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err);
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        result.password = undefined;
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
        result.forEach((element) => {
          element.password = undefined;
        });
        resolve(result);
      }
    });
  });
};

const getUser = (field, value) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM users WHERE ${field}=${value}`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(new AppError("Unable to perform operation !!!", 500));
      } else {
        result[0].password = undefined;
        resolve(result[0]);
      }
    });
  });
};

const getUserById = (id) => {
  return getUser("id", id);
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

const login = (email, candidatePassword) => {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM users WHERE email='${email}'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(new AppError("No user Found", 404));
      } else {
        resolve(
          (async (candidatePassword, user) => {
            console.log(candidatePassword);
            if (await bcrypt.compare(candidatePassword, user.password)) {
              user.password = undefined;
              return user;
            } else {
              return false;
            }
          })(candidatePassword, result[0])
        );
      }
    });
  });
};

module.exports.createUserInDB = createUserInDB;
module.exports.getAllUsersFromDB = getAllUsersFromDB;
module.exports.editUserInDB = editUserInDB;
module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
module.exports.deleteUser = deleteUser;
module.exports.login = login;
