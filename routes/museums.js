var express = require("express"),
    router = express(),
    middleware = require("../middleware/index"),
    Museum = require("../models/museum"),
    errorMessage = require("../utilities/errorMessages")

//show all museums
router.get("/",(req,res)=>{
    Museum.find({},(err, allMuseums)=>{
        if(err){
            req.flash("error",errorMessage.db_error);
            console.log(err);
        }else{
            res.render("museums/index",{museums:allMuseums});
        }
    });
});

//create a new museum, then redirect to museums page.
router.post("/",(req,res)=>{
    var data = req.body;
    var author ={id:req.user._id,username:req.user.username};
    
    var museum = new Museum({ name:data.name,
                              price:data.price,
                              image:data.image,
                              description:data.description,
                              author:author });
    Museum.create(museum,(err,newlyCreated)=>{
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/museums");
        }
    });          
});

//show create form
router.get("/new",middleware.isLoggedIn,(req,res)=>{//need to be placed before "/:id" route, 
        res.render("museums/new");                  //or it will go for "/:id". 
});

//show information about a specific museum
router.get("/:id",(req,res)=>{
    Museum.findById(req.params.id).populate("comments").exec((err,foundMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error",errorMessage.db_error);
            res.redirect("back");
        }else{
            res.render("museums/show",{museum:foundMuseum});
        }
    });
});


//show edit form
router.get("/:id/edit",middleware.checkMuseumOwnership,(req,res)=>{
    Museum.findById(req.params.id,(err,foundMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error",errorMessage.db_error);
            res.redirect("back");
        }else{
             res.render("museums/edit",{museum:foundMuseum});
        }
    });
});

//edit a particular museum, then redirect to show page
router.put("/:id",middleware.checkMuseumOwnership,(req,res)=>{
    var data = req.body;
    console.log(data);
    Museum.findByIdAndUpdate(req.params.id,data.museum,(err,updatedMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error",errorMessage.db_error);
            res.redirect("back");
        }else{
            res.redirect("/museums/"+req.params.id);
        }
    });
});


//delete a particular museum, then redirect to museums page
router.delete("/:id",middleware.checkMuseumOwnership,(req,res)=>{
    Museum.findByIdAndRemove(req.params.id,(err) =>{
        if(err){
            console.log(err);
            req.flash("error",errorMessage.db_error);
        }
        res.redirect("/museums");
    });
});

module.exports = router;