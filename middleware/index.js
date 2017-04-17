var middlewareObject = {},
    Museum           = require("../models/museum"),
    Comment          = require("../models/comment"),
    messages         = require("../utilities/messages");

middlewareObject.checkMuseumOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Museum.findById(req.params.id,(err,foundMuseum)=>{
            if(err){
                console.log(err);
                req.flash("error",messages.db_error);
                res.redirect("back");
            }else{
                if(foundMuseum.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error",messages.db_error);
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error",messages.login_required);
        res.redirect("back");
    }
};

middlewareObject.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,(err,foundComment)=>{
            if(err){
                console.log(err);
                req.flash("error",messages.db_error);
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error",messages.permission_denied);
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error",messages.login_required);
        res.redirect("back");
    }
};



middlewareObject.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("error",messages.login_required);
        console.log(req);
        res.redirect("/login");
    }
};

module.exports = middlewareObject;