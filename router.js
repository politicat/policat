var express = require('express');
var router = express.Router();

// NOTE: will be modified
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
/////////////////////////////////////////////

module.exports = router;
