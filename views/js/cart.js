// for adding item to the cart as well as sending request to server 

var data = {};
function add() {
    postData({ data: data }).then(json => {
        console.log(json);
    }).catch(err => {
        console.log(err);
    })
}
const postData = data => {
    const body = JSON.stringify(data);
    return fetch("/cart", {
        method: "POST",
        headers: { "Content-type": 'application/json' },
        body
    }).then(data => {
        return data.json();
    })
}
var addToCart = document.querySelectorAll('.addToCart')
addToCart.forEach(function (product) {
    product.addEventListener("click", (e) => {
        data = {
            parent: e.target.parentElement,
            src: e.target.parentElement.parentElement.children[0].src,
            name: e.target.parentElement.children[0].innerText,
            price: e.target.parentElement.children[4].innerHTML
        }
        console.log(data);
        // appendList(data);
        add(data);
    })
})


// for storing the quantity of product present in a cart as well as 
//changing prices whenever the quantity of product changes


var productList = document.querySelectorAll('#quantity');
document.querySelector('.orderDetails').children[2].style.display = "none";
productList.forEach(function (product) {
    product.parentElement.parentElement.children[4].style.display = "none";
    product.addEventListener("click", (e) => {
        let name = e.target.parentElement.parentElement.children[0].innerText;
        let quantity = { quantity: e.target.value, name: name };
        var body = JSON.stringify(quantity)
        fetch('/quantity', {
            method: "POST",
            headers: { "content-type": "application/json" },
            body
        }).then((data) => {
            return data.json();
        }).then((json) => {
            console.log(json);
        }).catch((err) => {
            console.log(err);
        })
            if(quantity.quantity!="1"){
            let totalQuantity = quantity.quantity-1;
            let actualPrice = e.target.parentElement.parentElement.children[4].innerHTML;
            let updatedPrice = +quantity.quantity * +actualPrice;
            e.target.parentElement.parentElement.children[5].innerHTML = updatedPrice;
            document.querySelector('.orderDetails').children[2].style.display = "none";
            updatedPrice = +totalQuantity * +actualPrice
            let price = +document.querySelector('.orderDetails').children[2].innerHTML;
            document.querySelector('.updatedtotal').innerHTML = price + updatedPrice;
            }else{
                e.target.parentElement.parentElement.children[5].innerHTML= +e.target.parentElement.parentElement.children[4].innerHTML
                document.querySelector('.updatedtotal').innerHTML=+document.querySelector('.orderDetails').children[2].innerHTML    
            }
    })
})


// for removing product from cart as well as database 

var cross = document.querySelectorAll('.cross')
cross.forEach(function(cros){
    cros.addEventListener("click",(e)=>{
        let name = e.target.parentElement.children[2].children[0].innerText
        let productName ={ productName: name};
        const body = JSON.stringify(productName);
        fetch("/cros",{
            method:"POSt",
            headers:{"content-type":"application/json"},
            body
        }).then((data)=>{
            return data.json();
        }).then((json)=>{
            console.log(json);
        }).catch((err)=>{
            console.log(err);
        })
        let productPrice = +e.target.parentElement.children[2].children[4].innerText;
        let quantity = +e.target.parentElement.children[2].children[2].children[0].value;
        productPrice = quantity*productPrice;
        e.target.parentElement.style.backgroundColor="#eceaea";
        e.target.parentElement.parentElement.innerHTML="";
        let subTotal = +document.querySelector('.updatedtotal').innerText;
        let updatedSubTotal = subTotal -productPrice;
        document.querySelector('.updatedtotal').innerHTML =`${updatedSubTotal}`;
    })
})



let products=document.querySelectorAll("#img")
products.forEach(function(product){
    product.addEventListener("click",(e)=>{
        console.log("hello");
    })
})




