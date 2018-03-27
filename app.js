var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/med");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("js"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

// MONGOOSE/MODEL CONFIG
var patientSchema = new mongoose.Schema({
    firstName: String,
    secondName: String,
    image: String,
    created: {type: Date, default: Date.now}
});

var Patient = mongoose.model("Patient", patientSchema);

//RESTFUL ROUTES
app.get("/", function(req,res){
  res.redirect("/patients"); 
});

app.get("/patients", function(req, res){
    Patient.find({}, function(err, patients){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("index", {blogs: patients});
        }
    });
});

//NEW ROUTE
app.get("/patients/new", function(req, res){
   res.render("new"); 
});

//CREATE ROUT
app.post("/patients", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Patient.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       } else{
           res.redirect("/patients");
       }
   });
});

//SHOW ROUTE
app.get("/patients/:id", function(req, res){
   Patient.findById(req.params.id, function(err, foundPatient){
       if(err){
           res.redirect("/patients");
       } else{
           res.render("show", {blog: foundPatient});
       }
   });
});

//EDIT ROUTE
app.get("/patients/:id/edit", function(req, res){
    Patient.findById(req.params.id, function(err, foundPatient){
        if(err){
            res.redirect("/patients");
        } else {
            res.render("edit", {blog: foundPatient});
        }
    });
});

//UPDATE ROUT
app.put("/patients/:id", function(req, res){
      req.body.blog.body = req.sanitize(req.body.blog.body);
    Patient.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedPatient){
       if(err){
           res.redirect("/patients");
       } else{
           res.redirect("/patients/"+ req.params.id);
       }
    });
});

//DELITE ROUT
app.delete("/patients/:id", function(req,res){
    Patient.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/patients");
       } else{
           res.redirect("/patients");
       }
    });
});


//Search ROUT
app.post("/search", function(req, res){
      name = req.sanitize(req.body.search);
      Patient.find({firstName: name}, function(err, foundPatient){
        if(err || foundPatient[0] == undefined){
            res.redirect("/patients");
        } else {
            res.render("index", {blogs: foundPatient});
        }
    });
});

app.listen(3000, function(){
    console.log("Started!");
});
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Started!");
// });
