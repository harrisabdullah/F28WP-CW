const { testSchema, _ } = require('./schema');

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
function buildGetterQuery(value, table, field){
    const sql = `SELECT * FROM ${table} WHERE ${field} = ?`
    return [sql, [value]]
}

module.exports = buildGetterQuery
