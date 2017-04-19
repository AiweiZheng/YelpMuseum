/*global $*/

 
$('#museum-search').on('input',function() {

    var search = $(this).serialize();
    if(search === "search="){
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
    }).fail(function(err) {
       // alert(err.responseText);
        $("#ajaxError").css("display", "block");
        $("#ajaxError").html(err.responseText);
    });
});

$('#museum-search').submit(function(event) {
  event.preventDefault();
 });
 