// Create express app and db
var express = require("express")
var app = express()
var db = require("./database.js")

//create a body parser for manage the post method call
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen Server port
var HTTP_PORT = 5000
// Start server on port
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// My Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// GET method return all info about Bugs
app.get("/api/bugs", (req, res, next) => {
    var sql = "select * from bugs"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//GET method return bug from by id
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from bugs where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

//POST Method and returns in error exception if all fields are not filled in correctly (error 400)
app.post("/api/bugs/", (req, res, next) => {
    var errors=[]
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.type){
        errors.push("No type specified");
    }
    if (!req.body.description){
        errors.push("No description specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
    }

    //insert the filed required in the db
    var sql ='INSERT INTO bugs (name, type, description) VALUES (?,?,?)'
    var params =[data.name, data.type, data.description]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//PUT method for update filed path
app.patch("/api/bugs/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description
    }
    db.run(
        `UPDATE user set
           name = COALESCE(?,name),
           type = COALESCE(?,type),
           description = COALESCE(?,description)
           WHERE id = ?`,
        [data.name, data.type, data.description, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

//DELETE method by id
app.delete("/api/bugs/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})
// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
