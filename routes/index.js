var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html', { root: './views/' });
});

router.get('/docs/gen', function (req, res, next) {
    res.sendFile('index.html', { root: './docs/gen/' });
});

module.exports = router;
