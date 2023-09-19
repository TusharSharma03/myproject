const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path')
const dirPath = path.join(__dirname + '/views')
const bodyParser = require('body-parser');
const upload = require('./multer');
const nodemailer = require('nodemailer');
const newuser = require('./views/mongoose/user.js');
const bcrypt = require('bcrypt');
const products = require('./views/mongoose/product.js');
const cartProduct = require('./views/mongoose/cart.js');
const session = require('express-session');
const flash = require('connect-flash');
const category = require('./views/mongoose/categories');
const Razorpay = require('razorpay');


app.set("view engine", 'ejs');
app.use(flash());
app.use(express.static(dirPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'sjkahkdshlkasjjask',
    resave:false,
    saveUninitialized:false,
}))

app.use(function(req,res,next)
{
    console.log(req.method,req.url);
    next();
})

// razorpay instance
var instance = new Razorpay({
    key_id: 'rzp_test_Iu8SvEOqXPXFQX',
    key_secret: 'hxMaAkADsUE2K0wSjNE9RIz3',
  });

  app.post('/create/orderId',(req,res)=>{
    console.log("create orderId",req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcpt1"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({orderId : order.id});
      });
  })

//add items to the cart
app.post('/cart', async (req, res) => {
    var product = new cartProduct({
        name: req.body.data.name,
        price: req.body.data.price,
        src: req.body.data.src,
        username: req.session.email
    });
    let result = await cartProduct.findOne({name:product.name,username:req.session.email}); 
    if(result){
        let quantity=+result.quantity+1; 
        quantity=quantity+"";
        await cartProduct.updateOne({name:product.name,username:req.session.email},{
            $set:{
                quantity:quantity
            }
         })
    }
    else{
        product.save();
    }
})



//login page


app.get('/', (req, res) => {
    res.render('login', { msg:req.flash('message')});
})

app.post('/', async (req, res) => {
    let username = req.body.Username;
    let password = req.body.password;
    let result = await newuser.findOne({ email: username });
    let matchPass = await bcrypt.compare(password, result.password);
    if (matchPass) {
        if (username!="sharma.tushar2213@gmail.com") {
            
            sess = req.session;
            sess.name = result.name;
            sess.email = result.email;
            if (req.session.email) {
                res.render('home');
            }
        }
       else{
            sess = req.session;
            sess.name = result.name;
            sess.email = result.email;
            if (req.session.email) {
                res.redirect('/adminProduct');
            }
           else{
            res.redirect('/');
           }
       }
    } else {
        req.flash('message','Invalid login details')
        res.redirect('/');
    }
})


//home route 

app.get("/home",(req,res)=>{
    if (req.session.email) {
        res.render('home')
    }else{
        res.redirect('/');
    }
})


//logout
app.get('/logout', async function (req, res, next) {
    // remove the req.user property and clear the login session

    // destroy session data
    req.session.destroy((err)=>{
        if (err) {
            console.log(err);
        }else{
            // redirect to loginpage
            res.redirect('/');
        }
    })
})
//get cart data
app.get('/cart', async (req, res) => {
    if(req.session.email){
        try {
            const result = await cartProduct.find({ username: req.session.email });
            var price = 0;
            var quantityPrice=0;
            result.forEach(product => {
                price = price + +product.price;
                quantityPrice= quantityPrice+ +product.price * +product.quantity
            });
            res.render('cart', { result, price,quantityPrice });
        } catch (error) {
            res.render('cart');
        }
    }
    else{
        res.redirect('/');
    }
})


//remove cart data

app.post("/cros",async (req,res)=>{
    let result = await cartProduct.findOne({username:req.session.email,name:req.body.productName});
    try {
        await cartProduct.findByIdAndDelete(result.id);    
    } catch (error) {
        console.log(error);
    }
    
})


//update quantity and price
app.post("/quantity",async (req,res)=>{
    let quantity = req.body.quantity;
    let name = req.body.name;
    let product = await cartProduct.findOne({name:name});
    await cartProduct.updateOne({name:product.name},{
        $set:{
            quantity:quantity,
        }
    }) 
})
//contact 
app.get('/contact', (req, res) => {
    if(req.session.email){
        res.render('contact')
    }else{
        res.redirect('/')
    }
})

// register 
app.get('/register', (req, res) => {
    res.render('register', { message: "" })
})

//products


app.get('/product', async (req, res) => {
    if(req.session.email){  
        if(req.query.type){
                let result = await products.find({category:type})
                res.render('product',{result:result})
                // res.send({result})
        }else{
            let result = await products.find();
            res.render('Product', { result});
        }
    }else{
        res.redirect('/')
    }
})


//categories
app.get('/categories',async (req, res) => {
    if(req.session.email){
        let result = await category.find();
        res.render('categories',{result})
    }else{
        res.redirect('/')
    }
})

//route for admin

app.get("/adminProduct",async (req,res)=>{
if (req.session.email) {
    let product = await products.find();
    res.render('adminProduct',{product});
}else{
    res.redirect('/');
}

})

// admin --> to add category

app.get('/addCategory',async (req,res)=>{
    if(req.session.email){
        res.render('adminADDcategories');
    }else{
        res.redirect('/');
    }
    
})

app.post('/addCategory',upload,async(req,res)=>{
    let src = `images/${req.file.filename}` 
    try {
        let data = await new category({
            name:req.body.name,
            gender:req.body.gender,
            src
        })
        data.save();
    } catch (error) {
        console.log(error);
    }
   
})
//admin --> route for product removing request 

app.post("/remove",async (req,res)=>{
    let name = req.body.productName;
    try {
        let result = await products.findOne({name:name});
        await products.findByIdAndDelete(result.id);
    } catch (error) {
        console.log(error);
    }
})

//admin --> route for updatin price and name

app.post("/update",async (req,res)=>{
    let name = req.body.name;
    let price = req.body.price;
    await products.updateOne({name:name},{
        $set:{
            name:name,
            price:price
        }
    })
})

//admin --> add product

app.get("/addProduct",(req,res)=>{
    if(req.session.email){
        res.render('adminAddProduct');
    }else{
        res.redirect('/');
    }
})

app.post("/addProduct",upload,(req,res)=>{
    let src = 'images/'+req.file.filename;
    let product = new products({
        name:req.body.name,
        price:req.body.price,
        src:src,
        description:req.body.Description,
        category:req.body.Category,
        type:req.body.type,
        gender:req.body.gender,
        stock:req.body.quantity
    })
    product.save();
    res.redirect('/addProduct')
})

//register a person

app.post('/register', upload, (req, res) => {
    let password = req.body.password;
    let confirmPassword = req.body.currentPassword;
    if (password === confirmPassword) {
        const data = async () => {
            var user = new newuser({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phoneNo: req.body.phone,
                password: req.body.password,
            })
            user.save();
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "umesh.atrii0712@gmail.com",
                    pass: 'zscojnmjdcbisfwo'
                }
            });
            var mailOptions = {
                from: 'umesh.atrii0712@gmail.com',
                to: req.body.email,
                html: `  <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        </head>
                        <body style="text-align: center;">
                        <h1 style="text-align: center;">Thankyou ${req.body.fname + " " + req.body.lname} for your Submission</h1>`,
                subject: 'thank you'
            };
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("sent");
                    res.redirect('/');
                }
            })
               let username = req.body.email;
            // let username = req.body.Username;
            // let password = req.body.password;
            // let result = await newuser.findOne({ email: username });
            // let matchPass = await bcrypt.compare(password, result.password);
            // if (matchPass) {
                if (username!="sharma.tushar2213@gmail.com") {
                    
                    sess = req.session;
                    // sess.name = name;
                    sess.email = username;
                    if (req.session.email) {
                        res.render('home');
                    }
                }
               else{
                    sess = req.session;
                    // sess.name = name;
                    sess.email = username;
                    if (req.session.email) {
                        res.redirect('/adminProduct');
                    }
                   else{
                    res.redirect('/');
                   }
               }
            // } else {
            //     req.flash('message','Invalid login details')
            //     res.redirect('/');
            // }

        }
        data();
    } else {
        const message = { pass: 'paasword and confirm password should be same' };
        res.redirect('register', { message });
    }

    

})

//route for product details
var detail; 
app.post("/getdetail",async (req,res)=>{
    try {
        let name = req.body.name;
        detail = await products.findOne({name:name});
    } catch (error) {
        console.log(error);
    }
   
})

app.get("/getdetail",(req,res)=>{
    if (req.session.email) {
        res.render("productDetails",{detail})
    }else{
        res.redirect('/');
    }
    
})


//profile route 

app.get('/profile',async (req,res)=>{
    if(req.session.email){
        let info = await newuser.findOne({email:req.session.email});
        res.render('profile',{info});
    }else{
        res.redirect('/');
    }
})


app.post("/profileImg",upload,async (req,res)=>{
    let fileName = `images/${req.file.filename}`
   let result= await newuser.updateOne({email:req.session.email},{
        $set:{
                profilepic:fileName
             }
    })
    res.redirect('/profile');
})


// find product categorywise 


var categoryProduct;
app.get('/find',async(req,res)=>{
    let type = req.query.type;
    categoryProduct = await products.find({category:type})
})
app.get('/findproduct',(req,res)=>{
    res.render('allProducts',{categoryProduct});
})


//update Profile 

app.post("/updateProfile",async (req,res)=>{
    let detail = req.body;
    let updated;
    if (detail.address!=null) {
       updated= await newuser.updateOne({email:req.session.email},{
            $set:{
                fname:detail.name,
                phoneNo: detail.phoneNo,
                address:detail.address
            }
        })
    }else{
         updated = await newuser.updateOne({email:req.session.email},{
            $set:{
                fname:detail.name,
                phoneNo: detail.phoneNo
            }
            
        })
    }
})



app.listen(8000, () => {
    console.log("Listening on port 8000...");
})