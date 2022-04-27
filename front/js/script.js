// Requête API

fetch("http://localhost:3000/api/products/")
  .then((res) => res.json())
  .then(appendProducts)
  .catch((error) => alert("Le service a rencontré une erreur"));

// Boucle sur l'élément ciblé (#items)
function appendProducts(products) {
  const items = document.querySelector("#items");
  for (let product of products) {
    appendProductToItems(product, items);
  }
}

// Ajoute un produit à la liste fournie

function appendProductToItems(product, items) {
  items.innerHTML += ` <a href="./product.html?id=${product._id}">
<article>
  <img src="${product.imageUrl}" alt="${product.altTxt}">
  <h3 class="productName">${product.name}</h3>
  <p class="productDescription">${product.description}</p>
</article>
</a> `;
}
