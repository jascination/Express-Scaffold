/* Use these clusters in production

// server.js
var cluster        = require('cluster');

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
*/

    /**
     * Loading variables from .env in root
     */
    require('dotenv').load();

    // set up ======================================================================
    // get all the tools we need
    var fs       = require('fs');
    var express  = require('express');
    var app      = express();
    var mongoose = require('mongoose');
    var passport = require('passport');
    var flash    = require('connect-flash');

    var http     = require('http');
        http.globalAgent.maxSockets = 200;

    var port     = process.env.PORT;

    // Express seed routes

    var routes   = require('./routes'),
        api      = require('./routes/api'),
        path     = require('path');

    var morgan       = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser   = require('body-parser');
    var session      = require('express-session');
    var MongoStore   = require('connect-mongo')(session);
    var favicon      = require('serve-favicon');
    var configDB     = require('./config/database.js');

    // configuration ===============================================================
    mongoose.connect(configDB.url); // connect to our database

    require('./config/passport')(passport); // pass passport for configuration

    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.static(path.join(__dirname, 'public')));

    // required for passport
    app.use(session({
        secret: '8w43nDanEpwtqxafWaEw',
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    // routes ======================================================================

    // Favicon
    // app.use(favicon(__dirname + '/public/img/favicon.ico'));

    // serve index and view partials
    app.get('/', routes.index);
    require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

    app.get('/partials/:name', routes.partials);


    // JSON API
    // app.get('/api/findProfile/', api.findProfile);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);

    // launch ======================================================================

    http.createServer(app).listen(port, function(){
       console.log("Server connected and ready to go m8!");
    });


// } // End cluster block