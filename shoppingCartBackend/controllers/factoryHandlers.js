//FACTORY FUNCTION - gets Model and returns a function to delete one from params
const asyncHandler = require("express-async-handler");
const APImethods = require("../utils/APImethods");
const AppError = require("../utils/AppError");

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const apimethods = new APImethods(Model.find(filter), req.query);
    apimethods.filter().sort().selectFields().makePagination();

    const documents = await apimethods.query;

    res.status(200).json({
      status: "success",
      documents,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (!req.params.id) return next(new AppError(400, "Missing Details"));
    const document = await Model.findById(req.params.id);
    if (!document)
      return next(new AppError(400, "the requested document was not found"));
    res.status(201).json({
      status: "success",
      document,
    });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      document,
    });
  });
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);
    if (!deletedDoc)
      return next(new AppError(400, "the requested document was not found"));
    res.status(204).json({
      status: "success",
      document: null,
    });
  });

exports.editOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc)
      return next(new AppError(400, "the requested document was not found"));
    res.status(201).json({
      status: "success",
      document: updatedDoc,
    });
  });
