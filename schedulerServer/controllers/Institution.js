const utility = require("../core/Utility")
const config = require('../config/config');

const code = "Institution";
const requiredParams = [
    "name"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllInstitutions();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getInstitution(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createInstitution(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateInstitution(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteInstitution(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function institutionExists(name)
{
    var sql = "SELECT * FROM institutions WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllInstitutions()
{
    var sql = "SELECT * FROM institutions";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all institutions." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getInstitutionByPublicKey(publicKey)
{
    var sql = "SELECT * FROM institutions WHERE public_key = $1";
    var params = [publicKey];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved institution." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function getInstitution(id)
{
    var sql = "SELECT * FROM institutions WHERE institution_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved institution." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createInstitution(institution)
{
    var hasParams = utility.validateParams(institution, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await institutionExists(institution.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Institution already exists.")
    }
    var sql = "INSERT INTO institutions (name) VALUES ($1) RETURNING *";
    var params = [
        institution.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created institution." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function updateInstitution(id, institution)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await institutionExists(institution.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Institution already exists.")
    }
    var sql = "UPDATE institutions SET name = $2 WHERE institution_id = $1 RETURNING *";
    var params = [
        id,
        institution.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated institution." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function deleteInstitution(id)
{
    var sql = "DELETE FROM institutions WHERE institution_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted institution." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}