var fs = require('fs');
var mongodb = require('mongodb');
var url = require('url');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// define the collections used for this model
var collections = ["posts"];

// connect to mongo db
var db = require("mongojs").connect(config.mongohq_url, collections);
var ObjectId = db.ObjectId;

// dummy data
//var posts = JSON.parse(fs.readFileSync('./mock_data/posts.json', 'utf8'));

/**
 * This is function will find all the posts based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.posts.find({}, function(err, posts) {
        if ( err || !posts) res.send("No posts returned.");
        else res.send(posts);
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
        else res.send(post);
    });
};

/**
 * This function will create a new post
 * @param req
 * @param res
 */
exports.createPost = function(req, res) {
    var post = req.body;
    db.posts.save(post, function(err, saved) {
        if( err || !saved ) res.send("There was a problem saving your post.  Please try again later or contact help@theulink.com");
        else res.send(saved);
    });
};

/**
 * This function will update a post
 * @param req
 * @param res
 */
exports.updatePost = function(req, res) {
    var post = req.body;
    db.posts.update({_id: ObjectId(post.id) }, {$set: {title: post.title, description:post.description}}, function(err, updated) {
        if( err || !updated ) res.send("There was a problem saving your post.  Please try again later or contact help@theulink.com");
        else res.send("Post Updated");
    });
};

/**
 * This function will delete a post based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deletePost = function(req, res) {
    db.posts.remove({_id: ObjectId(req.params.id) }, function(err, deleted) {
        if( err || !deleted ) res.send("There was a problem deleting your post.  Please try again later or contact help@theulink.com");
        else res.send("Post deleted");
    });
};