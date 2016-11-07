var CrosstabExt = require('./crosstabExt');

var crosstab = new CrosstabExt();
crosstab.mergeDimensions();
crosstab.makeGlobalArray();
var arr = [['Tea', 'Coffee'], ['New York', 'Washington'], [2013, 2014]];
var combos = crosstab.caller(arr);
console.log(combos);
// var filters = crosstab.createFilters();
// console.log(filters);
