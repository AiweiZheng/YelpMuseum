var express = require("express"),
    router = express(),
    middleware = require("../middleware/index"),
    Museum = require("../models/museum");

//show all museums
router.get("/",(req,res)=>{
    Museum.find({},(err, allMuseums)=>{
        if(err){
            req.flash("error","Unable to get data now, please try later.");
            console.log(err);
        }else{
            res.render("museums/index",{museums:allMuseums});
        }
    });
});

//show information about a specific museum
router.get("/:id",(req,res)=>{
    Museum.findById(req.params.id,(err,foundMuseum)=>{
        if(err){
            console.log(err);
            req.flash("error","Unable to find the data, please try later.");
            res.redirect("back");
        }
        else{
            console.log(foundMuseum);
            res.send("shoooooooooooo");
        //    res.render("museums/show",{museum:foundMuseum});
        }
    })
})

//show create form
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("museums/new");
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
    })            
})

module.exports = router;