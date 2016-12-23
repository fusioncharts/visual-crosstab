/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const CrosstabExt = __webpack_require__(1),
	    data = __webpack_require__(2);
	
	var config = {
	    dimensions: ['Product', 'State', 'Month'],
	    measures: ['Sale', 'Profit', 'Visitors'],
	    chartType: 'bar2d',
	    noDataMessage: 'No data to display.',
	    crosstabContainer: 'crosstab-div',
	    dataIsSortable: true,
	    cellWidth: 150,
	    cellHeight: 80,
	    // showFilter: true,
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	        this.dataIsSortable = config.dataIsSortable;
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
	        this.chartsAreSorted = false;
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
	            // Default categories for charts (i.e. no sorting applied)
	            this.categories = globalData[this.dimensions[this.dimensions.length - 1]];
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
	                                'categories': this.categories.reverse()
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
	                    minmaxObj = this.getChartObj(this.dataStore, this.categories,
	                        filteredDataHashKey, this._columnKeyArr[j])[0];
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
	            ascendingSortBtn,
	            descendingSortBtn,
	            headingTextNode,
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
	            htmlRef.style.position = 'relative';
	
	            ascendingSortBtn = this.createSortButton('ascending-sort');
	            htmlRef.appendChild(ascendingSortBtn);
	
	            descendingSortBtn = this.createSortButton('descending-sort');
	            htmlRef.appendChild(descendingSortBtn);
	
	            headingTextNode = document.createTextNode(fieldComponent);
	
	            htmlRef.appendChild(ascendingSortBtn);
	            htmlRef.appendChild(headingTextNode);
	            htmlRef.appendChild(descendingSortBtn);
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
	                                'categories': this.categories
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
	
	    createSortButton (className) {
	        let sortBtn,
	            classStr = 'sort-btn' + ' ' + (className || '');
	        sortBtn = document.createElement('span');
	        sortBtn.setAttribute('class', classStr.trim());
	        sortBtn.style.position = 'absolute';
	        if (className === 'ascending-sort') {
	            this.appendAscendingSteps(sortBtn, 4);
	        } else if (className === 'descending-sort') {
	            this.appendDescendingSteps(sortBtn, 4);
	        }
	        return sortBtn;
	    }
	
	    appendAscendingSteps (btn, numSteps) {
	        let i,
	            node,
	            marginValue = 1,
	            divWidth = 1;
	        for (i = 1; i <= numSteps; i++) {
	            node = document.createElement('span');
	            node.style.display = 'block';
	            node.className = 'sort-steps ascending';
	            node.style.borderBottom = '1px solid #59595C';
	            divWidth = divWidth + ((i / divWidth) * 3);
	            node.style.width = (divWidth.toFixed()) + 'px';
	            if (i === (numSteps - 1)) {
	                node.style.marginTop = marginValue + 'px';
	            } else {
	                node.style.marginTop = marginValue + 'px';
	            }
	            btn.appendChild(node);
	        }
	    }
	
	    appendDescendingSteps (btn, numSteps) {
	        let i,
	            node,
	            marginValue = 1,
	            divWidth = 9;
	        for (i = 1; i <= numSteps; i++) {
	            node = document.createElement('span');
	            node.style.display = 'block';
	            node.className = 'sort-steps descending';
	            node.style.borderBottom = '1px solid #59595C';
	            divWidth = divWidth - ((i / divWidth) * 4);
	            node.style.width = (divWidth.toFixed()) + 'px';
	            if (i === (numSteps - 1)) {
	                node.style.marginTop = marginValue + 'px';
	            } else {
	                node.style.marginTop = marginValue + 'px';
	            }
	            btn.appendChild(node);
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
	                            chartObj = this.getChartObj(this.dataStore, this.categories,
	                                crosstabElement.rowHash, crosstabElement.colHash, minLimit, maxLimit)[1];
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
	                        let chartObj = this.getChartObj(this.dataStore, this.categories,
	                            cell.rowHash, cell.colHash);
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
	                    let chartObj = this.getChartObj(this.dataStore, this.categories, crosstabElement.rowHash,
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
	
	    sortCharts (key, order) {
	        let sortProcessor = this.mc.createDataProcessor(),
	            sortFn,
	            sortedData;
	        this.chartsAreSorted = true;
	        if (order === 'ascending') {
	            sortFn = (a, b) => a[key] - b[key];
	        } else if (order === 'descending') {
	            sortFn = (a, b) => b[key] - a[key];
	        } else {
	            sortFn = (a, b) => 0;
	        }
	        sortProcessor.sort(sortFn);
	        sortedData = this.dataStore.getChildModel(sortProcessor);
	        this.crosstab.forEach(row => {
	            let rowCategories;
	            row.forEach(cell => {
	                if (cell.chart) {
	                    let chart = cell.chart,
	                        chartConf = chart.getConf();
	                    if (chartConf.type !== 'caption' && chartConf.type !== 'axis') {
	                        let chartObj = this.getChartObj(sortedData, this.categories,
	                            cell.rowHash, cell.colHash);
	                        chart.update(chartObj[1].getConf());
	                        rowCategories = chart.getConf().categories;
	                    }
	                }
	            });
	            row.forEach(cell => {
	                if (cell.chart) {
	                    let chart = cell.chart,
	                        chartConf = chart.getConf();
	                    if (chartConf.type === 'axis') {
	                        let axisType = chartConf.config.chart.axisType;
	                        if (axisType === 'x') {
	                            if (this.chartType === 'bar2d') {
	                                chartConf.config.categories = rowCategories.reverse();
	                            } else {
	                                chartConf.config.categories = rowCategories;
	                            }
	                            chart.update(chartConf);
	                        }
	                    }
	                }
	            });
	        });
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
	        if (this.dataIsSortable) {
	            this.setupSortButtons(this.multichartObject.placeHolder);
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
	
	    getChartObj (dataStore, categories, rowFilter, colFilter, minLimit, maxLimit) {
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
	            chart = {};
	
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
	            filteredData = dataStore.getChildModel(dataProcessors);
	            if (minLimit !== undefined && maxLimit !== undefined) {
	                this.chartConfig.chart.yAxisMinValue = minLimit;
	                this.chartConfig.chart.yAxisMaxValue = maxLimit;
	            }
	            if (this.dataIsSortable) {
	                let filteredJSON = filteredData.getJSON(),
	                    sortedCategories = [];
	                filteredJSON.forEach(val => {
	                    let category = val[this.dimensions[this.dimensions.length - 1]];
	                    if (sortedCategories.indexOf(category) === -1) {
	                        sortedCategories.push(category);
	                    }
	                });
	                categories = sortedCategories.slice();
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
	
	    setupSortButtons () {
	        let ascendingBtns = document.getElementsByClassName('ascending-sort'),
	            ii = ascendingBtns.length,
	            i,
	            descendingBtns = document.getElementsByClassName('descending-sort'),
	            jj = ascendingBtns.length,
	            j,
	            sortBtns = document.getElementsByClassName('sort-btn');
	        for (i = 0; i < ii; i++) {
	            let btn = ascendingBtns[i];
	            btn.addEventListener('mousedown', e => {
	                e.stopPropagation();
	                for (var i = sortBtns.length - 1; i >= 0; i--) {
	                    this.removeActiveClass(sortBtns[i]);
	                }
	                if (this.chartsAreSorted) {
	                    this.sortCharts();
	                    this.chartsAreSorted = false;
	                } else {
	                    let clickElem,
	                        targetChildren,
	                        classStr;
	                    if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                        clickElem = e.target.parentNode;
	                    } else {
	                        clickElem = e.target;
	                    }
	                    if (clickElem) {
	                        targetChildren = clickElem.parentNode.childNodes;
	                        classStr = clickElem.className + ' active';
	                        clickElem.setAttribute('class', classStr);
	                        targetChildren.forEach(val => {
	                            if (val.nodeType === 3) {
	                                this.sortCharts(val.nodeValue, 'ascending');
	                            }
	                        });
	                    }
	                }
	            });
	        };
	        for (j = 0; j < jj; j++) {
	            let btn = descendingBtns[j];
	            btn.addEventListener('mousedown', e => {
	                e.stopPropagation();
	                for (var i = sortBtns.length - 1; i >= 0; i--) {
	                    this.removeActiveClass(sortBtns[i]);
	                }
	                if (this.chartsAreSorted) {
	                    this.sortCharts();
	                    this.chartsAreSorted = false;
	                } else {
	                    let clickElem,
	                        targetChildren,
	                        classStr;
	                    if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                        clickElem = e.target.parentNode;
	                    } else {
	                        clickElem = e.target;
	                    }
	                    if (clickElem) {
	                        targetChildren = clickElem.parentNode.childNodes;
	                        classStr = clickElem.className + ' active';
	                        clickElem.setAttribute('class', classStr);
	                        targetChildren.forEach(val => {
	                            if (val.nodeType === 3) {
	                                this.sortCharts(val.nodeValue, 'descending');
	                            }
	                        });
	                    }
	                }
	            });
	        };
	    }
	
	    removeActiveClass (elem) {
	        let classNm = elem.className
	            .split(' ')
	            .filter((val) => val !== 'active')
	            .join(' ');
	        elem.setAttribute('class', classNm);
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
	            let target = e.target,
	                targetClassStr = target.className;
	            if (target.className === '' || targetClassStr.split(' ').indexOf('sort-btn') === -1) {
	                x = e.clientX;
	                y = e.clientY;
	                el.style.opacity = 0.8;
	                el.classList.add('dragging');
	                window.document.addEventListener('mousemove', customHandler);
	                window.document.addEventListener('mouseup', mouseUpHandler);
	            }
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = [
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 12,
	        'Visitors': 6
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 1,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 3,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 11,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 6,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 11,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 14,
	        'Visitors': 13
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 10,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 6,
	        'Profit': 3,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 7,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 14,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 2,
	        'Visitors': 9
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 9
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 5,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 12,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 13,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 7
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 6,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 4,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 0,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 9,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 9,
	        'Profit': 8,
	        'Visitors': 19
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 5,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 0,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 3,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 6,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 1,
	        'Profit': 9,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 4,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 11,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 5,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 14,
	        'Visitors': 4
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 5,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 7,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 2,
	        'Profit': 5,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 8,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 14,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 0,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 8,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 12,
	        'Visitors': 11
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 2,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 10,
	        'Profit': 11,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 14,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 10,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 1,
	        'Profit': 12,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 9,
	        'Profit': 4,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 9,
	        'Visitors': 2
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 0,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 6,
	        'Profit': 6,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 5,
	        'Visitors': 4
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 3,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 10,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 4,
	        'Visitors': 13
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 2,
	        'Profit': 13,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 14,
	        'Visitors': 1
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 11,
	        'Visitors': 11
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 4,
	        'Profit': 1,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 8,
	        'Visitors': 19
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 6,
	        'Visitors': 2
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 0,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 9,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 5,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 9,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 7,
	        'Visitors': 16
	    }
	];


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmVhZThlMDY3MTA5ZWM1NmNlYmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7Ozs7Ozs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQyx3QkFBd0I7QUFDNUQsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQixNQUFNO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCLHNCQUFxQjtBQUNyQjtBQUNBLGdDQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QixrQkFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLGdDQUFnQztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBLHdCQUF1Qix3Q0FBd0M7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWlDO0FBQ2pDO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekIsc0JBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYixVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQ0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQW1ELFNBQVM7QUFDNUQseURBQXdELFlBQVk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQSw2Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0EsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLDJEQUEwRCxRQUFRO0FBQ2xFO0FBQ0Esb0NBQW1DLGdCQUFnQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSx1REFBc0QsUUFBUTtBQUM5RDtBQUNBLGdDQUErQixnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBOEMsUUFBUTtBQUN0RDtBQUNBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBaUQsUUFBUTtBQUN6RDtBQUNBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBaUQsUUFBUTtBQUN6RDtBQUNBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0RBQWlELFFBQVE7QUFDekQ7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbURBQWtELFFBQVE7QUFDMUQ7QUFDQSw2Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBa0QsUUFBUTtBQUMxRDtBQUNBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3Qiw0QkFBMkI7QUFDM0Isd0JBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx1REFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLGtEQUFpRCxRQUFRO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0Esb0JBQW1CLFFBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0Esa0RBQWlELFFBQVE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQixZQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDOXdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LWVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZlYWU4ZTA2NzEwOWVjNTZjZWJjIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vbGFyZ2VEYXRhJyk7XG5cbnZhciBjb25maWcgPSB7XG4gICAgZGltZW5zaW9uczogWydQcm9kdWN0JywgJ1N0YXRlJywgJ01vbnRoJ10sXG4gICAgbWVhc3VyZXM6IFsnU2FsZScsICdQcm9maXQnLCAnVmlzaXRvcnMnXSxcbiAgICBjaGFydFR5cGU6ICdiYXIyZCcsXG4gICAgbm9EYXRhTWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheS4nLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcbiAgICBkYXRhSXNTb3J0YWJsZTogdHJ1ZSxcbiAgICBjZWxsV2lkdGg6IDE1MCxcbiAgICBjZWxsSGVpZ2h0OiA4MCxcbiAgICAvLyBzaG93RmlsdGVyOiB0cnVlLFxuICAgIGRyYWdnYWJsZUhlYWRlcnM6IHRydWUsXG4gICAgLy8gYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAncm9sbE92ZXJCYW5kQ29sb3InOiAnI2JhZGFmMCcsXG4gICAgICAgICAgICAnY29sdW1uSG92ZXJDb2xvcic6ICcjMWI4M2NjJyxcbiAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6ICc3JyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzVCNUI1QicsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgLy8gTGlzdCBvZiBwb3NzaWJsZSBldmVudHMgcmFpc2VkIGJ5IHRoZSBkYXRhIHN0b3JlLlxuICAgICAgICB0aGlzLmV2ZW50TGlzdCA9IHtcbiAgICAgICAgICAgICdtb2RlbFVwZGF0ZWQnOiAnbW9kZWx1cGRhdGVkJyxcbiAgICAgICAgICAgICdtb2RlbERlbGV0ZWQnOiAnbW9kZWxkZWxldGVkJyxcbiAgICAgICAgICAgICdtZXRhSW5mb1VwZGF0ZSc6ICdtZXRhaW5mb3VwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvclVwZGF0ZWQnOiAncHJvY2Vzc29ydXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yRGVsZXRlZCc6ICdwcm9jZXNzb3JkZWxldGVkJ1xuICAgICAgICB9O1xuICAgICAgICAvLyBQb3RlbnRpYWxseSB1bm5lY2Vzc2FyeSBtZW1iZXIuXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIGNvZGUgZGVwZW5kZW50IG9uIHZhcmlhYmxlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdmFyaWFibGUuXG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQXJyYXkgb2YgY29sdW1uIG5hbWVzIChtZWFzdXJlcykgdXNlZCB3aGVuIGJ1aWxkaW5nIHRoZSBjcm9zc3RhYiBhcnJheS5cbiAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIC8vIFNhdmluZyBwcm92aWRlZCBjb25maWd1cmF0aW9uIGludG8gaW5zdGFuY2UuXG4gICAgICAgIHRoaXMubWVhc3VyZXMgPSBjb25maWcubWVhc3VyZXM7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gY29uZmlnLmRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGF0YUlzU29ydGFibGUgPSBjb25maWcuZGF0YUlzU29ydGFibGU7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aCB8fCAyMTA7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0IHx8IDExMztcbiAgICAgICAgdGhpcy5zaG93RmlsdGVyID0gY29uZmlnLnNob3dGaWx0ZXIgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb24gfHwgJ3N1bSc7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVhZGVycyA9IGNvbmZpZy5kcmFnZ2FibGVIZWFkZXJzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZSB8fCAnTm8gZGF0YSB0byBkaXNwbGF5Lic7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICAvLyBDcmVhdGluZyBhbiBlbXB0eSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICAvLyBBZGRpbmcgZGF0YSB0byB0aGUgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTXVsdGlDaGFydG5nIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2hvd0ZpbHRlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhRmlsdGVyIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnVpbGRpbmcgYSBkYXRhIHN0cnVjdHVyZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAvLyBCdWlsZGluZyBhIGhhc2ggbWFwIG9mIGFwcGxpY2FibGUgZmlsdGVycyBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgZmlsdGVyIGZ1bmN0aW9uc1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbiBhcnJheSBvZiBhcnJheXMgZGF0YSBzdHJ1Y3R1cmUgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBhcnJheXMgZ2VuZXJhdGVkIGZyb20gdGhlIGRhdGFTdG9yZSdzIGFycmF5IG9mIG9iamVjdHNcbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBsZXQgZGF0YVN0b3JlID0gdGhpcy5kYXRhU3RvcmUsXG4gICAgICAgICAgICBmaWVsZHMgPSBkYXRhU3RvcmUuZ2V0S2V5cygpO1xuICAgICAgICBpZiAoZmllbGRzKSB7XG4gICAgICAgICAgICBsZXQgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSBkYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNhdGVnb3JpZXMgZm9yIGNoYXJ0cyAoaS5lLiBubyBzb3J0aW5nIGFwcGxpZWQpXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBnbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZW5lcmF0ZSBrZXlzIGZyb20gZGF0YSBzdG9yZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuX2NvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZlcnRpY2FsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXMucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZlcnRpY2FsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5fY29sdW1uS2V5QXJyW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcnQ6IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5fY29sdW1uS2V5QXJyW2pdKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NoYXJ0LWNlbGwgJyArIChqICsgMSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IGNvbExlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5jbGFzc05hbWUgPSAnY2hhcnQtY2VsbCBsYXN0LWNvbCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlTWVhc3VyZUhlYWRpbmdzICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgYXNjZW5kaW5nU29ydEJ0bixcbiAgICAgICAgICAgIGRlc2NlbmRpbmdTb3J0QnRuLFxuICAgICAgICAgICAgaGVhZGluZ1RleHROb2RlLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2FzY2VuZGluZy1zb3J0Jyk7XG4gICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGFzY2VuZGluZ1NvcnRCdG4pO1xuXG4gICAgICAgICAgICBkZXNjZW5kaW5nU29ydEJ0biA9IHRoaXMuY3JlYXRlU29ydEJ1dHRvbignZGVzY2VuZGluZy1zb3J0Jyk7XG4gICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGRlc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgaGVhZGluZ1RleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmllbGRDb21wb25lbnQpO1xuXG4gICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGFzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChoZWFkaW5nVGV4dE5vZGUpO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChkZXNjZW5kaW5nU29ydEJ0bik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIC8vIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1tZWFzdXJlcyAnICsgdGhpcy5tZWFzdXJlc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyICs9ICcgZHJhZ2dhYmxlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoZHJhZ0Rpdik7XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlRGltZW5zaW9uSGVhZGluZ3MgKGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgaGVhZGVyRGl2LFxuICAgICAgICAgICAgZHJhZ0RpdjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdkaW1lbnNpb24tZHJhZy1oYW5kbGUnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUuaGVpZ2h0ID0gJzVweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAnM3B4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ0JvdHRvbSA9ICcxcHgnO1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREcmFnSGFuZGxlKGRyYWdEaXYsIDI1KTtcblxuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5kaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmRpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciA9ICdkaW1lbnNpb24taGVhZGVyICcgKyB0aGlzLmRpbWVuc2lvbnNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoZHJhZ0Rpdik7XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0ubGVuZ3RoICogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ybmVyQ2VsbEFycjtcbiAgICB9XG5cbiAgICBjcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIgKCkge1xuICAgICAgICBsZXQgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1oZWFkZXItY2VsbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uIChtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NhcHRpb24nLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XTtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFibGUgPSBbXSxcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIC8vIEluc2VydCBkaW1lbnNpb24gaGVhZGluZ3NcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVEaW1lbnNpb25IZWFkaW5ncyh0YWJsZSwgY29sT3JkZXIubGVuZ3RoKSk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgdmVydGljYWwgYXhpcyBoZWFkZXJcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2godGhpcy5jcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIoKSk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgbWVhc3VyZSBoZWFkaW5nc1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVNZWFzdXJlSGVhZGluZ3ModGFibGUsIG9iaiwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgcm93c1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIC8vIEZpbmQgcm93IHdpdGggbWF4IGxlbmd0aCBpbiB0aGUgdGFibGVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHVzaCBibGFuayBwYWRkaW5nIGNlbGxzIHVuZGVyIHRoZSBkaW1lbnNpb25zIGluIHRoZSBzYW1lIHJvdyBhcyB0aGUgaG9yaXpvbnRhbCBheGlzXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeHRyYSBjZWxsIGZvciB5IGF4aXMuIEVzc2VudGlhbGx5IFkgYXhpcyBmb290ZXIuXG4gICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1mb290ZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBQdXNoIGhvcml6b250YWwgYXhlcyBpbnRvIHRoZSBsYXN0IHJvdyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlUGFkZGluZyc6IDAuNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IHRoaXMuY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgY2FwdGlvbiBjZWxsIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICB0YWJsZS51bnNoaWZ0KHRoaXMuY3JlYXRlQ2FwdGlvbihtYXhMZW5ndGgpKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm8gZGF0YSBmb3IgY3Jvc3N0YWIuIDooXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnMuc2xpY2UoMCwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBkaW1lbnNpb25zLmZvckVhY2goZGltZW5zaW9uID0+IHtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbZGltZW5zaW9uXTtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbihkaW1lbnNpb24sIHZhbHVlLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZihrZXkpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgIGtleSAhPT0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBhcHBlbmREcmFnSGFuZGxlIChub2RlLCBudW1IYW5kbGVzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgaGFuZGxlU3BhbjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bUhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubWFyZ2luTGVmdCA9ICcxcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5mb250U2l6ZSA9ICczcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ3RvcCc7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGhhbmRsZVNwYW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU29ydEJ1dHRvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGxldCBzb3J0QnRuLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnc29ydC1idG4nICsgJyAnICsgKGNsYXNzTmFtZSB8fCAnJyk7XG4gICAgICAgIHNvcnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNvcnRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzU3RyLnRyaW0oKSk7XG4gICAgICAgIHNvcnRCdG4uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSAnYXNjZW5kaW5nLXNvcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZEFzY2VuZGluZ1N0ZXBzKHNvcnRCdG4sIDQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNsYXNzTmFtZSA9PT0gJ2Rlc2NlbmRpbmctc29ydCcpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRGVzY2VuZGluZ1N0ZXBzKHNvcnRCdG4sIDQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3J0QnRuO1xuICAgIH1cblxuICAgIGFwcGVuZEFzY2VuZGluZ1N0ZXBzIChidG4sIG51bVN0ZXBzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1hcmdpblZhbHVlID0gMSxcbiAgICAgICAgICAgIGRpdldpZHRoID0gMTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBudW1TdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ3NvcnQtc3RlcHMgYXNjZW5kaW5nJztcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tID0gJzFweCBzb2xpZCAjNTk1OTVDJztcbiAgICAgICAgICAgIGRpdldpZHRoID0gZGl2V2lkdGggKyAoKGkgLyBkaXZXaWR0aCkgKiAzKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSAoZGl2V2lkdGgudG9GaXhlZCgpKSArICdweCc7XG4gICAgICAgICAgICBpZiAoaSA9PT0gKG51bVN0ZXBzIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmREZXNjZW5kaW5nU3RlcHMgKGJ0biwgbnVtU3RlcHMpIHtcbiAgICAgICAgbGV0IGksXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWFyZ2luVmFsdWUgPSAxLFxuICAgICAgICAgICAgZGl2V2lkdGggPSA5O1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSAnc29ydC1zdGVwcyBkZXNjZW5kaW5nJztcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tID0gJzFweCBzb2xpZCAjNTk1OTVDJztcbiAgICAgICAgICAgIGRpdldpZHRoID0gZGl2V2lkdGggLSAoKGkgLyBkaXZXaWR0aCkgKiA0KTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSAoZGl2V2lkdGgudG9GaXhlZCgpKSArICdweCc7XG4gICAgICAgICAgICBpZiAoaSA9PT0gKG51bVN0ZXBzIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIHlBeGlzO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSBjcm9zc3RhYiBhcnJheVxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuXG4gICAgICAgIC8vIEZpbmQgdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtIGZvciB0aGUgYXhlc1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3dMYXN0Q2hhcnQgPSB0aGlzLmNyb3NzdGFiW2ldW3RoaXMuY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIFkgYXhpcyBjaGFydHMgaW4gdGhlIGNyb3NzdGFiIGFycmF5IHdpdGggdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0NoYXJ0ID0gdGhpcy5tYy5jaGFydChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jaGFydCA9IGF4aXNDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERyYXcgdGhlIGNyb3NzdGFiIHdpdGggb25seSB0aGUgYXhlcywgY2FwdGlvbiBhbmQgaHRtbCB0ZXh0LlxuICAgICAgICAvLyBSZXF1aXJlZCBzaW5jZSBheGVzIGNhbm5vdCByZXR1cm4gbGltaXRzIHVubGVzcyB0aGV5IGFyZSBkcmF3blxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gRmluZCBhIFkgQXhpcyBjaGFydFxuICAgICAgICB5QXhpcyA9IHlBeGlzIHx8IHRoaXMuZmluZFlBeGlzQ2hhcnQoKTtcblxuICAgICAgICAvLyBQbGFjZSBhIGNoYXJ0IG9iamVjdCB3aXRoIGxpbWl0cyBmcm9tIHRoZSBZIEF4aXMgaW4gdGhlIGNvcnJlY3QgY2VsbFxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmICh5QXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdheGlzLWZvb3Rlci1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0geUF4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRJbnN0YW5jZSA9IGNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydEluc3RhbmNlLmdldExpbWl0cygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCwgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gsIG1pbkxpbWl0LCBtYXhMaW1pdClbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydE9iajtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY3Jvc3N0YWJcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBjcm9zc3RhYiB3aGVuIHRoZSBtb2RlbCB1cGRhdGVzXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudExpc3QubW9kZWxVcGRhdGVkLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgaGlnaGxpZ2h0IHBsb3RzIHdoZW4gaG92ZXJlZCBpblxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyaW4nLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IHJlbW92ZSBoaWdobGlnaHRzIGZyb20gcGxvdHMgd2hlbiBob3ZlcmVkIG91dFxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZmlsdGVyZWRDcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIGksIGlpLFxuICAgICAgICAgICAgaiwgamosXG4gICAgICAgICAgICBvbGRDaGFydHMgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgYXhpc0xpbWl0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgIT09ICdjYXB0aW9uJyAmJiBjaGFydENvbmYudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5yb3dIYXNoICYmIGNlbGwuY29sSGFzaCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkQ2hhcnQgPSB0aGlzLmdldE9sZENoYXJ0KG9sZENoYXJ0cywgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2xkQ2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydCA9IGNoYXJ0T2JqWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRPYmpbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jaGFydCA9IG9sZENoYXJ0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobGltaXRzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWF4ID0gbGltaXRzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWluID0gbGltaXRzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5tYXggfHwgY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IGNlbGwubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSBjZWxsLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IGNlbGwubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0ICYmIGNlbGwuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0F4aXMgPSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0NoYXJ0ID0gdGhpcy5tYy5jaGFydChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jaGFydCA9IGF4aXNDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3Jvc3N0YWIgPSBmaWx0ZXJlZENyb3NzdGFiO1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoKTtcbiAgICAgICAgYXhpc0xpbWl0cyA9IHRoaXMuZ2V0WUF4aXNMaW1pdHMoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmICghY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdheGlzLWZvb3Rlci1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuZ2V0Q29uZigpLnR5cGUgIT09ICdjYXB0aW9uJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuZ2V0Q29uZigpLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsIGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbWl0c1sxXSlbMV07XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC51cGRhdGUoY2hhcnRPYmouZ2V0Q29uZigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kWUF4aXNDaGFydCAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFlBeGlzTGltaXRzICgpIHtcbiAgICAgICAgbGV0IGksIGlpLFxuICAgICAgICAgICAgaiwgamo7XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSA9PT0gJ2F4aXMnICYmIGNoYXJ0Q29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjZWxsLmNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKS5nZXRMaW1pdHMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRPbGRDaGFydCAob2xkQ2hhcnRzLCByb3dIYXNoLCBjb2xIYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBvbGRDaGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChvbGRDaGFydHNbaV0ucm93SGFzaCA9PT0gcm93SGFzaCAmJiBvbGRDaGFydHNbaV0uY29sSGFzaCA9PT0gY29sSGFzaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGRDaGFydHNbaV0uY2hhcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0Q2hhcnRzIChrZXksIG9yZGVyKSB7XG4gICAgICAgIGxldCBzb3J0UHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCksXG4gICAgICAgICAgICBzb3J0Rm4sXG4gICAgICAgICAgICBzb3J0ZWREYXRhO1xuICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHRydWU7XG4gICAgICAgIGlmIChvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBhW2tleV0gLSBiW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IGJba2V5XSAtIGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiAwO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRQcm9jZXNzb3Iuc29ydChzb3J0Rm4pO1xuICAgICAgICBzb3J0ZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChzb3J0UHJvY2Vzc29yKTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYi5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICBsZXQgcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IGNlbGwuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYgPSBjaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooc29ydGVkRGF0YSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydE9ialsxXS5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q2F0ZWdvcmllcyA9IGNoYXJ0LmdldENvbmYoKS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNUeXBlID0gY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzVHlwZSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydENvbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUodGhpcy5jcm9zc3RhYik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFNvcnRCdXR0b25zKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChkYXRhU3RvcmUsIGNhdGVnb3JpZXMsIHJvd0ZpbHRlciwgY29sRmlsdGVyLCBtaW5MaW1pdCwgbWF4TGltaXQpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIC8vIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2hhcnQgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBkYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBpZiAobWluTGltaXQgIT09IHVuZGVmaW5lZCAmJiBtYXhMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzID0gW107XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRKU09OLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gdmFsW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29ydGVkQ2F0ZWdvcmllcy5pbmRleE9mKGNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZENhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzID0gc29ydGVkQ2F0ZWdvcmllcy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hhcnQgPSB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlOiBmaWx0ZXJlZERhdGEsXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGltaXRzID0gY2hhcnQuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCBjaGFydF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFNvcnRCdXR0b25zICgpIHtcbiAgICAgICAgbGV0IGFzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgaWkgPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkZXNjZW5kaW5nQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Rlc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgamogPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBzb3J0QnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NvcnQtYnRuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gYXNjZW5kaW5nQnRuc1tpXTtcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzb3J0QnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKHNvcnRCdG5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzQXJlU29ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGlja0VsZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRDaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1zdGVwcycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGlja0VsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuID0gY2xpY2tFbGVtLnBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyID0gY2xpY2tFbGVtLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2hpbGRyZW4uZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKHZhbC5ub2RlVmFsdWUsICdhc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGRlc2NlbmRpbmdCdG5zW2pdO1xuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNvcnRCdG5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3Moc29ydEJ0bnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNBcmVTb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsaWNrRWxlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NTdHI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LXN0ZXBzJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWNrRWxlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2hpbGRyZW4gPSBjbGlja0VsZW0ucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NTdHIgPSBjbGlja0VsZW0uY2xhc3NOYW1lICsgJyBhY3RpdmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRDaGlsZHJlbi5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHModmFsLm5vZGVWYWx1ZSwgJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJlbW92ZUFjdGl2ZUNsYXNzIChlbGVtKSB7XG4gICAgICAgIGxldCBjbGFzc05tID0gZWxlbS5jbGFzc05hbWVcbiAgICAgICAgICAgIC5zcGxpdCgnICcpXG4gICAgICAgICAgICAuZmlsdGVyKCh2YWwpID0+IHZhbCAhPT0gJ2FjdGl2ZScpXG4gICAgICAgICAgICAuam9pbignICcpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc05tKTtcbiAgICB9XG5cbiAgICBkcmFnTGlzdGVuZXIgKHBsYWNlSG9sZGVyKSB7XG4gICAgICAgIC8vIEdldHRpbmcgb25seSBsYWJlbHNcbiAgICAgICAgbGV0IG9yaWdDb25maWcgPSB0aGlzLnN0b3JlUGFyYW1zLmNvbmZpZyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBvcmlnQ29uZmlnLmRpbWVuc2lvbnMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlcyA9IG9yaWdDb25maWcubWVhc3VyZXMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlc0xlbmd0aCA9IG1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSAwLFxuICAgICAgICAgICAgZGltZW5zaW9uc0hvbGRlcixcbiAgICAgICAgICAgIG1lYXN1cmVzSG9sZGVyLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGxldCBlbmRcbiAgICAgICAgcGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlclsxXTtcbiAgICAgICAgLy8gT21pdHRpbmcgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgZGltZW5zaW9ucyA9IGRpbWVuc2lvbnMuc2xpY2UoMCwgZGltZW5zaW9ucy5sZW5ndGggLSAxKTtcbiAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IGRpbWVuc2lvbnMubGVuZ3RoO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIGRpbWVuc2lvbiBob2xkZXJcbiAgICAgICAgZGltZW5zaW9uc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKDAsIGRpbWVuc2lvbnNMZW5ndGgpO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIG1lYXN1cmVzIGhvbGRlclxuICAgICAgICAvLyBPbmUgc2hpZnQgZm9yIGJsYW5rIGJveFxuICAgICAgICBtZWFzdXJlc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKGRpbWVuc2lvbnNMZW5ndGggKyAxLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCArIG1lYXN1cmVzTGVuZ3RoICsgMSk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIoZGltZW5zaW9uc0hvbGRlciwgZGltZW5zaW9ucywgZGltZW5zaW9uc0xlbmd0aCwgdGhpcy5kaW1lbnNpb25zKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihtZWFzdXJlc0hvbGRlciwgbWVhc3VyZXMsIG1lYXN1cmVzTGVuZ3RoLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBMaXN0ZW5lciAoaG9sZGVyLCBhcnIsIGFyckxlbiwgZ2xvYmFsQXJyKSB7XG4gICAgICAgICAgICBsZXQgbGltaXRMZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gMCxcbiAgICAgICAgICAgICAgICBsYXN0ID0gYXJyTGVuIC0gMSxcbiAgICAgICAgICAgICAgICBsbiA9IE1hdGgubG9nMjtcblxuICAgICAgICAgICAgaWYgKGhvbGRlclswXSkge1xuICAgICAgICAgICAgICAgIGxpbWl0TGVmdCA9IHBhcnNlSW50KGhvbGRlclswXS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gcGFyc2VJbnQoaG9sZGVyW2xhc3RdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyckxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsID0gaG9sZGVyW2ldLmdyYXBoaWNzLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaG9sZGVyW2ldLFxuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXR1cERyYWcoaXRlbS5ncmFwaGljcywgZnVuY3Rpb24gZHJhZ1N0YXJ0IChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgZHggKyBpdGVtLmFkanVzdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0IDwgbGltaXRMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbGltaXRMZWZ0IC0gbkxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0TGVmdCAtIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA+IGxpbWl0UmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBuTGVmdCAtIGxpbWl0UmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0UmlnaHQgKyBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gbkxlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCBmYWxzZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgdHJ1ZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiBkcmFnRW5kICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5nZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gaXRlbS5vcmlnWjtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaiA8IGFyckxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsQXJyW2pdICE9PSBob2xkZXJbal0uY2VsbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQXJyW2pdID0gaG9sZGVyW2pdLmNlbGxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdsb2JhbERhdGEgPSBzZWxmLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWFuYWdlU2hpZnRpbmcgKGluZGV4LCBpc1JpZ2h0LCBob2xkZXIpIHtcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFtdLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gaG9sZGVyW2luZGV4XSxcbiAgICAgICAgICAgICAgICBuZXh0UG9zID0gaXNSaWdodCA/IGluZGV4ICsgMSA6IGluZGV4IC0gMSxcbiAgICAgICAgICAgICAgICBuZXh0SXRlbSA9IGhvbGRlcltuZXh0UG9zXTtcbiAgICAgICAgICAgIC8vIFNhdmluZyBkYXRhIGZvciBsYXRlciB1c2VcbiAgICAgICAgICAgIGlmIChuZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIWlzUmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpIDwgbmV4dEl0ZW0ucmVkWm9uZSkpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2sucG9wKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGlzUmlnaHQgJiYgcGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPiBuZXh0SXRlbS5vcmlnTGVmdCkpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFjay5wb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLnJlZFpvbmUpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLm9yaWdMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0ICs9IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCAtPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ub3JpZ0xlZnQgPSBkcmFnSXRlbS5vcmlnTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ucmVkWm9uZSA9IGRyYWdJdGVtLnJlZFpvbmU7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmluZGV4ID0gZHJhZ0l0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQgPSBuZXh0SXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goaG9sZGVyW25leHRQb3NdKTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW25leHRQb3NdID0gaG9sZGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW2luZGV4XSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldHRpbmcgbmV3IHZhbHVlcyBmb3IgZHJhZ2l0ZW1cbiAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5pbmRleCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLm9yaWdMZWZ0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ucmVkWm9uZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwRHJhZyAoZWwsIGhhbmRsZXIsIGhhbmRsZXIyKSB7XG4gICAgICAgIGxldCB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjdXN0b21IYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGUuY2xpZW50WCAtIHgsIGUuY2xpZW50WSAtIHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q2xhc3NTdHIgPSB0YXJnZXQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT09ICcnIHx8IHRhcmdldENsYXNzU3RyLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1idG4nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZXIyLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==