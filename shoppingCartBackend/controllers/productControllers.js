const Product = require("./../models/productModel");
const AppError = require(`../utils/AppError`);
const asyncHandler = require("express-async-handler");
// const { isDivisibleBy } = require("validator");
const factory = require("./factoryHandlers");
const multer = require("multer");
const sharp = require("sharp");

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    cb(new AppError(404, "The file is not type image"), false);
  else cb(null, true);
};
const upload = multer({ memoryStorage, fileFilter });

exports.uploadProductImage = upload.single("image");
const editAndResizeImage = (id, fileBuffer) => {
  //const productId = "123456";
  const fileName = `product-${Date.now()}-${id}.jpg`;
  //sharp(req.file.buffer)
  sharp(fileBuffer)
    .resize(500, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`public/img/products/${fileName}`);
  return fileName;
};

exports.getProductById = factory.getAll(Product);

exports.getProducts = factory.getAll(Product);

exports.createProduct = asyncHandler(async (req, res, next) => {
  console.log(req.file);
  const newProduct = await Product.create(req.body);
  if (req.file) {
    const fileName = editAndResizeImage(newProduct._id, req.file.buffer);
    /* const fileName = `product-${Date.now()}-${newProduct._id}.jpg`;
  
      sharp(req.file.buffer)
        .resize(500, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/products/${fileName}`); */
    newProduct.image = `public/img/products/${fileName}`;
    await newProduct.save();
  }
  res.status(201).json({
    status: "success",
    newProduct,
  });
});

exports.editProductById = factory.editOne(Product);

exports.deleteProductById = factory.deleteOne(Product);
