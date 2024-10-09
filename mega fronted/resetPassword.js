import { changePassword } from "./apiServices.js";
const submitChangePasswordBtn = document.getElementById(
  "submitChangePassword-btn"
);
const handleChangePassword = (e) => {
  console.log("password");
  const token = window.location.search.split("?")[1];
  const password = e.target.parentNode.children[0].value;
  const confirmPassword = e.target.parentNode.children[1].value;
  changePassword(token, password, confirmPassword).then((data) => {
    alert(data);
  });
};

submitChangePasswordBtn.addEventListener("click", handleChangePassword);
