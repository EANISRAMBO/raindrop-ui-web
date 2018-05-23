const path = require('path')
const sqlite3 = require('sqlite3')

var express = require('express');
var router = express.Router();

// returns the hydro username that is linked to the internal user, according to the database
router.post('/', async function(req, res, next) {
  let internalUsername = req.body.internalUsername;
  // get the user's information from the hydro2FA database
  var userInformation
  req.app.get('db').get("SELECT * FROM hydro2FA WHERE internalUsername = ?", internalUsername, (error, userInformation) => {
    if (userInformation === undefined) {
      res.json({exists: false})
    } else {
      res.json({exists: true, hydroID: userInformation.hydroID, confirmed: userInformation.confirmed})
    }
  });
});

module.exports = router;
