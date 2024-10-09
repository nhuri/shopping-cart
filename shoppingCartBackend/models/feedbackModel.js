const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: [1, "The minimum rating cannot be below 1"],
    max: [10, "The maximum rating cannot be above 10"],
    required: [true, "The feedback must have a rating"],
  },
  review: {
    type: String,
    maxLength: 300,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "The feedback must belong to a product"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "The feedback must belong to a user"],
  },
});
feedbackSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name",
  });
  next();
});
// feedbackSchema.pre(/^findOne/, function (next) {
//   this.populate("author").select("name");
//   next();
// });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
