import { userInSession, storageUsers } from "../utils/getStorageUsers.js";
import { headerShoppingCartCount, shoppingCardTable } from "../script.js";
import setTotalOrder from "../utils/setTotalOrder.js";

export default function handleClickShoppingCard(e) {
    if (!userInSession) {
        document.location.href = `login.html`;
        return;
    }

    const parent = e.target.closest("[data-id]");
    const itemId = Number(parent.dataset.id);
    const favorIndex = userInSession.shoppingCard.indexOf(
        userInSession.shoppingCard.find((item) => item.id === itemId)
    );

    if (favorIndex != -1) {
        userInSession.shoppingCard.splice(favorIndex, 1);
        shoppingCardTable && parent.remove();
        shoppingCardTable && setTotalOrder();
    } else {
        userInSession.shoppingCard.push({ id: itemId, count: 1 });
    }


    document.querySelectorAll(`.product[data-id="${itemId}"]`).forEach(item => {
        const button = item.querySelector('button.product__cart');
        favorIndex === -1
            ? button?.classList.add("product__cart--in")
            : button?.classList.remove("product__cart--in");
    });

    headerShoppingCartCount.innerText =
        userInSession.shoppingCard.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
    localStorage.setItem("users", JSON.stringify(storageUsers));
}
