const utility = require("../core/Utility")
const config = require('../config/config');

const code = "UserTypeCapability";
const requiredParams = [
    "name"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllUserTypeCapabilities();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getUserTypeCapability(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createUserTypeCapability(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const userTypeId = event.pathParameters.userTypeId;
    const capabilityId = event.pathParameters.capabilityId;
    var result = await deleteUserTypeCapability(userTypeId, capabilityId);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function userTypeCapabilityExists(name)
{
    var sql = "SELECT * FROM user_type_capabilities WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllUserTypeCapabilities()
{
    var sql = "SELECT * FROM user_type_capabilities";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all user_type_capabilities." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getUserTypeCapability(id)
{
    var sql = "SELECT * FROM user_type_capabilities WHERE user_type_capability_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved User Type Capability." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createUserTypeCapability(user_type_capability)
{
    var hasParams = utility.validateParams(user_type_capability, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await userTypeCapabilityExists(user_type_capability.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "UserTypeCapability already exists.")
    }
    var sql = "INSERT INTO user_type_capabilities (name) VALUES ($1) RETURNING *";
    var params = [
        user_type_capability.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created User Type Capability." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function deleteUserTypeCapability(id)
{
    var sql = "DELETE FROM user_type_capabilities WHERE user_type_capability_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted User Type Capability." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}