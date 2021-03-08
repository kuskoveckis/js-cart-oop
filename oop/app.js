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

const screenSize = window.innerWidth;

//CART
let cart = [];
let test = [];

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
    try {
      let response = await fetch("../oop/productsData.json");
      let data = await response.json();
      let products = data.items;
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
        result += `<div class="card-item flex-column" data-prod="${product.id}">
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
  }
  displayNewProducts(products) {
    let result = "";
    const newProducts = products.filter((product) => product.section === "new");
    Storage.saveNewProducts(newProducts);
    newProducts.forEach((product, index) => {
      if (index <= this.prodCount) {
        result += `<div class="card-item flex-column" data-prod="${product.id}">
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
  }

  showMoreProdBtn(products, ev) {
    let buttons = [...document.querySelectorAll(".more-btn")];
    test = buttons; // ! what does this do?
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
  getClickedProduct() {}
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const thumbnails = new Thumbnails();
  const products = new Products();
  const banner = new Banner();

  //sidenav
  ui.sideNav();

  //get banner, thumbnails, products
  banner.getBanner().then((image) => {
    ui.displayBanner(image);
    ui.carousel(image, "touchend");
    ui.carouselBtns(image);
  });

  thumbnails.getThumbnails().then((thumbs) => ui.displayThumbnails(thumbs));

  products.getProducts().then((products) => {
    ui.displayPopularProducts(products);
    ui.displayNewProducts(products);
    ui.productFilterBtns(products);
    ui.showMoreProdBtn(products, "click");
  });
});
