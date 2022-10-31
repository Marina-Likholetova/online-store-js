import { PRODUCTS } from "./data.js";
import { userInSession } from "./utils/getStorageUsers.js";
import getSalePrice from "./utils/getSalePrice.js";

export default function renderCategory(category) {
    return `<section class="category" data-name="${category}" >
				<h2>${category}</h2>
				<div class="category__container"> 

					${PRODUCTS.filter((product) => product.categories.includes(category))
                        .map((product) => {
                            const salePrice = getSalePrice(product.price, product.salePercent);
                            const isShoppingCard = userInSession?.shoppingCard?.filter(
                                (card) => card.id === product.id
                            ).length;
                            const isOrdered = userInSession?.ordered?.filter(
                                (order) => order.id === product.id
                            ).length;

                            return `<div class="product" data-id="${product.id}">
										<button class="product__favourite">
											<img src="images/product__favourite${
                                                userInSession?.favourites?.includes(product.id)
                                                    ? "--true"
                                                    : ""
                                            }.png" alt="favourite" height="20">
										</button>
										<img src="images/products/${product.img.toLowerCase()}.png" class="product__img" alt="${product.title}" height="80">
										<p class="product__title">${product.title}</p>

										${(() => {
                                            if (product.sale) {
                                                return `<div class="product__sale">
													<span class="product__sale--old">$${product.price}</span>
													<span class="product__sale--percent">-${product.salePercent}%</span>
												</div>`;
                                            } else {
                                                return "";
                                            }
                                        })()}
							
										<div class="product__info">
											<span class="product__price">$${salePrice}</span>
											<button class="product__cart ${
                                                isOrdered
                                                    ? "product__cart--ordered"
                                                    : isShoppingCard
                                                    ? "product__cart--in"
                                                    : ""
                                            }">
												<img src="images/shopping-cart.png" alt="shopping cart" height="20">
											</button>
										</div>
 									</div>`;
                        })
                        .join("")}
				</div>
			</section>`;
}
