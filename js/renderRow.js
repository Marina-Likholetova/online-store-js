import getSalePrice from "./utils/getSalePrice.js";

export default function renderRow(product, count, btnClass) {
    let img;
    let isOrderTable;
    let salePrice = getSalePrice(product.price, product.salePercent);

    switch (btnClass) {
        case "product__delete":
            img = "delete";
            break;
        case "item__favourite":
            img = "product__favourite--true";
            break;
        case "orderTable":
            isOrderTable = true;
            break;
        default:
            return;
    }

    return `<tr data-id=${product.id}>
                <td>
                    <div class="item__info">
                        <img src="images/products/${product.img.toLowerCase()}.png" alt="${product.title}" height="100">
                            <div>
                                <p class="item__info--title">${product.title}</p>
                            </div>
                    </div>
                </td>

                ${(() => {
                    if (count) {
                        return `<td> 
                                ${isOrderTable
                                    ? `${count}`
                                    : `<input class="countInput" type='number' min="1" value="${count}"/>`
                                }
                            </td>`;
                    } else {
                        return "";
                    }
                })()}
                
                <td>$${product.price}</td>

                ${(() => {
                    return product.sale
                        ? `<td><span class="item__sale">-${product.salePercent}%</span></td>`
                        : `<td>-</td>`;
                })()}
                
                <td class="total">$${salePrice * (count || 1)}</td>

                ${(() => {
                    return !isOrderTable
                        ? `<td>
                                <button class="${btnClass}">
                                    <img src="images/${img}.png" alt="${img}" height="20">
                                </button>
                            </td>`
                        : "";
                })()}
		    </tr>`;
}
