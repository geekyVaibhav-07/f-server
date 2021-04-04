const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

const paramId = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

router
    .route('/register')
    .post(userController.sendEmailVerificationOTP)
    .put(userController.createUser);

router
    .route('/login')
    .post(userController.login, paramId, authController.authToken);

// users routes => protected by login
router
    .route('/me')
    .get(authController.protect, paramId, userController.getUserById)
    .put(authController.protect, paramId, userController.updatedUserDetails);

router.route('/me/:id').get(authController.protect, userController.getUserById);



/**
 * unprotected => will be protected by role => will be used by admin
 * */
// router
//     .route('/:id')
//     .get(userController.getUserById)
//     .put(userController.updatedUserDetails)
//     .delete(userController.deleteUser);

module.exports = router;
