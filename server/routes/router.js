var express = require('express');
var router = express.Router();

// NOTE: will be modified
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', require('/client/components').index);
/////////////////////////////////////////////

module.exports = router;
