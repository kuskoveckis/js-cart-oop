import * as data from "./data.js";

console.log(data.thumb[0].category);

window.onload = () => {
  carousel.classList.add(".banner");
  carousel.style.backgroundImage = "url(" + data.banner[0].source + ")";

  displayThumbCards(data.thumb);

  displayProductCards(productCardsContainer[0], data.productsPopular); //TODO add if statement for class/id check?
  displayProductCards(productCardsContainer[1], data.productsNew); //TODO add if statement for class/id check?

  filterBtns(categoriesContainer[0], data.productsPopular); //TODO add if statement for class/id check?
  //filterBtns(categoriesContainer[1], data.productsNew); //TODO add if statement for class/id check?
};

// ================FUNCTIONS===============
// ========================================

// Carousel banner
const carousel = document.getElementById("promo-carousel");
let bannerCount = 0;

carousel.addEventListener("touchend", () => {
  bannerCount += 1;
  if (bannerCount < 6) {
    //TODO change int parameter for dynamic
    carousel.style.backgroundImage = "url(" + data.banner[bannerCount].source + ")";
  } else {
    bannerCount = 0;
    carousel.style.backgroundImage = "url(" + data.banner[0].source + ")";
    console.log(bannerCount);
  }
});

// Promo card group (Catalog thumbs)
const catThumbs = document.getElementById("promo-card-group");

function displayThumbCards(arr) {
  let thumbCardsItems = arr.map((item) => {
    return `<div class="flex-column thumbCard">
              <a href="${item.href}"><img class="thumbCard__img" src="${item.source}"></a>
              <div class="thumbCard__header">${item.category}</div>
            </div>`;
  });
  thumbCardsItems = thumbCardsItems.join("");
  catThumbs.innerHTML = thumbCardsItems;
}

// Filters select options
const categoriesContainer = document.querySelectorAll(".filter-container");

//TODO add if statement for class/id check?
function filterBtns(section, arr) {
  const itemCategories = arr.reduce(
    (values, catItem) => {
      if (!values.includes(catItem.category)) {
        values.push(catItem.category);
      }
      return values;
    }
    ["All"]
  );

  const categoryOption = itemCategories
    .map((category) => {
      return `<option class="filter-option" value="${category}" >${category}</option>`;
    })
    .join("");

  section.innerHTML = categoryOption;

  const filterSelect = document.querySelectorAll(".filter-container");
  console.log(filterSelect);

  //! filter btn functionality
  filterSelect.forEach(function (select) {
    select.addEventListener("change", function (e) {
      const selectValue = select.name;
      const optionCat = e.target.value;
      console.log(selectValue);
      console.log(optionCat);

      const products = data.productsPopular.filter(function (prodItem) {
        if (prodItem.category === optionCat) {
          return prodItem;
        }
      });
      console.log(products);
      if (selectValue === "popular") {
        if (optionCat === "All") {
          displayProductCards(productCardsContainer[0], data.productsPopular);
        } else {
          displayProductCards(productCardsContainer[0], products);
        }
      }
    });
  });
}

// Product cards

const productCardsContainer = document.querySelectorAll(".product-cards");

let prodCount = 3;

function displayProductCards(section, arr) {
  let displayProductItems = arr.map((item) => {
    if (item.prod <= prodCount) {
      return `<div class="card-item flex-column">
              <a href="${item.href}"><img class="thumbCard__img" src="${item.source}"></a>
              <div class="card-item__category card-text">${item.category}</div>
              <div class="card-item__model card-text">${item.model}</div>
              <div class="card-item__brand card-text">${item.brand}</div>
              <div class="card-item__price card-text">${item.price} $</div>
            </div>`;
    }
  });
  displayProductItems = displayProductItems.join("");
  section.innerHTML = displayProductItems;
}

const showMoreBtn = document.querySelectorAll(".more-btn");

// show more products btn
showMoreBtn.forEach((btn) => {
  btn.addEventListener("touchend", function (e) {
    let productQty;
    const currentBtn = e.target.dataset.id;
    prodCount += 2;

    if (currentBtn === "popular") {
      displayProductCards(productCardsContainer[0], data.productsPopular);
      productQty = data.productsPopular.length - 1;
    } else if (currentBtn === "new") {
      displayProductCards(productCardsContainer[1], data.productsNew);
      productQty = data.productsNew.length - 1;
    }

    if (prodCount >= productQty) {
      prodCount = productQty;
      btn.style.display = "none";
    }
  });
});
