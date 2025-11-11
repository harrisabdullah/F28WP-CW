
/**
 * Checks if a value is a number greater than or equal to zero.
 *
 * @param {any} n - The value to check.
 * @returns {boolean} True if `n` is a number and >= 0, false otherwise.
 */
function isNumOverEqualZero(n){
    return typeof n === 'number' && n >= 0;
}

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

// Defines schemas as objects mapping property names to validation functions.
const roomConfigSchema = {
    'single': isNumOverEqualZero,
    'double': isNumOverEqualZero,
    'twin': isNumOverEqualZero,
    'penthouse': isNumOverEqualZero,
}

const querySchema = {
    'name':        val => typeof val === 'string',
    'minPrice':   val => typeof val === 'number' && val >= 0.0,
    'maxPrice':   val => typeof val === 'number' && val >= 0.0,
    'startDate':  val => typeof val === 'string' && isValidDateInFuture(val),
    'endDate':    val => typeof val === 'string' && isValidDateInFuture(val),
    'roomConfig': val => typeof val === 'object'
}

/**
 * Tests whether an object conforms to a given schema.
 *
 * @param {Object} schema - An object where keys correspond to expected properties
 *   in `obj` and values are functions that take a property value and return a boolean
 *   indicating whether the value is valid.
 * @param {Object} obj - The object to validate against the schema.
 * @param {boolean} strict - If true, all keys in `obj` must exist in `schema` and pass
 *   their corresponding validation functions. If false, only keys present in `schema`
 *   are validated; extra keys in `obj` are ignored.
 *
 * @returns {boolean} True if `obj` passes the schema validation according to `strict`,
 *   false otherwise.
 */
function testSchema(schema, obj, strict){
    if (strict){
        return Object.entries(obj).every(([key, value]) => 
                schema[key]? schema[key](value) : false);
    }
    return Object.entries(obj).every(([key, value]) => 
            schema[key]? schema[key](value) : true);
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
 * Calculates the number of days between two dates.
 *
 * @param {string} startDate - The start date in the format "YYYY-MM-DD".
 * @param {string} endDate - The end date in the format "YYYY-MM-DD".
 *
 * @returns {number} The number of days between startDate and endDate.
 *   Returns a negative number if endDate is before startDate.
 */
function daysBetween(date1, date2){
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    let msInDay = 1000 * 60 * 60 * 24;
    return Math.floor((d2-d1) / msInDay); 
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
    }
    let sql = "SELECT * FROM hotels";
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    return [sql, params];
}

module.exports =  buildHotelSearchQuery;
