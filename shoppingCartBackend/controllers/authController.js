const AppError = require("../utils/AppError");
const User = require("./../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const sendMail = require("./../utils/mail");
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, role, mail, password, confirmPassword } = req.body;
  if (!role || !mail || !password || !confirmPassword)
    return next(new AppError(403, "Missing details"));
  const newUser = await User.create({
    name,
    role,
    mail,
    password,
    confirmPassword,
  });
  console.log(newUser);
  // const existingUser = User.find(user=>user.mail===mail)
  res.status(201).json({
    status: "success",
    User: newUser,
  });
});
exports.login = asyncHandler(async (req, res, next) => {
  const { mail, password } = req.body;

  if (!mail || !password)
    return next(new AppError(403, "Missing login details"));
  //find user by its mail
  const user = await User.findOne({ mail }).select("+password");
  console.log(user);
  if (!user)
    return next(
      new AppError(
        404,
        "The user is not exist please check your mail or register"
      )
    );
  //check the password
  const check = await bcrypt.compare(password, user.password);
  console.log(password, user.password);
  if (!check) return next(new AppError(403, "Email or password is incorrect"));
  //generate token
  console.log(check);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  console.log(token);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    secure: true,
    sameSite: "none",
  });
  //send it to client
  res.status(200).json({
    status: "success",
    role: user.role,
    token,
  });
  //cookie or res.json()
});
exports.protect = asyncHandler(async (req, res, next) => {
  //1 extract token from: a req.headers or b from cookies
  //console.log(req.cookies);
  if (!req.cookies || !req.cookies.jwt)
    return next(new AppError(403, "please login!"));
  const token = req.cookies.jwt;
  console.log(token);
  //2 verify token and extract payload data id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  if (!decoded || !decoded.exp >= Date.now() / 1000)
    return next(new AppError(403, "please login"));
  //3 find user by id
  const { id } = decoded;
  const user = await User.findById(id);
  if (!user) return next(new AppError(403, "please login user"));
  //4 upload user to req object
  // if (user.passwordChangedAt > decoded.iat)
  //   return next(new AppError(403, "Login again"));
  req.user = user;
  //5 check if user role is premium === later will refactor to a different function
  //   if (!req.user.role === "premium" && req.user.role !== "admin")
  //     return next(
  //       new AppError(403, "Please subscribe to premium to use this feature")
  //     );
  //go to the next function
  next();
});
exports.restrictByPremium = (req, res, next) => {
  if (!req.user.role != "premium")
    return next(new AppError("403", "This resource is not alowed"));
  next();
};
exports.restrictByRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return next(403, "This resource is not allowed for this role");
    next();
  };
};
///1 forgot password :
//נבדוק את המייל ונשלח אליו קישור לשינוי סיסמא שיהיה בתוקף של 5 דקות
//sending emails
//change password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { mail } = req.body;
  if (!mail) return next(new AppError(401, "Bad request, mail is missing"));
  console.log(mail);
  const user = await User.findOne({ mail });
  if (!user)
    return next(new AppError(404, "No account associated with the given mail"));
  //change password token
  const resetToken = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });
  const resetUrl = `${req.get("origin")}/resetPassword.html?${resetToken}`;
  console.log(resetUrl);

  //send this reset url to the user mail
  const mailOptions = {
    from: "shoppi <donotreply@shoppi.com>",
    to: user.mail,
    subject: "password reset",
    text: `<h3>please follow this link to reset your password</h3> <a href= "${resetUrl}">"Click here to reset password"</a>`,
  };
  try {
    await sendMail(mailOptions);
    res.status(200).json({
      status: "success",
      message: "The password reset link has been sent to your mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, "there was a problem sending mail"));
  }
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { plainResetToken } = req.params;
  if (!password || !confirmPassword || !plainResetToken)
    return next(new AppError(401, "Missing Details"));
  ///encrypt plain token to match the reset token in db
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainResetToken)
    .digest("hex");
  ///find user based on the reset token
  console.log(hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires: { $gte: Date.now() },
  }).select("+password");
  console.log(user);
  if (await user.checkPassword(password, user.password))
    return next(
      new AppError(401, "You can't use with your last password again")
    );

  if (!user) return next(new AppError(400, "Do Forgot password again"));

  ///change password
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  ///save user
  await user.save();
  res.status(200).json({
    status: "success",
    message: "The password has been changed",
  });
  ///delete token
});
exports.logout = (req, res) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(Date.now() - 1000),
    secure: true,
  });
  res.status(200).json({
    status: "success",
    message: "The logout successed",
  });
};
