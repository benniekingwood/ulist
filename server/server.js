/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/17/13
 * Description:
 ********************************************************************************/
var express = require('express');

var app = express();

app.get('/posts', function(req, res) {
    res.send([{name:'post1'}, {name:'post2'}]);
});

app.get('/posts/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

app.listen(3000);
console.log('Listening on port 3000...');
