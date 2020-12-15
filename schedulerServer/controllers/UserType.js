const utility = require("../core/Utility")
const config = require('../config/config');

const code = "UserType";
const requiredParams = [
    "name"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllUserTypes();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getUserType(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createUserType(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateUserType(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteUserType(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function userTypeExists(name)
{
    var sql = "SELECT * FROM user_types WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllUserTypes()
{
    var sql = "SELECT * FROM user_types";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all User Types." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data)
}

async function getUserType(id)
{
    var sql = "SELECT * FROM user_types WHERE user_type_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved User Type." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data, true)
}

async function createUserType(userType)
{
    var hasParams = utility.validateParams(userType, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await userTypeExists(userType.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "UserType already exists.")
    }
    var sql = "INSERT INTO user_types (name) VALUES ($1) RETURNING *";
    var params = [
        userType.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created User Type." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data, true)
}

async function updateUserType(id, userType)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await userTypeExists(userType.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "UserType already exists.")
    }
    var sql = "UPDATE user_types SET name = $2 WHERE user_type_id = $1 RETURNING *";
    var params = [
        id,
        userType.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated User Type." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function deleteUserType(id)
{
    var sql = "DELETE FROM user_types WHERE user_type_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted User Type." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}