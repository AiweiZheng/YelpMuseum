var express = require("express"),
    router = express(),
    middleware = require("../middleware/index"),
    Museum = require("../models/museum"),
    appConst = require("../common/const"),
    mongoose         = require("mongoose");
    
    mongoose.Promise = require("bluebird");

//show all museums
router.get("/",(req,res)=> {
    Museum.find({}).then(allMuseums=> {
        //success
        res.render("museums/index",{ museums:allMuseums });
    
    }).catch(dbErr=> {//catch database error
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
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
                              
    Museum.create(museum).then(newlyCreated => {
         res.redirect("/museums");
    
    }).catch(dbErr => {
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
});

//show create form
//need to be placed before "/:id" route,
//or it will go for "/:id". 
router.get("/new",middleware.isLoggedIn,(req,res)=>{ 
        res.render("museums/new");               
});

//show information about a specific museum
router.get("/:id",(req,res)=>{
    
    //var query = Museum.findById(req.params.id).populate("comments").exec();
    Museum.findById(req.params.id).populate("comments").exec().then(foundMuseum=>{
      res.render("museums/show",{museum:foundMuseum});
    
    }).catch(dbErr => {
          console.log(dbErr); 
          appConst.redirectBack(req,res,appConst.db_error);
    })
  
});

//show edit form
router.get("/:id/edit",middleware.checkMuseumOwnership,(req,res)=>{
    
    Museum.findById(req.params.id).then(foundMuseum => {
        res.render("museums/edit",{museum:foundMuseum});
    
    }).catch(dbErr => {
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
});

//edit a particular museum, then redirect to show page
router.put("/:id",middleware.checkMuseumOwnership,(req,res)=>{
    var data = req.body;
    Museum.findByIdAndUpdate(req.params.id,data.museum).then(() =>{
        res.redirect("/museums/"+req.params.id);
        
    }).catch(dbErr =>{
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
});


//delete a particular museum, then redirect to museums page
router.delete("/:id",middleware.checkMuseumOwnership,(req,res)=>{
    Museum.findByIdAndRemove(req.params.id).then(() => {
        res.redirect("/museums");
        
    }).catch(dbErr=>{
        console.log(dbErr); 
        appConst.redirectBack(req,res,appConst.db_error);
    });
});

module.exports = router;