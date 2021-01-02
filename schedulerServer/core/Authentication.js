var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
const config = require('../config/config');
const utility = require("./Utility");

function signJWTToken(userKey)
{
    var token = jwt.sign({ userKey: userKey }, config.JWT_TOKEN, {
        expiresIn: 86400 // expires in 24 hours
    });
    if (!token)
    {
        return utility.standardReturn(false, "Failed to create authentication token.");
    }
    return utility.standardReturn(true, "Successfully created authentication token.", {"token": token});
}

function verifyJWTToken(token)
{
    jwt.verify(token, config.JWT_TOKEN, function(err, decoded) {
        if (err)
        {
            return utility.standardReturn(false, "Failed to authenticate token.");
        }
        return utility.standardReturn(true, "Successfully verified authentication token.", [decoded]);
    });
}

module.exports = {signJWTToken, verifyJWTToken}