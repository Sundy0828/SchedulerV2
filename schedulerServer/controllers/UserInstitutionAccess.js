const utility = require("../core/Utility")
const config = require('../config/config');

const code = "UserInstitutionAccess";
const requiredParams = [
    "user_id",
    "institution_id"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllUserInstitutionAccess();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getUserInstitutionAccess(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createUserInstitutionAccess(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteUserInstitutionAccess(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function userInstitutionAccessExists(user_id, institution_id)
{
    var sql = "SELECT * FROM user_institution_access WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllUserInstitutionAccess()
{
    var sql = "SELECT * FROM user_institution_access";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all user_institution_access." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getUserInstitutionAccess(user_id, institution_id)
{
    var sql = "SELECT * FROM user_institution_access WHERE user_id = $1 AND institution_id = $2";
    var params = [user_id, institution_id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved user institution access." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createUserInstitutionAccess(user_institution_access)
{
    var hasParams = utility.validateParams(user_institution_access, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await userInstitutionAccessExists(user_institution_access.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "UserInstitutionAccess already exists.")
    }
    var sql = "INSERT INTO user_institution_access (name) VALUES ($1) RETURNING *";
    var params = [
        user_institution_access.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created user_institution_access." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function deleteUserInstitutionAccess(user_id, institution_id)
{
    var sql = "DELETE FROM user_institution_access WHERE user_id = $1 AND institution_id = $2";
    var params = [user_id, institution_id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted user institution access." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}