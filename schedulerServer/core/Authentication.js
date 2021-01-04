var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
const config = require('../config/config');
const utility = require("./Utility");
const user = require("../controllers/User");

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
    try {
        var decoded = jwt.verify(token, config.JWT_TOKEN);
        // session timed out
        if (decoded.iat > decoded.exp)
        {
            return utility.standardReturn(false, "Session has timed out.");
        }

        // check if user exists
        var userInfo = user.getUserByKey(decoded.userKey)
        if (!userInfo.success || userInfo.rowCount < 1)
        {
            return utility.standardReturn(false, "Failed to authenticate token.");
        }

        return utility.standardReturn(true, "Successfully verified authentication token.", {"userKey": decoded.userKey});
      } catch(err) {
        return utility.standardReturn(false, "Failed to authenticate token.");
      }
}

module.exports = {signJWTToken, verifyJWTToken}