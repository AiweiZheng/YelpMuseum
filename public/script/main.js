/*global $*/

function check_delete(){ 
     return confirm("Are you sure to delete this item?");
 }
 
$(document).ready(function(){
    $('form.sodirty').dirtyForms();
 });

 function likeOrUnlike(event,userId, museumId, likee){
     var data = { 'userId': userId, 'museumId': museumId };
     var sender = $(event.target);
     var like = sender.hasClass('fa-heart') ? false : true;
     if(like) {
        sendLikeReq(data,sender);
     } else {
         sendUnlikeReq(data,sender);
     }
 }

function sendLikeReq (data,sender){
     $.ajax({
        type:'PUT',
        dataType: 'json',
        data: data,
        contentType: 'application/x-www-form-urlencoded',
        url: 'museums/likes',
        success: function(response) {
          sender.html(response);
          sender.toggleClass('fa-heart');
          sender.toggleClass('fa-heart-o');
        },
        fail: function(err) {
            $("#ajaxError").css("display", "block");
            $("#ajaxError").html(err.responseText);
        }
     });
}

function sendUnlikeReq (data,sender){
     $.ajax({
        type:'DELETE',
        dataType: 'json',
        data: data,
        contentType: 'application/x-www-form-urlencoded',
        url: 'museums/likes',
        success: function(response) {
          sender.html(response);
          sender.toggleClass('fa-heart');
          sender.toggleClass('fa-heart-o');
        },
        fail: function(err) {
            $("#ajaxError").css("display", "block");
            $("#ajaxError").html(err.responseText);
        }
     });
}


 
 


 
 
