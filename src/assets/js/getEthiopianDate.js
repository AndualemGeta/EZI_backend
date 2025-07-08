var EC = require('./ec');

export default function getEthiopianDate(d){
    var date = new Date(d);
    var ec = EC.instance();
    var x = ec.fromJSDate(new Date(parseInt(date.getFullYear()), parseInt(date.getMonth()), parseInt(date.getDate())));
    return x.toEC().toLongString();
}
export function getEthiopianTime(d) {
    const date = new Date(d);
    let hour = date.getHours();
    let minute = date.getMinutes();
    // Format hour to Ethiopian system (12-hour format with AM/PM in Amharic)
    let period = '';
    if (hour >= 0 && hour < 6) {
        period = 'ሌሊት'; // Night
    } else if (hour >= 6 && hour < 12) {
        period = 'ጠዋት'; // Morning
    } else if (hour >= 12 && hour < 18) {
        period = 'ከሰዓት'; // Afternoon
    } else {
        period = 'ማታ'; // Evening
    }
    const ethHour24 = (hour+6) % 24;
    const ethHour12 = (ethHour24 % 12) || 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${ethHour12}:${formattedMinute} ${period}`;
}
