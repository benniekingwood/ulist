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
 POST_VALIDATION_ERROR : { 'code' : 699, 'errors' : {} },
 POST_SAVE_ERROR : { 'code' : 700,
    'message' : '"There was a problem saving your post.  Please try again later or contact help@theulink.com"'},
 POST_UPDATE_ERROR : { 'code' : 701,
    'message' : '"There was a problem updating your post.  Please try again later or contact help@theulink.com"'},
 POST_DELETE_ERROR : { 'code' : 702,
    'message' : '"There was a problem deleting your post.  Please try again later or contact help@theulink.com"'}
}