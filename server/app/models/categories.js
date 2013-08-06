/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description:  This script will handle all category CRUD, and special business
 *              logic.
 *
 * Category JSON - see mock_data/
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development'
    ,config = require('../../config/config')[env],
    response = require('../../response');

// define the collections used for this model
var collections = ["categories", "listings"];

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
    db.categories.find({}, function(err, categories) {
        if ( err ) {
            console.log("{Categories.findAll} Error: " + err);
            if(!res) {
                req.io.respond( {error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!categories ) {
            if(!res) {
                req.io.respond( {}, response.SUCCESS.code);
            } else {
                res.send({}, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond(  categories , response.SUCCESS.code);
            } else {
                res.send( categories, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will find the specific category based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById = function(req, res) {
    db.categories.find({ _id: ObjectId(req.params.id) }, function(err, category) {
        if ( err ) {
            console.log("{Categories.findById} Error: " + err);
            if(!res) {
                req.io.respond( {error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!category ) {
            if(!res) {
                req.io.respond(  {} , response.SUCCESS.code);
            } else {
                res.send({}, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond(category , response.SUCCESS.code);
            } else {
                res.send(category, response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will find the categories that have the most
 * listings.  The amount that the server will retrieve is 
 * based on the params
 * passed in id
 * @param req
 * @param res
 */
exports.findTopCategories = function(req, res) {
   var reqJSON = req.body;
   var limit = (reqJSON.limit != undefined && parseInt(reqJSON.limit) > 0) ? parseInt(reqJSON.limit) : 3;
   var schoolId = reqJSON.sid;
   if(schoolId != undefined && parseInt(schoolId) > 0) {
        db.listings.aggregate(
          [
            { $match : { school_id : parseInt(schoolId) } },
            { $group : { _id : {category:"$category"} , count : { $sum : 1 } } },
            { $sort : { "count" : -1 } },
            { $limit : limit }
          ], function(err, category) {
            if ( err ) {
                console.log("{Categories.findTopCategories} Error: " + err);
                if(!res) {
                    req.io.respond( {error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!category ) {
                if(!res) {
                    req.io.respond(  {} , response.SUCCESS.code);
                } else {
                    res.send({}, response.SUCCESS.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond(category , response.SUCCESS.code);
                } else {
                    res.send(category, response.SUCCESS.code);
                }
            }
        });
    } else {
        var errors = { school_id : 'A valid school id is required.'};
        if(!res) {
            req.io.respond( {errors : errors } , response.VALIDATION_ERROR.code);
        } else {
            res.send({errors : errors }, response.VALIDATION_ERROR.code);
        }
    }
};