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
    SYSTEM_ERROR : {'code':500, 'response' : 'A problem occurred.  Please try again later.'},
    VALIDATION_ERROR : { 'code' : 422, 'errors' : {} }
}