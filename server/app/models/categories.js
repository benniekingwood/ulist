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
                req.io.respond( {categories : {}} , response.SUCCESS.code);
            } else {
                res.send({categories : {}  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {categories : categories } , response.SUCCESS.code);
            } else {
                res.send({categories : categories }, response.SUCCESS.code);
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
                req.io.respond( {category : {} } , response.SUCCESS.code);
            } else {
                res.send({category : {}  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {category : category } , response.SUCCESS.code);
            } else {
                res.send({category : category }, response.SUCCESS.code);
            }
        }
    });
};