var express = require('express');
var router  = express.Router();
var util    = require(__dirname +'/../util');

/**
 * Authorize a user. Really, we are just setting their username in the session.
 */
router.post('/auth', function(req, res)
{
    // Put the username on the session object.
	req.session.username = req.body.username;

    // Send a success response.
    res.send( { status:'success' } );
});

// TODO: This is actually useless for this route since the route doesn't talk to
// the db, however, this is how you would get access to the same database
// instance in each route.
module.exports = function( app )
{
	//get the knex db instance.
	knex = app.get('knex');
	return router;
}
