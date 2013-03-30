/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description: This script will handle all post CRUD, and special business
 *              logic.
 *
 * Post JSON
 * {
    "user_id": 34,
    "school_id": 3,
    "title": "this is the post title",
    "description": "This is the post description",
    "type": "headline",
    "category": "Jobs",
    "email": "joe@gmail.com",
 "address": [
 {
     "street": "3543 big drive",
     "zip": "45445"
 }
 ],
 "image_urls": [
 "url1",
 "url2"
 ],
 "tags": [
 "tag1",
 "tag2"
 ],
 "meta": [
 "bold",
 "listing pic"
 ]
 }
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
        if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!posts ) {
            if(!res) {
                req.io.respond( {posts : new Array() } , response.SUCCESS.code);
            } else {
                res.send({posts : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {posts : posts } , response.SUCCESS.code);
            } else {
                res.send({posts : posts }, response.SUCCESS.code);
            }
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
          if ( err ) {
            if(!res) {
                req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error :  "There was an issue with your request." }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!post ) {
            if(!res) {
                req.io.respond( {post : new Array() } , response.SUCCESS.code);
            } else {
                res.send({post : new Array()  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {post : post } , response.SUCCESS.code);
            } else {
                res.send({post : post }, response.SUCCESS.code);
            }
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
   // var failed = validate(post, "POST");
    var failed = false;
    if(!failed) {
        db.posts.save(post, function(err, result) {
             if ( err ) {
                    if(!res) {
                        req.io.respond( { error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                    } else {
                        res.send({ error : "There was an issue with your request." }, response.SYSTEM_ERROR.code);
                    }
            } else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem creating your post.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem creating your post.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            } else {
                if(!res) {
                    req.io.respond( {post : result } , response.SUCCESS.code);
                } else {
                    res.send({post : result }, response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {error : "Validation error" } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "Validation error" }, response.VALIDATION_ERROR.code);
        }
    }
};

/**
 * This function will update a post
 * @param req
 * @param res
 */
exports.updatePost = function(req, res) {
    var post = req.body;
    delete post._id;
   // var failed = validate(post, "PUT");
    var failed = false;
    if(!failed) {
        db.posts.update({_id: ObjectId(req.params.id)}, post, function(err, result) {
            if ( err ) {
                    // TODO: add codes here so we know what went wrong, log errors
                    if(!res) {
                        req.io.respond( {error : "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                    } else {
                        res.send({error : "There was an issue with your request."  }, response.SYSTEM_ERROR.code);
                    }
            } else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem updating your post.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem updating your post.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            } else {
                if(!res) {
                    req.io.respond( {post : result } , response.SUCCESS.code);
                } else {
                    res.send({post : result }, response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {error : "Validation error" } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "Validation error" }, response.VALIDATION_ERROR.code);
        }
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
    //var failed = validate(post, "DELETE");
    var failed = false;
    if(!failed) {
        db.posts.remove({_id: ObjectId(post.id) },{safe:true}, function(err, result) {
            if ( err ) {
                if(!res) {
                    req.io.respond( {error:  "There was an issue with your request." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error :  "There was an issue with your request." }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem deleting your post.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem deleting your post.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond( {post : "Post deleted." } , response.SUCCESS.code);
                } else {
                    res.send({post : "Post deleted." }, response.SUCCESS.code);
                }
            }
        });
    } else {
         if(!res) {
            req.io.respond( {error : "An id is required to delete a post." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "An id is required to delete a post." }, response.VALIDATION_ERROR.code);
        }
    }
};