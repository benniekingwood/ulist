/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 7/18/13
 * Description: This will serve as a number utility
 ********************************************************************************/
/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
