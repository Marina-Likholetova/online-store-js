export default function getSalePrice(price, percent) {
    return price - (price * (percent || 0) / 100);
}