const pool = require("../db_connect")
const config = require('../config/config');
const utility = require("./Utility")
const auth = require("./Authentication")

// verify token
module.exports.verifyAccess = async (event, context, callback) => {
    console.log(event)
    context.succeed(generatePolicy('user', 'Allow', event.methodArn));
    callback(null, generatePolicy('user', 'Allow', event.methodArn));
//     var token = event.authorizationToken;
//     if (token.startsWith("Bearer ")){
//         token = token.substring(7, token.length);
//    } else {
//         // error
//    }
//     var loginInfo = await auth.verifyJWTToken(token)
//     console.log(loginInfo)
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