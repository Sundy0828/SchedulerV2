const utility = require("../core/Utility")
const config = require('../config/config');

const code = "Year";
const requiredParams = [
    "name",
    "institution_id"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllYears();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getYear(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createYear(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateYear(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteYear(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function yearExists(name)
{
    var sql = "SELECT * FROM years WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllYears(institutionId)
{
    var sql = "SELECT * FROM years WHERE institution_id = $1";
    var params = [institutionId];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all years." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getYear(id)
{
    var sql = "SELECT * FROM years WHERE year_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved year." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createYear(year)
{
    var hasParams = utility.validateParams(year, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await yearExists(year.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Year already exists.")
    }
    var sql = "INSERT INTO years (name, institution_id) VALUES ($1, $2) RETURNING *";
    var params = [
        year.name,
        year.institutionId
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created year." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function updateYear(id, year)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await yearExists(year.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Year already exists.")
    }
    var sql = "UPDATE years SET name = $2 WHERE year_id = $1 RETURNING *";
    var params = [
        id,
        year.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated year." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function deleteYear(id)
{
    var sql = "DELETE FROM years WHERE year_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted year." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}