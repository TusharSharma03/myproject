const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination:function (req,File,cb){
        let fileLocation = path.join(__dirname+'/views/images')
        cb(null,fileLocation);
    },
    filename:function (req,File,cb){
        let fileName =Date.now() +File.originalname;
        cb(null,fileName);
    }
});

const upload = multer({
    storage:storage
}).single("files");

module.exports = upload;