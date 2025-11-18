const { testSchema, roomConfigSchema } = require('./schema');
const daysBetween = require('./daysBetween');

/**
 * Checks if a string represents a valid date in the future.
 *
 * @param {string} str - A date string in the format "YYYY-MM-DD".
 * @returns {boolean} True if `str` is a valid date strictly in the future, false otherwise.
 */
function isValidDateInFuture(str) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    const [year, month, day] = str.split('-').map(Number);
    const date = new Date(str);
    const now = new Date();
    return date.getFullYear() === year &&
           date.getMonth() + 1 === month &&
           date.getDate() === day &&
           date > now;
}

const querySchema = {
    'name': val => typeof val === 'string',
    'minPrice': val => typeof val === 'number' && val >= 0.0,
    'maxPrice': val => typeof val === 'number' && val >= 0.0,
    'city': val => typeof val === 'string',
    'startDate': val => typeof val === 'string' && isValidDateInFuture(val),
    'endDate': val => typeof val === 'string' && isValidDateInFuture(val),
    'roomConfig': val => typeof val === 'object'
}

/**
 * Validates a hotel search query object.
 *
 * @param {Object} queryObj - JavaScript object containing search criteria.
 * @returns {boolean} Returns true if the query object is valid, false if it is invalid.
 */
function isValidQuery(q) {
    if (!testSchema(querySchema, q, false)){
        return false;
    }
    if (('maxPrice' in q || 'minPrice' in q) && !('roomConfig' in q)){
        return false;
    }
    const startDate = new Date(q.startDate);
    const endDate = new Date(q.endDate);
    if (startDate >= endDate){
        return false;
    }
    return q.roomConfig? 
           testSchema(roomConfigSchema, q.roomConfig, true) :
           true;
}

/**
 * Generates a SQL query and its parameters for searching hotels.
 *
 * @param {Object} queryObj - JavaScript object containing search criteria.
 *   Example fields:
 *     - name: string (hotel name)
 *     - minPrice: number
 *     - maxPrice: number
 *     - startDate: string (YYYY-MM-DD)
 *     - endDate: string (YYYY-MM-DD)
 *     - roomConfig: {
 *                      single: number,
 *                      double: number,
 *                      twin: number,
 *                      penthouse: number
 * }
 *
 * @returns {Array|number} Returns an array of the form:
 *   [sqlQueryString, parametersArray]
 *   - sqlQueryString: string containing SQL with placeholders
 *   - parametersArray: array of values to substitute in the query
 * Returns -1 if query generation fails.
 */
function buildHotelSearchQuery(query) {
    if (typeof query != 'object'){
        return -1;
    }
    if (!isValidQuery(query)){
        return -1;
    }
    
    const conditions = [];
    const params = [];
    if (query.name){
        conditions.push('name = ?');
        params.push(query.name);
    }
    if (query.minPrice || query.maxPrice){
        let daysCount = daysBetween(query.startDate, query.endDate);
        const price = "((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?)"
        const price_conds = [query.roomConfig.single, query.roomConfig.twin, query.roomConfig.double, 
                             query.roomConfig.penthouse, daysCount]
        if (query.minPrice){
            conditions.push(price + " > ?");
            params.push(...price_conds);
            params.push(query.minPrice);
        }
        if (query.maxPrice){
            conditions.push(price + " < ?");
            params.push(...price_conds);
            params.push(query.maxPrice);
        }
        if (query.location){
            conditions.push("city = ?");
            params.push(query.city);
        }
    }
    let sql = "SELECT * FROM hotels";
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    return [sql, params];
}

module.exports =  buildHotelSearchQuery;
