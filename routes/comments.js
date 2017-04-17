var express = require("express"),
    middleware = require("../middleware/index"),
    router = express.Router({mergeParams:true}),
    Museum = require("../models/museum"),
    Comment = require("../models/comment"),
    appConst = require("../common/const"),
    mongoose         = require("mongoose");
    
    mongoose.Promise = require("bluebird");

//add a new comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
    var comment = req.body.comment;
    var museum;
    Museum.findById(req.params.id).then(foundMuseum => {
        museum = foundMuseum;
        return Comment.create(comment);
    }).then(newlyComment =>{
         newlyComment.author.id = req.user._id;
         newlyComment.author.username = req.user.username;
         newlyComment.museum.id = museum._id;
         newlyComment.museum.museumname = museum.name;
         return newlyComment.save();
    }).then(comment =>{
        museum.comments.push(comment);
        return museum.save();
    }).then(() =>{
        req.flash(appConst.flash_success,appConst.comment_add_success);
        res.redirect("/museums/"+req.params.id);
    }).catch(dbErr =>{
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
});

//show form to create a new comment
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Museum.findById(req.params.id).then(foundMuseum => {
        res.render("comments/new",{museum:foundMuseum});
        
        }).catch(dbErr =>{
            console.log(dbErr); 
            appConst.redirectBack(req,res,appConst.db_error);
    });
});

//show form to edit a comment
router.get("/:commentId/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.commentId).then(foundComment => {
            res.render("comments/edit",{comment:foundComment});
            
    }).catch(dbErr =>{
            console.log(dbErr); 
            appConst.redirectBack(req,res,appConst.db_error);
    });
});

//update particular comment, then redirect to show page
router.put("/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.commentId,
                              req.body.comment).then(foundComment=> {
            res.redirect("/museums/"+req.params.id);
    
    }).catch(dbErr =>{
            console.log(dbErr); 
            appConst.redirectBack(req,res,appConst.db_error);
    });
});

//delete particular comment
router.delete("/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.commentId).then(()=> {
        res.redirect("/museums/"+req.params.id);
    
    }).catch(dbErr =>{
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
})

module.exports = router;