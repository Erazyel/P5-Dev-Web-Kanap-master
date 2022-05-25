const cartItemsElt = document.getElementById("cart__items");
const totalPriceElt = document.getElementById("totalPrice");
const totalQuantityElt = document.getElementById("totalQuantity");

main();

async function main() {
  // Boucle sur tous les produits du panier
  for (let productCart of cart) {
    let product = await getProduct(productCart._id);
    const price = product.price;
    addProductToHtml(product, productCart, cartItemsElt, price);
  }
  await updateTotalCart();
  // Ecoute les événements utilisateur sur les produits du panier (modification quantité ou suppression produit)
  listenAllEvents();
}

// Ajouter les produits au html
function addProductToHtml(product, productCart, itemsElt, price) {
  itemsElt.innerHTML += ` <article class="cart__item" data-id="${productCart._id}" data-color="${productCart.color}">
  <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.description}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${productCart.color}</p>
      <p>${price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productCart.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article> `;
}

// Mise à jour de la quantité d'un produit lors de l'événement

async function onProductQuantityChange(evt) {
  const input = evt.target;
  const quantity = Number(input.value);
  const productElt = evt.target.closest(".cart__item");
  const _id = productElt.dataset.id;
  const color = productElt.dataset.color;
  let cartProduct = cart.find((p) => p._id === _id && p.color === color);

  if (cartProduct === undefined) {
    // si le produit n'existe pas, on envoie une alerte
    alert("Le produit n'existe pas");
  } else {
    // si le produit existe déjà on met à jour la quantité, ou on retire le produit du panier
    if (quantity == 0) {
      await removeItemFromCart(_id, color);
    }
    // si la quantité n'est pas comprise entre 0 et 100 on envoie une alerte
    else if (quantity < 0 || quantity > 100) {
      alert(
        "Quantité invalide, veuillez indiquer une quantité comprise entre 1 et 100"
      );
    } else {
      cartProduct.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  await updateTotalCart();
}
// Au clic sur le bouton supprimer, on supprime le produit sélectionné du panier
async function onRemoveProduct(evt) {
  const productElt = evt.target.closest(".cart__item");
  const _id = productElt.dataset.id;
  const color = productElt.dataset.color;
  await removeItemFromCart(_id, color);
}

// Lier les événements utilisateur aux fonctions du panier
function listenAllEvents() {
  const inputs = document.querySelectorAll(".itemQuantity");
  for (let input of inputs) {
    input.addEventListener("change", async (evt) =>
      onProductQuantityChange(evt)
    );
  }
  const btns = document.querySelectorAll(".deleteItem");
  for (let btn of btns) {
    btn.addEventListener("click", async (evt) => onRemoveProduct(evt));
  }
}

// Supprime un produit du panier et du local storage
async function removeItemFromCart(_id, color) {
  const productElt = document.querySelector(
    `[data-id="${_id}"][data-color="${color}"]`
  );
  productElt.remove();
  cart = cart.filter((p) => p._id !== _id && p.color !== color);
  localStorage.setItem("cart", JSON.stringify(cart));
  await updateTotalCart();
  alert("Votre produit a bien été supprimé");
}

// Calcule et met à jour le prix total des produits ajoutés au panier
async function updateTotalCart() {
  let totalPrice = 0;
  let totalQuantity = 0;
  for (let productCart of cart) {
    let product = await getProduct(productCart._id);
    const price = getProductCartPrice(productCart, product);

    totalPrice += price;
    totalQuantity += productCart.quantity;
  }
  totalPriceElt.innerHTML = totalPrice;
  totalQuantityElt.innerHTML = totalQuantity;
}

// Gestion du formulaire

// Récupération du formulaire
let form = document.querySelector(".cart__order__form");
let fieldsValid = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false,
};
// Teste la valeur d'un champ du formulaire et met à jour le message d'erreur fourni en paramètre en cas d'échec (retourne true si la valeur est correcte, et false dans le cas contraire)
function checkRegex(value, pattern, errorEltId, errorMsg) {
  const regExp = new RegExp(pattern, "g");
  const errorElt = document.getElementById(errorEltId);
  const result = regExp.test(value);
  if (result != true) {
    fieldsValid.firstName = false;
    errorElt.innerText = errorMsg;
  } else {
    fieldsValid.firstName = true;
    errorElt.innerText = "";
  }
  return result;
}

// Prénom
form.firstName.addEventListener("change", function (evt) {
  const value = evt.target.value;
  const pattern =
    "^[a-zA-Z-9'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._s -]*$";
  const errorEltId = "firstNameErrorMsg";
  const errorMsg = "Le prénom ne doit pas contenir de chiffre";
  fieldsValid.firstName = checkRegex(value, pattern, errorEltId, errorMsg);
});

// Nom
form.lastName.addEventListener("change", function (evt) {
  const value = evt.target.value;
  const pattern =
    "^[a-zA-Z-9'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._s -]*$";
  const errorEltId = "lastNameErrorMsg";
  const errorMsg = "Le nom de famille ne doit pas contenir de chiffre";
  fieldsValid.lastName = checkRegex(value, pattern, errorEltId, errorMsg);
});

// Adresse
form.address.addEventListener("change", function (evt) {
  const value = evt.target.value;
  const pattern = "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+";
  const errorEltId = "addressErrorMsg";
  const errorMsg = "Format d'adresse non reconnu";
  fieldsValid.address = checkRegex(value, pattern, errorEltId, errorMsg);
});

// Ville
form.city.addEventListener("change", function (evt) {
  const value = evt.target.value;
  const pattern =
    "^[a-zA-Z-9'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._s -]*$";
  const errorEltId = "cityErrorMsg";
  const errorMsg = "Format de ville non reconnu";
  fieldsValid.city = checkRegex(value, pattern, errorEltId, errorMsg);
});

// Mail
form.email.addEventListener("change", function (evt) {
  const value = evt.target.value;
  const pattern =
    "^[a-zA-Z0-9ôöáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$";
  const errorEltId = "emailErrorMsg";
  const errorMsg = "Format d'email non reconnu'";
  fieldsValid.email = checkRegex(value, pattern, errorEltId, errorMsg);
});

// Passer la commande

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const submitBtn = document.getElementById("order");

submitBtn.addEventListener("click", function (evt) {
  // Evite le rechargement de la page
  evt.preventDefault();
  if (
    fieldsValid.firstName === false ||
    fieldsValid.lastName === false ||
    fieldsValid.address === false ||
    fieldsValid.city === false ||
    fieldsValid.email === false
  ) {
    alert("Formulaire invalide");
    return;
  }
  if (cart.length === 0) {
    alert("Votre panier est vide");
    return;
  }
  let idProducts = [];

  for (const cartItem of cart) {
    idProducts.push(cartItem._id);
  }
  const order = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: idProducts,
  };
  // Création de la commande
  getOrder(order)
    .then((data) => {
      localStorage.clear();

      window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch((err) => {
      alert();
    });
});
