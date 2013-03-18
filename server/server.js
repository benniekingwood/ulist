/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/17/13
 * Description: This file will function as the name server for the ulist node API
 ********************************************************************************/
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config');

var post = require('./routes/posts');

var app = express();

// get mock data from files
var categories = JSON.parse(fs.readFileSync('./mock_data/categories.json', 'utf8'));

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/posts', post.findAll);
app.get('/posts/:id', post.findById);
app.post('/posts', post.createPost);
app.put('/posts/:id', post.updatePost);
app.delete('/posts/:id', post.deletePost);

app.listen(3737);
console.log('Listening on port 3737...');