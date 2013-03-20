/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description: This script will handle all post CRUD, and special business
 *              logic.
 *
 * Post JSON
 * {
 *  "_id": "1323",
 *  "user_id": 34,
 *  "school_id": 3,
 *  "title": "this is the post title",
 *  "description": "This is the post description",
 *  "type": "headline" or "basic",
 *  "category": "Jobs",
 *  "created": { $date: "2010-07-13 13:23UTC"},
 *  "expires": { $date: "2010-12-13 13:23UTC"},
 *  "image_urls":["url1","url2"],
 *  "email": "joe@gmail.com",
 *  "tags": ["tag1","tag2"],
 *  "location": {
 *      “latitude”: “-122.2344”
 *      “longitude”: “42.43434”
 *  },
 *  "address": {
 *      "street": "3543 big drive",
 *      "zip": "45445",
 *  },
 *  "meta": ["bold" , "listing pic"]
 *  "flag": "spam" or "prohibited" or "miscategorized"
 * }
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development'
    ,config = require('../../config/config')[env],
    response = require('../../response');

// define the collections used for this model
// TODO: build post name off of user's college id (i.e posts-1)
var collections = ["posts"];

// TODO: check to see if post exists, if not, create it on the fly

// connect to mongo db
var db = require("mongojs").connect(config.db_url, collections);
var ObjectId = db.ObjectId;

/**
 * Post validation
 * @param post
 * @param mode
 * @returns {Array}
 */
function validate(post, mode) {
    var retVal = new Array();
    switch(mode) {
        case "DELETE" : {
            if(post.id === null || post.id === '') {
                retVal.push("An id is required.");
            } else {
                // TODO: grab the post from the db based on passed in id

                // TODO: verify that the user id passed in matches the user of the post

            }
        }
            break;
        case "POST" : {
            if(post.title === null || post.title === '') {
                retVal.push("A title is required.");
            }
        }
            break;
        case "PUT" : {
            if(post.id === null || post.id === '') {
                retVal.push("An id is required.");
            } else {
                // TODO: grab the post from the db based on passed in id

                // TODO: verify that the user id passed in matches the user of the post
            }
            if(post.title === null || post.title === '') {
                retVal.push("A title is required.");
            }
        }
    }
    if(retVal.length == 0) {
        retVal = false;
    }
    return retVal;
}

/**
 * This is function will find all the posts based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    // TODO: all by user_id
    // TODO: by category_id and school_id
    db.posts.find({}, function(err, posts) {
        if ( err || !posts) res.send("No posts returned.");
        else {
            response.SUCCESS.response = posts;
            res.send(response.SUCCESS);
        }
    });
};

/**
 * This function will find the specific post based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById = function(req, res) {
    db.posts.find({ _id: ObjectId(req.params.id) }, function(err, post) {
        if ( err || !post) res.send("No posts returned.");
        else {
            response.SUCCESS.response = post;
            res.send(response.SUCCESS);
        }
    });
};

/**
 * This function will create a new post
 * @param req
 * @param res
 */
exports.createPost = function(req, res) {
    var post = req.body;
    // validate post
    var failed = validate(post, "POST");
    if(!failed) {
        db.posts.save(post, function(err, saved) {
            if( err ) {
                // TODO: need to log this error to file
                res.send(response.POST_SAVE_ERROR)
            } else if (!saved) {
                res.send(response.POST_SAVE_ERROR);
            } else res.send(saved);
        });
    } else {
        response.POST_VALIDATION_ERROR.errors = failed;
        res.send(response.POST_VALIDATION_ERROR);
    }
};

/**
 * This function will update a post
 * @param req
 * @param res
 */
exports.updatePost = function(req, res) {
    var post = req.body;
    var failed = validate(post, "PUT");
    if(!failed) {
        db.posts.update({_id: ObjectId(post.id) }, {$set: {title: post.title, description:post.description}}, function(err, updated) {
            if( err ) {
                // TODO: need to log this error to file
                res.send(response.POST_UPDATE_ERROR)
            } else if (!updated) {
                res.send(response.POST_UPDATE_ERROR);
            } else {
                response.SUCCESS.response = post;
                res.send(response.SUCCESS);
            }
        });
    } else {
        response.POST_VALIDATION_ERROR.errors = failed;
        res.send(response.POST_VALIDATION_ERROR);
    }
};

/**
 * This function will delete a post based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deletePost = function(req, res) {
    var post = req.params;
    var failed = validate(post, "DELETE");
    if(!failed) {
        db.posts.remove({_id: ObjectId(post.id) },{safe:true}, function(err, deleted) {
            if( err ) {
                // TODO: need to log this error to file
                res.send(response.POST_DELETE_ERROR)
            } else if (!deleted) {
                res.send(response.POST_DELETE_ERROR);
            }
            else {
                response.SUCCESS.response = "Post deleted";
                res.send(response.SUCCESS);
            }
        });
    } else {
        response.POST_VALIDATION_ERROR.errors = failed;
        res.send(response.POST_VALIDATION_ERROR);
    }
};