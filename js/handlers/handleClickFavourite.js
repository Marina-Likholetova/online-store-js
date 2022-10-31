import { userInSession, storageUsers } from "../utils/getStorageUsers.js";
import { headerFavouritesCount, favouriteTable } from "../script.js";

export default function handleClickFavourite(e) {
    if (!userInSession) {
        document.location.href = `login.html`;
        return;
    }
    const parent = e.target.closest("[data-id]");
    const itemId = Number(parent.dataset.id);
    const favorIndex = userInSession.favourites.indexOf(itemId);

    if (favorIndex != -1) {
        userInSession.favourites.splice(favorIndex, 1);
        favouriteTable && parent.remove();
    } else {
        userInSession.favourites.push(itemId);
    }

    e.target.closest("img").src = `images/product__favourite${favorIndex === -1 ? "--true" : ""}.png`;
    headerFavouritesCount.innerText = userInSession.favourites.length;
    localStorage.setItem("users", JSON.stringify(storageUsers));
}
