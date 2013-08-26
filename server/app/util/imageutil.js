/*********************************************************************************
 * Copyright (C) 2013 uLink. All Rights Reserved.
 *
 * Created On: 7/17/13
 * Description: This will be the utility class that will handle all image related
 * functionality
 *
 *
 * public functions are saveImage and deleteImage
 *
 * saveImage:
 *  options {
 *      "destinationPath" : "", [required]
 *      "base64Image" : "", [required]
 *      "fileName" : "" [required]
 *      "s3Bucket" : "",
 *      "saveTos3" : "false",
 *      "saveThumb" : "false",
 *      "thumbDestinationPath": "",
 *      "mediumDestinationPath" : "",
 *      "saveMedium" : "false",
 *      "thumbWidth" : 80,
 *      "mediumWidth" : 500
 *  }
 *
 *  TODO: figure out async response
 ********************************************************************************/
var env = process.env.NODE_ENV || 'development'
    ,config = require('../../config/config')[env]
    ,AWS = require('aws-sdk')
    ,fs = require('fs')
    ,im = require('imagemagick');

// set the credentials for Amazon s3
AWS.config.update({accessKeyId: config.image.S3.key, secretAccessKey: config.image.S3.secret});
// Set your region for future requests.
AWS.config.update({region: config.image.S3.region});
var s3 = new AWS.S3({maxRetries: 2});

var save = {
    original: function (options) {
        // convert the base64 string to binary data
        var base64ImageBin = new Buffer(options.base64Image, 'base64');

        // if we are saving to s3
        if(options.saveTos3) {
            // create the data object for uploading to s3
            var data = {
                Bucket: options.s3Bucket,
                Key: options.destinationPath + options.fileName,
                Body: base64ImageBin,
                ACL: "public-read",
                ContentType: "image/jpeg"
            };

            s3.putObject(data, function(err, uploadData) {
                if (err) {
                    console.log("{imageutil#save.original} Error saving original image with name "+ options.fileName +": " + err);
                }
            });
        } else {
            fs.writeFile(options.destinationPath + options.fileName, base64ImageBin,'base64', function(err) {
                if (err) {
                    console.log("{imageutil#save.original} Error saving original to disk : " + err);
                }
            });
        }
    },
    thumb: function(options) {
        // resize the image and then upload to s3
        im.resize({
            srcData: new Buffer(options.base64Image, 'base64'),
            width:   options.thumbWidth || 80,
            quality: 1
        }, function(err, stdout, stderr){
            if (err) {
                console.log("{imageutil#save.thumb} Error resizing thumb: " + err);
            } else {
                // create the data object for uploading to s3
                var data = {
                    Bucket: options.s3Bucket,
                    Body : new Buffer(stdout, 'binary'),
                    Key: options.thumbDestinationPath + options.fileName,
                    ACL: "public-read",
                    ContentType: "image/jpeg"
                };
                // if we are saving to s3
                if(options.saveTos3) {
                    s3.putObject(data, function(err, uploadData) {
                        if(err) {
                            console.log("{imageutil#save.thumb} Error saving thumb to s3: " + err);
                        }
                    });
                } else {// else save to disk
                    fs.writeFile(data.Key, data.Body, 'binary', function(err) {
                        if (err) {
                            console.log("{imageutil#save.thumb} Error saving thumb to disk : " + err);
                        }
                    });
                }
            }
        });
    },
    medium: function(options){
        // resize the image and then upload to s3
        im.resize({
            srcData: new Buffer(options.base64Image, 'base64'),
            width:   options.mediumWidth || 500,
            quality: 1
        }, function(err, stdout, stderr){
            if (err) {
                console.log("{imageutil#save.medium} Error resizing medium: " + err);
            } else {
                // create the data object for uploading to s3
                var data = {
                    Bucket: options.s3Bucket,
                    Body : new Buffer(stdout, 'binary'),
                    Key: options.mediumDestinationPath + options.fileName,
                    ACL: "public-read",
                    ContentType: "image/jpeg"
                };
                // if we are saving to s3
                if(options.saveTos3) {
                    s3.putObject(data, function(err, uploadData) {
                        if(err) {
                            console.log("{imageutil#save.medium} Error saving medium to s3: " + err);
                        }
                    });
                } else { // else save to disk
                    fs.writeFile(data.Key, data.Body, 'binary', function(err) {
                        if (err) {
                            console.log("{imageutil#save.medium} Error saving medium to disk : " + err);
                        }
                    });
                }
            }
        });
    }
}

exports.saveImage = function (options) {
    var retVal = {};
    retVal.errors = [];
    // validate the options for saving
    if(options == undefined) {
        retVal.push('options are required');
    } else {
        if(options.base64Image == undefined) {
            retVal.push('a base64 image is required');
        }
        if(options.fileName == undefined) {
            retVal.push('fileName is required');
        }
    }
    // save the original size image
    save.original(options);
    // save the medium image if necessary
    if(options.saveMedium) {
        save.medium(options);
    }
    // save the thumb image if necessary
    if(options.saveThumb) {
        save.thumb(options);
    }
    return retVal;
}

exports.deleteImage = function (options) {
    var retVal;
    // if there are no s3 configurations, save to disk
    if(options.saveTos3 == true) {
        retVal = this.deleteFromS3(options);
    } else {
        retVal = this.deleteFromDisk(options);
    }
    return retVal;
}

exports.deleteFromS3 = function (options) {
    var retVal = true;
    var data = {
        Bucket: options.s3Bucket,
        Key: options.destinationPath + options.fileName
    };
    //  delete thumb and medium and original sized images from s3
    s3.deleteObject(data, function(err, data) {
        if (err) {
            console.log("{imageutil#deleteFromS3} Error : " + err);
            retVal = false;
        } 
    });
    data.Key = options.mediumDestinationPath + options.fileName;
    s3.deleteObject(data, function(err, data) {
        if (err) {
            console.log("{imageutil#deleteFromS3} Error : " + err);
            retVal = false;
        } 
    });
    data.Key = options.thumbDestinationPath + options.fileName;
    s3.deleteObject(data, function(err, data) {
        if (err) {
            console.log("{imageutil#deleteFromS3} Error : " + err);
            retVal = false;
        } 
    });
    return retVal;
}

exports.deleteFromDisk = function (options) {
    var retVal = true;
    //  delete thumb and medium and original sized images
    fs.unlink(options.destinationPath + options.fileName, function (err) {
        if (err) {
            console.log("{imageutil#removeFromDisk:original} Error : " + err);
            retVal = false;
        } 
    });
    fs.unlink(options.mediumDestinationPath + options.fileName, function (err) {
        if (err) {
            console.log("{imageutil#removeFromDisk:medium} Error : " + err);
            retVal = false;
        } 
    });
    fs.unlink(options.thumbDestinationPath + options.fileName, function (err) {
        if (err) {
            console.log("{imageutil#removeFromDisk:thumb} Error : " + err);
            retVal = false;
        } 
    });
    return retVal;
}