const pool = require("../db_connect")
const config = require('../config/config');
const utility = require("./Utility")
const auth = require("./Authentication")

// verify token
module.exports.verifyAccess = async (event, context, callback) => {
    var token = event.authorizationToken;
    // check for bearer token
    if (token.startsWith("Bearer "))
    {
        token = token.substring(7, token.length);
    } 
    else 
    {
        // error
    }
    
    // verify token
    var loginInfo = auth.verifyJWTToken(token)
    if (!loginInfo.success)
    {
        // return 401 error
    }
    else
    {
        // return 200
    }
}

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2021-01-03';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
    }
    return authResponse
}