var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var murl = process.env.mongoURL;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Communalist - Share your lists' });
});

router.get('/new', function(req, res) {
    newList()
    .then((result) => { res.send(result) })
    .catch((error) => { res.send(error) });
});

router.get('/list/:listCode', function(req, res) {
    let listCode = req.params.listCode;

    getList(listCode)
    .then((list) => { res.send(list) })
    .catch((err) => { res.send(err) });
});

router.post('/update', function(req, res) {
    let data = JSON.parse(req.body.data);

    updateList(data)
    .then((message) => { res.send(message) })
    .catch((error) => { res.send(error) });
});

// fetch list from MongoDB and return promise
function getList(listCode) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.log(err);
                client.close();
                reject({ 'list': null, 'errors': 'Database error.' });
            }
    
            const db = client.db('communalist');
    
            db.collection('userlists').findOne({ 'code': `${listCode}` }, (err, result) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject({ 'list': null, 'errors': "'Find one' error."});
                } else {
                    // console.log(result);
                    client.close();
                    resolve({ 'list': result, 'errors': null });
                }
            });
        });
    });
    return prom;
}

// update list and return promise
function updateList(data) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.log(err);
                client.close();
                reject({ 'list': null, 'errors': 'Database error.' });
            }
    
            const db = client.db('communalist');
    
            db.collection('userlists').updateOne( { 'code': data.code }, 
                                                { $set: { 'items': data.items, 'name': data.name } },
                                                (err, result) => {
                                                    if (err) {
                                                        client.close();
                                                        console.log(err);
                                                        reject(['0', 'Save error.']);
                                                    } else {
                                                        client.close();
                                                        console.log(`Upadate result: ${result}`);
                                                        resolve([ '1', 'List saved.' ]);
                                                    }
                                                });
        });
    });
    return prom;
}

// generate random number for listCode
function randomNum() {
    const bts = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += bts[Math.round(Math.random() * 36)];
    }
    return code.toUpperCase();
}

// get new random ID, check if exists; if not, create new list with said ID
function newList() {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.log(err);
                client.close();
                res.send( ['0', 'New list error.' ] );
            }
            
            let newCode = randomNum();
            const db = client.db('communalist');
    
            db.collection('userlists').find({ 'code': `${newCode}` }).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject(err);
                } else {
                    if (docs.length === 0) {
                        console.log(`Creating new document. Search documents returned:\n${docs}`);
                        db.collection('userlists').insertOne({
                            'code': newCode,
                            'name': 'New list name',
                            'items': 'Type your list here',
                            'dateCreated': new Date().toISOString()
                        }, (err, results) => {
                            if (err) {
                                console.log(err);
                                client.close();
                                reject(err);
                            } else {
                                console.log(`Creation results:\n${results}`);
                                client.close();
                                resolve(['1', newCode]);
                            }
                        });
                    } else {
                        client.close();
                        console.log(`Documents returned:\n${docs}`);
                        reject(['0', 'Code already in use.']);
                    }
                }
            });
        });
    });
    return prom;
}

module.exports = router;
