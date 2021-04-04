const { query } = require('./../db');
const bcrypt = require('bcrypt');

const createUserInDB = async ({ id, email, password }) => {
    const sql = 'INSERT INTO user SET ?';
    const result = await query(sql, { id, email, password });
    return result;
};

const ifExistInUser = async ({ email }) => {
    if (!email) {
        return false;
    }
    const sql = `SELECT email FROM user WHERE email='${email}'`;
    const result = await query(sql);
    return result;
};

const login = async ({ email, candidatePassword }) => {
    const sql = `SELECT * FROM user WHERE email='${email}'`;
    const result = await query(sql);
    if (result.length < 1) {
        return false;
    }
    const status = await bcrypt.compare(candidatePassword, result[0].password);
    if (status) {
        delete result[0].password;
        return result[0];
    }
    else {
        return false;
    }
};

const updateUserDetails = async ( data = {}) => {
    const { id } = data;
    if (!id) {
        return false
    }
    const updateData = { ...data };
    delete updateData.id;
    const sql = 'INSERT INTO user_detail SET ? ON DUPLICATE KEY UPDATE ?';
    const result = await query(sql, [ data, updateData ]);
    return result;
}

const getUser = async (field, value) => {
    const sql = `SELECT  id, email, account_created_at, password_updated_at FROM user WHERE ${field}='${value}'`;
    const result = await query(sql);
    return result;
};

const getUserById = async ({ id }) => {
    return await getUser('id', id);
};
















const registerUserInDB = async (data = {}) => {
    data.password = await bcrypt.hash(data.password, 12);
    data.otp = await bcrypt.hash(data.otp, 12);
    const sql = 'INSERT INTO register SET ?';
    const result = await query(sql, data);
    return result;
};

const resetRegistrationInDB  = async (data = {}) => {
    data.password = await bcrypt.hash(data.password, 12);
    data.otp = await bcrypt.hash(data.otp, 12);
    const sql = `UPDATE register SET password='${data.password}', otp='${data.otp}', otp_sent_at='${data.otp_sent_at}' WHERE email='${data.email}'`;
    const result = await query(sql);
    return result;
};


const getAccountActivationOtp = async (data = {}) => {
    const { email } = data;
    const sql = `SELECT * FROM register WHERE email='${email}'`;
    const result = await query(sql);
    return result;
}

const moveRegisterToUser = async (data) => {
    const { email }  = data;
    const sql = `SELECT email, password FROM register WHERE email='${data.email}'`;
    const result = await query(sql, data);
    return result;
}



const getAllUsersFromDB = async ({ offset, limit }) => {
    const sql = `SELECT id, email, firstname, lastname, avatar FROM user ORDER BY id ASC LIMIT ${offset},${limit} `;
    const result = await query(sql);
    return result;
};



const editUserInDB = async (id, data) => {
    const sql = `UPDATE user SET ? WHERE id=${id}`;
    const result = await query(sql, data);
    return result;
};

const deleteUser = async (id) => {
    const sql = `Delete FROM user  WHERE id=${id}`;
    const result = await query(sql);
    return result;
};



module.exports = {
    createUserInDB,
    ifExistInUser,
    login,
    updateUserDetails,
    getAllUsersFromDB,
    editUserInDB,
    getUser,
    getUserById,
    deleteUser,
    registerUserInDB,
    resetRegistrationInDB,
    getAccountActivationOtp
}