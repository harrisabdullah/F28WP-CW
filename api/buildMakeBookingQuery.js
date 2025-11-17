const { testSchema, roomConfigSchema } = require('./schema');

/**
 * Checks if a given string represents a valid date in the future.
 *
 * The string must be in the format "YYYY-MM-DD". Returns false if the string
 * is not in the correct format, cannot be parsed as a valid date, or represents
 * a date that is today or in the past.
 *
 * @param {string} str - The date string to validate.
 * @returns {boolean} True if the string is a valid future date, false otherwise.
 */
function isValidDateInFuture(str) {
    if (typeof str != 'string'){
        return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    const [year, month, day] = str.split('-').map(Number);
    const date = new Date(str);
    const now = new Date();
    return date.getFullYear() === year &&
           date.getMonth() + 1 === month &&
           date.getDate() === day &&
           date > now;
}

const makeBookingSchema = {
    'userID': val => Number.isInteger(val),
    'hotelID': val => Number.isInteger(val),
    'startDate': val => isValidDateInFuture(val),
    'endDate': val => isValidDateInFuture(val),
    'roomConfig': val => testSchema(roomConfigSchema, val, true)
}

/**
 * Generates a SQL query and its parameters for creating a new booking.
 *
 * @param {Object} body - JavaScript object containing booking data.
 *   Example fields:
 *     - userID: number
 *     - hotelID: number
 *     - startDate: string (YYYY-MM-DD)
 *     - endDate: string (YYYY-MM-DD)
 *     - roomConfig: {
 *                      single: number,
 *                      double: number,
 *                      twin: number,
 *                      penthouse: number
 *                    }
 *
 * @returns {Array|number} Returns an array of the form:
 *   [sqlQueryString, parametersArray]
 *   - sqlQueryString: string containing SQL with placeholders
 *   - parametersArray: array of values to substitute in the query
 * Returns -1 if input validation fails or startDate is not before endDate.
 */
function buildMakeBookingQuery(body){
    if (!testSchema(makeBookingSchema, body, true)){
        return -1;
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (startDate >= endDate){
        return -1;
    }

    const sql = 'INSERT INTO Bookings (user, hotel, startDate, endDate, singleCount, doubleCount, twinCount, penthouseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const args = [body.userID, 
                  body.hotelID, 
                  body.startDate, 
                  body.endDate, 
                  body.roomConfig.single, 
                  body.roomConfig.double, 
                  body.roomConfig.twin, 
                  body.roomConfig.penthouse]

    return [sql, args];
}

module.exports =  buildMakeBookingQuery;
