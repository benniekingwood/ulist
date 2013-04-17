/*********************************************************************************
 * Copyright (C) 2013 uLink. All Rights Reserved.
 *
 * Created On: 3/20/13
 * Description:  This file will contain the routes for uList API calls
 ********************************************************************************/
module.exports = function (app) {
    // listing routes
    var listing = require('../app/models/listings');
    app.get('/api/listings', listing.findAll);
    app.get('/api/listings/:id', listing.findById);
    app.post('/api/listings', listing.createListing);
    app.put('/api/listings/:id', listing.updateListing);
    app.delete('/api/listings/:id', listing.deleteListing);

    // socket listing routes
    app.io.route('listings', {
        find: function(req) {
            listing.findAll(req);
        },
        findById: function(req) {
            listing.findById
        },
        create: function(req) {
            listing.createListing
        },
        update: function(req) {
            listing.updateListing;
        },
        remove: function(req) {
            listing.deleteListing
        }
    });

    // categories routes
    var category = require('../app/models/categories');
    app.get('/api/categories', category.findAll);
    app.get('/api/categories/:id', category.findById);

    // socket category routes
    app.io.route('categories', {
        find: function(req) {
            category.findAll(req);
        }
    });
}
