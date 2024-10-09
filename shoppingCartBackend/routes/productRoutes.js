const productsControllers = require("./../controllers/productControllers");
const authController = require("./../controllers/authController");
// const feedbackControllers = require("../controllers/feedbackController");
const express = require("express");
const router = express.Router();
const feedbacksRouter = require(`./feedbackRoutes`);
const Feedback = require("../models/feedbackModel");

router.use("/:productId/feedbacks", feedbacksRouter);
router
  .route("/")
  .get(productsControllers.getProducts)
  //   .post(productsControllers.createProduct);
  .post(
    authController.protect,
    authController.restrictByRole("admin", "premium"),
    productsControllers.uploadProductImage,
    //productControllers.editAndResizeImage,
    productsControllers.createProduct
  );
router
  .route("/:id")
  .get(productsControllers.getProductById)
  .patch(
    authController.protect,
    authController.restrictByRole("admin", "premium"),
    productsControllers.editProductById
  )
  .delete(productsControllers.deleteProductById);
router.route(":productId/feedbacks");
module.exports = router;
