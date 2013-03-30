/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/17/13
 * Description: This file will function as the name server for the ulist node API
 ********************************************************************************/
var path = require('path')
express = require('express.io')
app = express().http().io()

app.configure(function () {
    app.set('port', process.env.PORT || 3737);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp/files' }));
});

// development environment settings
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
// production environment settings
app.configure('production', function(){
    app.use(express.errorHandler());
});
// Bootstrap routes
require('./config/routes')(app)

console.log('node server running on port ' + app.get('port'));

// Start the app by listening on <port>
app.listen(app.get('port'));
