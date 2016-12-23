const CrosstabExt = require('./crosstabExt'),
    data = require('./largeData');

var config = {
    dimensions: ['Product', 'State', 'Month'],
    measures: ['Sale', 'Profit', 'Visitors'],
    measureUnits: ['₹', '$', ''],
    unitFunction: (unit) => '(' + unit + ')',
    chartType: 'bar2d',
    noDataMessage: 'No data to display.',
    crosstabContainer: 'crosstab-div',
    dataIsSortable: true,
    cellWidth: 150,
    cellHeight: 80,
    // showFilter: true,
    draggableHeaders: false,
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
            'chartBottomMargin': '2',
            'chartTopMargin': '2',
            'chartLeftMargin': '5',
            'chartRightMargin': '7',
            'zeroPlaneThickness': '0',
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
            'canvasBorderAlpha': '0',
            'alternateVGridAlpha': '0',
            'paletteColors': '#5B5B5B',
            'usePlotGradientColor': '0',
            'valueFontColor': '#FFFFFF',
            'canvasBorderThickness': '0',
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
