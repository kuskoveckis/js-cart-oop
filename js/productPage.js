import * as data from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  displayProduct();
  // productDescription();
});

const productsArr = data.goodsArr;
// Display product data
function displayProduct() {
  const prodHeading = document.querySelector(".product__header__heading");
  const prodPhoto = document.getElementById("product__img");
  const prodPrice = document.querySelector(".product__price");
  const addBtn = document.querySelectorAll(".product__action__btn");

  const itemToDisplay = localStorage.getItem("itemToDisplay");
  if (itemToDisplay) {
    const item = JSON.parse(itemToDisplay);
    console.log(item);

    prodHeading.textContent = item[0].model;
    prodPhoto.src = item[0].source;
    prodPrice.textContent = item[0].price + "$";
    addBtn.forEach((element) => {
      element.setAttribute("data-prod", item[0].prod);
    });
  }
}

// Product description functionality
const prodDescSection = document.querySelectorAll(".product-description");
const techSpec = document.querySelector(".tech");
const prodDesc = document.querySelector(".desc");
const prodDescBody = document.getElementById("product-description-cont");
const techSpecBody = document.getElementById("tech-spec-desc");

function productDescriptionTech() {
  techSpec.addEventListener("touchend", (e) => {
    if (techSpecBody.classList.contains("hidden")) {
      techSpecBody.classList.remove("hidden");
      techSpec.style.backgroundColor = "#306bf5";
      techSpec.style.color = "white";
    } else {
      techSpecBody.classList.add("hidden");
      techSpec.style.backgroundColor = "#f7f9fc";
      techSpec.style.color = "black";
    }
  });
}

function productDescriptionBody() {
  prodDesc.addEventListener("touchend", (e) => {
    if (prodDescBody.classList.contains("hidden")) {
      prodDescBody.classList.remove("hidden");
      prodDesc.style.backgroundColor = "#306bf5";
      prodDesc.style.color = "white";
    } else {
      prodDescBody.classList.add("hidden");
      prodDesc.style.backgroundColor = "#f7f9fc";
      prodDesc.style.color = "black";
    }
  });
}
productDescriptionTech();
productDescriptionBody();

// ========== CART ===================
//Selected Cart items to Local Storage
let cartLs = [];

function addCartItemsToLS() {
  combineCartItems();
  //addToCart("touchend");
  addToCart("click");
}

addCartItemsToLS();

// check if cart exists and add next item to cart
function combineCartItems() {
  const getCartItem = localStorage.getItem("cart");
  if (getCartItem) {
    const cartItem = JSON.parse(getCartItem);
    //console.log(cartItem);
    cartLs = [...cartItem];
  }
}

// add cart items to local storage
function checkItemExists(x) {
  let cartArr = cartLs.flat(2);
  let result;
  console.log(cartArr);
  if (cartLs.length < 1 || cartLs == undefined) {
    return "empty";
  } else {
    for (let i = 0; i < cartArr.length; i++) {
      if (cartArr[i].prod == x) {
        result = true;
        break;
      } else {
        result = false;
      }
    }
    console.log(result);
    return result;
  }
}

function addToCart(ev) {
  const addToCartBtn = document.querySelector(".product__action__btn");
  addToCartBtn.addEventListener(ev, (e) => {
    // get product number
    const prodNr = parseInt(e.target.dataset.prod);
    console.log(prodNr);
    // get product from database/array
    //TODO can also get item from itemToDisplay local storage
    const addedProd = productsArr.filter((item) => {
      if (item.prod === prodNr) {
        item.amount = 1;
        return item;
      }
    });
    // check if item in array
    console.log(checkItemExists(prodNr));
    if (checkItemExists(prodNr) === false || checkItemExists(prodNr) === "empty" || isNaN(checkItemExists(prodNr))) {
      // add product to local storage
      cartLs.push(addedProd);
      //console.log(cartLs);
      localStorage.setItem("cart", JSON.stringify(cartLs));
      cartBadge();
      generateCartItems();
      //TODO change button to action or make alert
    } else if (checkItemExists(prodNr) === true) {
      addToCartBtn.innerHTML = "Item in cart";
      addToCartBtn.style.backgroundColor = "#39c176";
      //cartBadge();
      //generateCartItems();
    }
  });
}

const cartItems = localStorage.getItem("cart");

function cartBadge() {
  const cartBadge = document.querySelector(".nav__cart--count");
  const cartItems = localStorage.getItem("cart");
  if (cartItems) {
    let amount = 0;
    let cartNumber = JSON.parse(cartItems).flat(2);
    cartNumber.map((item) => {
      amount += item.amount;
    });

    if (cartNumber !== undefined || cartNumber !== null) {
      // add cart badge
      cartBadge.textContent = amount;
      cartBadge.style.backgroundColor = "#ffd600";
    }
  }
  // remove cart badge
  else {
    cartBadge.textContent = "";
    cartBadge.style.backgroundColor = "white";
  }
}

const cartItemsCont = document.querySelector(".cart-item-container");

function generateCartItems() {
  const cartItemsCont = document.querySelector(".cart-item-container");
  const cartItems = localStorage.getItem("cart");

  if (cartItems) {
    const cart = JSON.parse(cartItems).flat(2);

    let displayCartItems = cart.map((item) => {
      return `<div class="cart-item cart-grid" data-prod="${item.prod}">
                    <div class="cart-item__img">
                      <img src="${item.source}" alt="product image" />
                    </div>
                    <div class="cart-item__description flex-column">
                      <h4 class="cat-item__category">${item.category}</h4>
                      <h4 class="cart-item__model">${item.model}</h4>
                      <h4 class="cart-item__brand">${item.brand}</h4>
                      <span class="cart-item__price">${item.price} $</span>
                      <span class="cart-item__remove-btn" data-prod="${item.prod}">remove item</span>
                    </div>
                    <div class="cart-item__amend flex-column">
                      <i class="fas fa-plus cart--add" data-prod="${item.prod}"></i>
                      <span class="cart-item__qty">${item.amount}</span>
                      <i class="fas fa-minus cart--subtract" data-prod="${item.prod}"></i>
                    </div>
                  </div>`;
    });
    displayCartItems = displayCartItems.join("");
    cartItemsCont.innerHTML = displayCartItems;

    displayCartSummary(cart);
    emptyCart("touchend");
    emptyCart("click");
    changeQty("touchend");
    changeQty("click");

    removeCartItem("click");
  } else {
    const displayEmptyCart = `<div>
                                 <p>No items in cart</p>
                               </div>`;
    cartItemsCont.innerHTML = displayEmptyCart;
  }
}

function changeQty(ev) {
  const cartItems = document.querySelectorAll(".cart-item");
  const addQty = document.querySelectorAll(".cart--add");
  const subtractQty = document.querySelectorAll(".cart--subtract");
  //get cart items
  const cartArr = localStorage.getItem("cart");
  if (cartArr) {
    const cart = JSON.parse(cartArr).flat(2);
    // ADD qty
    addQty.forEach((symbol) => {
      symbol.addEventListener(ev, (e) => {
        // get clickable product number
        let prodNr = e.target.dataset.prod;
        console.log(prodNr);
        console.log(cart);
        let updatedCart = cart.map((item) => {
          if (item.prod === parseInt(prodNr)) {
            item.amount = item.amount + 1;
            //cartLs.push(item);
            return item;
          } else {
            //cartLs.push(item);
            return item;
          }
        });
        console.log(updatedCart);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        cartBadge();
        generateCartItems();
      });
    });
    // SUBTRACT qty
    subtractQty.forEach((symbol) => {
      symbol.addEventListener(ev, (e) => {
        // get clickable product number
        let prodNr = e.target.dataset.prod;
        console.log(prodNr);
        console.log(cart);
        let updatedCart = cart.map((item) => {
          if (item.prod === parseInt(prodNr) && item.amount > 1) {
            item.amount = item.amount - 1;
            //cartLs.push(item);
            return item;
          } else {
            //cartLs.push(item);
            return item;
          }
        });
        console.log(updatedCart);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        cartBadge();
        generateCartItems();
      });
    });
  }
}

function displayCartSummary(cart) {
  const cartSummary = document.querySelector(".cart-summary");
  // get total price of items
  let cartTotal = 0;
  cart.map((item) => {
    cartTotal += parseFloat(item.price) * parseFloat(item.amount);
  });

  let generateCartSummary = `<h2>Cart total: ${cartTotal.toFixed(2)}$</h2>
                             <button class="cart__empty">Empty cart</button>
                             <button class="cart__proceed">Proceed to checkout</button>`;

  cartSummary.innerHTML = generateCartSummary;
}

function removeCartItem(ev) {
  const cartSummary = document.querySelector(".cart-summary");
  const addToCartBtn = document.querySelector(".product__action__btn");
  const removeBtn = document.querySelectorAll(".cart-item__remove-btn");
  const cartArr = localStorage.getItem("cart");
  const cart = JSON.parse(cartArr).flat(2);
  removeBtn.forEach((btn) => {
    btn.addEventListener(ev, (e) => {
      let prodNr = e.target.dataset.prod;
      // remove item from cart local storage
      let itemIndex = cart.findIndex((item) => item.prod == prodNr);
      cart.splice(itemIndex, 1);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(cart));
      // remove item from cartLs array
      let cartLsItemIndex = cartLs.findIndex((item) => item.prod == prodNr);
      cartLs.splice(cartLsItemIndex, 1);
      if (cart.length >= 1) {
        generateCartItems();
        cartBadge();
        addToCartBtn.innerHTML = "Add to cart";
        addToCartBtn.style.backgroundColor = "#ffd600";
      } else {
        localStorage.removeItem("cart");
        cartLs.length = 0;
        generateCartItems();
        cartSummary.innerHTML = "";
        cartBadge();
        addToCartBtn.innerHTML = "Add to cart";
        addToCartBtn.style.backgroundColor = "#ffd600";
      }
    });
  });
}

function emptyCart(ev) {
  const emptyCartBtn = document.querySelector(".cart__empty");
  const cartSummary = document.querySelector(".cart-summary");
  const addToCartBtn = document.querySelector(".product__action__btn");
  emptyCartBtn.addEventListener(ev, () => {
    localStorage.removeItem("cart");
    cartLs.length = 0;
    generateCartItems();
    cartSummary.innerHTML = "";
    cartBadge();
    addToCartBtn.innerHTML = "Add to cart";
    addToCartBtn.style.backgroundColor = "#ffd600";
  });
}
