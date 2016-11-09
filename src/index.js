var CrosstabExt = require('./crosstabExt');

var crosstab = new CrosstabExt();
crosstab.mergeDimensions();
let matrix = crosstab.createMatrix();
crosstab.createMultiChart(matrix);
