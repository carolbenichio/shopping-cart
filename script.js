const items = document.getElementsByClassName('items');
const cartItems = document.querySelector('.cart__items');

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
    Number(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1)));
  const totalPrice = cartItemArray.reduce((acc, curr) => acc + curr, 0);
  currentPrice.innerHTML = totalPrice;
};

// 3
function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  localStorage.setItem('items', cartItems.innerHTML);
  sumPrice();
}

// 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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
const fetchAPI = async () => { 
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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

window.onload = function onload() {
  fetchAPI();
  getItems();
  
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', deleteItems);
  
  const price = createCustomElement('span', 'total-price', 0);
  const section = document.querySelector('.cart');
  section.appendChild(price);
  sumPrice();
};