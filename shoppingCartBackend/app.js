const express = require("express");
const cors = require("cors");
// const morgan = require('morgan')
const productsRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./utils/errorHandler");
const cookieParser = require("cookie-parser");
const app = express();
const feedbacksRouter = require("./routes/feedbackRoutes");

// app.use(morgan('dev'))
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({ origin: "http://127.0.0.1:49774", credentials: true }));
app.use(express.json());
app.use("/api/shoppi/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/feedbacks", feedbacksRouter);

app.all("*", (req, res, next) => {
  next(new AppError(550, "The requested route is not exist"));
});

app.use(globalErrorHandler);

module.exports = app;
