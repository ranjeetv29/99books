var mongoose = require('mongoose')
// var url = "mongodb://localhost:27017/99booksdatabase"
// var url = "mongodb+srv://ranjeet:enZPUHRZj0wGM8PK@cluster0.943ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/99booksdatabase"
var url = "mongodb+srv://ranjeet:enZPUHRZj0wGM8PK@cluster0.943ei.mongodb.net/99booksdatabase"
mongoose.connect(url)
var db = mongoose.connection
console.log(".......................................Connection successfully done......................................")
module.exports=db