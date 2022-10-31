import { PRODUCTS } from "./data.js";
import { storageUsers, userInSession } from "./utils/getStorageUsers.js";
import renderRow from "./renderRow.js";
import setTotalOrder from "./utils/setTotalOrder.js";
import renderCategory from "./renderCategory.js";
import handleClickFavourite from "./handlers/handleClickFavourite.js";
import handleClickShoppingCard from "./handlers/handleClickShoppingCard.js";
import onChangeCountInput from "./handlers/onChangeCountInput.js";

/**
 *  LOGIN FORM
 */

const loginForm = document.querySelector(`#LoginForm`);
const registrationForm = document.querySelector(`#RegistrationForm`);

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const loginError = e.target.querySelector(".error");
        loginError.classList.remove("active");

        let email = e.target.querySelector('input[data-name="email"]').value;
        let password = e.target.querySelector('input[data-name="password"]').value;

        const user = storageUsers.find((user) => user.email === email);

        if (!user) {
            loginError.classList.add("active");
            loginError.innerText = `Invalid email`;

            return;
        }

        if (user.password !== password) {
            loginError.classList.add("active");
            loginError.innerText = `Invalid password`;

            return;
        }

        user.status = true;
        localStorage.setItem("users", JSON.stringify(storageUsers));
        document.location.href = "account.html";
    });
}

/**
 *  REGISTRATION FORM
 */

if (registrationForm) {
    registrationForm.addEventListener("submit", (e) => {
        const loginError = e.target.querySelector(".error");
        loginError.classList.remove("active");

        let name = e.target.querySelector('input[data-name="name"]').value;
        let email = e.target.querySelector('input[data-name="email"]').value;
        let password = e.target.querySelector('input[data-name="password"]').value;
        let passwordVerify = e.target.querySelector('input[data-name="passwordVerify"]').value;

        e.preventDefault();

        if (password !== passwordVerify) {
            loginError.classList.add("active");
            loginError.innerText = `Password not matches!`;
            return;
        }

        if (storageUsers.find((user) => user.email === email)) {
            loginError.classList.add("active");
            loginError.innerText = `User with email ${email} already exist!`;
            return;
        }

        let user = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            status: true,
            favourites: [],
            shoppingCard: [],
            ordered: [],
        };

        storageUsers.push(user);
        localStorage.setItem("users", JSON.stringify(storageUsers));
        document.location.href = "account.html";
    });
}

/**HEADER
 *
 */

const headerUser = document.querySelector("#headerUser");
const headerFavourites = document.querySelector("#headerFavourites");
const headerLogout = document.querySelector("#headerLogout");
const headerShoppingCard = document.querySelector("#headerShoppingCart");
export const headerShoppingCartCount = document.querySelector("#headerShoppingCartCount");
export const headerFavouritesCount = document.querySelector("#headerFavouritesCount");

if (userInSession) {
    headerUser.href = "account.html";
    headerUser.innerText = userInSession.name;
    headerFavourites.href = "favourites.html";
    headerFavouritesCount.innerText = userInSession.favourites?.length ?? 0;
    headerShoppingCard.href = "shoppingCart.html";
    headerShoppingCartCount.innerText =
        userInSession.shoppingCard.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
    headerLogout.classList.add("active");
}

/**
 * LOG OUT
 */

headerLogout.addEventListener("click", (e) => {
    const userInSession = storageUsers.find((user) => user.status === true);
    userInSession.status = false;

    localStorage.setItem("users", JSON.stringify(storageUsers));
    document.location.href = `index.html`;
});

/**
 * INDEX.HTML
 */

const categoriesContainer = document.querySelector("#categoriesContainer");

if (categoriesContainer) {
    const allCategories = [...new Set(PRODUCTS.map((item) => item.categories).flat())];
    const categoriesList = allCategories.map((category) => {
        return renderCategory(category);
    });

    categoriesContainer.innerHTML = categoriesList.join(" ");
    document
        .querySelectorAll(".product__favourite")
        .forEach((button) => button.addEventListener("click", handleClickFavourite));
    document
        .querySelectorAll("button.product__cart")
        .forEach((button) => button.addEventListener("click", handleClickShoppingCard));
}

/**
 *  FAVOURITES
 */

export const favouriteTable = document.querySelector(`#favouriteTable`);

if (favouriteTable && userInSession.favourites.length) {
    const trs = userInSession.favourites.map((id) => {
        const product = PRODUCTS.find((product) => product.id === id);
        return renderRow(product, 0, "item__favourite");
    });

    favouriteTable.querySelector("tbody").innerHTML = trs.join(" ");
    document
        .querySelectorAll(".item__favourite")
        .forEach((button) => button.addEventListener("click", handleClickFavourite));
}

/**
 *  ACCOUNT
 */

const userInfo = document.querySelector("#userInfo");
const orderTable = document.querySelector("#orderTable");

if (userInfo) {
    const userInfoName = document.querySelector("#userInfoName");
    const userInfoEmail = document.querySelector("#userInfoEmail");
    const deleteAccount = document.querySelector("#deleteAcc");

    userInfoName.value = userInSession.name;
    userInfoEmail.innerText = userInSession.email;

    userInfo.addEventListener("submit", (e) => {
        userInSession.name = userInfoName.value;
        localStorage.setItem("users", JSON.stringify(storageUsers));
    });

    deleteAccount.addEventListener("click", (e) => {
        storageUsers.pop(userInSession);
        localStorage.setItem("users", JSON.stringify(storageUsers));
        document.location.href = "index.html";
    });
}

if (orderTable) {
    const trs = userInSession.ordered.map((card) => {
        const product = PRODUCTS.find((product) => product.id === card.id);
        return renderRow(product, card.count, "orderTable");
    });

    orderTable.querySelector("tbody").innerHTML = trs.join(" ");
}

/**
 *  SHOPPING CARD
 */

export const shoppingCardTable = document.querySelector("#shoppingCardTable");

if (shoppingCardTable) {
    const trs = userInSession.shoppingCard.map((card) => {
        const product = PRODUCTS.find((product) => product.id === card.id);
        return renderRow(product, card.count, "product__delete");
    });

    shoppingCardTable.querySelector("tbody").innerHTML = trs.join(" ");
    setTotalOrder();

    document
        .querySelectorAll("button.product__delete")
        .forEach((button) => button.addEventListener("click", handleClickShoppingCard));

    document
        .querySelectorAll(".countInput")
        .forEach((input) => input.addEventListener("change", onChangeCountInput));

    document
        .querySelector("button[type=submit]").addEventListener("click", (e) => {
            e.preventDefault();

            if (!userInSession.shoppingCard.length) return;
            
            userInSession.ordered = [...userInSession.ordered, ...userInSession.shoppingCard];
            userInSession.shoppingCard = [];
            userInSession.favourites = userInSession.favourites.filter(
                (item) => !userInSession.ordered.find((order) => order.id === item)
            );

            localStorage.setItem("users", JSON.stringify(storageUsers));
            document.location.href = "account.html";
    });
}
