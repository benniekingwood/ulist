/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 3/18/13
 * Description: This file will contain all of the response codes and
 *              messages that will be returned to the client
 ********************************************************************************/
/* STATUS CODES AND ERROR MESSAGES */
module.exports = {
    SUCCESS : {'code':200, 'response' : ''},
    NOT_FOUND : {'code':404, 'response' : 'Opps, that endpoint was not found in our API.'},
    BAD_REQUEST : {'code':400, 'response' : 'Bad request.'},
    UNAUTHORIZED : {'code':401, 'response' : 'You are not authorized.'},
    SYSTEM_ERROR : {'code':500, 'response' : 'There was an issue with your request.  Please try again later.'},
    IMAGE: {
        S3: {
            UPLOAD_ERROR: {'code': 501, 'response' : 'There was an issue saving the image to S3.'},
            DELETE_ERROR: {'code': 502, 'response' : 'There was an issue deleting the image from S3.'}
        },
        LOCAL_DISK: {
            UPLOAD_ERROR: {'code': 503, 'response' : 'There was an issue saving the image to disk.'},
            DELETE_ERROR: {'code': 504, 'response' : 'There was an issue deleting the image from disk.'}
        }
    },
    VALIDATION_ERROR : { 'code' : 422, 'errors' : {} }
}