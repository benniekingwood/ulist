/*********************************************************************************
 * Copyright (C) 2013 uLink. All Rights Reserved.
 *
 * Created On: 3/20/13
 * Description:  This file will contain the routes for uList API calls
 ********************************************************************************/
module.exports = function (app) {
    // post routes
    var post = require('../app/models/posts');
    app.get('/api/posts', post.findAll);
    app.get('/api/posts/:id', post.findById);
    app.post('/api/posts', post.createPost);
    app.put('/api/posts/:id', post.updatePost);
    app.delete('/api/posts/:id', post.deletePost);

    // socket post routes
    app.io.route('posts', {
        find: function(req) {
            post.findAll(req);
        },
        findById: function(req) {
            post.findById
        },
        create: function(req) {
            post.createPost
        },
        update: function(req) {
            post.updatePost;
        },
        remove: function(req) {
            post.deletePost
        }
    });

    // TODO: add authenticate stuff to certain routes
    // app.param('userId', users.user) NOT Sure what this does
    //app.all('/api/*', requireAuthentication);

    // categories routes
    var category = require('../app/models/categories');
    app.get('/api/categories', category.findAll);

    // socket category routes
    app.io.route('categories', {
        find: function(req) {
            category.findAll(req);
        },
        findById: function(req) {
            category.findById
        },
        create: function(req) {
            category.createCategory
        },
        update: function(req) {
            category.updateCategory;
        },
        remove: function(req) {
            category.deleteCategory
        }
    });
}
