const CrosstabExt = require('./crosstabExt'),
    data = require('./data');

var config = {
    rowDimensions: ['product', 'state'],
    colDimensions: ['year', 'month'],
    chartType: 'column2d',
    noDataMessage: 'No data to be displayed.',
    measure: 'sale',
    measureOnRow: false,
    cellWidth: 120,
    cellHeight: 100,
    crosstabContainer: 'crosstab-div',
    aggregation: 'sum',
    chartConfig: {
        chart: {
            'showBorder': '0',
            'showValues': '0',
            'divLineAlpha': '0',
            'numberPrefix': '₹',
            'rotateValues': '1',
            'bgColor': '#ffffff',
            'showXAxisLine': '1',
            'plotBorderAlpha': '0',
            'showXaxisValues': '0',
            'showYAxisValues': '0',
            'animation': '1',
            'alternateHGridAlpha': '0',
            'canvasBorderAlpha': '100',
            'alternateVGridAlpha': '0',
            'paletteColors': '#B5B9BA',
            'usePlotGradientColor': '0',
            'valueFontColor': '#ffffff',
            'xAxisLineColor': '#ffffff',
            'canvasBorderColor': '#000000'
        }
    }
};

window.crosstab = new CrosstabExt(data, config);
window.crosstab.renderCrosstab();
