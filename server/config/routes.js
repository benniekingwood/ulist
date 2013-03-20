/*********************************************************************************
 * Copyright (C) 2013 uLink. All Rights Reserved.
 *
 * Created On: 3/20/13
 * Description:
 ********************************************************************************/
module.exports = function (app) {
    // post routes
    var post = require('../app/models/posts');
    app.get('/api/posts', post.findAll);
    app.get('/api/posts/:id', post.findById);
    app.post('/api/posts', post.createPost);
    app.put('/api/posts/:id', post.updatePost);
    app.delete('/api/posts/:id', post.deletePost);

    // TODO: add authenticate stuff to certain routes
    // app.param('userId', users.user) NOT Sure what this does

    // categories routes
    var category = require('../app/models/categories');
    app.get('/api/categories', category.findAll);
}
