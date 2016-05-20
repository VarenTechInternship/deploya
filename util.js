//TODO: Example of creating additional NodeJS modules.

/**
 * Utility method for logging an error but also responding to the request.
 * TODO: This can be improved by also returning a status code. (200, 500, etc)
 */
exports.logAndSendError = function( res, err, msg )
{
	console.error( err );
	res.send({status:'error', message: msg});
}

/**
 * Generate a helpers object from the user's session.
 * The handlebars view engine allows js vars to be embedded in the templates.
 * You can do this manually each time for each view, or you can use a helper
 * make sure that the same base vars get sent to the template each time a
 * view is rendered. This is obviously useful for passing user related info
 * to each view.
 */
exports.helpers = function( req )
{
	return {
		username:     function(){ return req.session.username; },
	};
}
