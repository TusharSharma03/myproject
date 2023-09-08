
// to remove a product when admin wants

let removeBtn = document.querySelectorAll(".remove");
removeBtn.forEach(function(btn){
    btn.addEventListener("click",(e)=>{
        let name = e.target.parentElement.children[2].children[0].value 
        let productName ={productName : name};
        const body = JSON.stringify(productName);
        fetch("/remove",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body
        }).then((data)=>{
            return data.json()
        }).then((json)=>{
            console.log(json);
        }).catch((err)=>{
            console.log(err);
        })
        e.target.parentElement.style.display="none";
        e.target.parentElement.innerHTML = "";
        
    })
})


// to update price and name 

let updatebtn = document.querySelectorAll('.update');
updatebtn.forEach(function(btn){
    btn.addEventListener("click",(e)=>{
        let name = e.target.parentElement.children[2].children[0].value
        let price = e.target.parentElement.children[3].children[0].value
        let details = {name:name,price:price};
        const body = JSON.stringify(details);
        fetch('/update',{
            method:"POST",
            headers:{"content-type":"application/json"},
            body
        }).then((data)=>{
            return data.json()
        }).then((json)=>{
            console.log(json);
        })
    })
})