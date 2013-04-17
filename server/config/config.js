/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/20/13
 * Description: This file will contain all of the environment specific variables
 ********************************************************************************/
module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'uList'
        },
        db_url: 'mongodb://ulink:ulink@linus.mongohq.com:10098/ulist-dev',
        paypal: {
            clientID: "APP_ID"
            , clientSecret: "APP_SECRET"
            , callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        image: {
            S3: {
                key: 'API_KEY',
                secret: 'SECRET',
                bucket: 'BUCKET_NAME'
            }
        }
    }
    , test: {
        app: {
            name: 'uList'
        },
        db_url: 'mongodb://ulink:ulink@linus.mongohq.com:10098/ulist-dev'
    }
    , production: {
        app: {
            name: 'uList'
        },
        db_url: 'mongodb://ulink:ulink@linus.mongohq.com:10098/ulist-dev'
    }
}
