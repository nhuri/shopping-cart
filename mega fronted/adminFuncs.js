import { getProducts } from "./apiServices.js";
import { render, createCardEl } from "./script.js";
const rootEl = document.getElementById("root");

const formElAddP = document.getElementById("add-product-form");
const handleSubmitAddProduct = async (e) => {
  console.log("hello");
  e.preventDefault();
  const name = e.target.children[0].value;
  const price = e.target.children[1].value;
  const cat = e.target.children[2].value;
  const image = e.target.children[3].value;
  const quantity = 1;
  const config = {
    method: "post",
    data: {
      name,
      price,
      cat,
      image,
      quantity,
    },
  };
  const { data } = await axios.post(
    "http://localhost:8000/api/shoppi/products",
    { name, price, cat, image, quantity },
    { withCredentials: true }
  );
  console.log(data);
  getProducts().then((data) => {
    render(rootEl, data.products, createCardEl);
  });
};

formElAddP.addEventListener("submit", handleSubmitAddProduct);

const formElEditU = document.getElementById("edit-user-form");
const handleSubmitEditUser = async (e) => {
  e.preventDefault();
  const name = e.target.children[0].value;
  const mail = e.target.children[1].value;
  const config = {
    method: "patch",
    data: {
      name,
      mail,
    },
  };
  const { data } = await axios("http://localhost:8000/api/users/1", config);

  console.log(data);
};

const formElAddU = document.getElementById("add-user-form");
const handleSubmitAddUser = async (e) => {
  e.preventDefault();
  const name = e.target.children[0].value;
  const mail = e.target.children[1].value;
  const password = e.target.children[2].value;
  const cat = e.target.children[3].value;
  const config = {
    method: "post",
    data: {
      name,
      mail,
      password,
      cat,
    },
  };
  const { data } = await axios.post("http://localhost:8000/api/users", {
    name,
    mail,
    password,
    cat,
  });
  console.log(data);
};

formElAddU.addEventListener("submit", handleSubmitAddProduct);
