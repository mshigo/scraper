var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saveArticle: {
    type: Boolean,
    default: false
  },

  note: {
    type: Schema.Types.ObjectId, //holds note id
    ref: "Note"   // The ref property links the ObjectId to the Note model
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;