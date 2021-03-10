import { UI, Cart, Storage, cart } from "./app.js";

// OOP
// product description
const techSpec = document.querySelector(".tech");
const prodDesc = document.querySelector(".desc");
const prodDescBody = document.getElementById("product-description-cont");
const techSpecBody = document.getElementById("tech-spec-desc");
// displaying product on page
const prodHeading = document.querySelector(".product__header__heading");
const prodPhoto = document.getElementById("product__img");
const prodPrice = document.querySelector(".product__price");
const addBtn = document.querySelectorAll(".product__action__btn");
const addToCartBtn = document.getElementById("product__action__btn");

// const screenSize = window.innerWidth;

class ProductPageUI {
  productDescriptionTech() {
    techSpec.addEventListener("click", (e) => {
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
  productDescriptionBody() {
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
  displayIndividualProduct() {
    const item = Storage.getItemToDisplay();

    prodHeading.textContent = item[0].model;
    prodPhoto.src = item[0].image;
    prodPrice.textContent = item[0].price + "$";
    addBtn.forEach((element) => {
      element.setAttribute("data-id", item[0].id);
      element.setAttribute("data-section", item[0].section);
    });
  }
  getAddToCartBtn() {
    addToCartBtn.addEventListener("click", (e) => {
      // get product id
      const prodId = parseInt(e.target.dataset.id);
      const prodSection = e.target.dataset.section;
      console.log(prodId);
      console.log(prodSection);
      // get product from local storage
      let products = [];
      prodSection === "popular" ? (products = Storage.getPopularProducts()) : (products = Storage.getNewProducts());
      console.log(products);
      let product = products.filter((item) => {
        if (parseInt(item.id) === prodId) {
          item.amount = 1;
          return item;
        }
      });

      // check if item in array
      console.log(product);
      // add product to local storage
      cart.push(product);
      Storage.saveCart(cart.flat(2));
      console.log(cart);
      // localStorage.setItem("cart", JSON.stringify(cartLs));
      // cartBadge();
      // generateCartItems();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pageUI = new ProductPageUI();
  pageUI.productDescriptionTech();
  pageUI.productDescriptionBody();
  pageUI.displayIndividualProduct();
  pageUI.getAddToCartBtn();
});
