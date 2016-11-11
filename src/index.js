const CrosstabExt = require('./crosstabExt'),
    data = require('./largeData');

var config = {
    rowDimensions: ['product', 'state'],
    colDimensions: ['year', 'quality', 'month'],
    chartType: 'bar2d',
    measure: 'sale',
    measureOnRow: false,
    cellWidth: 320,
    cellHeight: 130,
    crosstabContainer: 'crosstab-div',
    chartConfig: {
        chart: {
            'numberPrefix': '₹',
            'paletteColors': '#b5b9ba',
            'bgColor': '#ffffff',
            'valueFontColor': '#ffffff',
            'usePlotGradientColor': '0',
            'showYAxisValues': '0',
            'showValues': '0',
            'showXAxisLine': '1',
            'showXaxisValues': '0',
            'rotateValues': '1',
            'alternateVGridAlpha': '0',
            'divLineAlpha': '0',
            'xAxisLineColor': '#ffffff',
            'plotBorderAlpha': '0',
            'canvasBorderColor': '#000000',
            'canvasBorderAlpha': '100'
        }
    }
};

window.crosstab = new CrosstabExt(data, config);
window.crosstab.createCrosstab();
