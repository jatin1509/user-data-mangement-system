const express = require("express");
const session = require("express-session");
const config = require('../Config/config');
const auth  = require("../middleware/auth");
const user_route = express();
user_route.use(session({secret:config.sessionsecret}));
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended: true}));

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage: storage});

user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');

const userController = require("../Controllers/userController");

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',upload.single('pic'),userController.registerUser);

//user_route.get('/verify',userController.verifyMail);

user_route.get('/login',userController.loginLoad);
user_route.get('/',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);


module.exports = user_route;
