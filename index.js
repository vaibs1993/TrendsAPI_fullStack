const googleTrends = require('google-trends-api');
let express   = require("express");
let app = express();
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



//node js api to call google trends query api
app.post('/api/users', function(req, res1) {   
    var keyword = req.body.data;
    googleTrends.relatedQueries({keyword: keyword})
    .then((res) => {
        obj = {
            filename: req.body.data,
            res: res
        }
        res1.send(obj);
})
    .catch((err) => {
    console.log(err);
})
    
});


let port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Server listening on port : " + port);
});



