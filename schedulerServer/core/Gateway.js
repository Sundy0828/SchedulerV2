const pool = require("../db_connect")
const config = require('../config/config');
const utility = require("./Utility")
const auth = require("./Authentication")

// get all
module.exports.verifyAccess = async (event, context, callback) => {
    var token = event.access_token;
    console.log(event)
}