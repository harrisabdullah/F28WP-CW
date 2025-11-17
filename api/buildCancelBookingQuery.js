const { testSchema, _ } = require('./schema');

const cancelBookingSchema = {
    'bookingID': val => Number.isInteger(val),
    'userID': val => Number.isInteger(val)
}

/**
 * Generates a SQL query and its parameters for canceling a booking.
 *
 * @param {Object} body - JavaScript object containing the booking information.
 *   fields:
 *     - bookingID: number (ID of the booking to cancel)
 *     - userID: number (ID of the user whoes booking to cancel)
 *
 * @returns {Array|number} Returns an array of the form:
 *   [sqlQueryString, parametersArray]
 *   - sqlQueryString: string containing SQL with placeholders
 *   - parametersArray: array of values to substitute in the query
 * Returns -1 if the provided body fails schema validation.
 */

function buildCancelBookingQuery(body){
    if (!testSchema(cancelBookingSchema, body, true)){
        return -1;
    }
    let sql = 'DELETE FROM Bookings WHERE bookingID = ?'
    return [sql, [body.bookingID]]
}

module.exports = buildCancelBookingQuery