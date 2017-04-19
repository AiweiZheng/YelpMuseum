/*global $*/

function check_delete() { 
     return confirm("Are you sure to delete this item?");
 }
 
$(document).ready(function() {
    $('form.sodirty').dirtyForms();
 });

 function likeOrUnlike(event, userId, museumId, likee) {
     $('#ajaxError').addClass('hidden');
     var data = { 'userId': userId, 'museumId': museumId };
     var sender = $(event.target);
     var like = sender.hasClass('fa-heart') ? false : true;
     if(like) {
        sendLikeReq(data,sender);
     } else {
         sendUnlikeReq(data,sender);
     }
 }

function sendLikeReq (data,sender) {
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
           showError(err.responseText);
        }
     });
}

function sendUnlikeReq (data,sender) {
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
            showError(err.responseText);
        }
     });
}


function showError(error) {
    $('#ajaxError').html(error);
    $('#ajaxError').toggleClass('hidden');
}

// ===============================search===========================

$(document).ready( function() {
    
    $('#museum-search').on('input',function() {
    var search = $(this).serialize();
    if(search === "search=") {
        search = "all";
    }
    $.get('/museums?' + search, function(data) {
        $("#ajaxError").css("display", "none");
        $('#museum-grid').html('');
        data.forEach(function(museum) {
            $('#museum-grid').append(`
                <div class = "col-md-3 col-sm-6">
                    <div class= "thumbnail">
                        <img src= "${ museum.image }">
                        <div class= "caption">
                            <h4>${museum.name}</h4>
                        <div>
                        <p>
                            <a href="museums/${ museum._id }"
                            class="btn btn-primary">More Info</a>
                        </p>
                    </div>
                <div>
            `);
        });
       }).fail(function(error) {
       showError(error);
       });
   });

   $('#museum-search').submit(function(event) {
      event.preventDefault();
   });
});







 
 


 
 
