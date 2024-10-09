const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    cat: String,
    name: {
      type: String,
      required: [true, "The product must have a name"],
    },
    price: {
      type: Number,
      required: [true, "The product must have a price"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_150.jpg",
    },
    quantity: {
      type: Number,
      min: [0, "The minimum quantity must be 0 and above"],
    },
    feedbacksCount: {
      type: Number,
      default: 0,
    },

    // feedbacks: Array, child reference
    // feedbacks: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Feedback",
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//query middleware - this refers to a query
productSchema.virtual("feedbacks", {
  ref: "Feedback",
  foreignField: "product", //איך זה נקרא אצל הפידבק
  localField: "_id", //איך נקרא השדה אצלי שמקשר אותי אצל הפידבק
});
// productSchema.pre(/^find/, function (next) {
//   this.populate("feedbacks");
//   next();
// });
productSchema.pre(/^find/, function (next) {
  // this.populate('feedbacks', ['rating', '-product', '-author']);
  this.populate({
    path: "feedbacks",
    options: { limit: 3 },
    // select:'-author'
  });
  next();
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;

// {
//     "name":"milka",
//     "price":"8",
//     "category":"breakfast",
//     "quantity":"1",
//     "id":"123",
//     "image":"images/milk.jpg"

// }
