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
    ,config = require('../../config/config')[env]
    ,response = require('../../response')
    ,moment = require('moment')
    ,imageUtil = require('../util/imageutil')
    ,stringUtil = require('../util/stringutil')
    ,geocoder = require('geocoder');

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
var LIST_FETCH_SIZE = 100;
var LIST_FETCH_SIZE_MAX = 100;

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
 * This function will save the images on the listing to the desired
 * destiniation based on the environment variables.
 * @param listing
 * @returns {{}}
 */
function saveListingImages(listing) {
    var retVal = {};
    // next upload to s3 if there are images
    if(listing.images != undefined) {
        var failedUpload = false;
        var imageURLs = [];
        // iterate over the base64 image strings and upload to [Local disk | s3]
        for(var x=0; x<listing.images.length;x++) {
            // generate the file name for the image (listing-userId-randomString.[jpg|png|gif])
            var fileName = 'listing-' + listing['user_id'];
            fileName += '-' + stringUtil.getRandomString(5 , 10, true, false, true);

            // TODO: use image util to determine type of image, then send the content type as a param to saveToS3
            fileName += '.jpg';

            // build the configuration for saving the image
            var options = {
                s3Bucket: config.image.S3.bucket,
                destinationPath : config.root + config.image.path,
                base64Image : listing.images[x],
                fileName : fileName,
                saveTos3 : config.image.S3.active,
                saveThumb : true,
                saveMedium : true,
                thumbDestinationPath: config.root + config.image.pathThumb,
                mediumDestinationPath : config.root + config.image.pathMedium
            };

            // save the images for the listing
            var result = imageUtil.saveImage(options);

            // if there were errors when attempting to save the image, remove any saved images for this listing, and return the error code
            if(result.error != undefined) {
                failedUpload = true;
                for(var y=0; y<imageURLs.length; y++)  {
                    var tokens = imageURLs[y].split('/');
                    imageUtil.deleteImage(tokens[tokens.length-1]);
                }
                break;
            } else {
                imageURLs.push(config.image.url + fileName);
            }
        }
        if(failedUpload) {
            retVal.response = result.error;
        } else {
            // remove the images from the listing array
            delete listing.images;
            // add the image urls
            listing.image_urls = imageURLs;
            // set the response as a success
            retVal.response = response.SUCCESS.code;
        }
    } else {
        retVal.response = response.SUCCESS.code;
    }
    retVal.listing = listing;
    return retVal;
}

/**
 * This function will use the geocoder to
 * reverse geocode the listing to retrieve the
 * listings latitude and longitude.
 * @param listing
 * @returns {*}
 */
function retrieveListingLatLng(listing) {
    if(listing.location != undefined) {
        var address = listing.location.street;
        address = address.concat(" ");
        address = address.concat(listing.location.city);
        address = address.concat(", ");
        address = address.concat(listing.location.state);
        address = address.concat(" ");
        address = address.concat(listing.location.zip);
        geocoder.geocode(address, function ( err, data ) {
            if(err) {
                console.log("{Listing#retrieveListingLatLng} Error attemping to find geocode: " + err);
            } else if(data.status == 'OK') {
                listing.location.latitude = data.results[0].geometry.location.lat;
                listing.location.longitude = data.results[0].geometry.location.lng;
            }
        });
    }
    return listing;
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

        // if location is present, attempt to determine lat long with reverse geo location
        listing = retrieveListingLatLng(listing);

        // if there are images present, attempt to save them
        var result = saveListingImages(listing);
        listing = result.listing;

        if(result.response == response.IMAGE.LOCAL_DISK.UPLOAD_ERROR.code ||
            result.response == response.IMAGE.S3.UPLOAD_ERROR.code) {
            console.log("{Listing#createListing} Error : " + result.message);
            if(!res) {
                req.io.respond( {error : "There was a problem creating your listing.  Please try again later or contact help@theulink.com." } , response.SYSTEM_ERROR.code);
            } else {
                res.send({error : "There was a problem creating your listing.  Please try again later or contact help@theulink.com." }, response.SYSTEM_ERROR.code);
            }
        } else { // since it was a successful upload, we can then save to the db
            db.listings.save(listing, function(err, result) {
                 if ( err ) { console.log("{Listing#createListing} Error : " + err);
                    // TODO: remove any uploaded images if necessary
                    if(!res) {
                        req.io.respond( { error : response.SYSTEM_ERROR.response } , response.SYSTEM_ERROR.code);
                    } else {
                        res.send({ error : response.SYSTEM_ERROR.response }, response.SYSTEM_ERROR.code);
                    }
                } else if(!result ) {
                     // TODO: remove any uploaded images if necessary
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
        }
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

/**
 * This function will find the tags that have been used the most
 * listings.  The amount that the server will retrieve is 
 * based on the params
 * passed in id
 * @param req
 * @param res
 */
exports.findTopTags= function(req, res) {
   var reqJSON = req.body;
   var limit = (reqJSON.limit != undefined && parseInt(reqJSON.limit) > 0) ? parseInt(reqJSON.limit) : 3;
   var schoolId = reqJSON.sid;
   if(schoolId != undefined && parseInt(schoolId) > 0) {
        db.listings.aggregate(
          [
            { $group : { _id : {tags:"$tags"} , count : { $sum : 1 } } },
            { $sort : { "count" : -1 } },
            { $limit : limit }
          ], function(err, category) {
            if ( err ) {
                console.log("{Categories.findTopTags} Error: " + err);
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