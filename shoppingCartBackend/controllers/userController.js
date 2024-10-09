const User = require("../models/userModel");
const AppError = require(`../utils/AppError`);
const asyncHandler = require("express-async-handler");
const APImethods = require("../utils/APImethods");
const factory = require("./factoryHandlers");

exports.getUsers = factory.getAll(User);

exports.getUserById = factory.getOne(User);

exports.deleteUserById = factory.deleteOne(User);

// const APImethods = require("../utils/APImethods");
// const AppError = require("../utils/AppError");
// const User = require("./../models/userModel");
// const asyncHandler = require("express-async-handler");
// // let users =[
// //     {
// //         "name":"Israel Israeli",
// //         "mail":"israel@mail.com",
// //         "password":"123456",
// //         "id":"1",
// //         "cat":"1"
// //     }
// // ];

// // exports.logIn = (req, res) => {
// //   const { mail, password } = req.body;
// //   users.map((user) => {
// //     if (user.mail === mail) {
// //       if (user.password == password) {
// //         res.status(200).json({
// //           status: "success",
// //           message: "1234",
// //         });
// //       } else {
// //         res.status(400).json({
// //           status: "failed",
// //           message: "The password is incorrect",
// //         });
// //       }
// //     } else {
// //       res.status(400).json({
// //         status: "failed",
// //         message: "The user no exist, please register",
// //       });
// //     }
// //   });
// // };

// exports.getUserById = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   res.status(200).json({
//     status: "success",
//     user,
//   });
// });

// exports.getUsers = asyncHandler(async (req, res, next) => {
//   const apimethods = new APImethods(User.find(), req.query);
//   apimethods.filter().sort().selectFields().makePagination();

//   const users = await apimethods.query;

//   // const users = await User.find().select("-__v");
//   res.status(200).json({
//     status: "success",
//     users,
//   });
// });

// exports.deleteUserById = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   User = await User.filter((user) => user.id != id);
//   res.status(202).json({
//     status: "success",
//     user: null,
//   });
// });
