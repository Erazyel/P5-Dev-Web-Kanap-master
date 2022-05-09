let orderId = new URLSearchParams(window.location.search).get("orderId");

const orderInner = document.getElementById("orderId");
orderInner.innerHTML = orderId;
