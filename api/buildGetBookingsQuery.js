const { testSchema, _ } = require('./schema');

const getBookingSchema = {
    'userID': val => Number.isInteger(val)
}

/**
 * Generates a SQL query and its parameters for retrieving bookings for a specific user.
 *
 * @param {Object} body - JavaScript object containing the user ID.
 *   Example fields:
 *     - userID: number (ID of the user whose bookings are being retrieved)
 *
 * @returns {Array|number} Returns an array of the form:
 *   [sqlQueryString, parametersArray]
 *   - sqlQueryString: string containing SQL with placeholders
 *   - parametersArray: array of values to substitute in the query
 * Returns -1 if the input validation fails.
 */
function buildGetBookingsApi(body){
    if (!testSchema(getBookingSchema, body, true)){
        return -1;
    }
    const sql = "SELECT * FROM Bookings WHERE user = ?"
    return [sql, [body.userID]]
}

module.exports = buildGetBookingsApi
