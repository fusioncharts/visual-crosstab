/**
 * Represents a crosstab.
 */
class CrosstabExt {
    constructor (data, config) {
        this.data = data;
        // List of possible events raised by the data store.
        this.eventList = {
            'modelUpdated': 'modelupdated',
            'modelDeleted': 'modeldeleted',
            'metaInfoUpdate': 'metainfoupdated',
            'processorUpdated': 'processorupdated',
            'processorDeleted': 'processordeleted'
        };
        // Potentially unnecessary member.
        // TODO: Refactor code dependent on variable.
        // TODO: Remove variable.
        this.storeParams = {
            data: data,
            config: config
        };
        // Array of column names (measures) used when building the crosstab array.
        this._columnKeyArr = [];
        // Saving provided configuration into instance.
        this.measures = config.measures;
        this.chartType = config.chartType;
        this.dimensions = config.dimensions;
        this.chartConfig = config.chartConfig;
        this.crosstabContainer = config.crosstabContainer;
        this.cellWidth = config.cellWidth || 210;
        this.cellHeight = config.cellHeight || 113;
        this.showFilter = config.showFilter || false;
        this.aggregation = config.aggregation || 'sum';
        this.draggableHeaders = config.draggableHeaders || false;
        this.noDataMessage = config.noDataMessage || 'No data to display.';
        if (typeof MultiCharting === 'function') {
            this.mc = new MultiCharting();
            // Creating an empty data store
            this.dataStore = this.mc.createDataStore();
            // Adding data to the data store
            this.dataStore.setData({ dataSource: this.data });
        } else {
            throw new Error('MultiChartng module not found.');
        }
        if (this.showFilter) {
            if (typeof FCDataFilterExt === 'function') {
                let filterConfig = {};
                this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box');
            } else {
                throw new Error('DataFilter module not found.');
            }
        }
        // Building a data structure for internal use.
        this.globalData = this.buildGlobalData();
        // Building a hash map of applicable filters and the corresponding filter functions
        this.hash = this.getFilterHashMap();
    }

    /**
     * Build an array of arrays data structure from the data store for internal use.
     * @return {Array} An array of arrays generated from the dataStore's array of objects
     */
    buildGlobalData () {
        let dataStore = this.dataStore,
            fields = dataStore.getKeys();
        if (fields) {
            let globalData = {};
            for (let i = 0, ii = fields.length; i < ii; i++) {
                globalData[fields[i]] = dataStore.getUniqueValues(fields[i]);
            }
            return globalData;
        } else {
            throw new Error('Could not generate keys from data store');
        }
    }

    createRow (table, data, rowOrder, currentIndex, filteredDataStore) {
        var rowspan = 0,
            fieldComponent = rowOrder[currentIndex],
            fieldValues = data[fieldComponent],
            i, l = fieldValues.length,
            rowElement,
            hasFurtherDepth = currentIndex < (rowOrder.length - 1),
            filteredDataHashKey,
            colLength = this._columnKeyArr.length,
            htmlRef,
            min = Infinity,
            max = -Infinity,
            minmaxObj = {};

        if (currentIndex === 0) {
            table.push([]);
        }

        for (i = 0; i < l; i += 1) {
            let classStr = '';
            htmlRef = document.createElement('p');
            htmlRef.innerHTML = fieldValues[i];
            htmlRef.style.textAlign = 'center';
            htmlRef.style.marginTop = ((this.cellHeight - 10) / 2) + 'px';
            classStr += 'row-dimensions' +
                ' ' + this.dimensions[currentIndex].toLowerCase() +
                ' ' + fieldValues[i].toLowerCase() + ' no-select';
            // if (currentIndex > 0) {
            //     htmlRef.classList.add(this.dimensions[currentIndex - 1].toLowerCase());
            // }
            htmlRef.style.visibility = 'hidden';
            document.body.appendChild(htmlRef);
            this.cornerWidth = fieldValues[i].length * 10;
            document.body.removeChild(htmlRef);
            htmlRef.style.visibility = 'visible';
            rowElement = {
                width: this.cornerWidth,
                height: 35,
                rowspan: 1,
                colspan: 1,
                html: htmlRef.outerHTML,
                className: classStr
            };
            filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
            if (i) {
                table.push([rowElement]);
            } else {
                table[table.length - 1].push(rowElement);
            }
            if (hasFurtherDepth) {
                rowElement.rowspan = this.createRow(table, data, rowOrder,
                    currentIndex + 1, filteredDataHashKey);
            } else {
                if (this.chartType === 'bar2d') {
                    let categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
                    table[table.length - 1].push({
                        rowspan: 1,
                        colspan: 1,
                        width: 40,
                        className: 'vertical-axis',
                        chart: this.mc.chart({
                            'type': 'axis',
                            'width': '100%',
                            'height': '100%',
                            'dataFormat': 'json',
                            'config': {
                                'chart': {
                                    'axisType': 'x',
                                    'borderthickness': 0,
                                    'isHorizontal': 0,
                                    'chartTopMargin': this.chartConfig.chart.chartTopMargin,
                                    'chartBottomMargin': this.chartConfig.chart.chartBottomMargin,
                                    'valuePadding': 0.5
                                },
                                'categories': categories
                            }
                        })
                    });
                } else {
                    table[table.length - 1].push({
                        rowspan: 1,
                        colspan: 1,
                        width: 40,
                        className: 'vertical-axis',
                        chart: this.mc.chart({
                            'type': 'axis',
                            'width': '100%',
                            'height': '100%',
                            'dataFormat': 'json',
                            'config': {
                                'chart': {
                                    'axisType': 'y'
                                }
                            }
                        })
                    });
                }
                for (let j = 0; j < colLength; j += 1) {
                    let chartCellObj = {
                        width: this.cellWidth,
                        height: this.cellHeight,
                        rowspan: 1,
                        colspan: 1,
                        rowHash: filteredDataHashKey,
                        colHash: this._columnKeyArr[j],
                        // chart: this.getChartObj(filteredDataHashKey, this._columnKeyArr[j])[1],
                        className: 'chart-cell ' + (j + 1)
                    };
                    if (j === colLength - 1) {
                        chartCellObj.className = 'chart-cell last-col';
                    }
                    table[table.length - 1].push(chartCellObj);
                    minmaxObj = this.getChartObj(filteredDataHashKey, this._columnKeyArr[j])[0];
                    max = (parseInt(minmaxObj.max) > max) ? minmaxObj.max : max;
                    min = (parseInt(minmaxObj.min) < min) ? minmaxObj.min : min;
                    chartCellObj.max = max;
                    chartCellObj.min = min;
                }
            }
            rowspan += rowElement.rowspan;
        }
        return rowspan;
    }

    createMeasureHeadings (table, data, measureOrder) {
        var colspan = 0,
            i,
            l = this.measures.length,
            colElement,
            htmlRef,
            headerDiv,
            dragDiv;

        for (i = 0; i < l; i += 1) {
            let classStr = '',
                fieldComponent = measureOrder[i];
                // fieldValues = data[fieldComponent];
            headerDiv = document.createElement('div');
            headerDiv.style.textAlign = 'center';

            dragDiv = document.createElement('div');
            dragDiv.setAttribute('class', 'measure-drag-handle');
            dragDiv.style.height = '5px';
            dragDiv.style.paddingTop = '3px';
            dragDiv.style.paddingBottom = '1px';
            this.appendDragHandle(dragDiv, 25);

            htmlRef = document.createElement('p');
            htmlRef.innerHTML = fieldComponent;
            htmlRef.style.textAlign = 'center';
            htmlRef.style.marginTop = '5px';
            // htmlRef.style.marginTop = ((30 * this.measures.length - 15) / 2) + 'px';
            document.body.appendChild(htmlRef);

            classStr += 'column-measures ' + this.measures[i].toLowerCase() + ' no-select';
            if (this.draggableHeaders) {
                classStr += ' draggable';
            }
            this.cornerHeight = htmlRef.offsetHeight;
            document.body.removeChild(htmlRef);

            headerDiv.appendChild(dragDiv);
            headerDiv.appendChild(htmlRef);
            colElement = {
                width: this.cellWidth,
                height: 35,
                rowspan: 1,
                colspan: 1,
                html: headerDiv.outerHTML,
                className: classStr
            };
            this._columnKeyArr.push(this.measures[i]);
            table[0].push(colElement);
        }
        return colspan;
    }

    createDimensionHeadings (colOrderLength) {
        var cornerCellArr = [],
            i = 0,
            htmlRef,
            classStr = '',
            headerDiv,
            dragDiv;

        for (i = 0; i < this.dimensions.length - 1; i++) {
            headerDiv = document.createElement('div');
            headerDiv.style.textAlign = 'center';

            dragDiv = document.createElement('div');
            dragDiv.setAttribute('class', 'dimension-drag-handle');
            dragDiv.style.height = '5px';
            dragDiv.style.paddingTop = '3px';
            dragDiv.style.paddingBottom = '1px';
            this.appendDragHandle(dragDiv, 25);

            htmlRef = document.createElement('p');
            htmlRef.innerHTML = this.dimensions[i][0].toUpperCase() + this.dimensions[i].substr(1);
            htmlRef.style.textAlign = 'center';
            htmlRef.style.marginTop = '5px';
            classStr = 'dimension-header ' + this.dimensions[i].toLowerCase() + ' no-select';
            if (this.draggableHeaders) {
                classStr += ' draggable';
            }
            headerDiv.appendChild(dragDiv);
            headerDiv.appendChild(htmlRef);
            cornerCellArr.push({
                width: this.dimensions[i].length * 10,
                height: 35,
                rowspan: 1,
                colspan: 1,
                html: headerDiv.outerHTML,
                className: classStr
            });
        }
        return cornerCellArr;
    }

    createVerticalAxisHeader () {
        let htmlRef = document.createElement('p');
        htmlRef.innerHTML = '';
        htmlRef.style.textAlign = 'center';
        return {
            width: 40,
            height: 35,
            rowspan: 1,
            colspan: 1,
            html: htmlRef.outerHTML,
            className: 'axis-header-cell'
        };
    }

    createCaption (maxLength) {
        return [{
            height: 50,
            rowspan: 1,
            colspan: maxLength,
            className: 'caption-chart',
            chart: this.mc.chart({
                'type': 'caption',
                'width': '100%',
                'height': '100%',
                'dataFormat': 'json',
                'config': {
                    'chart': {
                        'caption': 'Sale of Cereal',
                        'subcaption': 'Across States, Across Years',
                        'borderthickness': '0'
                    }
                }
            })
        }];
    }

    createCrosstab () {
        var obj = this.globalData,
            rowOrder = this.dimensions.filter(function (val, i, arr) {
                if (val !== arr[arr.length - 1]) {
                    return true;
                }
            }),
            colOrder = this.measures.filter(function (val, i, arr) {
                if (val !== arr[arr.length]) {
                    return true;
                }
            }),
            table = [],
            xAxisRow = [],
            i = 0,
            maxLength = 0;
        if (obj) {
            // Insert dimension headings
            table.push(this.createDimensionHeadings(table, colOrder.length));
            // Insert vertical axis header
            table[0].push(this.createVerticalAxisHeader());
            // Insert measure headings
            this.createMeasureHeadings(table, obj, this.measures);
            // Insert rows
            this.createRow(table, obj, rowOrder, 0, '');
            // Find row with max length in the table
            for (i = 0; i < table.length; i++) {
                maxLength = (maxLength < table[i].length) ? table[i].length : maxLength;
            }
            // Push blank padding cells under the dimensions in the same row as the horizontal axis
            for (i = 0; i < this.dimensions.length - 1; i++) {
                xAxisRow.push({
                    rowspan: 1,
                    colspan: 1,
                    height: 30,
                    className: 'blank-cell'
                });
            }

            // Extra cell for y axis. Essentially Y axis footer.
            xAxisRow.push({
                rowspan: 1,
                colspan: 1,
                height: 30,
                width: 40,
                className: 'axis-footer-cell'
            });

            // Push horizontal axes into the last row of the table
            for (i = 0; i < maxLength - this.dimensions.length; i++) {
                let categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
                if (this.chartType === 'bar2d') {
                    xAxisRow.push({
                        width: '100%',
                        height: 20,
                        rowspan: 1,
                        colspan: 1,
                        className: 'horizontal-axis',
                        chart: this.mc.chart({
                            'type': 'axis',
                            'width': '100%',
                            'height': '100%',
                            'dataFormat': 'json',
                            'config': {
                                'chart': {
                                    'axisType': 'y',
                                    'isHorizontal': 1
                                }
                            }
                        })
                    });
                } else {
                    xAxisRow.push({
                        width: '100%',
                        height: 20,
                        rowspan: 1,
                        colspan: 1,
                        className: 'horizontal-axis',
                        chart: this.mc.chart({
                            'type': 'axis',
                            'width': '100%',
                            'height': '100%',
                            'dataFormat': 'json',
                            'config': {
                                'chart': {
                                    'axisType': 'x',
                                    'borderthickness': 0,
                                    'chartLeftMargin': this.chartConfig.chart.chartLeftMargin,
                                    'chartRightMargin': this.chartConfig.chart.chartRightMargin,
                                    'valuePadding': 0.5
                                },
                                'categories': categories
                            }
                        })
                    });
                }
            }

            table.push(xAxisRow);
            // Place the caption cell at the beginning of the table
            table.unshift(this.createCaption(maxLength));
            this._columnKeyArr = [];
        } else {
            // No data for crosstab. :(
            table.push([{
                html: '<p style="text-align: center">' + this.noDataMessage + '</p>',
                height: 50,
                colspan: this.dimensions.length * this.measures.length
            }]);
        }
        return table;
    }

    createFilters () {
        let filters = [],
            dimensions = this.dimensions.slice(0, this.dimensions.length - 1),
            matchedValues;

        dimensions.forEach(dimension => {
            matchedValues = this.globalData[dimension];
            matchedValues.forEach(value => {
                filters.push({
                    filter: this.filterGen(dimension, value.toString()),
                    filterVal: value
                });
            });
        });

        return filters;
    }

    createDataCombos () {
        let r = [],
            globalArray = this.makeGlobalArray(),
            max = globalArray.length - 1;

        function recurse (arr, i) {
            for (let j = 0, l = globalArray[i].length; j < l; j++) {
                var a = arr.slice(0);
                a.push(globalArray[i][j]);
                if (i === max) {
                    r.push(a);
                } else {
                    recurse(a, i + 1);
                }
            }
        }
        recurse([], 0);
        return r;
    }

    makeGlobalArray () {
        let tempObj = {},
            tempArr = [];

        for (let key in this.globalData) {
            if (this.globalData.hasOwnProperty(key) &&
                this.dimensions.indexOf(key) !== -1 &&
                key !== this.dimensions[this.dimensions.length - 1]) {
                tempObj[key] = this.globalData[key];
            }
        }
        tempArr = Object.keys(tempObj).map(key => tempObj[key]);
        return tempArr;
    }

    getFilterHashMap () {
        let filters = this.createFilters(),
            dataCombos = this.createDataCombos(),
            hashMap = {};

        for (let i = 0, l = dataCombos.length; i < l; i++) {
            let dataCombo = dataCombos[i],
                key = '',
                value = [];

            for (let j = 0, len = dataCombo.length; j < len; j++) {
                for (let k = 0, length = filters.length; k < length; k++) {
                    let filterVal = filters[k].filterVal;
                    if (dataCombo[j] === filterVal) {
                        if (j === 0) {
                            key += dataCombo[j];
                        } else {
                            key += '|' + dataCombo[j];
                        }
                        value.push(filters[k].filter);
                    }
                }
            }
            hashMap[key] = value;
        }
        return hashMap;
    }

    appendDragHandle (node, numHandles) {
        let i,
            handleSpan;
        for (i = 0; i < numHandles; i++) {
            handleSpan = document.createElement('span');
            handleSpan.style.marginLeft = '1px';
            handleSpan.style.fontSize = '3px';
            handleSpan.style.lineHeight = '1';
            handleSpan.style.verticalAlign = 'top';
            node.appendChild(handleSpan);
        }
    }

    renderCrosstab () {
        let globalMax = -Infinity,
            globalMin = Infinity,
            yAxis;

        // Generate the crosstab array
        this.crosstab = this.createCrosstab();

        // Find the global maximum and minimum for the axes
        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
            let rowLastChart = this.crosstab[i][this.crosstab[i].length - 1];
            if (rowLastChart.max || rowLastChart.min) {
                if (globalMax < rowLastChart.max) {
                    globalMax = rowLastChart.max;
                }
                if (globalMin > rowLastChart.min) {
                    globalMin = rowLastChart.min;
                }
            }
        }

        // Update the Y axis charts in the crosstab array with the global maximum and minimum
        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i],
                rowAxis;
            for (let j = 0, jj = row.length; j < jj; j++) {
                let crosstabElement = row[j];
                if (crosstabElement.chart && crosstabElement.chart.conf.type === 'axis') {
                    rowAxis = crosstabElement;
                    if (rowAxis.chart.conf.config.chart.axisType === 'y') {
                        let axisChart = rowAxis.chart,
                            config = axisChart.conf;
                        config.config.chart = {
                            'dataMin': globalMin,
                            'axisType': 'y',
                            'dataMax': globalMax,
                            'borderthickness': 0,
                            'chartBottomMargin': this.chartConfig.chart.chartBottomMargin,
                            'chartTopMargin': this.chartConfig.chart.chartTopMargin
                        };
                        if (this.chartType === 'bar2d') {
                            config.config.chart = {
                                'dataMin': globalMin,
                                'axisType': 'y',
                                'dataMax': globalMax,
                                'borderthickness': 0,
                                'chartLeftMargin': this.chartConfig.chart.chartLeftMargin,
                                'chartRightMargin': this.chartConfig.chart.chartRightMargin,
                                'isHorizontal': 1
                            };
                        }
                        axisChart = this.mc.chart(config);
                        rowAxis.chart = axisChart;
                    }
                }
            }
        }

        // Draw the crosstab with only the axes, caption and html text.
        // Required since axes cannot return limits unless they are drawn
        this.createMultiChart(this.crosstab);

        // Find a Y Axis chart
        yAxis = yAxis || this.findYAxisChart();

        // Place a chart object with limits from the Y Axis in the correct cell
        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i];
            for (let j = 0, jj = row.length; j < jj; j++) {
                let crosstabElement = row[j];
                if (yAxis) {
                    if (!crosstabElement.hasOwnProperty('html') &&
                        !crosstabElement.hasOwnProperty('chart') &&
                        crosstabElement.className !== 'blank-cell' &&
                        crosstabElement.className !== 'axis-footer-cell') {
                        let chart = yAxis.chart,
                            chartInstance = chart.getChartInstance(),
                            limits = chartInstance.getLimits(),
                            minLimit = limits[0],
                            maxLimit = limits[1],
                            chartObj = this.getChartObj(crosstabElement.rowHash,
                                crosstabElement.colHash,
                                minLimit,
                                maxLimit)[1];
                        crosstabElement.chart = chartObj;
                    }
                }
            }
        }

        // Update the crosstab
        this.createMultiChart(this.crosstab);

        // Update crosstab when the model updates
        this.dataStore.addEventListener(this.eventList.modelUpdated, (e, d) => {
            this.globalData = this.buildGlobalData();
            this.updateCrosstab();
        });

        // Attach event listeners to concurrently highlight plots when hovered in
        this.mc.addEventListener('hoverin', (evt, data) => {
            if (data.data) {
                for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
                    let row = this.crosstab[i];
                    for (var j = 0; j < row.length; j++) {
                        if (row[j].chart) {
                            if (!(row[j].chart.conf.type === 'caption' ||
                                row[j].chart.conf.type === 'axis')) {
                                let cellAdapter = row[j].chart,
                                    category = this.dimensions[this.dimensions.length - 1],
                                    categoryVal = data.data[category];
                                cellAdapter.highlight(categoryVal);
                            }
                        }
                    }
                }
            }
        });

        // Attach event listeners to concurrently remove highlights from plots when hovered out
        this.mc.addEventListener('hoverout', (evt, data) => {
            for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
                let row = this.crosstab[i];
                for (var j = 0; j < row.length; j++) {
                    if (row[j].chart) {
                        if (!(row[j].chart.conf.type === 'caption' ||
                            row[j].chart.conf.type === 'axis')) {
                            let cellAdapter = row[j].chart;
                            cellAdapter.highlight();
                        }
                    }
                }
            }
        });
    }

    updateCrosstab () {
        let filteredCrosstab = this.createCrosstab(),
            i, ii,
            j, jj,
            oldCharts = [],
            globalMax = -Infinity,
            globalMin = Infinity,
            axisLimits = [];
        for (i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i];
            for (j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j];
                if (cell.chart) {
                    let chartConf = cell.chart.getConf();
                    if (chartConf.type !== 'caption' && chartConf.type !== 'axis') {
                        oldCharts.push(cell);
                    }
                }
            }
        }

        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
            let row = filteredCrosstab[i];
            for (j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j];
                if (cell.rowHash && cell.colHash) {
                    let oldChart = this.getOldChart(oldCharts, cell.rowHash, cell.colHash),
                        limits = {};
                    if (!oldChart) {
                        let chartObj = this.getChartObj(cell.rowHash, cell.colHash);
                        oldChart = chartObj[1];
                        limits = chartObj[0];
                    }
                    cell.chart = oldChart;
                    if (Object.keys(limits).length !== 0) {
                        cell.max = limits.max;
                        cell.min = limits.min;
                    }
                }
            }
        }

        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
            let row = filteredCrosstab[i];
            for (j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j];
                if (cell.max || cell.min) {
                    if (globalMax < cell.max) {
                        globalMax = cell.max;
                    }
                    if (globalMin > cell.min) {
                        globalMin = cell.min;
                    }
                }
            }
        }

        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
            let row = filteredCrosstab[i];
            for (j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j];
                if (cell.chart && cell.chart.conf.type === 'axis') {
                    let rowAxis = cell;
                    if (rowAxis.chart.conf.config.chart.axisType === 'y') {
                        let axisChart = rowAxis.chart,
                            config = axisChart.conf;
                        config.config.chart = {
                            'dataMin': globalMin,
                            'axisType': 'y',
                            'dataMax': globalMax,
                            'borderthickness': 0,
                            'chartBottomMargin': this.chartConfig.chart.chartBottomMargin,
                            'chartTopMargin': this.chartConfig.chart.chartTopMargin
                        };
                        if (this.chartType === 'bar2d') {
                            config.config.chart = {
                                'dataMin': globalMin,
                                'axisType': 'y',
                                'dataMax': globalMax,
                                'borderthickness': 0,
                                'chartLeftMargin': this.chartConfig.chart.chartLeftMargin,
                                'chartRightMargin': this.chartConfig.chart.chartRightMargin,
                                'isHorizontal': 1
                            };
                        }
                        axisChart = this.mc.chart(config);
                        rowAxis.chart = axisChart;
                    }
                }
            }
        }

        this.crosstab = filteredCrosstab;
        this.createMultiChart();
        axisLimits = this.getYAxisLimits();

        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i];
            for (let j = 0, jj = row.length; j < jj; j++) {
                let crosstabElement = row[j];
                if (!crosstabElement.hasOwnProperty('html') &&
                    crosstabElement.className !== 'blank-cell' &&
                    crosstabElement.className !== 'axis-footer-cell' &&
                    crosstabElement.chart.getConf().type !== 'caption' &&
                    crosstabElement.chart.getConf().type !== 'axis') {
                    let chartObj = this.getChartObj(crosstabElement.rowHash,
                        crosstabElement.colHash,
                        axisLimits[0],
                        axisLimits[1])[1];
                    crosstabElement.chart.update(chartObj.getConf());
                }
            }
        }
    }

    findYAxisChart () {
        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i];
            for (let j = 0, jj = row.length; j < jj; j++) {
                let crosstabElement = row[j];
                if (crosstabElement.chart &&
                    crosstabElement.chart.conf.config.chart.axisType === 'y') {
                    return crosstabElement;
                }
            }
        }
    }

    getYAxisLimits () {
        let i, ii,
            j, jj;
        for (i = 0, ii = this.crosstab.length; i < ii; i++) {
            let row = this.crosstab[i];
            for (j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j];
                if (cell.chart) {
                    let chartConf = cell.chart.getConf();
                    if (chartConf.type === 'axis' && chartConf.config.chart.axisType === 'y') {
                        return (cell.chart.getChartInstance().getLimits());
                    }
                }
            }
        }
    }

    getOldChart (oldCharts, rowHash, colHash) {
        for (var i = oldCharts.length - 1; i >= 0; i--) {
            if (oldCharts[i].rowHash === rowHash && oldCharts[i].colHash === colHash) {
                return oldCharts[i].chart;
            }
        }
    }

    createMultiChart () {
        if (this.multichartObject === undefined) {
            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, this.crosstab);
            this.multichartObject.draw();
        } else {
            this.multichartObject.update(this.crosstab);
        }
        if (this.draggableHeaders) {
            this.dragListener(this.multichartObject.placeHolder);
        }
        return this.multichartObject.placeHolder;
    }

    permuteArr (arr) {
        let results = [];
        function permute (arr, mem) {
            let current;
            mem = mem || [];

            for (let i = 0, ii = arr.length; i < ii; i++) {
                current = arr.splice(i, 1);
                if (arr.length === 0) {
                    results.push(mem.concat(current).join('|'));
                }
                permute(arr.slice(), mem.concat(current));
                arr.splice(i, 0, current[0]);
            }
            return results;
        }
        var permuteStrs = permute(arr);
        return permuteStrs.join('*!%^');
    }

    matchHash (filterStr, hash) {
        for (var key in hash) {
            if (hash.hasOwnProperty(key)) {
                let keys = key.split('|'),
                    keyPermutations = this.permuteArr(keys).split('*!%^');
                if (keyPermutations.indexOf(filterStr) !== -1) {
                    return keyPermutations[0];
                } else {
                    continue;
                }
            }
        }
        return false;
    }

    getChartObj (rowFilter, colFilter, minLimit, maxLimit) {
        let filters = [],
            filterStr = '',
            rowFilters = rowFilter.split('|'),
            dataProcessors = [],
            dataProcessor = {},
            matchedHashes = [],
            // filteredJSON = [],
            // max = -Infinity,
            // min = Infinity,
            filteredData = {},
            // adapter = {},
            limits = {},
            chart = {},
            categories = this.globalData[this.dimensions[this.dimensions.length - 1]];

        rowFilters.push.apply(rowFilters);
        filters = rowFilters.filter((a) => {
            return (a !== '');
        });
        filterStr = filters.join('|');
        matchedHashes = this.hash[this.matchHash(filterStr, this.hash)];
        if (matchedHashes) {
            for (let i = 0, ii = matchedHashes.length; i < ii; i++) {
                dataProcessor = this.mc.createDataProcessor();
                dataProcessor.filter(matchedHashes[i]);
                dataProcessors.push(dataProcessor);
            }
            filteredData = this.dataStore.getChildModel(dataProcessors);
            if (minLimit !== undefined && maxLimit !== undefined) {
                this.chartConfig.chart.yAxisMinValue = minLimit;
                this.chartConfig.chart.yAxisMaxValue = maxLimit;
            }
            chart = this.mc.chart({
                dataSource: filteredData,
                type: this.chartType,
                width: '100%',
                height: '100%',
                dimension: [this.dimensions[this.dimensions.length - 1]],
                measure: [colFilter],
                seriesType: 'SS',
                aggregateMode: this.aggregation,
                categories: categories,
                config: this.chartConfig
            });
            limits = chart.getLimit();
            return [{
                'max': limits.max,
                'min': limits.min
            }, chart];
        }
    }

    dragListener (placeHolder) {
        // Getting only labels
        let origConfig = this.storeParams.config,
            dimensions = origConfig.dimensions || [],
            measures = origConfig.measures || [],
            measuresLength = measures.length,
            dimensionsLength = 0,
            dimensionsHolder,
            measuresHolder,
            self = this;
        // let end
        placeHolder = placeHolder[1];
        // Omitting last dimension
        dimensions = dimensions.slice(0, dimensions.length - 1);
        dimensionsLength = dimensions.length;
        // Setting up dimension holder
        dimensionsHolder = placeHolder.slice(0, dimensionsLength);
        // Setting up measures holder
        // One shift for blank box
        measuresHolder = placeHolder.slice(dimensionsLength + 1,
            dimensionsLength + measuresLength + 1);
        setupListener(dimensionsHolder, dimensions, dimensionsLength, this.dimensions);
        setupListener(measuresHolder, measures, measuresLength, this.measures);
        function setupListener (holder, arr, arrLen, globalArr) {
            let limitLeft = 0,
                limitRight = 0,
                last = arrLen - 1,
                ln = Math.log2;

            if (holder[0]) {
                limitLeft = parseInt(holder[0].graphics.style.left);
                limitRight = parseInt(holder[last].graphics.style.left);
            }

            for (let i = 0; i < arrLen; ++i) {
                let el = holder[i].graphics,
                    item = holder[i],
                    nLeft = 0,
                    diff = 0;
                item.cellValue = arr[i];
                item.origLeft = parseInt(el.style.left);
                item.redZone = item.origLeft + parseInt(el.style.width) / 2;
                item.index = i;
                item.adjust = 0;
                item.origZ = el.style.zIndex;
                self._setupDrag(item.graphics, function dragStart (dx, dy) {
                    nLeft = item.origLeft + dx + item.adjust;
                    if (nLeft < limitLeft) {
                        diff = limitLeft - nLeft;
                        nLeft = limitLeft - ln(diff);
                    }
                    if (nLeft > limitRight) {
                        diff = nLeft - limitRight;
                        nLeft = limitRight + ln(diff);
                    }
                    el.style.left = nLeft + 'px';
                    el.style.zIndex = 1000;
                    manageShifting(item.index, false, holder);
                    manageShifting(item.index, true, holder);
                }, function dragEnd () {
                    let change = false,
                        j = 0;
                    item.adjust = 0;
                    el.style.zIndex = item.origZ;
                    el.style.left = item.origLeft + 'px';
                    for (; j < arrLen; ++j) {
                        if (globalArr[j] !== holder[j].cellValue) {
                            globalArr[j] = holder[j].cellValue;
                            change = true;
                        }
                    }
                    if (change) {
                        window.setTimeout(function () {
                            self.globalData = self.buildGlobalData();
                            self.updateCrosstab();
                        }, 10);
                    }
                });
            }
        }

        function manageShifting (index, isRight, holder) {
            let stack = [],
                dragItem = holder[index],
                nextPos = isRight ? index + 1 : index - 1,
                nextItem = holder[nextPos];
            // Saving data for later use
            if (nextItem) {
                stack.push(!isRight &&
                    (parseInt(dragItem.graphics.style.left) < nextItem.redZone));
                stack.push(stack.pop() ||
                    (isRight && parseInt(dragItem.graphics.style.left) > nextItem.origLeft));
                if (stack.pop()) {
                    stack.push(nextItem.redZone);
                    stack.push(nextItem.origLeft);
                    stack.push(nextItem.index);
                    if (!isRight) {
                        dragItem.adjust += parseInt(nextItem.graphics.style.width);
                    } else {
                        dragItem.adjust -= parseInt(nextItem.graphics.style.width);
                    }
                    nextItem.origLeft = dragItem.origLeft;
                    nextItem.redZone = dragItem.redZone;
                    nextItem.index = dragItem.index;
                    nextItem.graphics.style.left = nextItem.origLeft + 'px';
                    stack.push(holder[nextPos]);
                    holder[nextPos] = holder[index];
                    holder[index] = stack.pop();
                }
            }
            // Setting new values for dragitem
            if (stack.length === 3) {
                dragItem.index = stack.pop();
                dragItem.origLeft = stack.pop();
                dragItem.redZone = stack.pop();
            }
        }
    }

    _setupDrag (el, handler, handler2) {
        let x = 0,
            y = 0;
        function customHandler (e) {
            handler(e.clientX - x, e.clientY - y);
        }
        el.addEventListener('mousedown', function (e) {
            x = e.clientX;
            y = e.clientY;
            el.style.opacity = 0.8;
            el.classList.add('dragging');
            window.document.addEventListener('mousemove', customHandler);
            window.document.addEventListener('mouseup', mouseUpHandler);
        });
        function mouseUpHandler (e) {
            el.style.opacity = 1;
            el.classList.remove('dragging');
            window.document.removeEventListener('mousemove', customHandler);
            window.document.removeEventListener('mouseup', mouseUpHandler);
            window.setTimeout(handler2, 10);
        }
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }
}

module.exports = CrosstabExt;
