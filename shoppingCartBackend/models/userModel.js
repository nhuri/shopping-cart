const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const validator = require("validator");
const userSchema = new mongoose.Schema({
  cat: String,
  name: {
    type: String,
    required: [true, "The product must have a name"],
  },
  mail: {
    type: String,
    required: [true, "The user must have a mail"],

    validate: {
      validator: function (mail) {
        return this.mail.match(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        );
      },
      message: "The mail is not valid",

      // validator: function () {
      //   return validator.isEmail(this.mail);
      // },
    },
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, "The password must be at least 8 characters"],
    required: [true, "The user must have a password"],
    select: false,
  },
  confirmPassword: {
    type: String,
    minLength: [8, "The password must be at least 8 characters"],
    required: [true, "The retype the password"],
    validate: {
      validator: function () {
        return this.confirmPassword === this.password;
      },
      message: "The password is not match",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["free", "premium", "admin"],
      message: "The role can only be free, premium or admin",
    },
    dafault: "free",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

//Document middleware - This refers to a current document before the actual save on db
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
  }
  next();
});
userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew)
    this.passwordChangedAt = Date.now() - 1000;
  next();
});

//another way to check the password and to call this function from authController:
userSchema.methods.checkPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
