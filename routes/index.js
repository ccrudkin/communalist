var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var murl = process.env.mongoURL;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Communalist - Share your lists' });
});

router.get('/list/:listCode', function(req, res) {
    console.log(req.params);
    res.send({ title: 'Request received and processed.' });
});

module.exports = router;
