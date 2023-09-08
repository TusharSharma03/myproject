const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:"tanish.tyagi98134@gmail.com",
        pass:'tgmianrbqhqfawho'      
    }
});
var mailOptions ={
    from:"tanish.tyagi98134@gmail.com",
    to:"tyagitanish937@gmail.com",
    subject:'testing',
    text:'hello world'
}
transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error);
    }else{
        console.log("mail sent");
    }
})