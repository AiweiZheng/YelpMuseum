var appConst = {};

appConst.flash_error = "error";
appConst.flash_success = "success";

appConst.db_error = "Unable to read data, please try later!";
appConst.welcome_msg = "Welcome to YelpMeseum";
appConst.goodbye_msg = "See you later!";
appConst.login_required = "You need to be logged in to continue the operation.";
appConst.permission_denied = "You do not have permission to do that.";

appConst.comment_add_success = "Successfully added comment";

appConst.redirectBack = function(req,res,err) {
    req.flash(appConst.flash_error,err);
    res.redirect("back");
}

module.exports = appConst;