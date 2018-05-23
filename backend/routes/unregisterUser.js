var express = require('express');
var router = express.Router();

// unregisters an internal user and record it in the database
router.post('/', async function(req, res, next) {
  let internalUsername = req.body.internalUsername;

  // get the internal user's hydro username from the database
  let hydroID = await new Promise((resolve, reject) => {
    req.app.get('db').get(
      "SELECT * FROM hydro2FA WHERE internalUsername = ?", [ internalUsername ], (error, userInformation) => {
      if (error) {
        console.log(error)
        reject()
      } else {
        resolve(userInformation.hydroID)
      }
    })
  });

  if (!hydroID) {
    res.sendStatus(404)
    return
  }

  req.app.get('ClientRaindropPartner').unregisterUser(hydroID)
    // if the API call to unregister was successful, delete it in the database
    .then(result => {
      req.app.get('db').run("DELETE FROM hydro2FA WHERE hydroID = ?", [ hydroID ], (error) => {
        if (error) {
          console.log(error)
          res.sendStatus(404)
        } else {
          res.json({unregistered: true})
        }
      });
    })
    .catch(error => {
      console.log(error)
      res.sendStatus(404)
    });
});

module.exports = router;
