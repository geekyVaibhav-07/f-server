const express = require("express");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const app = express();
const globalErrorController = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");

//global app middleweres
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.route("*").all((req, res, next) => {
  next(new AppError("route not defined", 404));
});

//global error middleware should always be at the end
app.use(globalErrorController);

module.exports = app;
