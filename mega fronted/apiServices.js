export async function getProducts() {
  const url = "http://localhost:8000/api/shoppi/products";
  const config = { withCredentials: true };
  try {
    const { data } = await axios.get(url, config);
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function createProduct(name, price, cat, image) {
  const url = "http://localhost:8000/api/shoppi/products";
  try {
    const res = await axios.post(url, {
      name,
      price,
      cat,
      image,
    });
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
}
// const {data} = await axios.get(url);
// return data;
export async function editProduct(id, name, price) {
  const url = `http://localhost:8000/api/shoppi/products/${id}`;
  try {
    const res = await axios.patch(
      url,
      {
        name,
        price,
      },
      { withCredentials: true }
    );
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
}
export async function addFeedback(rating, review, productId) {
  const url = `http://localhost:8000/api/feedbacks`;
  try {
    const res = await axios.post(
      url,
      {
        rating,
        review,
        productId,
      },
      { withCredentials: true }
    );
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
}
export async function getFeedbacksByProductId(productId) {
  const url = `http://localhost:8000/api/shoppi/products/${productId}/feedbacks`;
  const config = { withCredentials: true };
  try {
    const res = await axios.get(url, config);
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
}

export async function getUsers() {
  const url = "http://localhost:8000/api/users";
  try {
    const { data } = await axios.get(url);
    console.log(data.users);
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function login(mail, password) {
  const url = "http://localhost:8000/api/users/login";
  console.log(mail, password);
  try {
    const { data } = await axios.post(
      url,
      {
        mail,
        password,
      },
      { withCredentials: true }
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function register(name, role, mail, password, confirmPassword) {
  const url = "http://localhost:8000/api/users/register";
  try {
    const { data } = await axios.post(url, {
      name,
      role,
      mail,
      password,
      confirmPassword,
    });
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function forgotPassword(mail) {
  console.log(mail);
  const url = "http://localhost:8000/api/users/forgotPassword";
  try {
    const { data } = await axios.post(url, { mail });
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

export async function changePassword(resetToken, password, confirmPassword) {
  const url = `http://localhost:8000/api/users/resetPassword/${resetToken}`;
  // const token = window.location.search.split("?")[1];
  try {
    const { data } = await axios.post(url, { password, confirmPassword });
    return data.message;
  } catch (err) {
    return err.response.data.message;
  }
}
