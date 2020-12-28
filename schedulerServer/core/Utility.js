const pool = require("../db_connect")
const config = require('../config/config');
const bcrypt = require('bcrypt');

function pgQueryParams(sql, params = [], code = "")
{
    try {
        const results = pool.query(sql, params);
        return results;
    } catch (error) {
        return code;
    }
}

function standardReturn(success, msg = "", data = [], selectOne = false)
{
    var singleReturn = new Object();
    singleReturn.success = success;

    if (msg)
    {
        singleReturn.msg = msg;
    }

    if (data)
    {
        singleReturn.count = data.rowCount;
        singleReturn.data = selectOne ? data.rows[0] : data.rows;
    }

    return singleReturn;
}

function hashPassword(password)
{
    const salt = bcrypt.genSaltSync(config.BCRYPT_SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);

    return {"salt": salt, "hash": hash};
}

function validateParams(values, required)
{
    required.forEach(value => {
        if (!values[value])
        {
            return standardReturn(false, "Missing required param: " + value);
        }
    });

    return standardReturn(true);
}

function aesEncrypt(encrypt, input)
{
    if (encrypt)
    {
        return CryptoJS.AES.encrypt(JSON.stringify(input), config.SECRET_KEY_HASH).toString();
    }
    else
    {
        var bytes  = CryptoJS.AES.decrypt(input, config.SECRET_KEY_HASH);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}

module.exports = {pgQueryParams, standardReturn, hashPassword, validateParams}