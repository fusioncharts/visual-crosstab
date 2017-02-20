{
    /* eslint-env browser */
    let dataURL = './javascripts/data/largeData.json',
        httpRequest = {};
    function instantiateCrosstab (data) {
        let config = {
                dimensions: ['Product', 'State', 'Month'],
                measures: ['Sale', 'Profit', 'Visitors'],
                measureUnits: ['INR', '$', ''],
                unitFunction: (unit) => '(' + unit + ')',
                chartType: 'bar2d',
                noDataMessage: 'No data to display.',
                crosstabContainer: 'crosstab-div',
                dataIsSortable: true,
                cellWidth: 150,
                cellHeight: 80,
                // filterDiv: 'control-box',
                draggableHeaders: false,
                aggregation: 'sum',
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
            },
            Crosstab = CrosstabExt.default;

        window.crosstab = new Crosstab(data, config);
    }
    function getData (url) {
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            console.warn('Cannot create XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = function () {
            let data = {};
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    data = JSON.parse(httpRequest.responseText);
                    instantiateCrosstab(data);
                } else {
                    console.error('There was a problem with the request.');
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    }
    getData(dataURL);
}
