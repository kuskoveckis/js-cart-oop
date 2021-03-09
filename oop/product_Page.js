import { UI, Cart, Storage } from "./app.js";

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
// PRODUCT PAGE
const techSpec = document.querySelector(".tech");
const prodDesc = document.querySelector(".desc");
const prodDescBody = document.getElementById("product-description-cont");
const techSpecBody = document.getElementById("tech-spec-desc");

const screenSize = window.innerWidth;

//CART
let cart = [];
let test = [];

document.addEventListener("DOMContentLoaded", () => {
  const test1 = new UI();
  const test2 = new Cart();
  const products = new Products();

  test2.setupApp();
  //sidenav
  test1.uiSetup();
});
