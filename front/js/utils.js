// Récupératio du panier depuis le local storage
let cart = JSON.parse(localStorage.getItem("cart"));
if (cart === null) {
  // si le panier n'existe pas, on crée le panier
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Récupération des articles de l'API
async function getProduct(idProduct) {
  const result = await fetch("http://localhost:3000/api/products/" + idProduct);
  const product = await result.json();
  return product;
}

// Requête API
async function getAllProducts() {
  const result = await fetch("http://localhost:3000/api/products/");
  const products = await result.json();
  return products;
}
// Envoi de la commande
async function getOrder(order) {
  const option = {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const result = await fetch(
    `http://localhost:3000/api/products/order`,
    option
  );
  return await result.json();
}

function getProductCartPrice(productCart, product) {
  const price = productCart.quantity * product.price;
  return price;
}
