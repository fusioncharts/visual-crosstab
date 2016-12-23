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
	        this.measureUnits = config.measureUnits;
	        this.dataIsSortable = config.dataIsSortable;
	        this.crosstabContainer = config.crosstabContainer;
	        this.cellWidth = config.cellWidth || 210;
	        this.cellHeight = config.cellHeight || 113;
	        this.showFilter = config.showFilter || false;
	        this.aggregation = config.aggregation || 'sum';
	        this.draggableHeaders = config.draggableHeaders || false;
	        this.noDataMessage = config.noDataMessage || 'No data to display.';
	        this.unitFunction = config.unitFunction || function (unit) { return '(' + unit + ')'; };
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
	        this.chartsAreSorted = {
	            bool: false,
	            order: '',
	            measure: ''
	        };
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
	                fieldComponent = measureOrder[i],
	                measureUnit = '';
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
	            htmlRef.setAttribute('data-measure', fieldComponent);
	
	            measureUnit = this.measureUnits[this.measures.indexOf(fieldComponent)];
	            if (measureUnit.length > 0) {
	                let measureHeading = fieldComponent + ' ' + this.unitFunction(measureUnit);
	                headingTextNode = document.createTextNode(measureHeading);
	            } else {
	                headingTextNode = document.createTextNode(fieldComponent);
	            }
	
	            // headingTextNode = document.createTextNode(fieldComponent);
	            if (this.dataIsSortable) {
	                ascendingSortBtn = this.createSortButton('ascending-sort');
	                htmlRef.appendChild(ascendingSortBtn);
	
	                descendingSortBtn = this.createSortButton('descending-sort');
	                htmlRef.appendChild(descendingSortBtn);
	
	                htmlRef.appendChild(ascendingSortBtn);
	                htmlRef.appendChild(headingTextNode);
	                htmlRef.appendChild(descendingSortBtn);
	            } else {
	                htmlRef.appendChild(headingTextNode);
	            }
	
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
	                let clickElem,
	                    measureName,
	                    classStr;
	                if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                    clickElem = e.target.parentNode;
	                } else {
	                    clickElem = e.target;
	                }
	                measureName = clickElem.parentNode.getAttribute('data-measure');
	                classStr = clickElem.className + ' active';
	                e.stopPropagation();
	                for (var i = sortBtns.length - 1; i >= 0; i--) {
	                    this.removeActiveClass(sortBtns[i]);
	                }
	                clickElem.setAttribute('class', classStr);
	                if (this.chartsAreSorted.bool) {
	                    let classList = clickElem.className.split(' ');
	                    if (measureName === this.chartsAreSorted.measure &&
	                        classList.indexOf(this.chartsAreSorted.order) !== -1) {
	                        this.sortCharts();
	                        this.chartsAreSorted = {
	                            bool: false,
	                            order: '',
	                            measure: ''
	                        };
	                        this.removeActiveClass(clickElem);
	                    } else {
	                        this.sortCharts(measureName, 'ascending');
	                        this.chartsAreSorted = {
	                            bool: true,
	                            order: 'ascending-sort',
	                            measure: measureName
	                        };
	                    }
	                } else {
	                    this.sortCharts(measureName, 'ascending');
	                    this.chartsAreSorted = {
	                        bool: true,
	                        order: 'ascending-sort',
	                        measure: measureName
	                    };
	                }
	            });
	        };
	        for (j = 0; j < jj; j++) {
	            let btn = descendingBtns[j];
	            btn.addEventListener('mousedown', e => {
	                let clickElem,
	                    measureName,
	                    classStr;
	                if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                    clickElem = e.target.parentNode;
	                } else {
	                    clickElem = e.target;
	                }
	                measureName = clickElem.parentNode.getAttribute('data-measure');
	                classStr = clickElem.className + ' active';
	                e.stopPropagation();
	                for (var i = sortBtns.length - 1; i >= 0; i--) {
	                    this.removeActiveClass(sortBtns[i]);
	                }
	                clickElem.setAttribute('class', classStr);
	                if (this.chartsAreSorted.bool) {
	                    let classList = clickElem.className.split(' ');
	                    if (measureName === this.chartsAreSorted.measure &&
	                        classList.indexOf(this.chartsAreSorted.order) !== -1) {
	                        this.sortCharts();
	                        this.chartsAreSorted = {
	                            bool: false,
	                            order: '',
	                            measure: ''
	                        };
	                        this.removeActiveClass(clickElem);
	                    } else {
	                        this.sortCharts(measureName, 'descending');
	                        this.chartsAreSorted = {
	                            bool: true,
	                            order: 'descending-sort',
	                            measure: measureName
	                        };
	                    }
	                } else {
	                    this.sortCharts(measureName, 'descending');
	                    this.chartsAreSorted = {
	                        bool: true,
	                        order: 'descending-sort',
	                        measure: measureName
	                    };
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
	
	    addActiveClass (elem) {
	        let classNm = elem.className
	            .split(' ');
	        classNm.push('active');
	        classNm = classNm.join(' ');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODUyYmI0ZTNmNjg2YmNlMWM1YzEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBOzs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQW9FLHlCQUF5QjtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQW9DLHdCQUF3QjtBQUM1RCxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBZ0IsTUFBTTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBaUM7QUFDakM7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QixzQkFBcUI7QUFDckIsa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QixzQkFBcUI7QUFDckI7QUFDQSxnQ0FBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW1CLGdDQUFnQztBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQSx3QkFBdUIsZ0NBQWdDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0Esd0JBQXVCLHdDQUF3QztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekIsc0JBQXFCO0FBQ3JCLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBaUM7QUFDakM7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QixzQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtDQUE4QyxPQUFPO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQSxvREFBbUQsU0FBUztBQUM1RCx5REFBd0QsWUFBWTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtELFFBQVE7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0EsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBa0QsUUFBUTtBQUMxRDtBQUNBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSwyREFBMEQsUUFBUTtBQUNsRTtBQUNBLG9DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsdURBQXNELFFBQVE7QUFDOUQ7QUFDQSxnQ0FBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0RBQWlELFFBQVE7QUFDekQ7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0RBQWlELFFBQVE7QUFDekQ7QUFDQSx5Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtEQUFpRCxRQUFRO0FBQ3pEO0FBQ0EseUNBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0EsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtELFFBQVE7QUFDMUQ7QUFDQSw2Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtDQUE4QyxRQUFRO0FBQ3REO0FBQ0EseUNBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCLDRCQUEyQjtBQUMzQix3QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHVEQUFzRCxRQUFRO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLFFBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFpRCxRQUFRO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxvQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWlELFFBQVE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQixZQUFZO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTBCLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyMENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODUyYmI0ZTNmNjg2YmNlMWM1YzEiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnTW9udGgnXSxcbiAgICBtZWFzdXJlczogWydTYWxlJywgJ1Byb2ZpdCcsICdWaXNpdG9ycyddLFxuICAgIG1lYXN1cmVVbml0czogWyfigrknLCAnJCcsICcnXSxcbiAgICB1bml0RnVuY3Rpb246ICh1bml0KSA9PiAnKCcgKyB1bml0ICsgJyknLFxuICAgIGNoYXJ0VHlwZTogJ2JhcjJkJyxcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5LicsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGRhdGFJc1NvcnRhYmxlOiB0cnVlLFxuICAgIGNlbGxXaWR0aDogMTUwLFxuICAgIGNlbGxIZWlnaHQ6IDgwLFxuICAgIC8vIHNob3dGaWx0ZXI6IHRydWUsXG4gICAgZHJhZ2dhYmxlSGVhZGVyczogZmFsc2UsXG4gICAgLy8gYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAncm9sbE92ZXJCYW5kQ29sb3InOiAnI2JhZGFmMCcsXG4gICAgICAgICAgICAnY29sdW1uSG92ZXJDb2xvcic6ICcjMWI4M2NjJyxcbiAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6ICc3JyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzVCNUI1QicsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgLy8gTGlzdCBvZiBwb3NzaWJsZSBldmVudHMgcmFpc2VkIGJ5IHRoZSBkYXRhIHN0b3JlLlxuICAgICAgICB0aGlzLmV2ZW50TGlzdCA9IHtcbiAgICAgICAgICAgICdtb2RlbFVwZGF0ZWQnOiAnbW9kZWx1cGRhdGVkJyxcbiAgICAgICAgICAgICdtb2RlbERlbGV0ZWQnOiAnbW9kZWxkZWxldGVkJyxcbiAgICAgICAgICAgICdtZXRhSW5mb1VwZGF0ZSc6ICdtZXRhaW5mb3VwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvclVwZGF0ZWQnOiAncHJvY2Vzc29ydXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yRGVsZXRlZCc6ICdwcm9jZXNzb3JkZWxldGVkJ1xuICAgICAgICB9O1xuICAgICAgICAvLyBQb3RlbnRpYWxseSB1bm5lY2Vzc2FyeSBtZW1iZXIuXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIGNvZGUgZGVwZW5kZW50IG9uIHZhcmlhYmxlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdmFyaWFibGUuXG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQXJyYXkgb2YgY29sdW1uIG5hbWVzIChtZWFzdXJlcykgdXNlZCB3aGVuIGJ1aWxkaW5nIHRoZSBjcm9zc3RhYiBhcnJheS5cbiAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIC8vIFNhdmluZyBwcm92aWRlZCBjb25maWd1cmF0aW9uIGludG8gaW5zdGFuY2UuXG4gICAgICAgIHRoaXMubWVhc3VyZXMgPSBjb25maWcubWVhc3VyZXM7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gY29uZmlnLmRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMubWVhc3VyZVVuaXRzID0gY29uZmlnLm1lYXN1cmVVbml0cztcbiAgICAgICAgdGhpcy5kYXRhSXNTb3J0YWJsZSA9IGNvbmZpZy5kYXRhSXNTb3J0YWJsZTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYkNvbnRhaW5lciA9IGNvbmZpZy5jcm9zc3RhYkNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoIHx8IDIxMDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQgfHwgMTEzO1xuICAgICAgICB0aGlzLnNob3dGaWx0ZXIgPSBjb25maWcuc2hvd0ZpbHRlciB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbiB8fCAnc3VtJztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVIZWFkZXJzID0gY29uZmlnLmRyYWdnYWJsZUhlYWRlcnMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlIHx8ICdObyBkYXRhIHRvIGRpc3BsYXkuJztcbiAgICAgICAgdGhpcy51bml0RnVuY3Rpb24gPSBjb25maWcudW5pdEZ1bmN0aW9uIHx8IGZ1bmN0aW9uICh1bml0KSB7IHJldHVybiAnKCcgKyB1bml0ICsgJyknOyB9O1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgLy8gQ3JlYXRpbmcgYW4gZW1wdHkgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgLy8gQWRkaW5nIGRhdGEgdG8gdGhlIGRhdGEgc3RvcmVcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpQ2hhcnRuZyBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YUZpbHRlciBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgZGF0YSBzdHJ1Y3R1cmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgLy8gQnVpbGRpbmcgYSBoYXNoIG1hcCBvZiBhcHBsaWNhYmxlIGZpbHRlcnMgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgYm9vbDogZmFsc2UsXG4gICAgICAgICAgICBvcmRlcjogJycsXG4gICAgICAgICAgICBtZWFzdXJlOiAnJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFuIGFycmF5IG9mIGFycmF5cyBkYXRhIHN0cnVjdHVyZSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIGFycmF5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgZGF0YVN0b3JlJ3MgYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBkYXRhU3RvcmUgPSB0aGlzLmRhdGFTdG9yZSxcbiAgICAgICAgICAgIGZpZWxkcyA9IGRhdGFTdG9yZS5nZXRLZXlzKCk7XG4gICAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgICAgIGxldCBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IGRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY2F0ZWdvcmllcyBmb3IgY2hhcnRzIChpLmUuIG5vIHNvcnRpbmcgYXBwbGllZClcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdlbmVyYXRlIGtleXMgZnJvbSBkYXRhIHN0b3JlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5fY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlcixcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlUGFkZGluZyc6IDAuNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IHRoaXMuY2F0ZWdvcmllcy5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLl9jb2x1bW5LZXlBcnJbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFydDogdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2hhcnQtY2VsbCAnICsgKGogKyAxKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY29sTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLmNsYXNzTmFtZSA9ICdjaGFydC1jZWxsIGxhc3QtY29sJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMF07XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSAocGFyc2VJbnQobWlubWF4T2JqLm1pbikgPCBtaW4pID8gbWlubWF4T2JqLm1pbiA6IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1heCA9IG1heDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVNZWFzdXJlSGVhZGluZ3MgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBhc2NlbmRpbmdTb3J0QnRuLFxuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4sXG4gICAgICAgICAgICBoZWFkaW5nVGV4dE5vZGUsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgaGVhZGVyRGl2LFxuICAgICAgICAgICAgZHJhZ0RpdjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlVW5pdCA9ICcnO1xuICAgICAgICAgICAgICAgIC8vIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF07XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lYXN1cmUtZHJhZy1oYW5kbGUnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUuaGVpZ2h0ID0gJzVweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAnM3B4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ0JvdHRvbSA9ICcxcHgnO1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREcmFnSGFuZGxlKGRyYWdEaXYsIDI1KTtcblxuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgaHRtbFJlZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWVhc3VyZScsIGZpZWxkQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgbWVhc3VyZVVuaXQgPSB0aGlzLm1lYXN1cmVVbml0c1t0aGlzLm1lYXN1cmVzLmluZGV4T2YoZmllbGRDb21wb25lbnQpXTtcbiAgICAgICAgICAgIGlmIChtZWFzdXJlVW5pdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1lYXN1cmVIZWFkaW5nID0gZmllbGRDb21wb25lbnQgKyAnICcgKyB0aGlzLnVuaXRGdW5jdGlvbihtZWFzdXJlVW5pdCk7XG4gICAgICAgICAgICAgICAgaGVhZGluZ1RleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobWVhc3VyZUhlYWRpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nVGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmaWVsZENvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhlYWRpbmdUZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpZWxkQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFJc1NvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgYXNjZW5kaW5nU29ydEJ0biA9IHRoaXMuY3JlYXRlU29ydEJ1dHRvbignYXNjZW5kaW5nLXNvcnQnKTtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGFzY2VuZGluZ1NvcnRCdG4pO1xuXG4gICAgICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2Rlc2NlbmRpbmctc29ydCcpO1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoZGVzY2VuZGluZ1NvcnRCdG4pO1xuXG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGhlYWRpbmdUZXh0Tm9kZSk7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChkZXNjZW5kaW5nU29ydEJ0bik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoaGVhZGluZ1RleHROb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tbWVhc3VyZXMgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIChjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGltZW5zaW9uLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuZGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5kaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgPSAnZGltZW5zaW9uLWhlYWRlciAnICsgdGhpcy5kaW1lbnNpb25zW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyICgpIHtcbiAgICAgICAgbGV0IGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAobWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnQgZGltZW5zaW9uIGhlYWRpbmdzXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlRGltZW5zaW9uSGVhZGluZ3ModGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHZlcnRpY2FsIGF4aXMgaGVhZGVyXG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKHRoaXMuY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyKCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IG1lYXN1cmUgaGVhZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTWVhc3VyZUhlYWRpbmdzKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHJvd3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICAvLyBGaW5kIHJvdyB3aXRoIG1heCBsZW5ndGggaW4gdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFB1c2ggYmxhbmsgcGFkZGluZyBjZWxscyB1bmRlciB0aGUgZGltZW5zaW9ucyBpbiB0aGUgc2FtZSByb3cgYXMgdGhlIGhvcml6b250YWwgYXhpc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUHVzaCBob3Jpem9udGFsIGF4ZXMgaW50byB0aGUgbGFzdCByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIGNhcHRpb24gY2VsbCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgdGFibGUudW5zaGlmdCh0aGlzLmNyZWF0ZUNhcHRpb24obWF4TGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGRhdGEgZm9yIGNyb3NzdGFiLiA6KFxuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zLnNsaWNlKDAsIHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW2RpbWVuc2lvbl07XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4oZGltZW5zaW9uLCB2YWx1ZS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT09IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgYXBwZW5kRHJhZ0hhbmRsZSAobm9kZSwgbnVtSGFuZGxlcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIGhhbmRsZVNwYW47XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1IYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLm1hcmdpbkxlZnQgPSAnMXB4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUuZm9udFNpemUgPSAnM3B4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubGluZUhlaWdodCA9ICcxJztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnO1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChoYW5kbGVTcGFuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVNvcnRCdXR0b24gKGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgc29ydEJ0bixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ3NvcnQtYnRuJyArICcgJyArIChjbGFzc05hbWUgfHwgJycpO1xuICAgICAgICBzb3J0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzb3J0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0ci50cmltKCkpO1xuICAgICAgICBzb3J0QnRuLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ2FzY2VuZGluZy1zb3J0Jykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRBc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc05hbWUgPT09ICdkZXNjZW5kaW5nLXNvcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERlc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc29ydEJ0bjtcbiAgICB9XG5cbiAgICBhcHBlbmRBc2NlbmRpbmdTdGVwcyAoYnRuLCBudW1TdGVwcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtYXJnaW5WYWx1ZSA9IDEsXG4gICAgICAgICAgICBkaXZXaWR0aCA9IDE7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbnVtU3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdzb3J0LXN0ZXBzIGFzY2VuZGluZyc7XG4gICAgICAgICAgICBkaXZXaWR0aCA9IGRpdldpZHRoICsgKChpIC8gZGl2V2lkdGgpICogMyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gKGRpdldpZHRoLnRvRml4ZWQoKSkgKyAncHgnO1xuICAgICAgICAgICAgaWYgKGkgPT09IChudW1TdGVwcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kRGVzY2VuZGluZ1N0ZXBzIChidG4sIG51bVN0ZXBzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1hcmdpblZhbHVlID0gMSxcbiAgICAgICAgICAgIGRpdldpZHRoID0gOTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBudW1TdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ3NvcnQtc3RlcHMgZGVzY2VuZGluZyc7XG4gICAgICAgICAgICBkaXZXaWR0aCA9IGRpdldpZHRoIC0gKChpIC8gZGl2V2lkdGgpICogNCk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gKGRpdldpZHRoLnRvRml4ZWQoKSkgKyAncHgnO1xuICAgICAgICAgICAgaWYgKGkgPT09IChudW1TdGVwcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICB5QXhpcztcblxuICAgICAgICAvLyBHZW5lcmF0ZSB0aGUgY3Jvc3N0YWIgYXJyYXlcbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuICAgICAgICAvLyBGaW5kIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bSBmb3IgdGhlIGF4ZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gdGhpcy5jcm9zc3RhYltpXVt0aGlzLmNyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBZIGF4aXMgY2hhcnRzIGluIHRoZSBjcm9zc3RhYiBhcnJheSB3aXRoIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldLFxuICAgICAgICAgICAgICAgIHJvd0F4aXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJiBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IHRoZSBjcm9zc3RhYiB3aXRoIG9ubHkgdGhlIGF4ZXMsIGNhcHRpb24gYW5kIGh0bWwgdGV4dC5cbiAgICAgICAgLy8gUmVxdWlyZWQgc2luY2UgYXhlcyBjYW5ub3QgcmV0dXJuIGxpbWl0cyB1bmxlc3MgdGhleSBhcmUgZHJhd25cbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIEZpbmQgYSBZIEF4aXMgY2hhcnRcbiAgICAgICAgeUF4aXMgPSB5QXhpcyB8fCB0aGlzLmZpbmRZQXhpc0NoYXJ0KCk7XG5cbiAgICAgICAgLy8gUGxhY2UgYSBjaGFydCBvYmplY3Qgd2l0aCBsaW1pdHMgZnJvbSB0aGUgWSBBeGlzIGluIHRoZSBjb3JyZWN0IGNlbGxcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoeUF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IHlBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2UgPSBjaGFydC5nZXRDaGFydEluc3RhbmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRJbnN0YW5jZS5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLCBtaW5MaW1pdCwgbWF4TGltaXQpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnRPYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIGNyb3NzdGFiXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBVcGRhdGUgY3Jvc3N0YWIgd2hlbiB0aGUgbW9kZWwgdXBkYXRlc1xuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKHRoaXMuZXZlbnRMaXN0Lm1vZGVsVXBkYXRlZCwgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IGhpZ2hsaWdodCBwbG90cyB3aGVuIGhvdmVyZWQgaW5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbCA9IGRhdGEuZGF0YVtjYXRlZ29yeV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodChjYXRlZ29yeVZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tIHBsb3RzIHdoZW4gaG92ZXJlZCBvdXRcbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3Zlcm91dCcsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcmVkQ3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqLFxuICAgICAgICAgICAgb2xkQ2hhcnRzID0gW10sXG4gICAgICAgICAgICBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGF4aXNMaW1pdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlICE9PSAnY2FwdGlvbicgJiYgY2hhcnRDb25mLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnRzLnB1c2goY2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwucm93SGFzaCAmJiBjZWxsLmNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZENoYXJ0ID0gdGhpcy5nZXRPbGRDaGFydChvbGRDaGFydHMsIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9sZENoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnQgPSBjaGFydE9ialsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0T2JqWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2hhcnQgPSBvbGRDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbWl0cykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1heCA9IGxpbWl0cy5tYXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1pbiA9IGxpbWl0cy5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwubWF4IHx8IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCBjZWxsLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gY2VsbC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSBjZWxsLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCAmJiBjZWxsLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gZmlsdGVyZWRDcm9zc3RhYjtcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KCk7XG4gICAgICAgIGF4aXNMaW1pdHMgPSB0aGlzLmdldFlBeGlzTGltaXRzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnY2FwdGlvbicgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLCBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMV0pWzFdO1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQudXBkYXRlKGNoYXJ0T2JqLmdldENvbmYoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFlBeGlzQ2hhcnQgKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRZQXhpc0xpbWl0cyAoKSB7XG4gICAgICAgIGxldCBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJyAmJiBjaGFydENvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2VsbC5jaGFydC5nZXRDaGFydEluc3RhbmNlKCkuZ2V0TGltaXRzKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0T2xkQ2hhcnQgKG9sZENoYXJ0cywgcm93SGFzaCwgY29sSGFzaCkge1xuICAgICAgICBmb3IgKHZhciBpID0gb2xkQ2hhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAob2xkQ2hhcnRzW2ldLnJvd0hhc2ggPT09IHJvd0hhc2ggJiYgb2xkQ2hhcnRzW2ldLmNvbEhhc2ggPT09IGNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2xkQ2hhcnRzW2ldLmNoYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ydENoYXJ0cyAoa2V5LCBvcmRlcikge1xuICAgICAgICBsZXQgc29ydFByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpLFxuICAgICAgICAgICAgc29ydEZuLFxuICAgICAgICAgICAgc29ydGVkRGF0YTtcbiAgICAgICAgaWYgKG9yZGVyID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IGFba2V5XSAtIGJba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmRlciA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gYltrZXldIC0gYVtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IDA7XG4gICAgICAgIH1cbiAgICAgICAgc29ydFByb2Nlc3Nvci5zb3J0KHNvcnRGbik7XG4gICAgICAgIHNvcnRlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXRDaGlsZE1vZGVsKHNvcnRQcm9jZXNzb3IpO1xuICAgICAgICB0aGlzLmNyb3NzdGFiLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIGxldCByb3dDYXRlZ29yaWVzO1xuICAgICAgICAgICAgcm93LmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gY2VsbC5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZiA9IGNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlICE9PSAnY2FwdGlvbicgJiYgY2hhcnRDb25mLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaihzb3J0ZWREYXRhLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQudXBkYXRlKGNoYXJ0T2JqWzFdLmdldENvbmYoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDYXRlZ29yaWVzID0gY2hhcnQuZ2V0Q29uZigpLmNhdGVnb3JpZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IGNlbGwuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYgPSBjaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc1R5cGUgPSBjaGFydENvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXNUeXBlID09PSAneCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mLmNvbmZpZy5jYXRlZ29yaWVzID0gcm93Q2F0ZWdvcmllcy5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mLmNvbmZpZy5jYXRlZ29yaWVzID0gcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQudXBkYXRlKGNoYXJ0Q29uZik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlTXVsdGlDaGFydCAoKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpY2hhcnRPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID0gdGhpcy5tYy5jcmVhdGVNYXRyaXgodGhpcy5jcm9zc3RhYkNvbnRhaW5lciwgdGhpcy5jcm9zc3RhYik7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QuZHJhdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZSh0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcih0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRhdGFJc1NvcnRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwU29ydEJ1dHRvbnModGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKGRhdGFTdG9yZSwgY2F0ZWdvcmllcywgcm93RmlsdGVyLCBjb2xGaWx0ZXIsIG1pbkxpbWl0LCBtYXhMaW1pdCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gW10sXG4gICAgICAgICAgICAvLyBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICAvLyBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxuICAgICAgICAgICAgLy8gYWRhcHRlciA9IHt9LFxuICAgICAgICAgICAgbGltaXRzID0ge30sXG4gICAgICAgICAgICBjaGFydCA9IHt9O1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGRhdGFTdG9yZS5nZXRDaGlsZE1vZGVsKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIGlmIChtaW5MaW1pdCAhPT0gdW5kZWZpbmVkICYmIG1heExpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LnlBeGlzTWF4VmFsdWUgPSBtYXhMaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFJc1NvcnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICAgICAgICAgIHNvcnRlZENhdGVnb3JpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZEpTT04uZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSB2YWxbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3J0ZWRDYXRlZ29yaWVzLmluZGV4T2YoY2F0ZWdvcnkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBzb3J0ZWRDYXRlZ29yaWVzLnNsaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGFydCA9IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2U6IGZpbHRlcmVkRGF0YSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgIG1lYXN1cmU6IFtjb2xGaWx0ZXJdLFxuICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsaW1pdHMgPSBjaGFydC5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIGNoYXJ0XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwU29ydEJ1dHRvbnMgKCkge1xuICAgICAgICBsZXQgYXNjZW5kaW5nQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FzY2VuZGluZy1zb3J0JyksXG4gICAgICAgICAgICBpaSA9IGFzY2VuZGluZ0J0bnMubGVuZ3RoLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGRlc2NlbmRpbmdCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVzY2VuZGluZy1zb3J0JyksXG4gICAgICAgICAgICBqaiA9IGFzY2VuZGluZ0J0bnMubGVuZ3RoLFxuICAgICAgICAgICAgaixcbiAgICAgICAgICAgIHNvcnRCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc29ydC1idG4nKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBhc2NlbmRpbmdCdG5zW2ldO1xuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjbGlja0VsZW0sXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc1N0cjtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1zdGVwcycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtZWFzdXJlTmFtZSA9IGNsaWNrRWxlbS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1tZWFzdXJlJyk7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgPSBjbGlja0VsZW0uY2xhc3NOYW1lICsgJyBhY3RpdmUnO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNvcnRCdG5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3Moc29ydEJ0bnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGlja0VsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzU3RyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNBcmVTb3J0ZWQuYm9vbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NMaXN0ID0gY2xpY2tFbGVtLmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVhc3VyZU5hbWUgPT09IHRoaXMuY2hhcnRzQXJlU29ydGVkLm1lYXN1cmUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5pbmRleE9mKHRoaXMuY2hhcnRzQXJlU29ydGVkLm9yZGVyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhjbGlja0VsZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKG1lYXN1cmVOYW1lLCAnYXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnYXNjZW5kaW5nLXNvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IG1lYXN1cmVOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKG1lYXN1cmVOYW1lLCAnYXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnYXNjZW5kaW5nLXNvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogbWVhc3VyZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBkZXNjZW5kaW5nQnRuc1tqXTtcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xpY2tFbGVtLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NTdHI7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtc3RlcHMnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUgPSBjbGlja0VsZW0ucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWVhc3VyZScpO1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyID0gY2xpY2tFbGVtLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzb3J0QnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKHNvcnRCdG5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xpY2tFbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0cik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzQXJlU29ydGVkLmJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzTGlzdCA9IGNsaWNrRWxlbS5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lYXN1cmVOYW1lID09PSB0aGlzLmNoYXJ0c0FyZVNvcnRlZC5tZWFzdXJlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QuaW5kZXhPZih0aGlzLmNoYXJ0c0FyZVNvcnRlZC5vcmRlcikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3MoY2xpY2tFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nLXNvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IG1lYXN1cmVOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKG1lYXN1cmVOYW1lLCAnZGVzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmctc29ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJlbW92ZUFjdGl2ZUNsYXNzIChlbGVtKSB7XG4gICAgICAgIGxldCBjbGFzc05tID0gZWxlbS5jbGFzc05hbWVcbiAgICAgICAgICAgIC5zcGxpdCgnICcpXG4gICAgICAgICAgICAuZmlsdGVyKCh2YWwpID0+IHZhbCAhPT0gJ2FjdGl2ZScpXG4gICAgICAgICAgICAuam9pbignICcpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc05tKTtcbiAgICB9XG5cbiAgICBhZGRBY3RpdmVDbGFzcyAoZWxlbSkge1xuICAgICAgICBsZXQgY2xhc3NObSA9IGVsZW0uY2xhc3NOYW1lXG4gICAgICAgICAgICAuc3BsaXQoJyAnKTtcbiAgICAgICAgY2xhc3NObS5wdXNoKCdhY3RpdmUnKTtcbiAgICAgICAgY2xhc3NObSA9IGNsYXNzTm0uam9pbignICcpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc05tKTtcbiAgICB9XG5cbiAgICBkcmFnTGlzdGVuZXIgKHBsYWNlSG9sZGVyKSB7XG4gICAgICAgIC8vIEdldHRpbmcgb25seSBsYWJlbHNcbiAgICAgICAgbGV0IG9yaWdDb25maWcgPSB0aGlzLnN0b3JlUGFyYW1zLmNvbmZpZyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBvcmlnQ29uZmlnLmRpbWVuc2lvbnMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlcyA9IG9yaWdDb25maWcubWVhc3VyZXMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlc0xlbmd0aCA9IG1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSAwLFxuICAgICAgICAgICAgZGltZW5zaW9uc0hvbGRlcixcbiAgICAgICAgICAgIG1lYXN1cmVzSG9sZGVyLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGxldCBlbmRcbiAgICAgICAgcGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlclsxXTtcbiAgICAgICAgLy8gT21pdHRpbmcgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgZGltZW5zaW9ucyA9IGRpbWVuc2lvbnMuc2xpY2UoMCwgZGltZW5zaW9ucy5sZW5ndGggLSAxKTtcbiAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IGRpbWVuc2lvbnMubGVuZ3RoO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIGRpbWVuc2lvbiBob2xkZXJcbiAgICAgICAgZGltZW5zaW9uc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKDAsIGRpbWVuc2lvbnNMZW5ndGgpO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIG1lYXN1cmVzIGhvbGRlclxuICAgICAgICAvLyBPbmUgc2hpZnQgZm9yIGJsYW5rIGJveFxuICAgICAgICBtZWFzdXJlc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKGRpbWVuc2lvbnNMZW5ndGggKyAxLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCArIG1lYXN1cmVzTGVuZ3RoICsgMSk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIoZGltZW5zaW9uc0hvbGRlciwgZGltZW5zaW9ucywgZGltZW5zaW9uc0xlbmd0aCwgdGhpcy5kaW1lbnNpb25zKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihtZWFzdXJlc0hvbGRlciwgbWVhc3VyZXMsIG1lYXN1cmVzTGVuZ3RoLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBMaXN0ZW5lciAoaG9sZGVyLCBhcnIsIGFyckxlbiwgZ2xvYmFsQXJyKSB7XG4gICAgICAgICAgICBsZXQgbGltaXRMZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gMCxcbiAgICAgICAgICAgICAgICBsYXN0ID0gYXJyTGVuIC0gMSxcbiAgICAgICAgICAgICAgICBsbiA9IE1hdGgubG9nMjtcblxuICAgICAgICAgICAgaWYgKGhvbGRlclswXSkge1xuICAgICAgICAgICAgICAgIGxpbWl0TGVmdCA9IHBhcnNlSW50KGhvbGRlclswXS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gcGFyc2VJbnQoaG9sZGVyW2xhc3RdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyckxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsID0gaG9sZGVyW2ldLmdyYXBoaWNzLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaG9sZGVyW2ldLFxuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXR1cERyYWcoaXRlbS5ncmFwaGljcywgZnVuY3Rpb24gZHJhZ1N0YXJ0IChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgZHggKyBpdGVtLmFkanVzdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0IDwgbGltaXRMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbGltaXRMZWZ0IC0gbkxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0TGVmdCAtIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA+IGxpbWl0UmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBuTGVmdCAtIGxpbWl0UmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0UmlnaHQgKyBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gbkxlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCBmYWxzZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgdHJ1ZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiBkcmFnRW5kICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5nZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gaXRlbS5vcmlnWjtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaiA8IGFyckxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsQXJyW2pdICE9PSBob2xkZXJbal0uY2VsbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQXJyW2pdID0gaG9sZGVyW2pdLmNlbGxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdsb2JhbERhdGEgPSBzZWxmLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWFuYWdlU2hpZnRpbmcgKGluZGV4LCBpc1JpZ2h0LCBob2xkZXIpIHtcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFtdLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gaG9sZGVyW2luZGV4XSxcbiAgICAgICAgICAgICAgICBuZXh0UG9zID0gaXNSaWdodCA/IGluZGV4ICsgMSA6IGluZGV4IC0gMSxcbiAgICAgICAgICAgICAgICBuZXh0SXRlbSA9IGhvbGRlcltuZXh0UG9zXTtcbiAgICAgICAgICAgIC8vIFNhdmluZyBkYXRhIGZvciBsYXRlciB1c2VcbiAgICAgICAgICAgIGlmIChuZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIWlzUmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpIDwgbmV4dEl0ZW0ucmVkWm9uZSkpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2sucG9wKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGlzUmlnaHQgJiYgcGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPiBuZXh0SXRlbS5vcmlnTGVmdCkpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFjay5wb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLnJlZFpvbmUpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLm9yaWdMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0ICs9IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCAtPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ub3JpZ0xlZnQgPSBkcmFnSXRlbS5vcmlnTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ucmVkWm9uZSA9IGRyYWdJdGVtLnJlZFpvbmU7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmluZGV4ID0gZHJhZ0l0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQgPSBuZXh0SXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goaG9sZGVyW25leHRQb3NdKTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW25leHRQb3NdID0gaG9sZGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW2luZGV4XSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldHRpbmcgbmV3IHZhbHVlcyBmb3IgZHJhZ2l0ZW1cbiAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5pbmRleCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLm9yaWdMZWZ0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ucmVkWm9uZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwRHJhZyAoZWwsIGhhbmRsZXIsIGhhbmRsZXIyKSB7XG4gICAgICAgIGxldCB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjdXN0b21IYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGUuY2xpZW50WCAtIHgsIGUuY2xpZW50WSAtIHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q2xhc3NTdHIgPSB0YXJnZXQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT09ICcnIHx8IHRhcmdldENsYXNzU3RyLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1idG4nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZXIyLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==