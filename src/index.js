const CrosstabExt = require('./crosstabExt'),
    data = require('./largeData');

var config = {
    dimensions: ['Product', 'State', 'Month'],
    measures: ['Sale', 'Profit', 'Visitors'],
    chartType: 'column2d',
    noDataMessage: 'No data to display.',
    crosstabContainer: 'crosstab-div',
    cellWidth: 150,
    cellHeight: 113,
    showFilter: true,
    draggableHeaders: true,
    // aggregation: 'sum',
    chartConfig: {
        chart: {
            'showBorder': '0',
            'showValues': '0',
            'divLineAlpha': '0',
            'numberPrefix': '₹',
            'rotateValues': '1',
            'rollOverBandColor': '#badaf0',
            'columnHoverColor': '#1b83cc',
            'chartBottomMargin': '10',
            'chartTopMargin': '10',
            'chartLeftMargin': '5',
            'chartRightMargin': '5',
            'zeroPlaneThickness': '1',
            'showZeroPlaneValue': '1',
            'zeroPlaneAlpha': '100',
            'bgColor': '#FFFFFF',
            'showXAxisLine': '1',
            'plotBorderAlpha': '0',
            'showXaxisValues': '0',
            'showYAxisValues': '0',
            'animation': '1',
            'transposeAnimation': '1',
            'alternateHGridAlpha': '0',
            'plotColorInTooltip': '0',
            'canvasBorderAlpha': '100',
            'alternateVGridAlpha': '0',
            'paletteColors': '#B5B9BA',
            'usePlotGradientColor': '0',
            'valueFontColor': '#FFFFFF',
            'drawTrendRegion': '1'
        }
    }
};

if (typeof window === 'object') {
    window.crosstab = new CrosstabExt(data, config);
    window.crosstab.renderCrosstab();
} else {
    module.exports = CrosstabExt;
}
