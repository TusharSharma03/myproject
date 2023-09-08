// for product details 


let products=document.querySelectorAll("#img")
products.forEach(function(product){
    product.addEventListener("mouseover",(e)=>{
        let value = e.target.parentElement.children[2].innerHTML.trim();
        // console.log(e.target.parentElement.children[2]);
        let name = { name : value};
        const body = JSON.stringify(name);
        fetch("/getdetail",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body
        }).then((data)=>{
            return data.text()
        }).then((json)=>{
            return json
        }).catch((err)=>{
            console.log("parsing error",err);
        })
    })
})