/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description:  This script will handle all category CRUD, and special business
 *              logic.
 *
 * Category JSON (How it is stored in mongo)
 * {
 *  "_id": "unique",
 *  "name": "category",
 *  "sub-categories": ["sub-category-1", "sub-category-2"]
 * }
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development'
    ,config = require('../../config/config')[env],
    response = require('../../response');

// define the collections used for this model
var collections = ["categories"];

// connect to mongo db
var db = require("mongojs").connect(config.db_url, collections);
var ObjectId = db.ObjectId;

/**
 * This is function will find all the categories based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.categories.find({}, function(err, posts) {
        if ( err || !posts) res.send("No categories returned.");
        else res.send(posts);
    });
};

/**
 * This function will find the specific category based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById = function(req, res) {
    db.categories.find({ _id: ObjectId(req.params.id) }, function(err, post) {
        if ( err || !post) res.send("No category returned.");
        else res.send(post);
    });
};
