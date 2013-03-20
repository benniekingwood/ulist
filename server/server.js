/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/17/13
 * Description: This file will function as the name server for the ulist node API
 ********************************************************************************/
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    response = require('./response'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

// Bootstrap models
/*var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
})*/

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "files")));
    app.use(app.router);
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

// Start the app by listening on <port>
var port = process.env.PORT || 3737
app.listen(port)
console.log('uList Server API app started on port '+port)