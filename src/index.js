const CrosstabExt = require('./crosstabExt'),
    data = require('./largeData');

var config = {
    rowDimensions: ['product', 'state'],
    colDimensions: ['year', 'month'],
    chartType: 'line',
    measure: 'sale',
    measureOnRow: false,
    cellWidth: 320,
    cellHeight: 130,
    crosstabContainer: 'crosstab-div'
};

window.crosstab = new CrosstabExt(data, config);
window.crosstab.createCrosstab();
