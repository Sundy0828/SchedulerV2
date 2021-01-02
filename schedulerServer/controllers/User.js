const utility = require("../core/Utility");
const auth = require("../core/Authentication");
const config = require('../config/config');

const code = "User";
const requiredParams = [
    "firstName",
    "lastName",
    "email",
    "password",
    "userTypeId"
];

// get all
module.exports.getAll = async (event, context, callback) => {
    var result = await getAllUsers();

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}
  
// get
module.exports.get = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteUserByKey(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// create
module.exports.create = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await createUser(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// update
module.exports.update = async (event, context, callback) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    var result = await updateUser(id, body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// delete
module.exports.delete = async (event, context, callback) => {
    const id = event.pathParameters.id;
    var result = await deleteUserByKey(id);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

// login
module.exports.login = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    var result = await loginUser(body);

    callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
    })
}

async function loginUser(login)
{
    var exists = await userExists(login.username);
    if (!exists.success)
    {
        return utility.standardReturn(false, "Invalid Email");
    }
    var user = await getUserByEmail(login.username);
    if (!user.success)
    {
        return utility.standardReturn(false, "Invalid Email");
    }
    user = user.data;
    if (user.login_attempts > 3)
    {
        return utility.standardReturn(false, "Account is locked, please contact administer for help.");
    }
    var hash = utility.hashPassword(login.password, user.salt);

    if (user.password != hash)
    {
        updateFailedAttempts(user.user_key, user.login_attempts + 1, user.login_attempts>3);
        return utility.standardReturn(false, "Invalid Password");
    }

    return await auth.signJWTToken(user.user_key);
}

async function updateFailedAttempts(userKey, loginAttempts, startTimeout = false)
{
    var sql = "UPDATE users SET login_attempts=$2 ";
    var params = [userKey, loginAttempts];
    if (startTimeout)
    {
        params.push(new Date().toISOString());
        sql += " timeout_start=$3 "
    }
    sql += " WHERE user_key = $1 RETURNING *";
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all users." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function updateUser(userKey, user)
{
    var savedUser = await getUserByKey(id);
    if (!savedUser.success) { utility.standardReturn(false, "User doesn't exist") }
    savedUser = savedUser.data;
    
    if (user.firstName)
    {
        savedUser.name.firstName = user.firstName;
    }
    if (user.lastName)
    {
        savedUser.name.lastName = user.lastName;
    }
    if (user.address)
    {
        savedUser.user_meta.address = user.address;
    }
    if (user.address2)
    {
        savedUser.user_meta.address2 = user.address2;
    }
    if (user.city)
    {
        savedUser.user_meta.city = user.city;
    }
    if (user.state)
    {
        savedUser.user_meta.state = user.state;
    }
    if (user.zip)
    {
        savedUser.user_meta.zip = user.zip;
    }
    if (user.phone)
    {
        savedUser.user_meta.phone = user.phone;
    }
    if (user.user_type_id)
    {
        savedUser.user_type_id = user.user_type_id;
    }
    var sql = "UPDATE users SET name=$2, user_meta=$4, user_type_id=$5 WHERE user_key = $1 RETURNING *";
    var params = [
        userKey,
        savedUser.name,
        savedUser.user_meta,
        savedUser.user_type_id
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully updated user." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}

async function createUser(user)
{
    var hasParams = utility.validateParams(user, requiredParams);
    if (!hasParams.success)
    {
        return hasParams
    }
    var exists = await userExists(user.email);
    if (exists.success)
    {
        return utility.standardReturn(false, "User already exists.")
    }
    var sql = "INSERT INTO users (name, email, password, salt, user_meta, login_attempts, user_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    var salt = utility.generateSalt();
    var hash = utility.hashPassword(user.password, salt);
    var params = [
        {"firstName": user.firstName, "lastName": user.lastName},
        user.email,
        hash,
        salt,
        {
            "address": user.address,
            "address2": user.address2,
            "city": user.city,
            "state": user.state,
            "zip": user.zip,
            "phone": user.phone
        },
        0,
        user.userTypeId
    ];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully created user." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function getAllUsers()
{
    var sql = "SELECT * FROM users";
    var params = [];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved all users." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount)
}

async function getUserByKey(userKey)
{
    var sql = "SELECT * FROM users WHERE user_key = $1";
    var params = [userKey];
    var res = await utility.pgQueryParams(sql, params, code);
    
    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved user." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function getUserByEmail(email)
{
    var sql = "SELECT * FROM users WHERE email = $1";
    var params = [email];
    var res = await utility.pgQueryParams(sql, params, code);
    
    var success = res == code ? false : true;
    var msg = success ? "Successfully retrieved user." : "Error: in " + code;
    var data = res != code ? res : null;

    return utility.standardReturn(success, msg, data.rows, data.rowCount, true)
}

async function userExists(email)
{
    var sql = "SELECT * FROM users WHERE email = $1";
    var params = [email];
    var res = await utility.pgQueryParams(sql, params, code);

    var exists = true;
    if (res != code && res.rowCount < 1)
    {
        exists = false;
    }

    return utility.standardReturn(exists)
}

async function deleteUserByKey(userKey)
{
    var sql = "DELETE FROM users WHERE user_key = $1";
    var params = [userKey];
    var res = await utility.pgQueryParams(sql, params, code);

    var success = res == code ? false : true;
    var msg = success ? "Successfully deleted user." : "Error: in " + code;

    return utility.standardReturn(success, msg)
}
