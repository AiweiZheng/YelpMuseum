var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    content:String,
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    museum:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Museum"
        },
        museumname:String
    }
});

module.exports = mongoose.model("Comment",commentSchema);