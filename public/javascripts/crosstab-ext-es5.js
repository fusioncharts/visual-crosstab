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

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var CrosstabExt = __webpack_require__(1),
	    data = __webpack_require__(2);
	
	var config = {
	    dimensions: ['Product', 'State', 'Month'],
	    measures: ['Sale', 'Profit', 'Visitors'],
	    chartType: 'bar2d',
	    noDataMessage: 'No data to display.',
	    crosstabContainer: 'crosstab-div',
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
	
	if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	    window.crosstab = new CrosstabExt(data, config);
	    window.crosstab.renderCrosstab();
	} else {
	    module.exports = CrosstabExt;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Represents a crosstab.
	 */
	var CrosstabExt = function () {
	    function CrosstabExt(data, config) {
	        _classCallCheck(this, CrosstabExt);
	
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
	                var filterConfig = {};
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
	
	
	    _createClass(CrosstabExt, [{
	        key: 'buildGlobalData',
	        value: function buildGlobalData() {
	            var dataStore = this.dataStore,
	                fields = dataStore.getKeys();
	            if (fields) {
	                var globalData = {};
	                for (var i = 0, ii = fields.length; i < ii; i++) {
	                    globalData[fields[i]] = dataStore.getUniqueValues(fields[i]);
	                }
	                return globalData;
	            } else {
	                throw new Error('Could not generate keys from data store');
	            }
	        }
	    }, {
	        key: 'createRow',
	        value: function createRow(table, data, rowOrder, currentIndex, filteredDataStore) {
	            var rowspan = 0,
	                fieldComponent = rowOrder[currentIndex],
	                fieldValues = data[fieldComponent],
	                i,
	                l = fieldValues.length,
	                rowElement,
	                hasFurtherDepth = currentIndex < rowOrder.length - 1,
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
	                var classStr = '';
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = fieldValues[i];
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = (this.cellHeight - 10) / 2 + 'px';
	                classStr += 'row-dimensions' + ' ' + this.dimensions[currentIndex].toLowerCase() + ' ' + fieldValues[i].toLowerCase() + ' no-select';
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
	                    rowElement.rowspan = this.createRow(table, data, rowOrder, currentIndex + 1, filteredDataHashKey);
	                } else {
	                    if (this.chartType === 'bar2d') {
	                        var categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
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
	                    for (var j = 0; j < colLength; j += 1) {
	                        var chartCellObj = {
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
	                        max = parseInt(minmaxObj.max) > max ? minmaxObj.max : max;
	                        min = parseInt(minmaxObj.min) < min ? minmaxObj.min : min;
	                        chartCellObj.max = max;
	                        chartCellObj.min = min;
	                    }
	                }
	                rowspan += rowElement.rowspan;
	            }
	            return rowspan;
	        }
	    }, {
	        key: 'createMeasureHeadings',
	        value: function createMeasureHeadings(table, data, measureOrder) {
	            var colspan = 0,
	                i,
	                l = this.measures.length,
	                colElement,
	                htmlRef,
	                headerDiv,
	                dragDiv;
	
	            for (i = 0; i < l; i += 1) {
	                var classStr = '',
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
	    }, {
	        key: 'createDimensionHeadings',
	        value: function createDimensionHeadings(colOrderLength) {
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
	    }, {
	        key: 'createVerticalAxisHeader',
	        value: function createVerticalAxisHeader() {
	            var htmlRef = document.createElement('p');
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
	    }, {
	        key: 'createCaption',
	        value: function createCaption(maxLength) {
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
	    }, {
	        key: 'createCrosstab',
	        value: function createCrosstab() {
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
	                    maxLength = maxLength < table[i].length ? table[i].length : maxLength;
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
	                    var categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
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
	    }, {
	        key: 'createFilters',
	        value: function createFilters() {
	            var _this = this;
	
	            var filters = [],
	                dimensions = this.dimensions.slice(0, this.dimensions.length - 1),
	                matchedValues = void 0;
	
	            dimensions.forEach(function (dimension) {
	                matchedValues = _this.globalData[dimension];
	                matchedValues.forEach(function (value) {
	                    filters.push({
	                        filter: _this.filterGen(dimension, value.toString()),
	                        filterVal: value
	                    });
	                });
	            });
	
	            return filters;
	        }
	    }, {
	        key: 'createDataCombos',
	        value: function createDataCombos() {
	            var r = [],
	                globalArray = this.makeGlobalArray(),
	                max = globalArray.length - 1;
	
	            function recurse(arr, i) {
	                for (var j = 0, l = globalArray[i].length; j < l; j++) {
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
	    }, {
	        key: 'makeGlobalArray',
	        value: function makeGlobalArray() {
	            var tempObj = {},
	                tempArr = [];
	
	            for (var key in this.globalData) {
	                if (this.globalData.hasOwnProperty(key) && this.dimensions.indexOf(key) !== -1 && key !== this.dimensions[this.dimensions.length - 1]) {
	                    tempObj[key] = this.globalData[key];
	                }
	            }
	            tempArr = Object.keys(tempObj).map(function (key) {
	                return tempObj[key];
	            });
	            return tempArr;
	        }
	    }, {
	        key: 'getFilterHashMap',
	        value: function getFilterHashMap() {
	            var filters = this.createFilters(),
	                dataCombos = this.createDataCombos(),
	                hashMap = {};
	
	            for (var i = 0, l = dataCombos.length; i < l; i++) {
	                var dataCombo = dataCombos[i],
	                    key = '',
	                    value = [];
	
	                for (var j = 0, len = dataCombo.length; j < len; j++) {
	                    for (var k = 0, length = filters.length; k < length; k++) {
	                        var filterVal = filters[k].filterVal;
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
	    }, {
	        key: 'appendDragHandle',
	        value: function appendDragHandle(node, numHandles) {
	            var i = void 0,
	                handleSpan = void 0;
	            for (i = 0; i < numHandles; i++) {
	                handleSpan = document.createElement('span');
	                handleSpan.style.marginLeft = '1px';
	                handleSpan.style.fontSize = '3px';
	                handleSpan.style.lineHeight = '1';
	                handleSpan.style.verticalAlign = 'top';
	                node.appendChild(handleSpan);
	            }
	        }
	    }, {
	        key: 'renderCrosstab',
	        value: function renderCrosstab() {
	            var _this2 = this;
	
	            var globalMax = -Infinity,
	                globalMin = Infinity,
	                yAxis = void 0;
	
	            // Generate the crosstab array
	            this.crosstab = this.createCrosstab();
	
	            // Find the global maximum and minimum for the axes
	            for (var i = 0, ii = this.crosstab.length; i < ii; i++) {
	                var rowLastChart = this.crosstab[i][this.crosstab[i].length - 1];
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
	            for (var _i = 0, _ii = this.crosstab.length; _i < _ii; _i++) {
	                var row = this.crosstab[_i],
	                    rowAxis = void 0;
	                for (var j = 0, jj = row.length; j < jj; j++) {
	                    var crosstabElement = row[j];
	                    if (crosstabElement.chart && crosstabElement.chart.conf.type === 'axis') {
	                        rowAxis = crosstabElement;
	                        if (rowAxis.chart.conf.config.chart.axisType === 'y') {
	                            var axisChart = rowAxis.chart,
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
	            for (var _i2 = 0, _ii2 = this.crosstab.length; _i2 < _ii2; _i2++) {
	                var _row = this.crosstab[_i2];
	                for (var _j = 0, _jj = _row.length; _j < _jj; _j++) {
	                    var _crosstabElement = _row[_j];
	                    if (yAxis) {
	                        if (!_crosstabElement.hasOwnProperty('html') && !_crosstabElement.hasOwnProperty('chart') && _crosstabElement.className !== 'blank-cell' && _crosstabElement.className !== 'axis-footer-cell') {
	                            var chart = yAxis.chart,
	                                chartInstance = chart.getChartInstance(),
	                                limits = chartInstance.getLimits(),
	                                minLimit = limits[0],
	                                maxLimit = limits[1],
	                                chartObj = this.getChartObj(_crosstabElement.rowHash, _crosstabElement.colHash, minLimit, maxLimit)[1];
	                            _crosstabElement.chart = chartObj;
	                        }
	                    }
	                }
	            }
	
	            // Update the crosstab
	            this.createMultiChart(this.crosstab);
	
	            // Update crosstab when the model updates
	            this.dataStore.addEventListener(this.eventList.modelUpdated, function (e, d) {
	                _this2.globalData = _this2.buildGlobalData();
	                _this2.updateCrosstab();
	            });
	
	            // Attach event listeners to concurrently highlight plots when hovered in
	            this.mc.addEventListener('hoverin', function (evt, data) {
	                if (data.data) {
	                    for (var _i3 = 0, _ii3 = _this2.crosstab.length; _i3 < _ii3; _i3++) {
	                        var _row2 = _this2.crosstab[_i3];
	                        for (var j = 0; j < _row2.length; j++) {
	                            if (_row2[j].chart) {
	                                if (!(_row2[j].chart.conf.type === 'caption' || _row2[j].chart.conf.type === 'axis')) {
	                                    var cellAdapter = _row2[j].chart,
	                                        category = _this2.dimensions[_this2.dimensions.length - 1],
	                                        categoryVal = data.data[category];
	                                    cellAdapter.highlight(categoryVal);
	                                }
	                            }
	                        }
	                    }
	                }
	            });
	
	            // Attach event listeners to concurrently remove highlights from plots when hovered out
	            this.mc.addEventListener('hoverout', function (evt, data) {
	                for (var _i4 = 0, _ii4 = _this2.crosstab.length; _i4 < _ii4; _i4++) {
	                    var _row3 = _this2.crosstab[_i4];
	                    for (var j = 0; j < _row3.length; j++) {
	                        if (_row3[j].chart) {
	                            if (!(_row3[j].chart.conf.type === 'caption' || _row3[j].chart.conf.type === 'axis')) {
	                                var cellAdapter = _row3[j].chart;
	                                cellAdapter.highlight();
	                            }
	                        }
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'updateCrosstab',
	        value: function updateCrosstab() {
	            var filteredCrosstab = this.createCrosstab(),
	                i = void 0,
	                ii = void 0,
	                j = void 0,
	                jj = void 0,
	                oldCharts = [],
	                globalMax = -Infinity,
	                globalMin = Infinity,
	                axisLimits = [];
	            for (i = 0, ii = this.crosstab.length; i < ii; i++) {
	                var row = this.crosstab[i];
	                for (j = 0, jj = row.length; j < jj; j++) {
	                    var cell = row[j];
	                    if (cell.chart) {
	                        var chartConf = cell.chart.getConf();
	                        if (chartConf.type !== 'caption' && chartConf.type !== 'axis') {
	                            oldCharts.push(cell);
	                        }
	                    }
	                }
	            }
	
	            for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	                var _row4 = filteredCrosstab[i];
	                for (j = 0, jj = _row4.length; j < jj; j++) {
	                    var _cell = _row4[j];
	                    if (_cell.rowHash && _cell.colHash) {
	                        var oldChart = this.getOldChart(oldCharts, _cell.rowHash, _cell.colHash),
	                            limits = {};
	                        if (!oldChart) {
	                            var chartObj = this.getChartObj(_cell.rowHash, _cell.colHash);
	                            oldChart = chartObj[1];
	                            limits = chartObj[0];
	                        }
	                        _cell.chart = oldChart;
	                        if (Object.keys(limits).length !== 0) {
	                            _cell.max = limits.max;
	                            _cell.min = limits.min;
	                        }
	                    }
	                }
	            }
	
	            for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	                var _row5 = filteredCrosstab[i];
	                for (j = 0, jj = _row5.length; j < jj; j++) {
	                    var _cell2 = _row5[j];
	                    if (_cell2.max || _cell2.min) {
	                        if (globalMax < _cell2.max) {
	                            globalMax = _cell2.max;
	                        }
	                        if (globalMin > _cell2.min) {
	                            globalMin = _cell2.min;
	                        }
	                    }
	                }
	            }
	
	            for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	                var _row6 = filteredCrosstab[i];
	                for (j = 0, jj = _row6.length; j < jj; j++) {
	                    var _cell3 = _row6[j];
	                    if (_cell3.chart && _cell3.chart.conf.type === 'axis') {
	                        var rowAxis = _cell3;
	                        if (rowAxis.chart.conf.config.chart.axisType === 'y') {
	                            var axisChart = rowAxis.chart,
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
	
	            for (var _i5 = 0, _ii5 = this.crosstab.length; _i5 < _ii5; _i5++) {
	                var _row7 = this.crosstab[_i5];
	                for (var _j2 = 0, _jj2 = _row7.length; _j2 < _jj2; _j2++) {
	                    var crosstabElement = _row7[_j2];
	                    if (!crosstabElement.hasOwnProperty('html') && crosstabElement.className !== 'blank-cell' && crosstabElement.className !== 'axis-footer-cell' && crosstabElement.chart.getConf().type !== 'caption' && crosstabElement.chart.getConf().type !== 'axis') {
	                        var _chartObj = this.getChartObj(crosstabElement.rowHash, crosstabElement.colHash, axisLimits[0], axisLimits[1])[1];
	                        crosstabElement.chart.update(_chartObj.getConf());
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'findYAxisChart',
	        value: function findYAxisChart() {
	            for (var i = 0, ii = this.crosstab.length; i < ii; i++) {
	                var row = this.crosstab[i];
	                for (var j = 0, jj = row.length; j < jj; j++) {
	                    var crosstabElement = row[j];
	                    if (crosstabElement.chart && crosstabElement.chart.conf.config.chart.axisType === 'y') {
	                        return crosstabElement;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'getYAxisLimits',
	        value: function getYAxisLimits() {
	            var i = void 0,
	                ii = void 0,
	                j = void 0,
	                jj = void 0;
	            for (i = 0, ii = this.crosstab.length; i < ii; i++) {
	                var row = this.crosstab[i];
	                for (j = 0, jj = row.length; j < jj; j++) {
	                    var cell = row[j];
	                    if (cell.chart) {
	                        var chartConf = cell.chart.getConf();
	                        if (chartConf.type === 'axis' && chartConf.config.chart.axisType === 'y') {
	                            return cell.chart.getChartInstance().getLimits();
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'getOldChart',
	        value: function getOldChart(oldCharts, rowHash, colHash) {
	            for (var i = oldCharts.length - 1; i >= 0; i--) {
	                if (oldCharts[i].rowHash === rowHash && oldCharts[i].colHash === colHash) {
	                    return oldCharts[i].chart;
	                }
	            }
	        }
	    }, {
	        key: 'createMultiChart',
	        value: function createMultiChart() {
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
	    }, {
	        key: 'permuteArr',
	        value: function permuteArr(arr) {
	            var results = [];
	            function permute(arr, mem) {
	                var current = void 0;
	                mem = mem || [];
	
	                for (var i = 0, ii = arr.length; i < ii; i++) {
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
	    }, {
	        key: 'matchHash',
	        value: function matchHash(filterStr, hash) {
	            for (var key in hash) {
	                if (hash.hasOwnProperty(key)) {
	                    var keys = key.split('|'),
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
	    }, {
	        key: 'getChartObj',
	        value: function getChartObj(rowFilter, colFilter, minLimit, maxLimit) {
	            var filters = [],
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
	            filters = rowFilters.filter(function (a) {
	                return a !== '';
	            });
	            filterStr = filters.join('|');
	            matchedHashes = this.hash[this.matchHash(filterStr, this.hash)];
	            if (matchedHashes) {
	                for (var i = 0, ii = matchedHashes.length; i < ii; i++) {
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
	    }, {
	        key: 'dragListener',
	        value: function dragListener(placeHolder) {
	            // Getting only labels
	            var origConfig = this.storeParams.config,
	                dimensions = origConfig.dimensions || [],
	                measures = origConfig.measures || [],
	                measuresLength = measures.length,
	                dimensionsLength = 0,
	                dimensionsHolder = void 0,
	                measuresHolder = void 0,
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
	            measuresHolder = placeHolder.slice(dimensionsLength + 1, dimensionsLength + measuresLength + 1);
	            setupListener(dimensionsHolder, dimensions, dimensionsLength, this.dimensions);
	            setupListener(measuresHolder, measures, measuresLength, this.measures);
	            function setupListener(holder, arr, arrLen, globalArr) {
	                var limitLeft = 0,
	                    limitRight = 0,
	                    last = arrLen - 1,
	                    ln = Math.log2;
	
	                if (holder[0]) {
	                    limitLeft = parseInt(holder[0].graphics.style.left);
	                    limitRight = parseInt(holder[last].graphics.style.left);
	                }
	
	                var _loop = function _loop(i) {
	                    var el = holder[i].graphics,
	                        item = holder[i],
	                        nLeft = 0,
	                        diff = 0;
	                    item.cellValue = arr[i];
	                    item.origLeft = parseInt(el.style.left);
	                    item.redZone = item.origLeft + parseInt(el.style.width) / 2;
	                    item.index = i;
	                    item.adjust = 0;
	                    item.origZ = el.style.zIndex;
	                    self._setupDrag(item.graphics, function dragStart(dx, dy) {
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
	                    }, function dragEnd() {
	                        var change = false,
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
	                };
	
	                for (var i = 0; i < arrLen; ++i) {
	                    _loop(i);
	                }
	            }
	
	            function manageShifting(index, isRight, holder) {
	                var stack = [],
	                    dragItem = holder[index],
	                    nextPos = isRight ? index + 1 : index - 1,
	                    nextItem = holder[nextPos];
	                // Saving data for later use
	                if (nextItem) {
	                    stack.push(!isRight && parseInt(dragItem.graphics.style.left) < nextItem.redZone);
	                    stack.push(stack.pop() || isRight && parseInt(dragItem.graphics.style.left) > nextItem.origLeft);
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
	    }, {
	        key: '_setupDrag',
	        value: function _setupDrag(el, handler, handler2) {
	            var x = 0,
	                y = 0;
	            function customHandler(e) {
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
	            function mouseUpHandler(e) {
	                el.style.opacity = 1;
	                el.classList.remove('dragging');
	                window.document.removeEventListener('mousemove', customHandler);
	                window.document.removeEventListener('mouseup', mouseUpHandler);
	                window.setTimeout(handler2, 10);
	            }
	        }
	    }, {
	        key: 'filterGen',
	        value: function filterGen(key, val) {
	            return function (data) {
	                return data[key] === val;
	            };
	        }
	    }]);
	
	    return CrosstabExt;
	}();
	
	module.exports = CrosstabExt;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = [{
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 2,
	    'Profit': 12,
	    'Visitors': 6
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 8,
	    'Profit': 1,
	    'Visitors': 12
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 7,
	    'Profit': 3,
	    'Visitors': 18
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 11,
	    'Visitors': 17
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 8,
	    'Profit': 6,
	    'Visitors': 14
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 1,
	    'Profit': 11,
	    'Visitors': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 9,
	    'Profit': 14,
	    'Visitors': 13
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 5,
	    'Profit': 10,
	    'Visitors': 16
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 6,
	    'Profit': 3,
	    'Visitors': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 6,
	    'Profit': 7,
	    'Visitors': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 2,
	    'Profit': 14,
	    'Visitors': 16
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 1,
	    'Profit': 2,
	    'Visitors': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 3,
	    'Profit': 1,
	    'Visitors': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 8,
	    'Profit': 5,
	    'Visitors': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 8,
	    'Profit': 12,
	    'Visitors': 14
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 6,
	    'Profit': 13,
	    'Visitors': 15
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 3,
	    'Profit': 1,
	    'Visitors': 7
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4,
	    'Profit': 6,
	    'Visitors': 0
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10,
	    'Profit': 4,
	    'Visitors': 10
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 8,
	    'Profit': 0,
	    'Visitors': 17
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 9,
	    'Profit': 9,
	    'Visitors': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 9,
	    'Profit': 8,
	    'Visitors': 19
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 9,
	    'Profit': 5,
	    'Visitors': 17
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 5,
	    'Profit': 0,
	    'Visitors': 18
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 8,
	    'Profit': 3,
	    'Visitors': 15
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 5,
	    'Profit': 6,
	    'Visitors': 18
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 1,
	    'Profit': 9,
	    'Visitors': 16
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 5,
	    'Profit': 4,
	    'Visitors': 17
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 10,
	    'Profit': 11,
	    'Visitors': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 5,
	    'Visitors': 15
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5,
	    'Profit': 14,
	    'Visitors': 4
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 5,
	    'Visitors': 12
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 3,
	    'Profit': 7,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 2,
	    'Profit': 5,
	    'Visitors': 12
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10,
	    'Profit': 8,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 14,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 2,
	    'Profit': 0,
	    'Visitors': 14
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 3,
	    'Profit': 1,
	    'Visitors': 12
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5,
	    'Profit': 8,
	    'Visitors': 14
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 1,
	    'Profit': 12,
	    'Visitors': 11
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 5,
	    'Profit': 2,
	    'Visitors': 17
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 10,
	    'Profit': 11,
	    'Visitors': 0
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 7,
	    'Profit': 14,
	    'Visitors': 18
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 4,
	    'Profit': 10,
	    'Visitors': 8
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 1,
	    'Profit': 12,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 9,
	    'Profit': 4,
	    'Visitors': 15
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 7,
	    'Profit': 9,
	    'Visitors': 2
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 4,
	    'Profit': 0,
	    'Visitors': 12
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 6,
	    'Profit': 6,
	    'Visitors': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4,
	    'Profit': 5,
	    'Visitors': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 9,
	    'Profit': 3,
	    'Visitors': 18
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 6,
	    'Profit': 10,
	    'Visitors': 0
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 7,
	    'Profit': 4,
	    'Visitors': 13
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 2,
	    'Profit': 13,
	    'Visitors': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5,
	    'Profit': 14,
	    'Visitors': 1
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 11,
	    'Visitors': 11
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 4,
	    'Profit': 1,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4,
	    'Profit': 8,
	    'Visitors': 19
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10,
	    'Profit': 6,
	    'Visitors': 2
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 0,
	    'Visitors': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 8,
	    'Profit': 9,
	    'Visitors': 17
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 6,
	    'Profit': 5,
	    'Visitors': 18
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 10,
	    'Profit': 9,
	    'Visitors': 14
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7,
	    'Profit': 7,
	    'Visitors': 16
	}];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODI1ZDMyYTE1NDNmYjdjMjY0ZTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwiY3Jvc3N0YWJDb250YWluZXIiLCJjZWxsV2lkdGgiLCJjZWxsSGVpZ2h0IiwiZHJhZ2dhYmxlSGVhZGVycyIsImNoYXJ0Q29uZmlnIiwiY2hhcnQiLCJ3aW5kb3ciLCJjcm9zc3RhYiIsInJlbmRlckNyb3NzdGFiIiwibW9kdWxlIiwiZXhwb3J0cyIsImV2ZW50TGlzdCIsInN0b3JlUGFyYW1zIiwiX2NvbHVtbktleUFyciIsInNob3dGaWx0ZXIiLCJhZ2dyZWdhdGlvbiIsIk11bHRpQ2hhcnRpbmciLCJtYyIsImRhdGFTdG9yZSIsImNyZWF0ZURhdGFTdG9yZSIsInNldERhdGEiLCJkYXRhU291cmNlIiwiRXJyb3IiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiZmllbGRzIiwiZ2V0S2V5cyIsImkiLCJpaSIsImxlbmd0aCIsImdldFVuaXF1ZVZhbHVlcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwicHVzaCIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsImNyZWF0ZVJvdyIsImNhdGVnb3JpZXMiLCJjaGFydFRvcE1hcmdpbiIsImNoYXJ0Qm90dG9tTWFyZ2luIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJoZWFkZXJEaXYiLCJkcmFnRGl2Iiwic2V0QXR0cmlidXRlIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJhcHBlbmREcmFnSGFuZGxlIiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJtYXhMZW5ndGgiLCJvYmoiLCJmaWx0ZXIiLCJ2YWwiLCJhcnIiLCJjb2xPcmRlciIsInhBeGlzUm93IiwiY3JlYXRlRGltZW5zaW9uSGVhZGluZ3MiLCJjcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIiLCJjcmVhdGVNZWFzdXJlSGVhZGluZ3MiLCJjaGFydExlZnRNYXJnaW4iLCJjaGFydFJpZ2h0TWFyZ2luIiwidW5zaGlmdCIsImNyZWF0ZUNhcHRpb24iLCJmaWx0ZXJzIiwic2xpY2UiLCJtYXRjaGVkVmFsdWVzIiwiZm9yRWFjaCIsImRpbWVuc2lvbiIsImZpbHRlckdlbiIsInZhbHVlIiwidG9TdHJpbmciLCJmaWx0ZXJWYWwiLCJyIiwiZ2xvYmFsQXJyYXkiLCJtYWtlR2xvYmFsQXJyYXkiLCJyZWN1cnNlIiwiYSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJpbmRleE9mIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImNyZWF0ZUZpbHRlcnMiLCJkYXRhQ29tYm9zIiwiY3JlYXRlRGF0YUNvbWJvcyIsImhhc2hNYXAiLCJkYXRhQ29tYm8iLCJsZW4iLCJrIiwibm9kZSIsIm51bUhhbmRsZXMiLCJoYW5kbGVTcGFuIiwibWFyZ2luTGVmdCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsInZlcnRpY2FsQWxpZ24iLCJnbG9iYWxNYXgiLCJnbG9iYWxNaW4iLCJ5QXhpcyIsImNyZWF0ZUNyb3NzdGFiIiwicm93TGFzdENoYXJ0Iiwicm93Iiwicm93QXhpcyIsImpqIiwiY3Jvc3N0YWJFbGVtZW50IiwiY29uZiIsInR5cGUiLCJheGlzVHlwZSIsImF4aXNDaGFydCIsImNyZWF0ZU11bHRpQ2hhcnQiLCJmaW5kWUF4aXNDaGFydCIsImNoYXJ0SW5zdGFuY2UiLCJnZXRDaGFydEluc3RhbmNlIiwibGltaXRzIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsImNoYXJ0T2JqIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vZGVsVXBkYXRlZCIsImUiLCJkIiwidXBkYXRlQ3Jvc3N0YWIiLCJldnQiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJmaWx0ZXJlZENyb3NzdGFiIiwib2xkQ2hhcnRzIiwiYXhpc0xpbWl0cyIsImNlbGwiLCJjaGFydENvbmYiLCJnZXRDb25mIiwib2xkQ2hhcnQiLCJnZXRPbGRDaGFydCIsImdldFlBeGlzTGltaXRzIiwidXBkYXRlIiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsInNwbGljZSIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsInNwbGl0Iiwia2V5UGVybXV0YXRpb25zIiwicGVybXV0ZUFyciIsInJvd0ZpbHRlciIsImNvbEZpbHRlciIsInJvd0ZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0Q2hpbGRNb2RlbCIsInlBeGlzTWluVmFsdWUiLCJ5QXhpc01heFZhbHVlIiwibWVhc3VyZSIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZ2V0TGltaXQiLCJvcmlnQ29uZmlnIiwibWVhc3VyZXNMZW5ndGgiLCJkaW1lbnNpb25zTGVuZ3RoIiwiZGltZW5zaW9uc0hvbGRlciIsIm1lYXN1cmVzSG9sZGVyIiwic2VsZiIsInNldHVwTGlzdGVuZXIiLCJob2xkZXIiLCJhcnJMZW4iLCJnbG9iYWxBcnIiLCJsaW1pdExlZnQiLCJsaW1pdFJpZ2h0IiwibGFzdCIsImxuIiwiTWF0aCIsImxvZzIiLCJncmFwaGljcyIsImxlZnQiLCJlbCIsIml0ZW0iLCJuTGVmdCIsImRpZmYiLCJjZWxsVmFsdWUiLCJvcmlnTGVmdCIsInJlZFpvbmUiLCJpbmRleCIsImFkanVzdCIsIm9yaWdaIiwiekluZGV4IiwiX3NldHVwRHJhZyIsImRyYWdTdGFydCIsImR4IiwiZHkiLCJtYW5hZ2VTaGlmdGluZyIsImRyYWdFbmQiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiaXNSaWdodCIsInN0YWNrIiwiZHJhZ0l0ZW0iLCJuZXh0UG9zIiwibmV4dEl0ZW0iLCJwb3AiLCJoYW5kbGVyIiwiaGFuZGxlcjIiLCJ4IiwieSIsImN1c3RvbUhhbmRsZXIiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9wYWNpdHkiLCJjbGFzc0xpc3QiLCJhZGQiLCJtb3VzZVVwSGFuZGxlciIsInJlbW92ZSIsInJlbW92ZUV2ZW50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QVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4MjVkMzJhMTU0M2ZiN2MyNjRlNyIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnUHJvZml0JywgJ1Zpc2l0b3JzJ10sXG4gICAgY2hhcnRUeXBlOiAnYmFyMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgY2VsbFdpZHRoOiAxNTAsXG4gICAgY2VsbEhlaWdodDogODAsXG4gICAgLy8gc2hvd0ZpbHRlcjogdHJ1ZSxcbiAgICBkcmFnZ2FibGVIZWFkZXJzOiB0cnVlLFxuICAgIC8vIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ3JvbGxPdmVyQmFuZENvbG9yJzogJyNiYWRhZjAnLFxuICAgICAgICAgICAgJ2NvbHVtbkhvdmVyQ29sb3InOiAnIzFiODNjYycsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNycsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyM1QjVCNUInLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlclRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIC8vIExpc3Qgb2YgcG9zc2libGUgZXZlbnRzIHJhaXNlZCBieSB0aGUgZGF0YSBzdG9yZS5cbiAgICAgICAgdGhpcy5ldmVudExpc3QgPSB7XG4gICAgICAgICAgICAnbW9kZWxVcGRhdGVkJzogJ21vZGVsdXBkYXRlZCcsXG4gICAgICAgICAgICAnbW9kZWxEZWxldGVkJzogJ21vZGVsZGVsZXRlZCcsXG4gICAgICAgICAgICAnbWV0YUluZm9VcGRhdGUnOiAnbWV0YWluZm91cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JVcGRhdGVkJzogJ3Byb2Nlc3NvcnVwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvckRlbGV0ZWQnOiAncHJvY2Vzc29yZGVsZXRlZCdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gUG90ZW50aWFsbHkgdW5uZWNlc3NhcnkgbWVtYmVyLlxuICAgICAgICAvLyBUT0RPOiBSZWZhY3RvciBjb2RlIGRlcGVuZGVudCBvbiB2YXJpYWJsZS5cbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHZhcmlhYmxlLlxuICAgICAgICB0aGlzLnN0b3JlUGFyYW1zID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIC8vIEFycmF5IG9mIGNvbHVtbiBuYW1lcyAobWVhc3VyZXMpIHVzZWQgd2hlbiBidWlsZGluZyB0aGUgY3Jvc3N0YWIgYXJyYXkuXG4gICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICAvLyBTYXZpbmcgcHJvdmlkZWQgY29uZmlndXJhdGlvbiBpbnRvIGluc3RhbmNlLlxuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuc2hvd0ZpbHRlciA9IGNvbmZpZy5zaG93RmlsdGVyIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uIHx8ICdzdW0nO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZUhlYWRlcnMgPSBjb25maWcuZHJhZ2dhYmxlSGVhZGVycyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2UgfHwgJ05vIGRhdGEgdG8gZGlzcGxheS4nO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgLy8gQ3JlYXRpbmcgYW4gZW1wdHkgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgLy8gQWRkaW5nIGRhdGEgdG8gdGhlIGRhdGEgc3RvcmVcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpQ2hhcnRuZyBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YUZpbHRlciBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgZGF0YSBzdHJ1Y3R1cmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgLy8gQnVpbGRpbmcgYSBoYXNoIG1hcCBvZiBhcHBsaWNhYmxlIGZpbHRlcnMgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYW4gYXJyYXkgb2YgYXJyYXlzIGRhdGEgc3RydWN0dXJlIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgYXJyYXlzIGdlbmVyYXRlZCBmcm9tIHRoZSBkYXRhU3RvcmUncyBhcnJheSBvZiBvYmplY3RzXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgbGV0IGRhdGFTdG9yZSA9IHRoaXMuZGF0YVN0b3JlLFxuICAgICAgICAgICAgZmllbGRzID0gZGF0YVN0b3JlLmdldEtleXMoKTtcbiAgICAgICAgaWYgKGZpZWxkcykge1xuICAgICAgICAgICAgbGV0IGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZW5lcmF0ZSBrZXlzIGZyb20gZGF0YSBzdG9yZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuX2NvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuX2NvbHVtbktleUFycltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjaGFydC1jZWxsICcgKyAoaiArIDEpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjb2xMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmouY2xhc3NOYW1lID0gJ2NoYXJ0LWNlbGwgbGFzdC1jb2wnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlTWVhc3VyZUhlYWRpbmdzICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgLy8gaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLW1lYXN1cmVzICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyci5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICAgICAgdGFibGVbMF0ucHVzaChjb2xFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyAoY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICBoZWFkZXJEaXYsXG4gICAgICAgICAgICBkcmFnRGl2O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2RpbWVuc2lvbi1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ2RpbWVuc2lvbi1oZWFkZXIgJyArIHRoaXMuZGltZW5zaW9uc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyICs9ICcgZHJhZ2dhYmxlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZGltZW5zaW9uc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciAoKSB7XG4gICAgICAgIGxldCBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWhlYWRlci1jZWxsJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNyZWF0ZUNhcHRpb24gKG1heExlbmd0aCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2FwdGlvbi1jaGFydCcsXG4gICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29sT3JkZXIgPSB0aGlzLm1lYXN1cmVzLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgLy8gSW5zZXJ0IGRpbWVuc2lvbiBoZWFkaW5nc1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCB2ZXJ0aWNhbCBheGlzIGhlYWRlclxuICAgICAgICAgICAgdGFibGVbMF0ucHVzaCh0aGlzLmNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlcigpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCBtZWFzdXJlIGhlYWRpbmdzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU1lYXN1cmVIZWFkaW5ncyh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIC8vIEluc2VydCByb3dzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgLy8gRmluZCByb3cgd2l0aCBtYXggbGVuZ3RoIGluIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQdXNoIGJsYW5rIHBhZGRpbmcgY2VsbHMgdW5kZXIgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIHNhbWUgcm93IGFzIHRoZSBob3Jpem9udGFsIGF4aXNcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4dHJhIGNlbGwgZm9yIHkgYXhpcy4gRXNzZW50aWFsbHkgWSBheGlzIGZvb3Rlci5cbiAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWZvb3Rlci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFB1c2ggaG9yaXpvbnRhbCBheGVzIGludG8gdGhlIGxhc3Qgcm93IG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgY2FwdGlvbiBjZWxsIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICB0YWJsZS51bnNoaWZ0KHRoaXMuY3JlYXRlQ2FwdGlvbihtYXhMZW5ndGgpKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm8gZGF0YSBmb3IgY3Jvc3N0YWIuIDooXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnMuc2xpY2UoMCwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBkaW1lbnNpb25zLmZvckVhY2goZGltZW5zaW9uID0+IHtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbZGltZW5zaW9uXTtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbihkaW1lbnNpb24sIHZhbHVlLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZihrZXkpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgIGtleSAhPT0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBhcHBlbmREcmFnSGFuZGxlIChub2RlLCBudW1IYW5kbGVzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgaGFuZGxlU3BhbjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bUhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubWFyZ2luTGVmdCA9ICcxcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5mb250U2l6ZSA9ICczcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ3RvcCc7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGhhbmRsZVNwYW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICB5QXhpcztcblxuICAgICAgICAvLyBHZW5lcmF0ZSB0aGUgY3Jvc3N0YWIgYXJyYXlcbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuICAgICAgICAvLyBGaW5kIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bSBmb3IgdGhlIGF4ZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gdGhpcy5jcm9zc3RhYltpXVt0aGlzLmNyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBZIGF4aXMgY2hhcnRzIGluIHRoZSBjcm9zc3RhYiBhcnJheSB3aXRoIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldLFxuICAgICAgICAgICAgICAgIHJvd0F4aXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJiBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IHRoZSBjcm9zc3RhYiB3aXRoIG9ubHkgdGhlIGF4ZXMsIGNhcHRpb24gYW5kIGh0bWwgdGV4dC5cbiAgICAgICAgLy8gUmVxdWlyZWQgc2luY2UgYXhlcyBjYW5ub3QgcmV0dXJuIGxpbWl0cyB1bmxlc3MgdGhleSBhcmUgZHJhd25cbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIEZpbmQgYSBZIEF4aXMgY2hhcnRcbiAgICAgICAgeUF4aXMgPSB5QXhpcyB8fCB0aGlzLmZpbmRZQXhpc0NoYXJ0KCk7XG5cbiAgICAgICAgLy8gUGxhY2UgYSBjaGFydCBvYmplY3Qgd2l0aCBsaW1pdHMgZnJvbSB0aGUgWSBBeGlzIGluIHRoZSBjb3JyZWN0IGNlbGxcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoeUF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IHlBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2UgPSBjaGFydC5nZXRDaGFydEluc3RhbmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRJbnN0YW5jZS5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnRPYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIGNyb3NzdGFiXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBVcGRhdGUgY3Jvc3N0YWIgd2hlbiB0aGUgbW9kZWwgdXBkYXRlc1xuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKHRoaXMuZXZlbnRMaXN0Lm1vZGVsVXBkYXRlZCwgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IGhpZ2hsaWdodCBwbG90cyB3aGVuIGhvdmVyZWQgaW5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbCA9IGRhdGEuZGF0YVtjYXRlZ29yeV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodChjYXRlZ29yeVZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tIHBsb3RzIHdoZW4gaG92ZXJlZCBvdXRcbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3Zlcm91dCcsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcmVkQ3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqLFxuICAgICAgICAgICAgb2xkQ2hhcnRzID0gW10sXG4gICAgICAgICAgICBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGF4aXNMaW1pdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlICE9PSAnY2FwdGlvbicgJiYgY2hhcnRDb25mLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnRzLnB1c2goY2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwucm93SGFzaCAmJiBjZWxsLmNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZENoYXJ0ID0gdGhpcy5nZXRPbGRDaGFydChvbGRDaGFydHMsIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9sZENoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0ID0gY2hhcnRPYmpbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydE9ialswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNoYXJ0ID0gb2xkQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW1pdHMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5tYXggPSBsaW1pdHMubWF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taW4gPSBsaW1pdHMubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLm1heCB8fCBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgY2VsbC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IGNlbGwubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gY2VsbC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQgJiYgY2VsbC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93QXhpcyA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IGZpbHRlcmVkQ3Jvc3N0YWI7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCgpO1xuICAgICAgICBheGlzTGltaXRzID0gdGhpcy5nZXRZQXhpc0xpbWl0cygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2NhcHRpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzFdKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnVwZGF0ZShjaGFydE9iai5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRZQXhpc0NoYXJ0ICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0WUF4aXNMaW1pdHMgKCkge1xuICAgICAgICBsZXQgaSwgaWksXG4gICAgICAgICAgICBqLCBqajtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycgJiYgY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNlbGwuY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLmdldExpbWl0cygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE9sZENoYXJ0IChvbGRDaGFydHMsIHJvd0hhc2gsIGNvbEhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IG9sZENoYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKG9sZENoYXJ0c1tpXS5yb3dIYXNoID09PSByb3dIYXNoICYmIG9sZENoYXJ0c1tpXS5jb2xIYXNoID09PSBjb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9sZENoYXJ0c1tpXS5jaGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUodGhpcy5jcm9zc3RhYik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sRmlsdGVyLCBtaW5MaW1pdCwgbWF4TGltaXQpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIC8vIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2hhcnQgPSB7fSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBpZiAobWluTGltaXQgIT09IHVuZGVmaW5lZCAmJiBtYXhMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGFydCA9IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2U6IGZpbHRlcmVkRGF0YSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgIG1lYXN1cmU6IFtjb2xGaWx0ZXJdLFxuICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsaW1pdHMgPSBjaGFydC5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIGNoYXJ0XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYWdMaXN0ZW5lciAocGxhY2VIb2xkZXIpIHtcbiAgICAgICAgLy8gR2V0dGluZyBvbmx5IGxhYmVsc1xuICAgICAgICBsZXQgb3JpZ0NvbmZpZyA9IHRoaXMuc3RvcmVQYXJhbXMuY29uZmlnLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG9yaWdDb25maWcuZGltZW5zaW9ucyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gb3JpZ0NvbmZpZy5tZWFzdXJlcyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzTGVuZ3RoID0gbWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgbWVhc3VyZXNIb2xkZXIsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gbGV0IGVuZFxuICAgICAgICBwbGFjZUhvbGRlciA9IHBsYWNlSG9sZGVyWzFdO1xuICAgICAgICAvLyBPbWl0dGluZyBsYXN0IGRpbWVuc2lvblxuICAgICAgICBkaW1lbnNpb25zID0gZGltZW5zaW9ucy5zbGljZSgwLCBkaW1lbnNpb25zLmxlbmd0aCAtIDEpO1xuICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gZGltZW5zaW9ucy5sZW5ndGg7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgZGltZW5zaW9uIGhvbGRlclxuICAgICAgICBkaW1lbnNpb25zSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoMCwgZGltZW5zaW9uc0xlbmd0aCk7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgbWVhc3VyZXMgaG9sZGVyXG4gICAgICAgIC8vIE9uZSBzaGlmdCBmb3IgYmxhbmsgYm94XG4gICAgICAgIG1lYXN1cmVzSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoZGltZW5zaW9uc0xlbmd0aCArIDEsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoICsgbWVhc3VyZXNMZW5ndGggKyAxKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihkaW1lbnNpb25zSG9sZGVyLCBkaW1lbnNpb25zLCBkaW1lbnNpb25zTGVuZ3RoLCB0aGlzLmRpbWVuc2lvbnMpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKG1lYXN1cmVzSG9sZGVyLCBtZWFzdXJlcywgbWVhc3VyZXNMZW5ndGgsIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICBmdW5jdGlvbiBzZXR1cExpc3RlbmVyIChob2xkZXIsIGFyciwgYXJyTGVuLCBnbG9iYWxBcnIpIHtcbiAgICAgICAgICAgIGxldCBsaW1pdExlZnQgPSAwLFxuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSAwLFxuICAgICAgICAgICAgICAgIGxhc3QgPSBhcnJMZW4gLSAxLFxuICAgICAgICAgICAgICAgIGxuID0gTWF0aC5sb2cyO1xuXG4gICAgICAgICAgICBpZiAoaG9sZGVyWzBdKSB7XG4gICAgICAgICAgICAgICAgbGltaXRMZWZ0ID0gcGFyc2VJbnQoaG9sZGVyWzBdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSBwYXJzZUludChob2xkZXJbbGFzdF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyTGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWwgPSBob2xkZXJbaV0uZ3JhcGhpY3MsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBob2xkZXJbaV0sXG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5jZWxsVmFsdWUgPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnTGVmdCA9IHBhcnNlSW50KGVsLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVkWm9uZSA9IGl0ZW0ub3JpZ0xlZnQgKyBwYXJzZUludChlbC5zdHlsZS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdaID0gZWwuc3R5bGUuekluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuX3NldHVwRHJhZyhpdGVtLmdyYXBoaWNzLCBmdW5jdGlvbiBkcmFnU3RhcnQgKGR4LCBkeSkge1xuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPCBsaW1pdExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBsaW1pdExlZnQgLSBuTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRMZWZ0IC0gbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0ID4gbGltaXRSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IG5MZWZ0IC0gbGltaXRSaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRSaWdodCArIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBuTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIGZhbHNlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCB0cnVlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGRyYWdFbmQgKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBpdGVtLm9yaWdaO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgYXJyTGVuOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxBcnJbal0gIT09IGhvbGRlcltqXS5jZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxBcnJbal0gPSBob2xkZXJbal0uY2VsbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VTaGlmdGluZyAoaW5kZXgsIGlzUmlnaHQsIGhvbGRlcikge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gW10sXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSBob2xkZXJbaW5kZXhdLFxuICAgICAgICAgICAgICAgIG5leHRQb3MgPSBpc1JpZ2h0ID8gaW5kZXggKyAxIDogaW5kZXggLSAxLFxuICAgICAgICAgICAgICAgIG5leHRJdGVtID0gaG9sZGVyW25leHRQb3NdO1xuICAgICAgICAgICAgLy8gU2F2aW5nIGRhdGEgZm9yIGxhdGVyIHVzZVxuICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCghaXNSaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPCBuZXh0SXRlbS5yZWRab25lKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFjay5wb3AoKSB8fFxuICAgICAgICAgICAgICAgICAgICAoaXNSaWdodCAmJiBwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA+IG5leHRJdGVtLm9yaWdMZWZ0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ucmVkWm9uZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ub3JpZ0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgKz0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0IC09IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5vcmlnTGVmdCA9IGRyYWdJdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5yZWRab25lID0gZHJhZ0l0ZW0ucmVkWm9uZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uaW5kZXggPSBkcmFnSXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCA9IG5leHRJdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChob2xkZXJbbmV4dFBvc10pO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbbmV4dFBvc10gPSBob2xkZXJbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbaW5kZXhdID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0dGluZyBuZXcgdmFsdWVzIGZvciBkcmFnaXRlbVxuICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLmluZGV4ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ub3JpZ0xlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5yZWRab25lID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBEcmFnIChlbCwgaGFuZGxlciwgaGFuZGxlcjIpIHtcbiAgICAgICAgbGV0IHggPSAwLFxuICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZS5jbGllbnRYIC0geCwgZS5jbGllbnRZIC0geSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZXIyLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGFyZ2VEYXRhLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==