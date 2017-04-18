var middlewareObject = {},
    appConst         = require("../common/const"),
    Comment          = require("../models/comment"),
    Museum           = require("../models/museum"),
    mongoose         = require("mongoose");
    mongoose.Promise = require("bluebird");

middlewareObject.checkCommentOwnership = function(req,res,next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId).then( foundComment => {
           //success,check ownership   
           if(userIdentityCheck(foundComment.author.id, req.user._id)) {
               next();
           } else {
              appConst.redirectBack(req, res, appConst.permission_denied); 
           }
           
        }).catch(dbErr => {//catch database read error
            console.log(dbErr);
            appConst.redirectBack(req, res, appConst.db_error);
        });
    } else { //not login yet
        appConst.redirectBack(req, res, appConst.login_required);
    }
};

middlewareObject.checkMuseumOwnership= function(req,res,next) {
    if(req.isAuthenticated()) {
        Museum.findById(req.params.id).then(foundMuseum => {
            //success, check ownership 
          if(userIdentityCheck(foundMuseum.author.id, req.user._id)) {
              next();
          } else {
              appConst.redirectBack(req, res, appConst.permission_denied); 
          }
          
        }).catch(dbErr => {//catch database read error
            console.log(dbErr);
            appConst.redirectBack(req, res, appConst.db_error);
        });

    } else {//not login yet
        appConst.redirectBack(req,res,appConst.login_required);
    }
};

middlewareObject.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        next();
    }else{
        req.flash(appConst.flash_error,appConst.login_required);
        res.redirect("/login");
    }
};

function userIdentityCheck(owner,reqUser,next){
    return owner.equals(reqUser) ? true:false
}

module.exports = middlewareObject;