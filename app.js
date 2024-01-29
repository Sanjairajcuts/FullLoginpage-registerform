
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/kk");
//mongoose.connect("mongodb+srv://sanjai1102001:Sanjairaj744639@cluster0.9cqdflv.mongodb.net/sv");

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true}));

app.use(require("express-session")({
    secret:"Rusty is a dog",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============================
//Routes
//=============================

// showing home page
app.get("/",function (req, res){
    res.render("home");
}); 

//showing secret page
app.get("/secret",isLoggedIn, function (req,res){
    res.render("secret");
});

//showing register page
app.get("/register", function (req,res){
    res.render("register");
});

// Handling user signup
app.post("/register", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    User.register(new User({ username: username }),
            password, function (err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(
            req,res,function(){
            res.render("secret");
        });
    });
});

//showing login form
app.get("/login",function (req,res){
    res.render("login");
});

//handling user login
app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect:"/login"
}), function (req, res){   
});

//handling user logout
app.get("/logout",function(req, res, next){
    req.logout(function(err){
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("server has Started");
});