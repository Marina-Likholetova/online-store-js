import { userInSession, storageUsers } from "../utils/getStorageUsers.js";
import { PRODUCTS } from "../data.js";
import { headerShoppingCartCount } from "../script.js";
import getSalePrice from "../utils/getSalePrice.js";
import setTotalOrder from "../utils/setTotalOrder.js";

export default function onChangeCountInput(e) {
    const amount = Number(e.target.value);
    const parent = e.target.closest("[data-id]");
    const itemId = Number(parent.dataset.id);
    const itemShoppingCard = userInSession?.shoppingCard?.find((card) => card.id === itemId);
    itemShoppingCard.count = amount;
    const total = parent.querySelector(".total");
    const product = PRODUCTS.find((product) => product.id === itemId);
    total.innerText = `$${amount * getSalePrice(product.price, product.salePercent)}`;

    setTotalOrder();

    headerShoppingCartCount.innerText =
        userInSession.shoppingCard.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
    localStorage.setItem("users", JSON.stringify(storageUsers));
}
