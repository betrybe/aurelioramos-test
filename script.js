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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItem(products, productsSection) {
  products.map((product) => ({ 
      sku: product.id, 
      name: product.title, 
      image: product.thumbnail, 
    }))
  .forEach((product) => {
    const newProductSection = createProductItemElement(product);        
    productsSection.appendChild(newProductSection);
  });
}

const fetchProducts = () => {
  const productsSection = document.querySelector('.items');  
  fetch(API_URL_PRODUCTS, options)
    .then((response) => response.json())
    .then((data) => {       
      createProductItem(data.results, productsSection);
    });    
};

window.onload = () => { 
  fetchProducts();
};
