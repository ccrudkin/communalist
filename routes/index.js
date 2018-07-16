var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var murl = process.env.mongoURL;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Communalist - Share your lists' });
});

router.get('/list/:listCode', function(req, res) {
    let listCode = req.params.listCode;

    MongoClient.connect(murl, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log(err);
            client.close();
            res.send({ 'list': '', 'errors': 'Database error.' });
        }

        const db = client.db('communalist');

        db.collection('userlists').findOne({ 'code': `${listCode}` }, (err, result) => {
            if (err) {
                console.log(err);
                client.close();
                res.send({ 'list': null, 'errors': "'Find one' error."});
            } else {
                // console.log(result);
                client.close();
                res.send({ 'list': result, 'errors': null });
            }
        });
    });
});

router.post('/update', function(req, res) {
    console.log(req.body);
    let data = JSON.parse(req.body.data);
    console.log(data.code);
    console.log(data.items);

    // /*
    MongoClient.connect(murl, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log(err);
            client.close();
            res.send({ 'list': '', 'errors': 'Database error.' });
        }

        const db = client.db('communalist');

        db.collection('userlists').updateOne( { 'code': data.code }, 
                                            { $set: { 'items': data.items } },
                                            (err, result) => {
                                                if (err) {
                                                    client.close();
                                                    console.log(err);
                                                    res.send(['0', 'Save error.']);
                                                } else {
                                                    client.close();
                                                    console.log(`Upadate result: ${result}`);
                                                    res.send([ '1', 'List saved.' ]);
                                                }
                                            });
    });
});

module.exports = router;
