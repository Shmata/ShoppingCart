function renderProducts(products) {
  const productList = document.getElementById('product-list');

  const productsHTML = products
    .map(
      product =>
        `<div class="product col-lg-4 col-md-6 mb-4">
		<div class="card h-100">
			<a href="#"
				><img
					class="card-img-top"
					src="${product.image}"
					alt="${product.title}"
			/></a>
			<div class="card-body">
				<h4 class="card-title">
				    ${product.title}
				</h4>
				<h5 class="product-price">${formatMoney(product.price)} تومان</h5>
				<p class="card-text">
				    ${product.description}
				</p>
			</div>
			<div class="card-footer">
				<button class="btn btn-light add-to-cart" data-product-id="${product.id}">
					افزودن به سبد خرید
				</button>
			</div>
		</div>
	</div>`
    )
    .join('');

  productList.innerHTML = productsHTML;
}

function formatMoney(amount, decimalCount = 0, decimal = '.', thousands = ',') {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    console.log(e);
  }
}

let products = [];
window
  .fetch('http://localhost:3000/products')
  .then(res => res.json())
  .then(result => {
    products = result;
    renderProducts(products);
  });

function renderCart(cart) {
  const cartList = document.getElementById('cart-list');

  if (cart.length === 0) {
    cartList.innerHTML = 'هیچ ایتمی در سبد خرید شما وجود ندارد.';
    return;
  }

  const cartHTML = cart
    .map(
      item =>
        `<div
				class="list-group-item d-flex justify-content-between align-items-center cart-item"
			>
				<span>${item.title}</span>
				<div>
					<button class="btn inc-quantity" data-product-id="${item.id}">+</button><span>${item.quantity}</span
					><button class="btn dec-quantity" data-product-id="${item.id}">-</button>
				</div>
			</div>`
    )
    .join('');

  cartList.innerHTML = cartHTML;
}

function addToCart(productId, products, cart) {
  const addedProduct = products.filter(product => product.id == productId)[0];

  const productInCart = cart.find(item => item.id == productId);

  if (productInCart) {
    return cart.map(item =>
      item.id == productId ? {...item, quantity: item.quantity + 1} : item
    );
  }

  return [...cart, {...addedProduct, quantity: 1}];
}

function takeFromCart(productId, cart) {
  const productInCart = cart.find(item => item.id == productId);

  if (productInCart.quantity === 1) {
    return cart.filter(item => item.id != productId);
  } else {
    return cart.map(item =>
      item.id == productId ? {...item, quantity: item.quantity - 1} : item
    );
  }
}

function presistCart(cart) {
  window.localStorage.setItem('cart', JSON.stringify(cart));
}

function rehydrateCart() {
  if (window.localStorage.getItem('cart')) {
    return JSON.parse(window.localStorage.getItem('cart'));
  } else {
    return [];
  }
}

let cart = [];

cart = rehydrateCart();

renderCart(cart);

document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('add-to-cart')) {
    const productId = e.target.getAttribute('data-product-id');
    cart = addToCart(productId, products, cart);
    renderCart(cart);
    presistCart(cart);
  } else if (e.target && e.target.classList.contains('inc-quantity')) {
    const productId = e.target.getAttribute('data-product-id');
    cart = addToCart(productId, products, cart);
    renderCart(cart);
    presistCart(cart);
  } else if (e.target && e.target.classList.contains('dec-quantity')) {
    const productId = e.target.getAttribute('data-product-id');
    cart = takeFromCart(productId, cart);
    renderCart(cart);
    presistCart(cart);
  }
});

