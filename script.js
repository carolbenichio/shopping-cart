const items = document.getElementsByClassName('items');
const cartItems = document.querySelector('.cart__items');
const searchBtn = document.getElementById('search-btn');

// 1
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// 1
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // pega o id, title e thumbnail e "chama" de sku, name e image
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image.replace('I.jpg', 'O.jgp')));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
  
// 5
const sumPrice = () => {
  const currentPrice = document.querySelector('.total-price');
  const cartItem = document.querySelectorAll('.cart__item');
  const cartItemArray = Array.prototype.map.call(cartItem, (li) =>
    Number(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1, li.innerHTML.indexOf('<'))));
  const totalPrice = cartItemArray.reduce((acc, curr) => acc + curr, 0);
  currentPrice.innerHTML = `Preço total: R$ ${Number(totalPrice.toFixed(2))}`;
};

// 3
function cartItemClickListener(event) {
  if (event.target.tagName === 'IMG') {
    event.target.parentNode.remove();
  } else {
  event.target.remove();
  }
  localStorage.setItem('items', cartItems.innerHTML);
  sumPrice();
}

// 2
function createCartItemElement({ id: sku, title: name, price: salePrice, thumbnail }) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.classList.add('cart-img');
  img.src = thumbnail;
  li.className = 'cart__item';
  li.innerText += `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(img);
  li.addEventListener('click', cartItemClickListener);
  img.addEventListener('click', cartItemClickListener);
  return li;
}

// 2
async function addItemsToCart(id) {
  const API2 = `https://api.mercadolibre.com/items/${id}`;
  const api = await fetch(API2);
  const apiJSON = await api.json();
  cartItems.appendChild(createCartItemElement(apiJSON));
  localStorage.setItem('items', cartItems.innerHTML); // 4
  sumPrice();
}

// 2
const buttonEvents = () => {
  const itemButton = document.querySelectorAll('.item__add');
  itemButton.forEach((button) => button.addEventListener('click', ({ target }) => {
    addItemsToCart(target.parentNode.firstChild.innerText);
  }));
};

// 4
const getItems = () => {
  if (localStorage.getItem('items') !== undefined) {
    cartItems.innerHTML = localStorage.getItem('items');
    const cartItem = document.querySelectorAll('.cart__item');
    cartItem.forEach((li) => li.addEventListener('click', cartItemClickListener));
  }
};

// 7
function loadingAlert() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// 1
const fetchAPI = async (searchWord) => {
  console.log(searchWord);
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${searchWord}`;
  const api = await fetch(API_URL); // pega, pelo API, os produtos consultados
  const apiJSON = await api.json(); // transforma a promise em JSON
  const arrayResult = apiJSON.results; // pega só o 'results' do retorno
  await arrayResult.forEach((item) => items[0].appendChild(createProductItemElement(item)));
  buttonEvents();
  loadingAlert();
};

// 6
function deleteItems() {
  cartItems.innerHTML = '';
  localStorage.clear();
  sumPrice();
}

const search = document.querySelector('.search');
function searchItem() {
  console.log(search);
  items[0].innerHTML = '';
  items[0].innerHTML = '<section class="loading">Loading...</section>';
  fetchAPI(search.value);
}

search.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    searchItem(search.value);
  }
});
searchBtn.addEventListener('click', searchItem);

window.onload = function onload() {
  fetchAPI('computador');
  getItems();
  
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', deleteItems);
  
  const price = createCustomElement('span', 'total-price', 0);
  const section = document.querySelector('.cart');
  section.appendChild(price);
  sumPrice();
};