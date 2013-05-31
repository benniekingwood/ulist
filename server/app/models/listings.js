/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description: This script will handle all listing CRUD, and special business
 *              logic.
 *
 * Listings JSON - see mock_data/
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development'
    ,config = require('../../config/config')[env],
    response = require('../../response'),
    moment = require('moment');

// define the collections used for this model
// TODO: build listing name off of user's college id (i.e listings-1)
var collections = ["listings"];

// TODO: check to see if listing db exists, if not, create it on the fly

// connect to mongo db
var db = require("mongojs").connect(config.db_url, collections);
var ObjectId = db.ObjectId;

/*
 * LIST_FETCH_SIZE - constant we will use to define how many listing
 *                 - results we fetch at any given time 
 */
var LIST_FETCH_SIZE = 10
var LIST_FETCH_SIZE_MAX = 25

/**
 * This function will validate the basic listing information.
 * @param retVal
 * @param listing
 * @returns {*}
 */
function validateBaseInformation(retVal, listing) {
    if(listing.title == null || listing.title == '') {
        retVal['title'] = "A title is required.";
    }
    if(listing.description == null || listing.description == '') {
        retVal['description'] = "A description is required.";
    }
    // if main_category is For Sale we need a price
    if(listing.main_category == "For Sale" && (listing.price == null || parseInt(listing.price) <= 0)) {
        console.log('here');
        retVal['price'] = "A valid price is required.";
    }
    return retVal;
}

/**
 * This function will verify that the user id
 * passed in matches the user id of the listing
 * @param userId
 * @return boolean
 */
function userIsListingOwner(userId) {
    db.listings.find({ _id: ObjectId(userId) }, function(err, listing) {
        if ( err ) { console.log("{Listing#validateUserIsOwner} Error : " + err);
            return false;
        } else {
            return (listing && listing.id == userId);
        }
    });
}

/**
 * This function will perform all of the necessary validations for the
 * listing model
 * @param listing
 * @param mode
 * @param id
 * @returns {*}
 */
function validate(listing, mode, id) {
    var retVal = {};
    switch(mode) {
        case "DELETE" : {
            if(id === null || id === '') {
                retVal['id'] = "An id is required.";
            }
        }
            break;
        case "PUT" : {
            if(id === null || id === '') {
                retVal['id'] = "An id is required.";
            }
        }
        case "POST" : {
            retVal = validateBaseInformation(retVal, listing);
        }
            break;
    }
    // if there are no validation errors return false
    if(Object.keys(retVal).length == 0) {
        retVal = false;
    }
    return retVal;
}

/**
 * This function will build the search query
 * for listings
 *
 * @param params
 * @returns {*}
 */
function buildSearchQuery(params) {
    var query = {};
    // determine the query type
    switch(params.qt) {
        case 's':
            // search on the tags OR the title, will ignore the case as well
            query['$or'] = [{tags : {$regex : params.t, $options: 'i' }},{title : {$regex : params.t, $options: 'i' }}];
            // add main and sub category and school id
            query['school_id'] = parseInt(params.sid);
            // main category and sub category query params are optional
            if(params.mc != undefined) {query['main_category'] = params.mc;}
            if(params.c != undefined) {query['category'] = params.c};
            break;
        case 'c':
            // add main and sub category and school id
            query['main_category'] = params.mc;
            query['category'] = params.c;
            query['school_id'] = parseInt(params.sid);
            break;
        case 'u':
            // searching against the user only
            query['user_id'] = parseInt(params.uid);
            break;
    }
    return query;
}

/**
 * This is function will find all the listings based on the
 * passed in parameters
 *  batchNum - will be passed in query params as batch=<number>
 *           - this will allow us to load a prefix no. of results
 *           - to reduce stress load
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    var batchNum = parseInt(req.query.b);
    console.log("batch number: " + batchNum);
    var query = buildSearchQuery(req.query);
    db.listings.find(query).skip(batchNum * LIST_FETCH_SIZE).limit(LIST_FETCH_SIZE, function(err, listings) {
        if ( err ) {
            console.log("{listings.findById} Error: " + err);
            if(!res) {
                req.io.respond( {error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!listings ) {
            if(!res) {
                req.io.respond(  {} , response.SUCCESS.code);
            } else {
                res.send( {} , response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond(  listings , response.SUCCESS.code);
            } else {
                res.send( listings , response.SUCCESS.code);
            }
        }
    });
    /*}).skip(batch * LIST_FETCH_SIZE).limit(LIST_FETCH_SIZE);*/
};

/**
 * This function will find the specific listing based on the
 * passed in id
 * @param req
 * @param res
 */
exports.findById = function(req, res) {
    db.listings.find({ _id: ObjectId(req.params.id) }, function(err, listing) {
          if ( err ) { console.log("{Listing#findById} Error : " + err);
            if(!res) {
                req.io.respond( {error :response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
            }
        }
        else if(!listing ) {
            if(!res) {
                req.io.respond( {} , response.SUCCESS.code);
            } else {
                res.send({}, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond(  listing , response.SUCCESS.code);
            } else {
                res.send( listing , response.SUCCESS.code);
            }
        }
    });
};

/**
 * This function will create a new listing
 * @param req
 * @param res
 */
exports.createListing = function(req, res) {
    var listing = req.body;
    // validate listing
    var errors = validate(listing, "POST", null);
    if(!errors) {
        // created date
        listing['created'] = moment().format("YYYY-MM-DD h:mm:ss A");
        /*
         * If the listing type is headline, we need to check for the
         * duration that the client purchased.  If there is no duration for
         * some reason, we will default to 3 days which is the max for a
         * headline.
         */
        if(listing.type == "headline") {
            if(listing.meta == undefined) { listing['meta']['duration'] = 3;}
            else if (listing.meta.duration == undefined) { listing.meta['duration'] = 3; }
            listing['expires'] = moment().add('days', parseInt(listing.meta.duration));
        } else { // we can assume that we want to add 7 days as a standard
            listing['expires'] = moment().add('days', 7);
        }
        listing['expires'] = listing['expires'].format("YYYY-MM-DD h:mm:ss A");

        // shorten the description for the short_description field.  limit to 40 chars.
        listing['short_description'] = (listing.description.length > 40) ? listing.description.substring(0,40) + "..." : listing.description;

        db.listings.save(listing, function(err, result) {
             if ( err ) { console.log("{Listing#createListing} Error : " + err);
                    if(!res) {
                        req.io.respond( { error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
                    } else {
                        res.send({ error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
                    }
            } else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem creating your listing.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem creating your listing.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            } else {
                if(!res) {
                    req.io.respond( result  , response.SUCCESS.code);
                } else {
                    res.send( result , response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {errors : errors } , response.VALIDATION_ERROR.code);
        } else {
            res.send({errors : errors }, response.VALIDATION_ERROR.code);
        }
    }
};

/**
 * This function will update a listing
 * @param req
 * @param res
 */
exports.updateListing = function(req, res) {
    var listing = req.body;
    // delete the id that was passed in for the listing, we don't want to overwrite the original id
    delete listing._id;
    var errors = validate(listing, "PUT", req.params.id);
    if(!errors) {
        db.listings.update({_id: ObjectId(req.params.id)}, listing, function(err, result) {
            if ( err ) {
                    console.log("{Listing#updateListing} Error : " + err);
                    if(!res) {
                        req.io.respond( {error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
                    } else {
                        res.send({error : response.SYSTEM_ERROR.response  }, response.SYSTEM_ERROR.code);
                    }
            } else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem updating your listing.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem updating your listing.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            } else {
                if(!res) {
                    req.io.respond(  {}  , response.SUCCESS.code);
                } else {
                    res.send( {} , response.SUCCESS.code);
                }
            }
        });
    } else {
        if(!res) {
            req.io.respond( {errors : errors } , response.VALIDATION_ERROR.code);
        } else {
            res.send({errors : errors }, response.VALIDATION_ERROR.code);
        }
    }
};

/**
 * This function will delete a listing based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deleteListing = function(req, res) {
    var listing = req.params;
    var errors = validate(listing, "DELETE", req.params.id);
    if(!errors) {
        db.listings.remove({_id: ObjectId(listing.id) },{safe:true}, function(err, result) {
            if ( err ) {
                console.log("{Listing#deleteListing} Error : " + err);
                if(!res) {
                    req.io.respond( {error: response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error :response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
                }
            }
            else if(!result ) {
                if(!res) {
                    req.io.respond( {error : "There was a problem deleting your listing.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
                } else {
                    res.send({error : "There was a problem deleting your listing.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
                }
            }
            else {
                if(!res) {
                    req.io.respond( {} , response.SUCCESS.code);
                } else {
                    res.send({}, response.SUCCESS.code);
                }
            }
        });
    } else {
         if(!res) {
            req.io.respond( {errors : errors } , response.VALIDATION_ERROR.code);
        } else {
            res.send({errors : errors }, response.VALIDATION_ERROR.code);
        }
    }
};