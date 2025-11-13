
function isIntOverEqualZero(n) {
    return typeof n === 'number' && Number.isInteger(n) && n >= 0;
}

const roomConfigSchema = {
    'single': isIntOverEqualZero,
    'double': isIntOverEqualZero,
    'twin': isIntOverEqualZero,
    'penthouse': isIntOverEqualZero,
}

/**
 * Validates an object against a schema.
 *
 * @param {Object} schema - An object where keys are property names and values are 
 *                          validation functions that return true if the value is valid.
 * @param {Object} obj - The object to validate.
 * @param {boolean} strict - If true, ensures the object has exactly the same keys as the schema.
 * @returns {boolean} - Returns true if the object passes all validation checks, false otherwise.
 *
 * Behavior:
 * - Returns false if the object is empty.
 * - Checks that all keys in the object exist in the schema and pass their corresponding validation function.
 * - If strict is true, also ensures the object contains all keys defined in the schema.
 */
function testSchema(schema, obj, strict) {

    const objKeys = Object.keys(obj);
    const schemaKeys = Object.keys(schema);

    const allKeysValid = objKeys.every(key => schema[key] && schema[key](obj[key]));
    if (!allKeysValid) return false;

    if (strict) {
        return schemaKeys.every(key => obj.hasOwnProperty(key));
    }

    return true;
}

module.exports = { testSchema, roomConfigSchema }
