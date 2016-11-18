const CrosstabExt = require('./crosstabExt'),
    data = require('./largeData');

var config = {
    rowDimensions: ['product', 'state'],
    colDimensions: ['year', 'quality', 'month'],
    chartType: 'column2d',
    noDataMessage: 'No data to display.',
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
            'chartBottomMargin': '5',
            'chartTopMargin': '5',
            'chartLeftMargin': '5',
            'chartRightMargin': '5',
            'zeroPlaneThickness': '1',
            'showZeroPlaneValue': '1',
            'zeroPlaneAlpha': '100',
            'bgColor': '#ffffff',
            'showXAxisLine': '1',
            'plotBorderAlpha': '0',
            'showXaxisValues': '0',
            'showYAxisValues': '0',
            'animation': '1',
            'transposeAnimation': '0',
            'alternateHGridAlpha': '0',
            'canvasBorderAlpha': '100',
            'alternateVGridAlpha': '0',
            'paletteColors': '#B5B9BA',
            'usePlotGradientColor': '0',
            'valueFontColor': '#ffffff'
        }
    }
};

window.crosstab = new CrosstabExt(data, config);
window.crosstab.renderCrosstab();
