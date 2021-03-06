var express  = require("express"),
    router   = express.Router(),
    User     = require("../models/user"),
    passport = require("passport"),
    appConst = require("../common/const")

//root route
router.get("/",(req, res)=> {
    res.render("landing");
});

//show reigster form
router.get("/register",(req, res)=> {
    res.render("register", {page: "register"});
});

//handle register logic
router.post("/register",(req, res)=> {
    var newUser = new User({ username:req.body.username });
    User.register(newUser, req.body.password, (err, user)=> {
        if(err){
            console.log(err);
        //   req.flash("error",err.message); //this only works on "res.redirect()"
            return res.render("register", { error: err.message });//must pass an object to "res.render()" to show error msg.
        }
        passport.authenticate("local")(req, res, ()=> {
            req.flash(appConst.flash_success, appConst.welcome_msg);
            res.redirect("/museums");
        });
    });
});

//show login form
router.get("/login",(req, res)=> {
    res.render("login", {page: "login"});
});

//handle login logic
router.post("/login", passport.authenticate("local",//call authenticate middleware to 
      {                                           //check the status of user login
            successRedirect: "/museums",
            failureRedirect: "/login",
            failureFlash: true,
            successFlash: appConst.welcome_msg
      }), (req, res)=> {}
);


router.get("/logout", (req,res)=> {
    req.logout();
    req.flash(appConst.flash_success, appConst.goodbye_msg);
    res.redirect("/museums");
})

module.exports = router;
