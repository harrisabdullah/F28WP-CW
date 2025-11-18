
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

module.exports = daysBetween
