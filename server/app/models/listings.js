/*********************************************************************************
 * Copyright (C) 2013 ulink, Inc. All Rights Reserved.
 *
 * Created On: 3/19/13
 * Description: This script will handle all listing CRUD, and special business
 *              logic.
 *
 * Listings JSON
 * {
    "user_id": 34,
    "school_id": 3,
    "title": "this is the listing title",
    "description": "This is the listing description",
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
// TODO: build listing name off of user's college id (i.e listings-1)
var collections = ["listings"];

// TODO: check to see if listing db exists, if not, create it on the fly

// connect to mongo db
var db = require("mongojs").connect(config.db_url, collections);
var ObjectId = db.ObjectId;

/**
 * This function will validate the basic listing information.
 * @param retVal
 * @param listing
 * @returns {*}
 */
function validateBaseInformation(retVal, listing) {
    if(listing.title === null || listing.title === '') {
        retVal.push("A title is required.");
    }
    if(listing.description === null || listing.description === '') {
        retVal.push("A description is required.");
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
 * @returns {Array}
 */
function validate(listing, mode, id) {
    var retVal = [];
    switch(mode) {
        case "DELETE" : {
            if(id === null || id === '') {
                retVal.push("An id is required.");
            }
        }
            break;
        case "PUT" : {
            if(id === null || id === '') {
                retVal.push("An id is required.");
            }
        }
        case "POST" : retVal = validateBaseInformation(retVal, listing);
            break;
    }
    if(retVal.length == 0) {
        retVal = false;
    }
    return retVal;
}

/**
 * This is function will find all the listings based on the
 * passed in parameters
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    console.log(req.query);
    // TODO: have query param that denotes the type of search q=1 for Searching, u=1 for user search,
    // TODO: all by user_id (my listings)
    // TODO: This is for grabbing all the recent by category - by category and school_id ? but what about the categories that have Generals? we need to figure that out

    // TODO: Searching - search against the tag, title with LIKEs

    db.listings.find({}, function(err, listings) {
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
                req.io.respond( {listings : {} } , response.SUCCESS.code);
            } else {
                res.send({listings : {}  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {listings : listings } , response.SUCCESS.code);
            } else {
                res.send({listings : listings }, response.SUCCESS.code);
            }
        }
    });
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
                req.io.respond( {listing : {} } , response.SUCCESS.code);
            } else {
                res.send({listing : {}  }, response.SUCCESS.code);
            }
        }
        else {
            if(!res) {
                req.io.respond( {listing : listing } , response.SUCCESS.code);
            } else {
                res.send({listing : listing }, response.SUCCESS.code);
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
    var failed = validate(listing, "POST", null);
    if(!failed) {
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
                    req.io.respond( {listing : result } , response.SUCCESS.code);
                } else {
                    res.send({listing : result }, response.SUCCESS.code);
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
 * This function will update a listing
 * @param req
 * @param res
 */
exports.updateListing = function(req, res) {
    var listing = req.body;
    //delete listing._id;
    var failed = validate(listing, "PUT", req.params.id);
    if(!failed) {
        db.listings.update({_id: ObjectId(req.params.id)}, listing, function(err, result) {
            if ( err ) {
                    console.log("{Listing#updateListing} Error : " + err);
                    // TODO: add codes here so we know what went wrong, log errors
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
                    req.io.respond( {listing : result } , response.SUCCESS.code);
                } else {
                    res.send({listing : result }, response.SUCCESS.code);
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
 * This function will delete a listing based on the
 * passed in id parameter
 * @param req
 * @param res
 */
exports.deleteListing = function(req, res) {
    var listing = req.params;
    var failed = validate(listing, "DELETE", req.params.id);
    if(!failed) {
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
                    req.io.respond( {listing : "listing deleted." } , response.SUCCESS.code);
                } else {
                    res.send({listing : "listing deleted." }, response.SUCCESS.code);
                }
            }
        });
    } else {
         if(!res) {
            req.io.respond( {error : "An id is required to delete a listing." } , response.VALIDATION_ERROR.code);
        } else {
            res.send({error : "An id is required to delete a listing." }, response.VALIDATION_ERROR.code);
        }
    }
};