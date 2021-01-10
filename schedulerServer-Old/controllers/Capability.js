const utility = require("../core/Utility");
const config = require('../config/config');

const code = "Capability";
const requiredParams = [
    "name"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllCapabilities();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getCapability(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createCapability(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateCapability(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteCapability(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function capabilityExists(name)
{
    var sql = "SELECT * FROM capabilities WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllCapabilities()
{
    var sql = "SELECT * FROM capabilities";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all capabilities." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getCapability(id)
{
    var sql = "SELECT * FROM capabilities WHERE capability_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved capability." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createCapability(capability)
{
    var hasParams = utility.validateParams(capability, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await capabilityExists(capability.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Capability already exists.")
    }
    var sql = "INSERT INTO capabilities (name) VALUES ($1) RETURNING *";
    var params = [
        capability.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created capability." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function updateCapability(id, capability)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await capabilityExists(capability.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Capability already exists.")
    }
    var sql = "UPDATE capabilities SET name = $2 WHERE capability_id = $1 RETURNING *";
    var params = [
        id,
        capability.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated capability." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function deleteCapability(id)
{
    var sql = "DELETE FROM capabilities WHERE capability_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted capability." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}