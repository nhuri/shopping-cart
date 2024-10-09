const express = require("express");
const feedbackControllers = require("../controllers/feedbackController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    (req, res, next) => {
      req.body.author = req.user._id;
      next();
    },
    feedbackControllers.createFeedback
  )
  // .post(feedbackControllers.createFeedback)
  .get(feedbackControllers.getFeedbacksByProductId);
// router.route("/").get(feedbackControllers.getAllFeedbacks);
// router.get("/all", feedbackControllers.getAllFeedbacks);
// router.route("/:id").get(feedbackControllers.getFeedbackById);

module.exports = router;
