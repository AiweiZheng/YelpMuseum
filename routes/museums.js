var express        = require("express"),
    router         = express(),
    middleware     = require("../middleware/index"),
    Museum         = require("../models/museum"),
    appConst       = require("../common/const"),
    ajaxResHandler = require("../common/ajaxResHandler"),
    mongoose       = require("mongoose"),
    moment         = require("moment");
    
    mongoose.Promise = require("bluebird");

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
//show all museums
router.get("/",(req, res)=> {
    
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search),'gi');
        Museum.find({ name:regex }).then(allMuseums => {
             ajaxResHandler.success(res, allMuseums);
        }).catch(dbErr=> {
             console.log(dbErr);
             ajaxResHandler.fail(res, appConst.db_error);
        });
        
    } else {
        Museum.find({}).then(allMuseums=> {
            //success
            if(req.xhr){
                ajaxResHandler.success(res, allMuseums);
            }else{
                res.render("museums/index", { museums:allMuseums , page: "museums" });
            }
            
        }).catch(dbErr=> {//catch database error
            console.log(dbErr); 
            if(req.xhr){
                ajaxResHandler.fail(res, appConst.db_error);
            }else{
                appConst.redirectBack(req, res, appConst.db_error);
            }
        });
    }
});


//create a new museum, then redirect to museums page.
router.post("/",(req, res)=> {
    var data = req.body;
    var author = {id:req.user._id, username:req.user.username};
    
    var museum = new Museum({ name:data.name,
                              price:data.price,
                              image:data.image,
                              description:data.description,
                              author:author });
                              
    Museum.create(museum).then(newlyCreated=> {
         res.redirect("/museums");
    
    }).catch(dbErr=> {
        console.log(dbErr); 
        appConst.redirectBack(req, res, appConst.db_error);
    });
});

//show create form
//need to be placed before "/:id" route,
//or it will go for "/:id". 
router.get("/new", middleware.isLoggedIn, (req, res)=> { 
        res.render("museums/new");               
});

//show information about a specific museum
router.get("/:id",(req, res)=> {
    Museum.findById(req.params.id).populate("comments").exec().then(foundMuseum => {
      res.render("museums/show", { museum:foundMuseum, moment:moment });
    
    }).catch(dbErr => {
          console.log(dbErr); 
          appConst.redirectBack(req, res, appConst.db_error);
    });
});

//show edit form
router.get("/:id/edit",middleware.checkMuseumOwnership, (req,res)=> {
    
    Museum.findById(req.params.id).then(foundMuseum => {
        res.render("museums/edit",{ museum:foundMuseum });
    
    }).catch(dbErr => {
        console.log(dbErr); 
        appConst.redirectBack( req, res, appConst.db_error);
    });
});

//like a museum. MUST place it before /:id
router.put("/likes", middleware.isLoggedIn, (req, res)=> {
     var reqData = req.body;
     Museum.findById( reqData.museumId ).then(foundMuseum=> {
        foundMuseum.likedBy.push(reqData.userId);
        return foundMuseum.save();
     }).then(( savedMuseum )=>{

         ajaxResHandler.success(res, savedMuseum.likedBy.length);
     }).catch((err)=> {
         console.log(err);
         ajaxResHandler.fail(res,appConst.db_error);
     });
});

//dislike
router.delete("/likes", middleware.isLoggedIn, (req, res)=> {
     var reqData = req.body;
     Museum.findById( reqData.museumId ).then(foundMuseum=> {
        var index = foundMuseum.likedBy.indexOf(reqData.userId);
        foundMuseum.likedBy.splice(index, 1);
        return foundMuseum.save();
     }).then(( savedMuseum ) => {
         
         ajaxResHandler.success(res,savedMuseum.likedBy.length);
     }).catch((err)=> {
         console.log(err);
         ajaxResHandler.fail(res,appConst.db_error);
     });
});

//edit a particular museum, then redirect to show page
router.put("/:id",middleware.checkMuseumOwnership,( req, res)=> {
    var data = req.body;
    Museum.findByIdAndUpdate(req.params.id, data.museum).then(() =>{
        res.redirect("/museums/" + req.params.id);
        
    }).catch(dbErr=> {
        console.log(dbErr); 
        appConst.redirectBack(req, res, appConst.db_error);
    });
});


//delete a particular museum, then redirect to museums page
router.delete("/:id", middleware.checkMuseumOwnership, (req, res)=> {
    Museum.findByIdAndRemove(req.params.id).then(() => {
        res.redirect("/museums");
        
    }).catch(dbErr=> {
        console.log(dbErr); 
        appConst.redirectBack(req, res, appConst.db_error);
    });
});



module.exports = router;