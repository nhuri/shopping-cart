const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.querySelector(".modal-close-btn");
const closeFeedbackModalBtn = document.querySelector(
  ".feedbackModal-close-btn"
);
const openLoginModalBtn = document.getElementById("openLoginModal");
const openLogoutModalBtn = document.getElementById("openLogoutModal");
const closeLoginModalBtn = document.getElementById("closeLogin");
const handleShowModal = () => {
  const modalOverlayEl = document.querySelector(".overlay");
  modalOverlayEl.style.display = "flex";
  modalOverlayEl.style.animation = "fade-in 500ms forwards";
};
const handleShowModalFeedbacks = () => {
  const modalOverlayEl = document.querySelector(".feedbackOverlay");
  modalOverlayEl.style.display = "flex";
  modalOverlayEl.style.animation = "fade-in 500ms forwards";
};
const handleCloseFeedbackModal = () => {
  const modalOverlayEl = document.querySelector(".feedbackOverlay");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};

const handleCloseModal = () => {
  const modalOverlayEl = document.querySelector(".overlay");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};
const handleShowLoginModal = () => {
  const modalOverlayEl = document.getElementById("loginOverlay");
  modalOverlayEl.style.display = "flex";
  modalOverlayEl.style.animation = "fade-in 500ms forwards";
};
const handleCloseLoginModal = () => {
  const modalOverlayEl = document.getElementById("loginOverlay");
  modalOverlayEl.style.animation = "fade-out 500ms forwards";
  setTimeout(() => {
    modalOverlayEl.style.display = "none";
  }, 500);
};
const handleShowLogoutModal = () => {
  const modalOverlayEl = document.querySelector(".displayToPremium");
  modalOverlayEl.style.display = "none";
  const modalOverlayElBtn = document.querySelectorAll(".btn");
  modalOverlayElBtn.forEach((item) => {
    item.style.display = "none";
  });
  const editByAdmin = document.querySelectorAll(".editButton");
  editByAdmin.forEach((item) => {
    item.style.display = "none";
  });
  const adminModalEl = document.querySelectorAll(".displayToAdmin");
  adminModalEl.forEach((item) => {
    item.style.display = "none";
  });
};

openModalBtn.addEventListener("click", handleShowModal);
closeModalBtn.addEventListener("click", handleCloseModal);
closeFeedbackModalBtn.addEventListener("click", handleCloseFeedbackModal);
openLoginModalBtn.addEventListener("click", handleShowLoginModal);
openLogoutModalBtn.addEventListener("click", handleShowLogoutModal);
closeLoginModalBtn.addEventListener("click", handleCloseLoginModal);
export { handleCloseLoginModal, handleShowModalFeedbacks };
