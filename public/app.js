$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++){
        $("#articles").append("<p data-id='" + data[i]._id + "'>"
         + data[i].title + data[i].link + "</p>");
    }
});
//click handler for p tags
$(document).on("click", "p", function(){
    $("#notes").empty();
    //grab id from this p tag
    var id = $(this).attr("data-id");
    //ajax call for article
    $.ajax({
        url: "/articles/" + id,
        method: "GET"
    })
    .then(function(resp){
        console.log(resp);

        //append title
        $("#notes").append("<h2>" + data.title + "</h2>");
        //input to edit title
        $("#notes").append("<input id='title-input' name='title'>");
        //area to add notes
        $("#notes").append("<textarea id='body-input' name='body'></textarea>");
        //submit button for note w/ id of articlw
        $("#notes").append("<button data-id='" + data._id + "' id='add-note'>Add Note</button>");
    });
});

//click handler for addinga note
$(document).on("click", "#add-note", function() {
    // Grab the article id from submit button
    var id = $(this).attr("data-id");
    //post request to update note
    $.ajax({
        url: "/articles/" + id,
        method: "POST",
        data: {
        title: $("#title-input").val(),
        // Value taken from note textarea
        body: $("#body-input").val()
      }
    })
    .then(function(resp) {
        console.log(resp);
        $("#notes").empty();
      });
//clear values from input
    $("#title-input").val("");
    $("#body-input").val("");
  });
//on click for scrape
$(document).on("click", "btn scrape", function(){
    $.ajax({
        url: "/scrape",
        method: "GET"
    })
    .then(function(resp){
        console.log(resp);
    })
    .catch(function(err){
        console.error(err);
    })
})