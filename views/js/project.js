let login = document.querySelector("#login");
const menu = document.querySelector('.menu');

menu.removeChild(menu.children[3]);
menu.removeChild(menu.children[3]);

let link = document.createElement('span');
link.innerHTML = `<a href="/profile" class="header">Profile</a>`;
menu.append(link)

let logout = document.createElement('span');
logout.innerHTML = `<a href="/logout" class="header">Logout</a>`;
menu.append(logout)


let span = document.createElement('span');
span.classList.add("orderCart");
span.innerHTML = `<a href="/cart"  onmouseout="out()"><img src="./images/cart.PNG" class="order-cart"></a>`
menu.append(span);


// function hover() {
//     let cart = document.querySelector('.orderCart');
//     cart.innerHTML = `<a href="/cart"><img src="./images/hoverCart.PNG" class="order-cart"></a>`
// };
// function hover() {
//     let cart = document.querySelector('.orderCart');
//     cart.innerHTML = `<a href="/cart" onmouseout="out()"><img src="./images/hoverCart.PNG" class="order-cart"></a>`;
// }

// function out() {
//     document.querySelector('.orderCart').innerHTML = `<a href="/cart"  onmouseover="hover()"><img src="./images/cart.PNG" class="order-cart"></a>`
// }


// slide show 

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 4000); // Change image every 2 seconds
}

function show(type){
  console.log(type);
 fetch('/find?type='+type)
  .then((data)=>{
    return data.text()
  }).then((html)=>{
        return html;
  })
  // fetch('/find?type='+type)
  // .then((data)=>{
  //   return data.text();
  // }).then((json)=>{
  //   console.log(json);
  // })
}


