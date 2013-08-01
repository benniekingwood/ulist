/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 7/18/13
 * Description: String utility class
 ********************************************************************************/
var numberUtil = require('./numberutil');
/**
 * This function will generate a random String based on the passed in parameters
 * @param int $minLength
 * @param int $maxLength
 * @param bool $useUpper
 * @param bool $useSpecial
 * @param bool $useNumbers
 * @return string
 */
exports.getRandomString = function getRandomString(minLength , maxLength, useUpper, useSpecial, useNumbers) {
    var charset = "abcdefghijklmnopqrstuvwxyz";
    var key = '';

    if (useUpper) {
        charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (useNumbers) {
        charset += "0123456789";
    }
    if (useSpecial) {
        charset += "~@#$%^*()_+-={}|][";
    }
    if (minLength > maxLength) {
        length = numberUtil.getRandomInt(maxLength, minLength);
    } else {
        length = numberUtil.getRandomInt(minLength, maxLength);
    }

    /*
     *  iterate over the desired length of the string
     *  appending a random char from the charset.
     */
    for (var i = 0; i < length; i++) {
        key += charset[(numberUtil.getRandomInt(0, (charset.length - 1)))];
    }
    return key;
}