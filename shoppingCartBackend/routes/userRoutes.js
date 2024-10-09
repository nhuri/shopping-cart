const usersControllers = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const express = require("express");
const router = express.Router();

router.route("/").get(usersControllers.getUsers);
router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/logout", authController.logout);

router.post("/resetPassword/:plainResetToken", authController.resetPassword);
router
  .route("/:id")
  .get(usersControllers.getUserById)
  .delete(usersControllers.deleteUserById);

module.exports = router;
