import {
  changePassword,
  forgotPassword,
  login,
  register,
} from "./apiServices.js";
import { handleCloseLoginModal } from "./modal.js";
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const submitBtn = document.getElementById("submit-btn");
const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const closeRegisterBtn = document.getElementById("closeRegister");

const handleVerifyDetails = async (e) => {
  e.preventDefault();
  const mail = e.target.parentNode.children[0].value;
  const password = e.target.parentNode.children[1].value;
  const response = await login(mail, password);
  const modalOverlayEl = document.querySelector(".displayToPremium");
  modalOverlayEl.style.display = "flex";
  const modalOverlayElBtn = document.querySelectorAll(".btn");
  modalOverlayElBtn.forEach((item) => {
    item.style.display = "flex";
  });
  const editByAdmin = document.querySelectorAll(".edit-btn");
  editByAdmin.forEach((item) => {
    item.style.display = "flex";
  });
  const adminModalEl = document.querySelectorAll(".displayToAdmin");
  adminModalEl.forEach((item) => {
    item.style.display = "flex";
  });
  if (response.status === "success") {
    handleCloseLoginModal();
    if (response.role === "premium" || response.role === "admin") {
      modalOverlayEl.style.display = "flex";
      modalOverlayElBtn.forEach((item) => {
        item.style.display = "flex";
      });
    }
    if (response.role === "admin") {
      const modalOverlayEl = document.querySelectorAll(".displayToAdmin");
      modalOverlayEl.forEach((item) => {
        item.style.display = "flex";
      });
      editByAdmin.forEach((item) => {
        item.style.display = "flex";
      });
      //   const modalOverlayEl = document.querySelectorAll(".displayToAdmin");
      //   modalOverlayEl.forEach((item) => {
      //     item.style.display = "flex";
      //   });
      //   modalOverlayEl.style.display = "flex";
    }
  }
};

const handleRegister = () => {
  const modalOverlayEl = document.getElementById("registerOverlay");
  modalOverlayEl.style.display = "flex";
  modalOverlayEl.style.animation = "fade-in 500ms forwards";
};
const handleSubmit = (e) => {
  const name = e.target.parentNode.children[0].value;
  const role = e.target.parentNode.children[1].value;
  const mail = e.target.parentNode.children[2].value;
  const password = e.target.parentNode.children[3].value;
  const confirmPassword = e.target.parentNode.children[4].value;
  register(name, role, mail, password, confirmPassword);
  handleCloseRegister();
  handleCloseLoginModal();
};
const handleForgotPassword = (e) => {
  e.preventDefault();
  const mail = e.target.parentNode.children[0].value;
  if (mail === "") {
    alert("You must enter mail before you press on forgot password");
  } else {
    forgotPassword(mail);
    handleCloseLoginModal();
    alert(
      "Enter to your mail and Press on the link in the mail you got right now"
    );
  }
};

const handleCloseRegister = () => {
  const modalOverlayEl = document.getElementById("registerOverlay");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};
const handleCloseChangePassword = () => {
  const modalOverlayEl = document.getElementById("changePassword-modal");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};
loginBtn.addEventListener("click", handleVerifyDetails);
registerBtn.addEventListener("click", handleRegister);
submitBtn.addEventListener("click", handleSubmit);
closeRegisterBtn.addEventListener("click", handleCloseRegister);
forgotPasswordBtn.addEventListener("click", handleForgotPassword);
