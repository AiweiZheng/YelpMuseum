var express = require("express"),
    middleware = require("../middleware/index"),
    router = express.Router({mergeParams:true}),
    Museum = require("../models/museum"),
    Comment = require("../models/comment"),
    messages = require("../utilities/messages");

//add a new comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
    var comment = req.body.comment;
    Museum.findById(req.params.id,(err,foundMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error",messages.db_error);
            res.redirect("back");
        }else {//found museum successfully
            Comment.create(comment,(err,newlyComment)=>{
                if(err){
                    req.flash("error",messages.db_error);
                    res.redirect("back");
                } else {
                      newlyComment.author.id = req.user._id;
                      newlyComment.author.username = req.user.username;
                      newlyComment.museum.id = foundMuseum._id;
                      newlyComment.museum.museumname = foundMuseum.name;
                      newlyComment.save();
                      foundMuseum.comments.push(newlyComment);
                      foundMuseum.save();
                      req.flash("error",messages.comment_add_success);
                      res.redirect("/museums/"+req.params.id);
                }
            });
        }
    });
});


//show form to create a new comment
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Museum.findById(req.params.id,(err,foundMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error",messages.db_error);
            res.redirect("back");
        }else{
             res.render("comments/new",{museum:foundMuseum});
        }
    });
});

//show form to edit a comment
router.get("/:commentId/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.commentId,(err,foundComment)=>{
        if(err){
            console.log(err);
            req.flash("error",messages.db_error);
            res.redirect("back");
        }else{
            res.render("comments/edit",{comment:foundComment});
        }
    });
});

//update particular comment, then redirect to show page
router.put("/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,(err,foundComment)=>{
        if(err){
            console.log(err);
            req.flash("error",messages.db_error);
            res.redirect("back");
        } else {
            res.redirect("/museums/"+req.params.id);
        }
    });
});

//delete particular comment
router.delete("/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.commentId,(err)=>{
        if(err){
            console.log(err);
            req.flash("error",messages.db_error);
            res.redirect("back");
        } else {
            res.redirect("/museums/"+req.params.id);
        }
    });
})

module.exports = router;