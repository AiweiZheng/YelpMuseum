var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride= require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport =require("passport"),
    LocalStrategy = require("passport-local"),
    
    User = require("./models/user"),
    indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    museumRoutes = require("./routes/museums"),
    appConst     = require("./common/const");

app.use(bodyParser.urlencoded({extended:true})); 

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(methodOverride("_method"));


var url = process.env.DATABASEURL || "mongodb://localhost/yelp_museum";
mongoose.connect(url);

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Top museums in united states!!!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MUST after session because "flash" requires session.
app.use(function(req,res,next){//middleware which will be executed on every single route.MUST BEFORE ROUTES
    res.locals.currentUser = req.user;
    res.locals.error = req.flash(appConst.flash_error);
    res.locals.success = req.flash(appConst.flash_success);
    next();
})


//ROUTES !!!!!!!!!!!MUST AFTER "passport configuaration" !!!!!!!!!!!!!!!!!!!!!
app.use("/",indexRoutes);
app.use("/museums/:id/comments",commentRoutes);
app.use("/museums", museumRoutes);


app.listen(process.env.PORT, process.env.IP,()=>{
    console.log("YelpMeseum is running!!!!");
})