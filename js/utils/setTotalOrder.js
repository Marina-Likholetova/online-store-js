export default function setTotalOrder() {
    const orderTotal = document.querySelector('#orderTotal');
   
    let total = 0;
    document.querySelectorAll('.total').forEach(item => total += Number(item.textContent.slice(1)));
  
    orderTotal.innerText = `$${total}`;
}