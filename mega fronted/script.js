import { handleShowModalFeedbacks } from "./modal.js";
import {
  getProducts,
  editProduct,
  addFeedback,
  getFeedbacksByProductId,
} from "./apiServices.js";
// import { handleEditByAdmin } from "./adminFuncs.js";
const rootEl = document.getElementById("root");
const searchBtn = document.querySelector("header div:nth-child(5) form button");
const inputSearch = document.getElementById("inputSearch");
const searchForm = document.querySelector("header div:nth-child(2) form");
const sort = document.querySelector("#sortPrice");
const cartCardsModal = document.getElementById("cartCardsModal");
const feedbacksModal = document.getElementById("feedbacksModal");
const totalPriceModal = document.getElementById("totalPrice");

// const products = [
//   {
//     name: "milka",
//     price: "8",
//     category: "breakfast",
//     quantity: "1",
//     id: "123",
//     image: "images/milk.jpg",
//   },
//   {
//     name: "gvinaZehuba",
//     price: "18",
//     category: "breakfast",
//     quantity: "1",
//     id: "456",
//     image: "images/gvinaZehuba.jpg",
//   },
//   {
//     name: "cookies",
//     price: "26",
//     category: "dinner",
//     quantity: "1",
//     id: "789",
//     image: "images/cookies.jpg",
//   },
//   {
//     name: "cocacola",
//     price: "10",
//     category: "drink",
//     quantity: "1",
//     id: "987",
//     image: "images/cocacola.jpg",
//   },
//   {
//     name: "bread",
//     price: "5",
//     category: "dinner",
//     quantity: "1",
//     id: "654",
//     image: "images/bread.jpg",
//   },
//   {
//     name: "birthdayCake",
//     price: "8",
//     category: "birthday",
//     quantity: "1",
//     id: "321",
//     image: "images/birthdayCake.jpg",
//   },
// ];
const products = getProducts().then((data) => {
  data;
});

let shoppingCart = [];
const handleAddProductToCart = (e) => {
  const id = e.target.id.split("_")[1];
  ///1 the product is in cart ---> update the quantity
  let alreadyInCart = false;
  shoppingCart = shoppingCart.map((product) => {
    if (product.id === id) {
      product.quantity++;
      alreadyInCart = true;
      console.log(shoppingCart);
    }
    return product;
  });
  if (alreadyInCart) return;
  ///2 The product is not in cart ---> find it in products and add to cart
  const product = products.find((product) => product.id === id);
  const cartProduct = { ...product };
  cartProduct.quantity = 1;
  shoppingCart.push(cartProduct);
  const price1 = shoppingCart.reduce((prev, current) => {
    console.log(
      `prev ${prev}, current price ${current.price}, quantity ${current.quantity}`
    );
    return prev + current.price * 1 * (current.quantity * 1);
  }, 0);
  console.log(price1);
  totalPriceModal.innerHTML = `<p>The total price is: ${price1}$</p>`;

  // cartCardsModal.innerHTML +=  `<div class="cartCardsModal-body">
  // <h5 class="card-title">"the price to pay is ${price} nis"</h5>
  // </div>`;

  render(cartCardsModal, shoppingCart, createShoppingCard);
  console.log(shoppingCart);
};
const createShoppingCard = (productObj) => {
  const cardAcount = document.createElement("div");
  cardAcount.className = "cardAcount";
  const cardAcountName = document.createElement("h4");
  cardAcountName.innerHTML = `${productObj.name}`;
  cardAcount.append(cardAcountName);
  const cardAcountNum = document.createElement("div");
  cardAcountNum.className = "cardAcountNum";
  cardAcount.append(cardAcountNum);
  const buttonMinus = document.createElement("button");
  buttonMinus.className = "btn minus";
  buttonMinus.id = `prodMinus_${productObj._id}`;
  buttonMinus.innerHTML = `-`;
  buttonMinus.addEventListener("click", handleChangeQuantity);
  cardAcountNum.append(buttonMinus);
  const productName = document.createElement("h3");
  // cardAcountName.innerHTML = `${productObj.quantity}`;
  cardAcountNum.append(productObj.quantity);
  const buttonPlus = document.createElement("button");
  buttonPlus.className = "btn plus";
  buttonPlus.id = `prod_${productObj._id}`;
  buttonPlus.innerHTML = `+`;
  buttonPlus.addEventListener("click", handleChangeQuantity);
  cardAcountNum.append(buttonPlus);
  return cardAcount;
};

const handleContinue = () => {
  const modalOverlayEl = document.querySelector(".overlay");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};

const handleChangeQuantity = (e) => {
  // console.log(prod);
  const searchProductId = e.target.id.split("_")[1];
  const product = shoppingCart.find((product) => {
    if (product.id == searchProductId) return product;
  });

  const action = e.target.innerHTML;
  if (action === "+") product.quantity++;
  else if (action === "-") {
    if (product.quantity == "1") {
      confirm(`are you like delete the ${product.name} from the cart?`);
      shoppingCart = shoppingCart.filter(
        (product) => product.id != searchProductId
      );
    } else product.quantity--;
  }

  console.log(shoppingCart);
  const price1 = shoppingCart.reduce((prev, current) => {
    // console.log(`prev ${prev}, current price ${current.price}, quantity ${current.quantity}`)
    return prev + current.price * 1 * (current.quantity * 1);
  }, 0);
  totalPriceModal.innerHTML = `<p>The total price is: ${price1}$</p>`;
  render(cartCardsModal, shoppingCart, createShoppingCard);
};

const handleToggleEditMode = (e) => {
  if (e.target.parentElement.children[1].style.display == "block")
    e.target.parentElement.children[1].style.display = "none";
  else e.target.parentElement.children[1].style.display = "block";
};
const handleToggleFeedbackMode = (e) => {
  if (e.target.parentElement.children[6].style.display == "block")
    e.target.parentElement.children[6].style.display = "none";
  else e.target.parentElement.children[6].style.display = "block";
};
let flag = 1;
let i = 1;
const handleShowFeedbacks = async (e) => {
  const id = e.target.id.split("_")[1];
  const nameProduct = e.target.parentElement.name;
  handleShowModalFeedbacks();
  if (flag === 1) {
    feedbacksModal.innerHTML += `
    <h3>The feedbacks on ${nameProduct}:</h3>`;
    getFeedbacksByProductId(id).then((data) => {
      data.feedbacks.map((feedback) => {
        feedbacksModal.innerHTML += `<div>
      <h5>${i}. review: ${feedback.review}, 
      rating: ${feedback.rating}, author: ${feedback.author.name}</h5>
      </div>`;
      });

      console.log(data.feedbacks[0]);
      return data;
    });
    flag = 2;
  }
};

const createCardEl = (productObj) => {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.name = `${productObj.name}`;

  const editBtnEl = document.createElement("button");
  editBtnEl.id = `edit_${productObj._id}`;
  editBtnEl.innerHTML = "edit";
  editBtnEl.className = "edit-btn";
  editBtnEl.addEventListener("click", handleToggleEditMode);

  const editFormEl = document.createElement("form");
  editFormEl.id = `edit_form_${productObj._id}`;
  editFormEl.className = "formEditProduct";

  const editNameInputEl = document.createElement("input");
  editNameInputEl.value = productObj.name;
  editNameInputEl.placeholder = "edit name";
  editNameInputEl.type = "text";
  editFormEl.append(editNameInputEl);

  const editPriceInputEl = document.createElement("input");
  editPriceInputEl.value = productObj.price;
  editPriceInputEl.placeholder = "edit price";
  editPriceInputEl.type = "number";
  editFormEl.append(editPriceInputEl);

  const editSubmitInputEl = document.createElement("input");
  editSubmitInputEl.value = "Save Changes";
  editSubmitInputEl.type = "submit";
  editFormEl.addEventListener("submit", handleEditByAdmin);
  editFormEl.append(editSubmitInputEl);

  const showFeedbackBtn = document.createElement("button");
  showFeedbackBtn.id = `showFeedback_${productObj._id}`;
  showFeedbackBtn.innerHTML = "show feedbacks";
  showFeedbackBtn.className = "edit-btn";
  showFeedbackBtn.addEventListener("click", handleShowFeedbacks);

  const writeFeedbackBtn = document.createElement("button");
  writeFeedbackBtn.id = `writeFeedback_${productObj._id}`;
  writeFeedbackBtn.innerHTML = "write feedback";
  writeFeedbackBtn.className = "edit-btn";
  writeFeedbackBtn.addEventListener("click", handleToggleFeedbackMode);

  const feedbackForm = document.createElement("form");
  feedbackForm.id = `feedback_form_${productObj._id}`;
  feedbackForm.className = "feedbackForm";

  const feedbackInput = document.createElement("input");
  feedbackInput.placeholder = "write feedback to product";
  feedbackInput.type = "text";
  feedbackForm.append(feedbackInput);

  const ratingInput = document.createElement("input");
  ratingInput.placeholder = "rate the product";
  ratingInput.type = "number";
  feedbackForm.append(ratingInput);

  const feedbackSubmit = document.createElement("input");
  feedbackSubmit.value = "Add feedback";
  feedbackSubmit.type = "submit";
  feedbackForm.addEventListener("submit", handleWriteFeedbackByPremium);
  productObj.feedbacksCount++;
  feedbackForm.append(feedbackSubmit);

  const imgEl = document.createElement("img");
  imgEl.src = `http://127.0.0.1:8000/img/products/${productObj.image}`;
  imgEl.alt = productObj.name;
  cardEl.append(imgEl);
  rootEl.append(cardEl);
  cardEl.innerHTML += `<div class="card-body">
    <h5 class="card-title">${productObj.name}</h5>
    <p class="card-text">${productObj.cat}</p>
    <p class="card-text">${productObj.price}</p>
    </div>`;
  const buyButton = document.createElement("button");
  buyButton.className = "btn btn-primary";
  buyButton.id = `btn_${productObj._id}`;
  buyButton.innerHTML = `Buy ${productObj.name} Now!`;
  buyButton.addEventListener("click", handleAddProductToCart);
  cardEl.append(buyButton);
  cardEl.prepend(editFormEl);
  cardEl.prepend(editBtnEl);
  cardEl.append(writeFeedbackBtn);
  cardEl.append(feedbackForm);
  cardEl.append(showFeedbackBtn);
  return cardEl;
};

const handleEditByAdmin = (e) => {
  e.preventDefault();
  const id = e.target.id.split("_")[2];
  const name = e.target.children[0].value;
  const price = e.target.children[1].value;
  editProduct(id, name, price).then(() => {
    getProducts().then((data) => {
      render(rootEl, data.products, createCardEl);
    });
  });
};

const handleWriteFeedbackByPremium = (e) => {
  e.preventDefault();
  const id = e.target.id.split("_")[2];
  const review = e.target.children[0].value;
  const rating = e.target.children[1].value;
  addFeedback(rating, review, id).then(() => {
    getProducts().then((data) => {
      render(rootEl, data.products, createCardEl);
    });
  });
};

const shopping = [];
const addContent = (elToAppend, contentElBeAdded) =>
  elToAppend.append(contentElBeAdded);

// products.map((richer) => rootEl.append(createCardEl(richer)));
const addContent1 = (elToAppend, contentElBeAdded) =>
  elToAppend.append(contentElBeAdded);
const render = (elToRenderIn, objArr, createCard) => {
  elToRenderIn.innerHTML = "";
  objArr.map((el) => addContent1(elToRenderIn, createCard(el)));
};

const handleSearchproducts = () => {
  const searchTerm = inputSearch.value;
  const filteredArr = products.filter((product) =>
    product.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
  );
  render(rootEl, filteredArr, createCardEl);
};
const handleSort = (sortBy) => {
  const sortedArr = [...products];
  if (sortBy === "cheapToExp") {
    sortedArr.sort((a, b) => a.price - b.price);
  } else if (sortBy === "expToCheap") {
    sortedArr.sort((b, a) => a.price - b.price);
  }

  render(rootEl, sortedArr, createCardEl);
};
const handleSearchOnInput = (e) => {
  const searchTerm = e.target.value;
  console.log(searchTerm);
  const filteredArr = products.filter((product) =>
    product.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
  );
  render(rootEl, filteredArr, createCardEl);
};
const handleSearchOnSubmit = (e) => {
  e.preventDefault();
  console.log(e.target.children);
  const searchTerm = e.target.children[0].value;
  const filteredArr = products.filter((richer) =>
    richer.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
  );
  render(rootEl, filteredArr, createCardEl);
};
sort.addEventListener("change", (e) => {
  const sortBy = e.target.value;
  handleSort(sortBy);
});

getProducts().then((data) => {
  render(rootEl, data.documents, createCardEl);
});

// searchForm.addEventListener('submit', handleSearchOnSubmit);
// inputSearch.addEventListener('input', handleSearchOnInput);
searchBtn.addEventListener("click", handleSearchproducts);
export { render, createCardEl };
