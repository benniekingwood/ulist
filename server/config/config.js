/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/20/13
 * Description: This file will contain all of the environment specific variables
 ********************************************************************************/
var pa = require('path');
module.exports = {
    development: {
        root: pa.normalize(__dirname + '/..'),
        app: {
            name: 'uList'
        },
        db_url: 'mongodb://ulink:ulink@linus.mongohq.com:10098/ulist-dev',
        image: {
            S3: {
                active: false,
                key: 'AKIAIWNS6CENCJVPALBA',
                secret: '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',
                bucket: 'ulink_images',
                region: 'us-east-1'
            },
            path: '/public/img/listings/',
            pathThumb: '/public/img/listings/thumb/',
            pathMedium: '/public/img/listings/medium/',
            url: 'http://localhost:3737/img/listings/'
        }
    }
    , production: {
        root: pa.normalize(__dirname + '/..'),
        app: {
            name: 'uList'
        },
        db_url: 'mongodb://ulink:ulink@linus.mongohq.com:10098/ulist-dev',
        image: {
            S3: {
                active: true,
                key: 'AKIAIWNS6CENCJVPALBA',
                secret: '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',
                bucket: 'ulink_images',
                region: 'us-east-1'
            },
            path: 'img/listings/',
            pathThumb: 'img/listings/thumb/',
            pathMedium: 'img/listings/medium/',
            url: 'https://s3.amazonaws.com/ulink_images/img/listings/'
        }
    }
}