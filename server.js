var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/", function(req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});
app.get("/scrape", function(req, res) {
  db.Article.remove({})
  .then(function(dbArticle) {
      console.log(dbArticle);
  });
// First, we grab the body of the html with axios
axios.get("https://www.skysports.com/football/news").then(function(resp) {
  //cheerio shorthand $
  var $ = cheerio.load(resp.data);

  //grab all h4s
  $("h4.news-list__headline").each(function(i, element) {
    // Save these results in an empty object
    var result = {};

    result.title = $(element)
    .children("a")
    .text();

    result.link = $(element)
    .children()
    .attr("href");

    // Create a new Article 
    db.Article.create(result)
    .then(function(dbArticle) {
      console.log(dbArticle);
    })
    .catch(function(err) {
      console.error(err);
    });
  });
  //reload index
  res.redirect("index.html");
  res.send("Scrape Complete");
});
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
db.Article.find({})
  .then(function(dbArticle) {
   //send articles back if found
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//unable to get notes to work
app.get("/articles/:id", function(req, res) {
db.Article.findOne({ _id: req.params.id })
//populates all notes associated with id
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Save/update note
app.post("/articles/:id", function(req, res) {
// Create new note and pass the req.body
db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});
//update article
app.put("/update/articles/:id",function(req,res){
  db.Article.update({_id: req.params.id}, { saveArticle: true })
  .then(function(dbArticle){
    res.json(dbArticle);
    res.redirect("index.html");
  });
});
  
// Start the server
app.listen(process.env.PORT || 3000, function() {
console.log("App running on port " + PORT + "!");
});
  