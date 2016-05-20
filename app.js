var express     = require('express');
var session     = require('express-session');
var app         = express('connect');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var expressHbs  = require('express-handlebars');
var _           = require('underscore');
var knex        = require('knex');
var util        = require(__dirname + '/util');
var sqlite3     = require('sqlite3');

/*
 * Database connectivity.
 */
//TODO: The below example shows setting up knex with a mysql database.
// We want to use sqlite.
//var knex = require('knex')({
//    client: 'mysql',
//    connection:
//    {
//        host     : '127.0.0.1',
//        user     : 'root',
//        password : '',
//        database : 'dl'
//    },
//    pool:
//    {
//        min: 0,
//        max: 7
//    }
//});
app.set('knex', knex); //make the instance reusable in other modules.

/********************************************************************
 * Configure express.
 ********************************************************************/
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));     //setup the handlebars engine.
app.set('view engine', 'hbs');                                                //set the view engine to handlebars.
app.use(morgan('dev'));                                                       //logging
app.use(express.static(__dirname + '/public'));                                    //serve static files
app.use(bodyParser.urlencoded({extended: true}));                             //for parsing posts
app.use(bodyParser.json());                                                   //for parsing posts
app.use(session({secret: 'ssshhhhh', resave:true, saveUninitialized:true}));  //sessions

var router = express.Router();                                                //Express 4 router.

/********************************************************************
 * Make sure the user has a valid session on all requests, or
 * redirect to the login page.
 ********************************************************************/
var authenticateLogin = function(req, res, next)
{
	// Run this for all routes except for auth. Auth is the only
	// page that shouldnt have a session active.
	if(req.url != '/auth' && req.url != '/')
    {
		// If the user has a username in their session then they must be
		// properly authenticated.
		if(req.session.username)
			next();
		else
			res.render( 'login', { layout:false } );
    }
	else
		next();
}
router.use( authenticateLogin );

/********************************************************************
 * Run the server.
 ********************************************************************/
var server = app.listen(3000, function ()
{
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);
});

/******************************************************************************
 * Routing
 * / and home are so simple that they can be defined right here. Any routes that
 * are more complicated really should get their own file under routes.
 *****************************************************************************/
router.get('/', function(req, res){
    res.render( 'login', { helpers:util.helpers( req ), layout:'login' } );
});

router.get('/home', function(req, res){
    res.render( 'home', { helpers:util.helpers( req ), layout:'main'  } );
});

router.use('/', require(__dirname + '/routes/auth')(app));
//TODO: add any new routes right here, just like above.

//set the routes.
app.use('/', router);
