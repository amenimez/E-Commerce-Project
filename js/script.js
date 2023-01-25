// Add user into LS (users)
function signup() {
  // Return all objects into users key from LS users = [{},{},{}]
  var usersTab = JSON.parse(localStorage.getItem("users") || "[]");
  // get values from inputs
  var firstName = document.getElementById("firstNameId").value;
  verification(
    "firstNameError",
    "First name must have at least 3 chars",
    firstName.length < 3
  );
  var lastName = document.getElementById("lastNameId").value;
  verification(
    "lastNameError",
    "Last name must have at least 5 chars",
    lastName.length < 5
  );
  var email = document.getElementById("emailId").value;
  verification("emailError", "Email exist", checkEmail(usersTab, email));
  var pwd = document.getElementById("pwdId").value;
  if (pwd.length > 12 || pwd.length < 6) {
    document.getElementById("pwdError").innerHTML = "Pwd betwenn 6 and 12";
  } else {
    document.getElementById("pwdError").innerHTML = "";
  }
  var tel = document.getElementById("telId").value;
  if (tel.length != 8) {
    document.getElementById("telError").innerHTML = "Tel must be correct";
  } else {
    document.getElementById("telError").innerHTML = "";
  }
  if (
    firstName.length >= 3 &&
    lastName.length >= 5 &&
    pwd.length >= 6 &&
    pwd.length <= 12 &&
    tel.length == 8 &&
    !checkEmail(usersTab, email)
  ) {
    // create JSON Object
    var userObj = {
      id: maxId(usersTab) + 1,
      firstName: firstName,
      lastName: lastName,
      email: email,
      pwd: pwd,
      tel: tel,
      role: "client",
    };

    // save object into DB
    // localStorage.setItem("users", JSON.stringify(user));
    // insert user object into array
    usersTab.push(userObj);
    // users = [{},{},{},{}]
    localStorage.setItem("users", JSON.stringify(usersTab));
  }
}

// Function that displays error message into span
function verification(spanId, msg, condition) {
  if (condition) {
    document.getElementById(spanId).innerHTML = msg;
  } else {
    document.getElementById(spanId).innerHTML = "";
  }
}

// Add Product into LS (products)
function addProduct() {
  var productName = document.getElementById("productNameId").value;
  verification(
    "productNameError",
    "Product name must have at least 3 chars",
    productName.length < 3
  );
  var price = document.getElementById("priceId").value;
  verification(
    "priceError",
    "Price must be greater then 0",
    Number(price) <= 0
  );
  var category = document.getElementById("categoryId").value;
  verification(
    "categoryError",
    "Category must have at least 5 chars",
    category.length < 5
  );
  var stock = document.getElementById("stockId").value;
  verification(
    "stockError",
    "Stock must be greater then 10",
    Number(stock) < 10
  );

  if (
    productName.length >= 3 &&
    Number(price) > 0 &&
    category.length >= 5 &&
    Number(stock) >= 10
  ) {
    // get all products from LS
    var productsTab = JSON.parse(localStorage.getItem("products") || "[]");
    var connectedUser = localStorage.getItem("connectedUser");
    // create product object
    var product = {
      id: maxId(productsTab) + 1,
      name: productName,
      price: price,
      category: category,
      stock: stock,
      idUser: connectedUser
    };

    // add product object to productsTab
    productsTab.push(product);
    // set productsTab into LS
    localStorage.setItem("products", JSON.stringify(productsTab));
    // Go to index page
    location.replace("showProducts.html");
  }
}

// Check if email exists into Array
function checkEmail(T, ch) {
  var emailExist = false;
  for (let i = 0; i < T.length; i++) {
    if (T[i].email == ch) {
      emailExist = true;
      break;
    }
  }
  console.log("emailExist variable", emailExist);
  return emailExist;
}

// Display All Products Function
function displayAllProducts() {
  var productsTab = getFromLS("products");
  var result = "";
  for (let i = 0; i < productsTab.length; i++) {
    result =
      result +
      ` <tr>
          <td>${productsTab[i].name}</td>
          <td>${productsTab[i].price}</td>
          <td>${productsTab[i].stock}</td>
          <td>${productsTab[i].category}</td>
          <td>
            <button class="btn btn-success">Display</button>
            <button class="btn btn-warning">Edit</button>
            <button class="btn btn-danger">Delete</button>
          </td>
      </tr>`;
  }
  document.getElementById("productsTable").innerHTML = result;
}

function getFromLS(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function showProducts() {
  var productsTab = getFromLS("products");
  var result = "";
  for (let i = 0; i < productsTab.length; i++) {
    result += `
    <div class="col-lg-4 col-md-6">
							<div class="single-product">
								<img class="img-fluid" src="img/product/p1.jpg" alt="">
								<div class="product-details">
									<h6>${productsTab[i].name}</h6>
									<div class="price">
										<h6>${productsTab[i].price} $</h6> <br>
										<h6>${productsTab[i].stock} pieces </h6>
 									</div>
                  <div>
                      <button onclick="goToProductInfo(${productsTab[i].id})" class="btn btn-warning">Order</button>
                  </div>
								</div>
							</div>
						</div>`;
  }

  console.log("Here result", result);
  document.getElementById("productsBloc").innerHTML = result;
}

function goToProductInfo(productId) {
  localStorage.setItem("prId", productId);
  location.replace("productDetails.html");
}

function maxId(T) {
  var max;
  if (T.length == 0) {
    max = 0;
  } else {
    max = T[0].id;
    for (let i = 1; i < T.length; i++) {
      if (T[i].id > max) {
        max = T[i].id;
      }
    }
  }
  return max;
}

function displayProductDetails() {
  // Get ID from LS
  var idP = localStorage.getItem("prId");
  console.log("Here idP", idP);
  // Get all products objects from LS
  var productsTab = getFromLS("products");
  console.log("Here productsTab", productsTab);
  // Initialize Var
  var product = {};
  // Search product by ID
  for (let i = 0; i < productsTab.length; i++) {
    if (productsTab[i].id == idP) {
      product = productsTab[i];
      break;
    }
  }
  document.getElementById("prName").innerHTML = product.name;
  document.getElementById("prPrice").innerHTML = product.price;
  document.getElementById("prCategory").innerHTML = product.category;
}

function addToCart() {
  var qty = document.getElementById("qtyId").value;
  var idP = localStorage.getItem("prId");
  // Get all products objects from LS
  var productsTab = getFromLS("products");
  var product = {};
  for (let i = 0; i < productsTab.length; i++) {
    if (productsTab[i].id == idP) {
      product = productsTab[i];
      break;
    }
  }
  if (Number(product.stock) >= Number(qty) && Number(qty) > 0) {
    var orders = getFromLS("orders");
    var connectedUser = localStorage.getItem("connectedUser");
    var productId = localStorage.getItem("prId");
    var order = {
      id: maxId(orders) + 1,
      idProduct: productId,
      idUser: connectedUser,
      qty: qty,
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Update stock qty
    // get all products from LS
    var products = getFromLS("products");
    for (let i = 0; i < products.length; i++) {
      if (products[i].id == productId) {
        products[i].stock = Number(products[i].stock) - Number(qty);
        break;
      }
    }
    localStorage.setItem("products", JSON.stringify(products));
    location.replace("basket.html");
  } else {
    document.getElementById("qtyError").innerHTML = "Not Available";
  }
}

function login() {
  var usersTab = getFromLS("users");
  var email = document.getElementById("userEmail").value;
  var pwd = document.getElementById("userPwd").value;

  var isLoggedIn = false;
  for (let i = 0; i < usersTab.length; i++) {
    if (usersTab[i].email == email && usersTab[i].pwd == pwd) {
      localStorage.setItem("connectedUser", usersTab[i].id);
      isLoggedIn = true;
      role = usersTab[i].role;
      break;
    }
  }

  if (isLoggedIn) {
    if (role == "admin") {
      location.replace("admin.html");
    } else if (role == "client") {
      location.replace("showProducts.html");
    } else {
      location.replace("mySpace.html");
    }
  } else {
    document.getElementById("userError").innerHTML = "Please check Email/Pwd";
  }
}

function myOrders() {
  var orders = getFromLS("orders");
  var connectedUser = localStorage.getItem("connectedUser");

  var myOrdersTab = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].idUser == connectedUser) {
      myOrdersTab.push(orders[i]);
    }
  }
  var result = "";
  for (let i = 0; i < myOrdersTab.length; i++) {
    result += `
    <tr>
                              <td>
                              ${myOrdersTab[i].id}
                              </td>    
                            <td>
                                    <div class="media">
                                        <div class="d-flex">
                                            <img src="img/cart.jpg" alt="">
                                        </div>
                                        <div class="media-body">
                                            <p>${searchProductById(
      myOrdersTab[i].idProduct
    ).name
      }</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <h5>${searchProductById(
        myOrdersTab[i].idProduct
      ).price
      }</h5>
                                </td>
                                <td>
                                    ${myOrdersTab[i].qty}
                                </td>
                                <td>
                                    <h5>$720.00</h5>
                                </td>
                                <td>
                                    <button class="btn btn-danger" onclick="deleteOrder(${myOrdersTab[i].id
      })">Delete</button>
                                </td>
                            </tr>
    `;
  }

  document.getElementById("myOrdersId").innerHTML = result;
}

// Search Product By ID
function searchProductById(id) {
  var products = getFromLS("products");
  var findedProduct;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      findedProduct = products[i];
      break;
    }
  }
  return findedProduct;
}

function deleteOrder(id) {
  // Get all Orders
  var ordersTab = getFromLS("orders");
  var obj;
  for (let i = 0; i < ordersTab.length; i++) {
    if (ordersTab[i].id == id) {
      obj = ordersTab[i];
      ordersTab.splice(i, 1);
      break;
    }
  }
  // MAJ product stock
  var productsTab = getFromLS("products");
  for (let i = 0; i < productsTab.length; i++) {
    if (productsTab[i].id == obj.idProduct) {
      productsTab[i].stock += Number(obj.qty);
      break;
    }
  }
  localStorage.setItem("products", JSON.stringify(productsTab));
  localStorage.setItem("orders", JSON.stringify(ordersTab));
  location.reload();
}

function generateHeader() {
  var connectedUser = localStorage.getItem("connectedUser");
  // var usersTab = getFromLS("users");
  // var findedUser;
  // for (let i = 0; i < usersTab.length; i++) {
  //   if (usersTab[i].id == connectedUser) {
  //     findedUser = usersTab[i];
  //     break;
  //   }
  // }
  var findedUser = searchObjectById(connectedUser, "users");
  var result = "";
  if (connectedUser) {
    if (findedUser.role == "admin") {
      result = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="showProducts.html">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="basket.html">Basket</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html">Welcome ${findedUser.firstName} ${findedUser.lastName}</a></li>
            <li class="nav-item"><a class="nav-link" href="profile.html">Profile</a></li>
            <li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>
            <li class="nav-item"><a class="nav-link" onclick="logout()">Logout</a></li>
						<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>`;
    } else {
      result = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html">Basket</a></li>
            <li class="nav-item"><a class="nav-link" href="index.html">Welcome ${findedUser.firstName} ${findedUser.lastName}</a></li>
            <li class="nav-item"><a class="nav-link" href="profile.html">Profile</a></li>
            <li class="nav-item"><a class="nav-link" onclick="logout()">Logout</a></li>
						<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>`;
    }
  } else {
    result = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="showProducts.html">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="singup.html">Signup</a></li>
						<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>`;
  }
  document.getElementById("headerID").innerHTML = result;
}
// Generic function that search object By ID from KEY
function searchObjectById(idObj, key) {
  var tab = getFromLS(key);
  var findedObject;
  for (let i = 0; i < tab.length; i++) {
    if (tab[i].id == idObj) {
      findedObject = tab[i];
      break;
    }
  }
  return findedObject;
}


function profile() {
  var connectedUser = localStorage.getItem("connectedUser");
  var user = searchObjectById(connectedUser, "users");
  document.getElementById("fNameId").innerHTML = user.firstName;
  document.getElementById("lNameId").innerHTML = user.lastName;
  document.getElementById("emailId").innerHTML = user.email;
  document.getElementById("telId").innerHTML = user.tel;
}

function adminProducts() {
  var productsTab = getFromLS("products");
  var result = "";
  for (let i = 0; i < productsTab.length; i++) {
    result =
      result +
      ` <tr>
          <td>${productsTab[i].name}</td>
          <td>${productsTab[i].price}</td>
          <td>${productsTab[i].stock}</td>
          <td>${productsTab[i].category}</td>
          <td>
            <button class="btn btn-warning" onclick="editProduct(${productsTab[i].id})" >Edit</button>
          </td>
      </tr>`;
  }
  document.getElementById("productsTableAdmin").innerHTML = result;
}

function shipperProducts() {
  var productsTab = getFromLS("products");
  var connectedUser = localStorage.getItem("connectedUser");
  var result = "";
  for (let i = 0; i < productsTab.length; i++) {
    if (connectedUser == productsTab[i].idUser) {
    result =
      result +
      ` <tr>
          <td>${productsTab[i].name}</td>
          <td>${productsTab[i].price}</td>
          <td>${productsTab[i].stock}</td>
          <td>${productsTab[i].category}</td>
          <td>
            <button class="btn btn-warning" onclick="editProduct(${productsTab[i].id})" >Edit</button>
          </td>
      </tr>`;
  }
  document.getElementById("productsTableShipper").innerHTML = result;
}
}

function displayProducts(T) {
  var result = "";
  for (let i = 0; i < T.length; i++) {
    result =
      result +
      ` <tr>
          <td>${T[i].name}</td>
          <td>${T[i].price}</td>
          <td>${T[i].stock}</td>
          <td>${T[i].category}</td>
          <td>
            <button class="btn btn-warning" onclick="editProduct(${T[i].id})" >Edit</button>
          </td>
      </tr>`;
  }
  document.getElementById("productsTableAdmin").innerHTML = result;
}
function myProducts(id) {
  var productsTab = getFromLS("products");
  var myProducts = [];
  for (let i = 0; i < productsTab.length; i++) {
    if (productsTab[i].idUser == id) {
    myProducts.push(productsTab[i]);
    }
}
return myProducts;
}

function adminUsers() {
  var usersTab = getFromLS("users");
  var result = "";
  for (let i = 0; i < usersTab.length; i++) {
    result =
      result +
      ` <tr>
          <td>${usersTab[i].firstName}</td>
          <td>${usersTab[i].lastName}</td>
          <td>${usersTab[i].email}</td>
          <td>${usersTab[i].tel}</td>
          <td>
            <button class="btn btn-success">Display</button>
            <button class="btn btn-warning">Edit</button>
            <button class="btn btn-danger">Delete</button>
          </td>
      </tr>`;
  }
  document.getElementById("usersTableAdmin").innerHTML = result;
}

function adminOrders() {
  var OrdersTab = getFromLS("orders");
  var result = "";
  for (let i = 0; i < OrdersTab.length; i++) {
    result =
      result +
      ` <tr>
          <td>${OrdersTab[i].id}</td>
          <td>${OrdersTab[i].qty}</td>
          <td>${searchObjectById(OrdersTab[i].idProduct, "products").name}</td>
          <td>${searchObjectById(OrdersTab[i].idProduct, "products").price}</td>
          <td>${searchObjectById(OrdersTab[i].idUser, "users").firstName}</td>
          <td>${searchObjectById(OrdersTab[i].idUser, "users").lastName}</td>
          <td>${searchObjectById(OrdersTab[i].idUser, "users").tel}</td>
          <td>${OrdersTab[i].qty * searchObjectById(OrdersTab[i].idProduct, "products").price}</td>
          <td>
            <button class="btn btn-success">Confirm</button>
          </td>
      </tr>`;
  }
  document.getElementById("ordersTableAdmin").innerHTML = result;
}

function signupAdmin() {
  // Return all objects into users key from LS users = [{},{},{}]
  var usersTab = JSON.parse(localStorage.getItem("users") || "[]");
  // get values from inputs
  var firstName = document.getElementById("firstNameAdminId").value;
  verification(
    "firstNameError",
    "First name must have at least 3 chars",
    firstName.length < 3
  );
  var lastName = document.getElementById("lastNameAdminId").value;
  verification(
    "lastNameError",
    "Last name must have at least 5 chars",
    lastName.length < 5
  );
  var email = document.getElementById("emailAdminId").value;
  verification("emailError", "Email exist", checkEmail(usersTab, email));
  var pwd = document.getElementById("pwdAdminId").value;
  if (pwd.length > 12 || pwd.length < 6) {
    document.getElementById("pwdError").innerHTML = "Pwd betwenn 6 and 12";
  } else {
    document.getElementById("pwdError").innerHTML = "";
  }
  var tel = document.getElementById("telAdminId").value;
  if (tel.length != 8) {
    document.getElementById("telError").innerHTML = "Tel must be correct";
  } else {
    document.getElementById("telError").innerHTML = "";
  }
  if (
    firstName.length >= 3 &&
    lastName.length >= 5 &&
    pwd.length >= 6 &&
    pwd.length <= 12 &&
    tel.length == 8 &&
    !checkEmail(usersTab, email)
  ) {
    // create JSON Object
    var userObj = {
      id: maxId(usersTab) + 1,
      firstName: firstName,
      lastName: lastName,
      email: email,
      pwd: pwd,
      tel: tel,
      role: "admin",
    };

    // save object into DB
    // localStorage.setItem("users", JSON.stringify(user));
    // insert user object into array
    usersTab.push(userObj);
    // users = [{},{},{},{}]
    localStorage.setItem("users", JSON.stringify(usersTab));
  }
}

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("index.html");
}

function editProduct(id) {
  var product = searchObjectById(id, "products");
  console.log('product', product);
  var editForm = `
  <div>
  <div class="col-md-12 form-group" >
      <input type="text" class="form-control" id="newName" value="${product.name}">
  </div>
  <div class="col-md-12 form-group" >
      <input type="number" class="form-control" id="newStock" value=${product.stock}>
  </div>
  <div class="col-md-12 form-group" >
      <input type="number" class="form-control" id="newPrice" value=${product.price}>
  </div>
  <div class="col-md-12 form-group">
  <button type="submit" class="btn btn-success" onclick="validate(${product.id})">Validate</button>
  </div>
</div>`;
  console.log("editForm", editForm);
  document.getElementById("editFormId").innerHTML = editForm;
}
function validate(id) {
  // alert("validate clicked");
  var newName = document.getElementById("newName").value;
  var newStock = document.getElementById("newStock").value;
  var newPrice = document.getElementById("newPrice").value;

  var productsTab = getFromLS("products");
  for (let i = 0; i < productsTab.length; i++) {
    if (productsTab[i].id == id) {
      productsTab[i].name = newName;
      productsTab[i].stock = newStock;
      productsTab[i].price = newPrice;
      break;
    }
  }
  localStorage.setItem("products", JSON.stringify(productsTab));
  location.reload();
  }

  function signupShipper() {
    // Return all objects into users key from LS users = [{},{},{}]
    var usersTab = JSON.parse(localStorage.getItem("users") || "[]");
    // get values from inputs
    var firstName = document.getElementById("firstNameShipperId").value;
    verification(
      "firstNameError",
      "First name must have at least 3 chars",
      firstName.length < 3
    );
    var lastName = document.getElementById("lastNameShipperId").value;
    verification(
      "lastNameError",
      "Last name must have at least 5 chars",
      lastName.length < 5
    );
    var email = document.getElementById("emailShipperId").value;
    verification("emailError", "Email exist", checkEmail(usersTab, email));
    var pwd = document.getElementById("pwdShipperId").value;
    if (pwd.length > 12 || pwd.length < 6) {
      document.getElementById("pwdError").innerHTML = "Pwd betwenn 6 and 12";
    } else {
      document.getElementById("pwdError").innerHTML = "";
    }
    var tel = document.getElementById("telShipperId").value;
    if (tel.length != 8) {
      document.getElementById("telError").innerHTML = "Tel must be correct";
    } else {
      document.getElementById("telError").innerHTML = "";
    }
    if (
      firstName.length >= 3 &&
      lastName.length >= 5 &&
      pwd.length >= 6 &&
      pwd.length <= 12 &&
      tel.length == 8 &&
      !checkEmail(usersTab, email)
    ) {
      // create JSON Object
      var userObj = {
        id: maxId(usersTab) + 1,
        firstName: firstName,
        lastName: lastName,
        email: email,
        pwd: pwd,
        tel: tel,
        role: "shipper",
      };
  
      // save object into DB
      // localStorage.setItem("users", JSON.stringify(user));
      // insert user object into array
      usersTab.push(userObj);
      // users = [{},{},{},{}]
      localStorage.setItem("users", JSON.stringify(usersTab));
    }
  }
