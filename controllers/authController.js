const jwt = require("jsonwebtoken");
const userModel = require("./../models/userModel");
const asyncCatch = require("./../utils/asyncCatch");
const AppError = require("./../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (req, res, next) => {
  jwtCookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") jwtCookieOptions.secure = true;
  const id = req.user.id;
  const token = signToken(id);
  res.cookie("jwt", token, jwtCookieOptions);
  res.status(200).json({
    status: "success",
    token,
  });
};

const protect = asyncCatch(async (req, res, next) => {
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in, please log in to get access !!!",
        401
      )
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await userModel.getUserById(decoded.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists !!!", 401));
  }

  //to be implemented

  //   if (freshUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //       new AppError(
  //         "Your password has been changed recently, please login again !!!",
  //         401
  //       )
  //     );
  //   }

  req.user = freshUser;
  next();
});

module.exports.authToken = createSendToken;
module.exports.protect = protect;
