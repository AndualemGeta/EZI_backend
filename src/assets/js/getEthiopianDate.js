var EC = require('./ec');

export default function getEthiopianDate(d){
    var date = new Date(d);
    var ec = EC.instance();
    var x = ec.fromJSDate(new Date(parseInt(date.getFullYear()), parseInt(date.getMonth()), parseInt(date.getDate())));
    return x.toEC().toLongString();
}