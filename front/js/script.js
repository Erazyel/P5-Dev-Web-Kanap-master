const itemsElt = document.querySelector("#items");

// Requête API
getAllProducts()
  .then(appendProducts)
  .catch((error) => alert("Le service a rencontré une erreur"));

// Boucle sur l'élément ciblé (#items)
function appendProducts(products) {
  for (let product of products) {
    appendProductToHtml(product, itemsElt);
  }
}

// Ajoute un produit au html

function appendProductToHtml(product, itemsElt) {
  itemsElt.innerHTML += ` <a href="./product.html?id=${product._id}">
<article>
  <img src="${product.imageUrl}" alt="${product.altTxt}">
  <h3 class="productName">${product.name}</h3>
  <p class="productDescription">${product.description}</p>
</article>
</a> `;
}
