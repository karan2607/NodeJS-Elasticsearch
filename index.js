var express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
const elasticsearch = require('elasticsearch');
//.use(cors());

exports.client = new elasticsearch.Client({
    host : "localhost:9200"
});

var app = express()
app.use(cors());

app.get('/',function(req,res){
    console.log('inside / api')
    res.json({"message": "Welcome to the application."});
})
var port = 8001

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data');
    
    if (req.method == 'OPTIONS') {
    res.status(200).end();
    } else {
    next();
    }
    });


const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;



// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/node.routes.js')(app)

app.listen(port,()=> {
    console.log('server started at port ',port)
})