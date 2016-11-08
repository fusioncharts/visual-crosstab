var CrosstabExt = require('./crosstabExt');

var crosstab = new CrosstabExt();
crosstab.mergeDimensions();
crosstab.createFilterFunctions();
crosstab.draw('crosstab-div');
crosstab.createMultiChart();
