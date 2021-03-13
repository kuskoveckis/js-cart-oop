// OOP
// VARIABLES
const catThumbs = document.getElementById("promo-card-group");
// Sidenav
const sidenav = document.getElementById("sidenav");
const sidenavCloseBtn = document.getElementById("sidenav-close-btn");
const hamburger = document.getElementById("hamburger");
const dropdown = document.getElementById("dropdown--toggle");
const ddCaret = document.getElementById("caret");
const ddMenu = document.getElementById("dropdown__menu");
// banner/carousel
const carousel = document.getElementById("promo-carousel");
const btnLeft = document.getElementById("carousle-btn-left");
const btnRight = document.getElementById("carousle-btn-right");
// product cards
const productCardsContainer = document.querySelectorAll(".product-cards");
// filters select options
const categoriesContainer = document.querySelectorAll(".filter-container");
const filterSelect = document.querySelectorAll(".filter-container");
// cart
const cartSummary = document.querySelector(".cart-summary");
const cartItemsCont = document.querySelector(".cart-item-container");
const navCart = document.querySelector(".nav__cart");
const cartCont = document.querySelector(".cart");
const closeCartBtn = document.getElementById("cart-cls-btn");
const clearCartBtn = document.querySelector(".cart__empty");
const cartBadge = document.querySelector(".nav__cart--count");

const screenSize = window.innerWidth;

//CART
let cart = [];
let btns = [];

class Banner {
  async getBanner() {
    try {
      let response = await fetch("../oop/bannerData.json");
      let data = await response.json();
      let bannerImgs = data.items;
      bannerImgs = bannerImgs.map((img) => {
        const { id } = img.sys;
        const image = img.fields.image.fields.file.url;
        return { id, image };
      });
      return bannerImgs;
    } catch (error) {
      console.log(error);
    }
  }
}

class Thumbnails {
  async getThumbnails() {
    try {
      let response = await fetch("../oop/thumbnailData.json");
      let data = await response.json();
      let thumbs = data.items;
      thumbs = thumbs.map((item) => {
        const { id } = item.sys;
        const { category } = item.fields;
        const image = item.fields.image.fields.file.url;
        return { id, category, image };
      });
      return thumbs;
    } catch (error) {
      console.log(error);
    }
  }
}

class Products {
  async getProducts() {
    // for local json file
    // let response = await fetch("../oop/productsData.json");
    // let data = await response.json();
    const client = contentful.createClient({
      space: "b0pkux0648tu",
      accessToken: "QgNQ-iRJuZvEJ1Ycw5N3XNpt3apNZp6pB7JKFomUO00",
    });
    try {
      let content = await client.getEntries();
      let products = content.items;
      products = products.map((item) => {
        const { id } = item.sys;
        const { brand, model, category, price, section, qty } = item.fields;
        const image = item.fields.image.fields.file.url;
        return { id, brand, model, category, price, section, qty, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  constructor() {
    // initial number of products to display
    if (screenSize < 768) {
      this.prodCount = 3;
    } else {
      this.prodCount = 5;
    }
  }
  uiSetup() {
    this.sideNav();
    this.showCart();
    this.closeCart();
  }
  sideNav() {
    hamburger.addEventListener("click", () => {
      sidenav.style.width = "80vw";
      sidenav.style.boxShadow = "0 0 0 1000px rgba(0,0,0,.50)";
      document.body.classList.add("overflow");
    });

    sidenavCloseBtn.addEventListener("click", () => {
      sidenav.style.width = "0";
      ddMenu.classList.add("hidden");
      sidenav.style.boxShadow = "none";
      document.body.classList.remove("overflow");
    });
    //TODO change to caret
    dropdown.addEventListener("click", () => {
      if (ddMenu.classList !== "hidden") {
        ddCaret.innerHTML = '<i class="fas fa-angle-up"></i>';
      } else {
        ddCaret.innerHTML = '<i class="fas fa-angle-down"></i>';
      }
      ddMenu.classList.toggle("hidden");
    });
  }
  displayBanner(image) {
    carousel.style.backgroundImage = "url(" + image[0].image + ")";
    carousel.classList.add(".banner");
  }
  carousel(image, ev) {
    let bannerCount = 0;
    carousel.addEventListener(ev, () => {
      console.log(screenSize);
      bannerCount += 1;
      const bannerLength = image.length;
      console.log(bannerLength);
      if (bannerCount < bannerLength) {
        carousel.style.backgroundImage = "url(" + image[bannerCount].image + ")";
      } else {
        bannerCount = 0;
        carousel.style.backgroundImage = "url(" + image[0].image + ")";
        console.log(bannerCount);
      }
    });
  }
  carouselBtns(image) {
    const screenSize = window.innerWidth;
    if (screenSize >= 768) {
      btnLeft.style.display = "block";
      btnRight.style.display = "block";

      carousel.addEventListener("mouseover", () => {
        btnLeft.style.backgroundColor = "rgb(255, 255, 255)";
        btnRight.style.backgroundColor = "rgb(255, 255, 255)";
      });

      carousel.addEventListener("mouseout", () => {
        btnLeft.style.backgroundColor = "rgb(255, 255, 255, 0.7)";
        btnRight.style.backgroundColor = "rgb(255, 255, 255, 0.7)";
      });

      let bannerCount = 0;
      const bannerLength = image.length;
      const lastEl = image.length - 1;

      btnRight.addEventListener("click", () => {
        bannerCount += 1;
        if (bannerCount < bannerLength) {
          carousel.style.backgroundImage = "url(" + image[bannerCount].image + ")";
        } else {
          bannerCount = 0;
          carousel.style.backgroundImage = "url(" + image[0].image + ")";
        }
      });
      btnLeft.addEventListener("click", () => {
        bannerCount -= 1;
        if (bannerCount >= 0) {
          carousel.style.backgroundImage = "url(" + image[bannerCount].image + ")";
        } else if (bannerCount < 0) {
          bannerCount = lastEl;
          carousel.style.backgroundImage = "url(" + image[lastEl].image + ")";
        }
      });
    }
  }

  displayThumbnails(thumbs) {
    let result = "";
    thumbs.forEach((thumbnail) => {
      result += `<div class="flex-column thumbCard">
              <div class="thumbCard-img-container">
                <a href="#"><img class="thumbCard__img" src="${thumbnail.image}"></a>
              </div>  
              <div class="thumbCard__header">${thumbnail.category}</div>
            </div>`;
    });
    catThumbs.innerHTML = result;
  }
  displayPopularProducts(products) {
    let result = "";
    const popularProducts = products.filter((product) => product.section === "popular");
    Storage.savePopularProducts(popularProducts);
    popularProducts.forEach((product, index) => {
      if (index <= this.prodCount) {
        result += `<div class="card-item flex-column" data-id="${product.id}" data-section="${product.section}">
              <div class="card-img-container">
                <a href="products.html"> 
                  <img class="card__img" src="${product.image}">
                </a>
              </div>  
              <div class="card-item__category card-text">${product.category}</div>
              <div class="card-item__model card-text">${product.model}</div>
              <div class="card-item__brand card-text">${product.brand}</div>
              <div class="card-item__price card-text">${product.price} $</div>
              <div class="card-underline"></div>
            </div>`;
      }
    });
    productCardsContainer[0].innerHTML = result;
    // save clicked product to local storage
    const productCard = document.querySelectorAll(".card-item");
    this.getClickedProduct(productCard);
  }
  displayNewProducts(products) {
    let result = "";
    const newProducts = products.filter((product) => product.section === "new");
    Storage.saveNewProducts(newProducts);
    newProducts.forEach((product, index) => {
      if (index <= this.prodCount) {
        result += `<div class="card-item flex-column" data-id="${product.id}" data-section="${product.section}">
              <div class="card-img-container">
                <a href="products.html">
                  <img class="card__img" src="${product.image}">
                </a>
              </div>  
              <div class="card-item__category card-text">${product.category}</div>
              <div class="card-item__model card-text">${product.model}</div>
              <div class="card-item__brand card-text">${product.brand}</div>
              <div class="card-item__price card-text">${product.price} $</div>
              <div class="card-underline"></div>
            </div>`;
      }
    });
    productCardsContainer[1].innerHTML = result;
    // save clicked product to local storage
    const productCard = document.querySelectorAll(".card-item");
    this.getClickedProduct(productCard);
  }

  showMoreProdBtn(products, ev) {
    let buttons = [...document.querySelectorAll(".more-btn")];
    btns = buttons; // ! what does this do?
    buttons.forEach((btn) => {
      btn.addEventListener(ev, (e) => {
        let productQty;
        const currentBtn = e.target.dataset.id;
        if (screenSize < 768) {
          this.prodCount += 2;
        } else {
          this.prodCount += 6;
        }

        if (currentBtn === "popular") {
          this.displayPopularProducts(products);
          productQty = Storage.getPopularProducts().length - 1;
        } else if (currentBtn === "new") {
          this.displayNewProducts(products);
          productQty = Storage.getNewProducts().length - 1;
        }

        if (this.prodCount >= productQty) {
          this.prodCount = productQty;
          btn.style.display = "none";
        }
      });
    });
  }
  productFilterBtns(products) {
    // get products
    let popularProducts = Storage.getPopularProducts();
    let newProducts = Storage.getNewProducts();

    //get filter options for each product section
    const popularItemCategories = popularProducts.reduce(
      (values, catItem) => {
        if (!values.includes(catItem.category)) {
          values.push(catItem.category);
        }
        return values;
      },
      ["All"]
    );

    const newItemCategories = newProducts.reduce(
      (values, catItem) => {
        if (!values.includes(catItem.category)) {
          values.push(catItem.category);
        }
        return values;
      },
      ["All"]
    );
    // insert into DOM
    //popular prod
    const popularItems = popularItemCategories
      .map((category) => {
        return `<option class="filter-option" value="${category}">${category}</option>`;
      })
      .join("");
    categoriesContainer[0].innerHTML = popularItems;
    // new prod
    const newItem = newItemCategories
      .map((category) => {
        return `<option class="filter-option" value="${category}">${category}</option>`;
      })
      .join("");
    categoriesContainer[1].innerHTML = newItem;

    // filter btn functionality
    filterSelect.forEach((select) => {
      select.addEventListener("change", (e) => {
        const selectValue = select.name;
        const optionCat = e.target.value;

        //filter popular prod
        let filteredPopular = popularProducts.filter((prodItem) => {
          if (prodItem.category === optionCat) {
            return prodItem;
          }
        });
        // filter new prod
        let filteredNew = newProducts.filter((prodItem) => {
          if (prodItem.category === optionCat) {
            return prodItem;
          }
        });
        //insert into DOM
        if (selectValue === "popular") {
          if (optionCat === "All") {
            this.displayPopularProducts(products);
          } else {
            this.displayPopularProducts(filteredPopular);
          }
        } else if (selectValue === "new") {
          if (optionCat === "All") {
            this.displayNewProducts(products);
          } else {
            this.displayNewProducts(filteredNew);
          }
        }
      });
    });
  }

  showCart() {
    navCart.addEventListener("click", () => {
      cartCont.style.width = "100vw";
    });
  }
  closeCart() {
    closeCartBtn.addEventListener("click", () => {
      cartCont.style.width = "0";
    });
  }
  getClickedProduct(cards) {
    cards.forEach((item) => {
      item.addEventListener("click", (e) => {
        // get product number
        const productNumber = e.currentTarget.dataset.id;
        // get product section
        const section = e.currentTarget.dataset.section;
        // get clicked product
        let products = Storage.getPopularProducts();
        section === "popular" ? (products = Storage.getPopularProducts()) : (products = Storage.getNewProducts());
        const clickedItem = products.filter((item) => {
          if (item.id == productNumber) {
            return item;
          }
        });
        //save clicked product to local storage
        Storage.saveItemToDisplay(clickedItem);
      });
    });
  }
}

class Cart {
  setupApp() {
    cart = Storage.getCart();
    this.generateCartItems(cart);
    this.displayCartSummary(cart);
    this.cartBadge();
  }
  generateCartItems(cart) {
    if (cart.length > 0) {
      // cart = JSON.parse(cartItems).flat(2);
      let displayCartItems = cart.map((item) => {
        return `<div class="cart-item cart-grid" data-id="${item.id}">
                   <div class="cart-item__img">
                     <img src="${item.image}" alt="product image" />
                   </div>
                   <div class="cart-item__description flex-column">
                     <h4 class="cat-item__category">${item.category}</h4>
                     <h4 class="cart-item__model">${item.model}</h4>
                     <h4 class="cart-item__brand">${item.brand}</h4>
                     <span class="cart-item__price">${item.price} $</span>
                     <span class="cart-item__remove-btn" data-id="${item.id}">remove item</span>
                   </div>
                   <div class="cart-item__amend flex-column">
                     <i class="fas fa-plus cart--add" data-id="${item.id}"></i>
                     <span class="cart-item__qty">${item.amount}</span>
                     <i class="fas fa-minus cart--subtract" data-id="${item.id}"></i>
                   </div>
                 </div>`;
      });
      displayCartItems = displayCartItems.join("");
      cartItemsCont.innerHTML = displayCartItems;
      // remove individual product btn func.
      this.removeCartItem();
      // change product qty func.
      this.addQty();
      this.subtractQty();
    } else {
      this.blankCart(cart);
    }
  }
  displayCartSummary(cart) {
    // get total price of items
    let cartTotal = 0;
    cart.map((item) => {
      cartTotal += parseFloat(item.price) * parseFloat(item.amount);
    });

    let generateCartSummary = `<h2>Cart total: ${cartTotal.toFixed(2)}$</h2>`;

    cartSummary.innerHTML = generateCartSummary;
  }
  blankCart(cart) {
    const displayEmptyCart = `<div>
                                <p>No items in cart</p>
                              </div>`;
    cartItemsCont.innerHTML = displayEmptyCart;
  }
  clearCart() {
    localStorage.removeItem("cart");
    cart.length = 0;
    this.getAddToCartBtn();
  }
  getAddToCartBtn() {
    const addToCartBtn = document.getElementById("product__action__btn");
    if (addToCartBtn) {
      console.log("true");
      const btnId = addToCartBtn.dataset.id;
      const inCart = cart.find((item) => item.id === btnId);
      if (inCart) {
        addToCartBtn.innerHTML = "In Cart";
        addToCartBtn.disabled = true;
        addToCartBtn.style.backgroundColor = "#39c176";
      } else {
        addToCartBtn.innerHTML = "Add item";
        addToCartBtn.disabled = false;
        addToCartBtn.style.backgroundColor = "#ffd600";
      }
    } else {
      console.log("false");
    }
  }
  addToCart() {
    const addToCartBtn = document.getElementById("product__action__btn");

    addToCartBtn.addEventListener("click", (e) => {
      // get product id
      const prodId = e.target.dataset.id;
      const prodSection = e.target.dataset.section;
      console.log(prodId);
      console.log(prodSection);
      // get product from local storage
      let products = [];
      prodSection === "popular" ? (products = Storage.getPopularProducts()) : (products = Storage.getNewProducts());
      console.log(products);
      let product = products.filter((item) => {
        if (item.id === prodId) {
          item.amount = 1;
          return item;
        }
      });
      // add item to cart
      cart.push(product);
      // add product to local storage
      Storage.saveCart(cart.flat(2));
      // generateCartItems();
      this.setupApp();
      // disable add button
      this.getAddToCartBtn();
      // cartBadge();
    });
  }
  cartBadge() {
    let amount = 0;
    if (cart.length > 0) {
      cart.map((item) => {
        amount += item.amount;
      });
      cartBadge.textContent = amount;
      cartBadge.style.backgroundColor = "#ffd600";
    } else {
      cartBadge.textContent = "";
      cartBadge.style.backgroundColor = "white";
    }
  }
  removeCartItem() {
    const removeButtons = [...document.querySelectorAll(".cart-item__remove-btn")];
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let prodId = e.target.dataset.id;
        let newCart = cart.filter((item) => item.id !== prodId);
        Storage.saveCart(newCart);
        this.setupApp();
        this.getAddToCartBtn();
      });
    });
  }
  addQty() {
    const addQtyBtns = [...document.querySelectorAll(".cart--add")];
    addQtyBtns.forEach((symbol) => {
      symbol.addEventListener("click", (e) => {
        // get clickable product number
        let prodId = e.target.dataset.id;
        let updatedCart = cart.map((item) => {
          if (item.id === prodId) {
            item.amount = item.amount + 1;
            return item;
          } else {
            return item;
          }
        });
        Storage.saveCart(updatedCart);
        this.setupApp();
      });
    });
  }
  subtractQty() {
    const subtractQty = [...document.querySelectorAll(".cart--subtract")];
    subtractQty.forEach((symbol) => {
      symbol.addEventListener("click", (e) => {
        // get clickable product number
        let prodId = e.target.dataset.id;
        let updatedCart = cart.map((item) => {
          if (item.id === prodId && item.amount > 1) {
            item.amount = item.amount - 1;
            return item;
          } else {
            return item;
          }
        });
        Storage.saveCart(updatedCart);
        this.setupApp();
      });
    });
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
      this.setupApp();
    });
  }
}

class Storage {
  static savePopularProducts(products) {
    localStorage.setItem("popularProducts", JSON.stringify(products));
  }
  static saveNewProducts(products) {
    localStorage.setItem("newProducts", JSON.stringify(products));
  }
  static getPopularProducts() {
    let products = JSON.parse(localStorage.getItem("popularProducts"));
    return products;
  }
  static getNewProducts() {
    let products = JSON.parse(localStorage.getItem("newProducts"));
    return products;
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
  static saveItemToDisplay(item) {
    localStorage.setItem("itemToDisplay", JSON.stringify(item));
  }
  static getItemToDisplay() {
    return localStorage.getItem("itemToDisplay") ? JSON.parse(localStorage.getItem("itemToDisplay")) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const newCart = new Cart();
  const thumbnails = new Thumbnails();
  const products = new Products();
  const banner = new Banner();

  //sidenav
  ui.uiSetup();

  newCart.cartLogic();
  newCart.setupApp();
  newCart.getAddToCartBtn();

  // get and display banner/hero
  banner.getBanner().then((image) => {
    ui.displayBanner(image);
    ui.carousel(image, "touchend");
    ui.carouselBtns(image);
  });
  // get and display thumbnails
  thumbnails.getThumbnails().then((thumbs) => ui.displayThumbnails(thumbs));
  // get and display products
  products
    .getProducts()
    .then((products) => {
      ui.displayPopularProducts(products);
      ui.displayNewProducts(products);
      ui.productFilterBtns(products);
      ui.showMoreProdBtn(products, "click");
    })
    .then(() => {
      // cart.cartLogic();
    });
});

export { UI, Cart, Storage, cart };
