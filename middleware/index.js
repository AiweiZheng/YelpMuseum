var middlewareObject = {};
var Museum = require("../models/museum");

middlewareObject.checkMuseumOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Museum.findById(req.params.id,(err,foundMuseum)=>{
            if(err){
                console.log(err);
                req.flash("error","Unable to find the data,please try later.");
                res.redirect("back");
            }else{
                if(foundMuseum.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("error","Please login to continue the operation.");
        res.redirect("/login");
    }
};

module.exports = middlewareObject;