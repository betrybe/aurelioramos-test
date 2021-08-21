const API_URL_PRODUCTS = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const options = {
  method: 'GET',
  mode: 'cors',
  cache: 'default',
  headers: { Accept: 'application/json' },
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.preventDefault();
  this.parentElement.removeChild(this);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartItem(product) {
  const productsSection = document.querySelector('.cart__items');
  const newListItem = createCartItemElement(product);  
  newListItem.addEventListener('click', cartItemClickListener);
  productsSection.appendChild(newListItem);  
}

const fetchProductById = (itemID) => {  
  const API_URL = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(API_URL, options)
    .then((response) => response.json())
    .then((data) => {      
      const product = { 
          sku: data.id, 
          name: data.title, 
          salePrice: data.price, 
      };                  
      createCartItem(product);
    });
};

function productItemClickListener(event) { 
  event.preventDefault();
  const id = getSkuFromProductItem(this);  
  fetchProductById(id); 
}

function createProductItem(products, productsSection) {
  products.map((product) => ({ 
      sku: product.id, 
      name: product.title, 
      image: product.thumbnail, 
    }))
  .forEach((product) => {
    const newProductSection = createProductItemElement(product);
    newProductSection.addEventListener('click', productItemClickListener);        
    productsSection.appendChild(newProductSection);
  });
}

function createLoading() {
  const loading = createCustomElement('progress', 'loading', 'loading...');  
  document.body.appendChild(loading);
}

function removeLoading() {  
  const loading = document.querySelector('.loading');  
  document.body.removeChild(loading);
}

const fetchProducts = () => {
  createLoading();
  const productsSection = document.querySelector('.items');  
  fetch(API_URL_PRODUCTS, options)
    .then((response) => response.json())
    .then((data) => {  
      removeLoading();     
      createProductItem(data.results, productsSection);
    });    
};

function emptyCart() {
  document.querySelector('.cart__items').textContent = ''; 
}

window.onload = () => { 
  fetchProducts();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
};
