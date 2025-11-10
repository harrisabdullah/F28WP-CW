function isNumOverEqualZero(n){
    return typeof n === 'number' && n >= 0;
}

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

function testSchema(schema, obj, strict){
    if (strict){
        return Object.entries(obj).every(([key, value]) => 
                schema[key]? schema[key](value) : false);
    }
    console.log(obj);
    return Object.entries(obj).every(([key, value]) => 
            schema[key]? schema[key](value) : true);
}

function isValidQuery(q) {
    console.log("1");
    if (!testSchema(querySchema, q, false)){
        return false;
    }
        console.log("2");
    if (('maxPrice' in q || 'minPrice' in q) && !('roomConfig' in q)){
        return false;
    }
        console.log("3");
    const startDate = new Date(q.startDate);
    const endDate = new Date(q.endDate);
    if (startDate >= endDate){
        return false;
    }
        console.log("4");
    return q.roomConfig? 
           testSchema(roomConfigSchema, q.roomConfig, true) :
           true;
}

function daysBetween(date1, date2){
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    let msInDay = 1000 * 60 * 60 * 24;
    return Math.floor((d2-d1) / msInDay); 
}

function search(query) {
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
        console.log('here');
        const price = "((singleRoomPrice * ? + twinRoomPrice * ? + doubleRoomPrice * ? + penthousePrice * ?) * ?)"
        const price_conds = [query.roomConfig.single, query.roomConfig.twin, query.roomConfig.double, query.roomConfig.penthouse, daysCount]
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

module.exports =  search;
