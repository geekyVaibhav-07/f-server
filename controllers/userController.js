const userModel = require('./../models/userModel');
const otpModel = require('./../models/otpModel');
const asyncCatch = require('./../utils/asyncCatch');
const AppError = require('./../utils/appError');
const uniqid = require('uniqid');
const { validateEmail } = require('./../utils/validators');
const { OtpHandler } = require('./../utils/otpHandler');
const { errorConstants, userConstants, successConstants } = require('../constants/constants');
const bcrypt = require('bcrypt');
const { removeUndefindes } = require('./../utils/helper');

const userExist = async (email) => {
    try {
        if (!email) {
            return {}
        }
        const ifExistInEmailVerificationOtp = await otpModel.ifExistInEmailVerificationOtp({ email });
        if (ifExistInEmailVerificationOtp[0]) {
            return {
                otp_sent_at: ifExistInEmailVerificationOtp[0].otp_sent_at
            }
        }
        const ifExistInUser = await userModel.ifExistInUser({ email });
        if (ifExistInUser[0]) {
            return {
                active: true
            }
        }
        return {};
    }
    catch {
        return {};
    }
};

const createUser = asyncCatch(async (req = {}, res = {}, next) => {
    const { body: { email, password, otp } = {} }  =req;
    if (!email || !password || !otp) {
        const message = {
            type: errorConstants.INSUFFICIENT_DATA
        };
        return next(new AppError( message, 400))
    }
    if ( !validateEmail(email) ) {
        const message = {
            type: errorConstants.EMAIL_INVALID
        }
        return next(new AppError(message, 400));
    }
    const ifUserExist  = await userModel.ifExistInUser({ email });
    if(ifUserExist.length > 0) {
        const message = {
            type: userConstants.ALREADY_REGISTERED
        }
        return next(new AppError(message, 400));
    } 
    const result = await otpModel.getEmailVerificationOTP(email);
    if (!Array.isArray(result) || !result.length > 0) {
        const message = {
            type: errorConstants.OTP_NOT_SENT
        }
        return next(new AppError(message, 400));
    }
    const { otp: sent_otp, otp_sent_at } = result[0];
    const timeNow = Date.now();
    if ((timeNow - new Date(otp_sent_at).getTime())/1000 > 300) {
        const message = {
            type: errorConstants.OTP_EXPIRED
        }
        return next(new AppError(message, 400));
    }
    const verified =  await bcrypt.compare(otp, sent_otp);
    if (!verified) {
        const message = {
            type: errorConstants.OTP_NOT_MATCH
        }
        return next(new AppError(message, 400));
    }
    const id = uniqid('123-');
    
    const encrypted_password = await bcrypt.hash(password, 12);
    const response = await userModel.createUserInDB({ id, email, password: encrypted_password });
    if (response) {
        const deleteFfromEmailVerificationOtp = await otpModel.deleteEmailOtp({ email })
    }
    res.status(201).json({
        status: '1',
        message: {
            type: successConstants.REGISTERED
        }
    });
})

const sendEmailVerificationOTP = asyncCatch(async (req = {}, res = {}, next) => {
    const { body: { email } = {} }  =req;
    if (!email) {
        const message = {
            type: errorConstants.INSUFFICIENT_DATA
        }
        return next(AppError(message, 400))
    }
    if ( !validateEmail(email) ) {
        const message = {
            type: errorConstants.EMAIL_INVALID
        }
        return next(new AppError(message, 400));
    }
    const ifUserExist = await userExist(email);
    const { otp_sent_at, active } = ifUserExist;
    if (active) {
        const message = {
            type: userConstants.ALREADY_REGISTERED
        }
        return next(new AppError(message, 400));
    }
    const timeNow = Date.now();
    if ((timeNow - new Date(otp_sent_at).getTime())/1000 < 300) {
        const message = {
            type: successConstants.OTP_ALREADY_SENT
        }
        return next(new AppError(message, 400));
    }
    const otp = await bcrypt.hash( OtpHandler.createOTP(), 12);
    const result = await otpModel.registerOTP({ email, otp });
    const otpSent = await OtpHandler.sendOtp();
    res.status(201).json({
        status: successConstants.OTP_SENT,
        message: {
            type: successConstants.OTP_SENT,
        }
    });
});

const login = asyncCatch(async (req = {}, res, next) => {
    const { body: { email, password } = {} } = req;
    if (!email || !password) {
        const message = {
            type: errorConstants.INSUFFICIENT_DATA
        }
        return next(new AppError(message, 400));
    }
    const response = await userModel.login({ email, candidatePassword: password });
    if (!response) {
        const message = {
            type: errorConstants.EMAIL_PASSWORD_WRONG
        }
        return next(new AppError(message, 400));
    }
    req.user = response;
    next();
});

const updatedUserDetails = asyncCatch(async (req = {}, res, next) => {
    const { body: { first_name, last_name, middle_name, phone_number, country_code, address_1, address_2, city, zip, country, dob, geneder } = {}, user: { id } = {} } = req;
    if (!id) {
        const message = {
            type: errorConstants.INSUFFICIENT_DATA
        }
        return next(new AppError(message, 400));
    }
    const updateData = removeUndefindes({ id, first_name, last_name, middle_name, phone_number, country_code, address_1, address_2, city, zip, country, dob, geneder });
    const response  = await userModel.updateUserDetails(updateData);
    res.status(201).json({
        status: 1,
        message: {
            type: userConstants.DETAILS_UPDATED,
        }
    });

});

const getAllUsers = asyncCatch(async (req, res, next) => {
    const query = req.query;
    const pagination = {};
    pagination.limit = Number.parseInt(query.count) || 10;

    const page = (Number.parseInt(query.page) - 1) * Number.parseInt(query.count);
    pagination.offset = isNaN(page) ? 0 : page;

    const response = await userModel.getAllUsersFromDB(pagination);
    res.status(200).json({
        status: 'success',
        users: response,
    });
});

const getUserById = asyncCatch(async (req, res, next) => {
    const response = await userModel.getUserById(req.params.id);
    if (response.length === 0) {
        return next(new AppError('No User Found', 404));
    }
    res.status(200).json({
        status: 'success',
        user: response[0],
    });
});


const deleteUser = asyncCatch(async (req, res, next) => {
    const response = await userModel.deleteUser(req.params.id);
    if (response.affectedRows === 0) {
        return next(new AppError('No User Found', 404));
    }
    res.status(200).json({
        status: 'success',
        user: response,
    });
});



module.exports = {
    sendEmailVerificationOTP,
    createUser,
    login,
    updatedUserDetails,
    getUserById,
    deleteUser,
    getAllUsers
}