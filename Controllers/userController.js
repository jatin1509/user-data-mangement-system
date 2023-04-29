const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const loadRegister = async(req,res)=>{
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}
// mail sending
/*const sendVerifyMail = async(name, email, user_id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: 'jatin1509gupta@gmail.com',
                password: 'Jatin@1509',
            }
        });

        const mailOptions = {
            from: 'jatin1509gupta@gmail.com',
            to: 'email',
            subject: "for email verification",
            html: '<p>Hii,' + name +  'please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'">Verify your mail.</a>',
        };
        transporter.sendMail(mailOptions,function(error,info){
            if(error)
            {
                console.log(error);
            }
            else
            {
                console.log("Email has been sent:-", info.response);
            }
        });
    } 
    catch (error) {
        console.log(error.message);
    }

}

const verifyMail = async(req,res)=>{
    try {
        const updateInfo = await User.updateOne({_id:req.query.id}, {$set: {is_varified:1}})  ;  

        console.log(updateInfo)
        res.render("email-verified");
    } 
    catch (error) {
        console.log(error.message);
    }
}*/

const registerUser = async(req,res)=>{
    try {

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: spassword,
            is_admin: 0,
        });

        const userData= await user.save();

        if(userData)
        {
            sendVerifyMail(req.body.name,reqbody.email,userData._id);
            res.render('register',{message: "Registration Sucess! Please verify your mail."});
        }
        else
        {
            res.render('register',{message: "Registration Failed!"});
        }
    } catch (error) {
        console.log(error.message);
    }
}
//login user methods started

const loginLoad = async(req,res)=>{
try {
    res.render('login');
}
 catch (error) {
    console.log(error.message);
}
};

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password =  req.body.password;


         const userData = await User.findOne({email:email});

         if(userData)
         {
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch)
            {
                req.session.user_id = userData._id;
                res.redirect('/home');
            }
            else
            {
                res.render('login',{message:'email and password is incorrect'});
            }
         }
         else
         {
            res.render('login',{message:'email or password incorrect'});

         }
    } catch (error) {
        console.log(error.message);
    }
}

//load home

const loadHome = async(req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async(req,res) =>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {loadRegister,registerUser,loginLoad,verifyLogin,loadHome,userLogout};

