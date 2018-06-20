var express = require('express');
var router = express.Router();
var raindrop = require('@hydrogenplatform/raindrop');

// gets a randomly generated message for the user to sign
router.get('/', function(req, res, next) {
  let message = raindrop.client.generateMessage();
  req.session.message = message; // save the message in the session
  req.session.save(function(error) {
    if (error) {
      console.log(error)
      res.send(400)
      return
    }
    res.json({message: message})
  })
});

module.exports = router;
