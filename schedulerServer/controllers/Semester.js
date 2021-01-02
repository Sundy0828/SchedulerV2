const utility = require("../core/Utility")
const config = require('../config/config');

const code = "Semester";
const requiredParams = [
    "name",
    "institution_id"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllSemesters();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await getSemester(id)

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createSemester(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateSemester(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteSemester(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function semesterExists(name)
{
    var sql = "SELECT * FROM semesters WHERE name = $1";
    var params = [name];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function getAllSemesters(institutionId)
{
    var sql = "SELECT * FROM semesters WHERE institution_id = $1";
    var params = [institutionId];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all semesters." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getSemester(id)
{
    var sql = "SELECT * FROM semesters WHERE semester_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved semester." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function createSemester(semester)
{
    var hasParams = utility.validateParams(semester, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await semesterExists(semester.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Semester already exists.")
    }
    var sql = "INSERT INTO semesters (name, institution_id) VALUES ($1, $2) RETURNING *";
    var params = [
        semester.name,
        semester.institutionId
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created semester." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function updateSemester(id, semester)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await semesterExists(semester.name);
    if (exists.success)
    {
        return utility.standardReturn(false, "Semester already exists.")
    }
    var sql = "UPDATE semesters SET name = $2 WHERE semester_id = $1 RETURNING *";
    var params = [
        id,
        semester.name
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated semester." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function deleteSemester(id)
{
    var sql = "DELETE FROM semesters WHERE semester_id = $1";
    var params = [id];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted semester." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}