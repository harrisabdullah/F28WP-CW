const { testSchema, _ } = require('./schema');

const getterSchema = {
    'userID': val => Number.isInteger(val)
}

/**
 * Generates a SQL query and its parameters for retrieving rows from a specified table
 * where a given field matches the provided user ID.
 *
 * @param {Object} body - JavaScript object containing the user ID.
 *   Example fields:
 *     - userID: number (ID to filter the table by)
 * @param {string} table - Name of the database table to query.
 * @param {string} field - Name of the column to match against the user ID.
 *
 * @returns {Array|number} Returns an array of the form:
 *   [sqlQueryString, parametersArray]
 *   - sqlQueryString: string containing SQL with placeholders
 *   - parametersArray: array of values to substitute in the query
 * Returns -1 if the input validation fails.
 */
function buildGetterQuery(body, table, field){
    if (!testSchema(getterSchema, body, true)){
        return -1;
    }
    const sql = `SELECT * FROM ${table} WHERE ${field} = ?`
    return [sql, [body.userID]]
}

module.exports = buildGetterQuery
