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
	    dataIsSortable: false,
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
	                // Default categories for charts (i.e. no sorting applied)
	                this.categories = globalData[this.dimensions[this.dimensions.length - 1]];
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
	                                    'categories': this.categories
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
	                        minmaxObj = this.getChartObj(this.dataStore, this.categories, filteredDataHashKey, this._columnKeyArr[j])[0];
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
	                                chartObj = this.getChartObj(this.dataStore, this.categories, _crosstabElement.rowHash, _crosstabElement.colHash, minLimit, maxLimit)[1];
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
	                            var chartObj = this.getChartObj(this.dataStore, this.categories, _cell.rowHash, _cell.colHash);
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
	                        var _chartObj = this.getChartObj(this.dataStore, this.categories, crosstabElement.rowHash, crosstabElement.colHash, axisLimits[0], axisLimits[1])[1];
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
	        key: 'sortCharts',
	        value: function sortCharts(key, order) {
	            var _this3 = this;
	
	            var sortProcessor = this.mc.createDataProcessor(),
	                sortFn = void 0,
	                sortedData = void 0;
	
	            this.dataIsSortable = true;
	            if (order === 'ascending') {
	                sortFn = function sortFn(a, b) {
	                    return a[key] - b[key];
	                };
	            } else {
	                sortFn = function sortFn(a, b) {
	                    return b[key] - a[key];
	                };
	            }
	            sortProcessor.sort(sortFn);
	            sortedData = this.dataStore.getChildModel(sortProcessor);
	            this.crosstab.forEach(function (row) {
	                var rowCategories = void 0;
	                row.forEach(function (cell) {
	                    if (cell.chart) {
	                        var chart = cell.chart,
	                            chartConf = chart.getConf();
	                        if (chartConf.type !== 'caption' && chartConf.type !== 'axis') {
	                            var chartObj = _this3.getChartObj(sortedData, _this3.categories, cell.rowHash, cell.colHash);
	                            chart.update(chartObj[1].getConf());
	                            rowCategories = chart.getConf().categories;
	                        }
	                    }
	                });
	                row.forEach(function (cell) {
	                    if (cell.chart) {
	                        var chart = cell.chart,
	                            chartConf = chart.getConf();
	                        if (chartConf.type === 'axis') {
	                            var axisType = chartConf.config.chart.axisType;
	                            if (axisType === 'x') {
	                                chartConf.config.categories = rowCategories;
	                                chart.update(chartConf);
	                            }
	                        }
	                    }
	                });
	            });
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
	        value: function getChartObj(dataStore, categories, rowFilter, colFilter, minLimit, maxLimit) {
	            var _this4 = this;
	
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
	                chart = {};
	
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
	                filteredData = dataStore.getChildModel(dataProcessors);
	                if (minLimit !== undefined && maxLimit !== undefined) {
	                    this.chartConfig.chart.yAxisMinValue = minLimit;
	                    this.chartConfig.chart.yAxisMaxValue = maxLimit;
	                }
	                if (this.dataIsSortable) {
	                    (function () {
	                        var filteredJSON = filteredData.getJSON(),
	                            sortedCategories = [];
	                        filteredJSON.forEach(function (val) {
	                            var category = val[_this4.dimensions[_this4.dimensions.length - 1]];
	                            if (sortedCategories.indexOf(category) === -1) {
	                                sortedCategories.push(category);
	                            }
	                        });
	                        categories = sortedCategories.slice();
	                    })();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzQxZTllMDQyZWMyOTE4ZTA3ZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwiY3Jvc3N0YWJDb250YWluZXIiLCJkYXRhSXNTb3J0YWJsZSIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJkcmFnZ2FibGVIZWFkZXJzIiwiY2hhcnRDb25maWciLCJjaGFydCIsIndpbmRvdyIsImNyb3NzdGFiIiwicmVuZGVyQ3Jvc3N0YWIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXZlbnRMaXN0Iiwic3RvcmVQYXJhbXMiLCJfY29sdW1uS2V5QXJyIiwic2hvd0ZpbHRlciIsImFnZ3JlZ2F0aW9uIiwiTXVsdGlDaGFydGluZyIsIm1jIiwiZGF0YVN0b3JlIiwiY3JlYXRlRGF0YVN0b3JlIiwic2V0RGF0YSIsImRhdGFTb3VyY2UiLCJFcnJvciIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJmaWVsZHMiLCJnZXRLZXlzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwiY2F0ZWdvcmllcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwicHVzaCIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsImNyZWF0ZVJvdyIsImNoYXJ0VG9wTWFyZ2luIiwiY2hhcnRCb3R0b21NYXJnaW4iLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImhlYWRlckRpdiIsImRyYWdEaXYiLCJzZXRBdHRyaWJ1dGUiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsImFwcGVuZERyYWdIYW5kbGUiLCJjb3JuZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjb2xPcmRlckxlbmd0aCIsImNvcm5lckNlbGxBcnIiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIm1heExlbmd0aCIsIm9iaiIsImZpbHRlciIsInZhbCIsImFyciIsImNvbE9yZGVyIiwieEF4aXNSb3ciLCJjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyIsImNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciIsImNyZWF0ZU1lYXN1cmVIZWFkaW5ncyIsImNoYXJ0TGVmdE1hcmdpbiIsImNoYXJ0UmlnaHRNYXJnaW4iLCJ1bnNoaWZ0IiwiY3JlYXRlQ2FwdGlvbiIsImZpbHRlcnMiLCJzbGljZSIsIm1hdGNoZWRWYWx1ZXMiLCJmb3JFYWNoIiwiZGltZW5zaW9uIiwiZmlsdGVyR2VuIiwidmFsdWUiLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJhIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImluZGV4T2YiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsImxlbiIsImsiLCJub2RlIiwibnVtSGFuZGxlcyIsImhhbmRsZVNwYW4iLCJtYXJnaW5MZWZ0IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwidmVydGljYWxBbGlnbiIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInlBeGlzIiwiY3JlYXRlQ3Jvc3N0YWIiLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiamoiLCJjcm9zc3RhYkVsZW1lbnQiLCJjb25mIiwidHlwZSIsImF4aXNUeXBlIiwiYXhpc0NoYXJ0IiwiY3JlYXRlTXVsdGlDaGFydCIsImZpbmRZQXhpc0NoYXJ0IiwiY2hhcnRJbnN0YW5jZSIsImdldENoYXJ0SW5zdGFuY2UiLCJsaW1pdHMiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiY2hhcnRPYmoiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kZWxVcGRhdGVkIiwiZSIsImQiLCJ1cGRhdGVDcm9zc3RhYiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsImZpbHRlcmVkQ3Jvc3N0YWIiLCJvbGRDaGFydHMiLCJheGlzTGltaXRzIiwiY2VsbCIsImNoYXJ0Q29uZiIsImdldENvbmYiLCJvbGRDaGFydCIsImdldE9sZENoYXJ0IiwiZ2V0WUF4aXNMaW1pdHMiLCJ1cGRhdGUiLCJvcmRlciIsInNvcnRQcm9jZXNzb3IiLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwic29ydEZuIiwic29ydGVkRGF0YSIsImIiLCJzb3J0IiwiZ2V0Q2hpbGRNb2RlbCIsInJvd0NhdGVnb3JpZXMiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50Iiwic3BsaWNlIiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sRmlsdGVyIiwicm93RmlsdGVycyIsImRhdGFQcm9jZXNzb3JzIiwiZGF0YVByb2Nlc3NvciIsIm1hdGNoZWRIYXNoZXMiLCJmaWx0ZXJlZERhdGEiLCJhcHBseSIsIm1hdGNoSGFzaCIsInlBeGlzTWluVmFsdWUiLCJ5QXhpc01heFZhbHVlIiwiZmlsdGVyZWRKU09OIiwiZ2V0SlNPTiIsInNvcnRlZENhdGVnb3JpZXMiLCJtZWFzdXJlIiwic2VyaWVzVHlwZSIsImFnZ3JlZ2F0ZU1vZGUiLCJnZXRMaW1pdCIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZWxmIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImxpbWl0TGVmdCIsImxpbWl0UmlnaHQiLCJsYXN0IiwibG4iLCJNYXRoIiwibG9nMiIsImdyYXBoaWNzIiwibGVmdCIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwib3BhY2l0eSIsImNsYXNzTGlzdCIsImFkZCIsIm1vdXNlVXBIYW5kbGVyIiwicmVtb3ZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdENBLEtBQU1BLGNBQWMsbUJBQUFDLENBQVEsQ0FBUixDQUFwQjtBQUFBLEtBQ0lDLE9BQU8sbUJBQUFELENBQVEsQ0FBUixDQURYOztBQUdBLEtBQUlFLFNBQVM7QUFDVEMsaUJBQVksQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQURIO0FBRVRDLGVBQVUsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixDQUZEO0FBR1RDLGdCQUFXLE9BSEY7QUFJVEMsb0JBQWUscUJBSk47QUFLVEMsd0JBQW1CLGNBTFY7QUFNVEMscUJBQWdCLEtBTlA7QUFPVEMsZ0JBQVcsR0FQRjtBQVFUQyxpQkFBWSxFQVJIO0FBU1Q7QUFDQUMsdUJBQWtCLElBVlQ7QUFXVDtBQUNBQyxrQkFBYTtBQUNUQyxnQkFBTztBQUNILDJCQUFjLEdBRFg7QUFFSCwyQkFBYyxHQUZYO0FBR0gsNkJBQWdCLEdBSGI7QUFJSCw2QkFBZ0IsR0FKYjtBQUtILDZCQUFnQixHQUxiO0FBTUgsa0NBQXFCLFNBTmxCO0FBT0gsaUNBQW9CLFNBUGpCO0FBUUgsa0NBQXFCLEdBUmxCO0FBU0gsK0JBQWtCLEdBVGY7QUFVSCxnQ0FBbUIsR0FWaEI7QUFXSCxpQ0FBb0IsR0FYakI7QUFZSCxtQ0FBc0IsR0FabkI7QUFhSCwrQkFBa0IsS0FiZjtB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N21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NDFlOWUwNDJlYzI5MThlMDdlOCIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnUHJvZml0JywgJ1Zpc2l0b3JzJ10sXG4gICAgY2hhcnRUeXBlOiAnYmFyMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgZGF0YUlzU29ydGFibGU6IGZhbHNlLFxuICAgIGNlbGxXaWR0aDogMTUwLFxuICAgIGNlbGxIZWlnaHQ6IDgwLFxuICAgIC8vIHNob3dGaWx0ZXI6IHRydWUsXG4gICAgZHJhZ2dhYmxlSGVhZGVyczogdHJ1ZSxcbiAgICAvLyBhZ2dyZWdhdGlvbjogJ3N1bScsXG4gICAgY2hhcnRDb25maWc6IHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICdzaG93Qm9yZGVyJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdyb2xsT3ZlckJhbmRDb2xvcic6ICcjYmFkYWYwJyxcbiAgICAgICAgICAgICdjb2x1bW5Ib3ZlckNvbG9yJzogJyMxYjgzY2MnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzcnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjNUI1QjVCJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnZHJhd1RyZW5kUmVnaW9uJzogJzEnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAvLyBMaXN0IG9mIHBvc3NpYmxlIGV2ZW50cyByYWlzZWQgYnkgdGhlIGRhdGEgc3RvcmUuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ID0ge1xuICAgICAgICAgICAgJ21vZGVsVXBkYXRlZCc6ICdtb2RlbHVwZGF0ZWQnLFxuICAgICAgICAgICAgJ21vZGVsRGVsZXRlZCc6ICdtb2RlbGRlbGV0ZWQnLFxuICAgICAgICAgICAgJ21ldGFJbmZvVXBkYXRlJzogJ21ldGFpbmZvdXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yVXBkYXRlZCc6ICdwcm9jZXNzb3J1cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JEZWxldGVkJzogJ3Byb2Nlc3NvcmRlbGV0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIC8vIFBvdGVudGlhbGx5IHVubmVjZXNzYXJ5IG1lbWJlci5cbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgY29kZSBkZXBlbmRlbnQgb24gdmFyaWFibGUuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB2YXJpYWJsZS5cbiAgICAgICAgdGhpcy5zdG9yZVBhcmFtcyA9IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICB9O1xuICAgICAgICAvLyBBcnJheSBvZiBjb2x1bW4gbmFtZXMgKG1lYXN1cmVzKSB1c2VkIHdoZW4gYnVpbGRpbmcgdGhlIGNyb3NzdGFiIGFycmF5LlxuICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgLy8gU2F2aW5nIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gaW50byBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5kYXRhSXNTb3J0YWJsZSA9IGNvbmZpZy5kYXRhSXNTb3J0YWJsZTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYkNvbnRhaW5lciA9IGNvbmZpZy5jcm9zc3RhYkNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoIHx8IDIxMDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQgfHwgMTEzO1xuICAgICAgICB0aGlzLnNob3dGaWx0ZXIgPSBjb25maWcuc2hvd0ZpbHRlciB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbiB8fCAnc3VtJztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVIZWFkZXJzID0gY29uZmlnLmRyYWdnYWJsZUhlYWRlcnMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlIHx8ICdObyBkYXRhIHRvIGRpc3BsYXkuJztcbiAgICAgICAgaWYgKHR5cGVvZiBNdWx0aUNoYXJ0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLm1jID0gbmV3IE11bHRpQ2hhcnRpbmcoKTtcbiAgICAgICAgICAgIC8vIENyZWF0aW5nIGFuIGVtcHR5IGRhdGEgc3RvcmVcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgICAgIC8vIEFkZGluZyBkYXRhIHRvIHRoZSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aUNoYXJ0bmcgbW9kdWxlIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zaG93RmlsdGVyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFGaWx0ZXJFeHQgPSBuZXcgRkNEYXRhRmlsdGVyRXh0KHRoaXMuZGF0YVN0b3JlLCBmaWx0ZXJDb25maWcsICdjb250cm9sLWJveCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGFGaWx0ZXIgbW9kdWxlIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBCdWlsZGluZyBhIGRhdGEgc3RydWN0dXJlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgaGFzaCBtYXAgb2YgYXBwbGljYWJsZSBmaWx0ZXJzIGFuZCB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgZnVuY3Rpb25zXG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFuIGFycmF5IG9mIGFycmF5cyBkYXRhIHN0cnVjdHVyZSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIGFycmF5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgZGF0YVN0b3JlJ3MgYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBkYXRhU3RvcmUgPSB0aGlzLmRhdGFTdG9yZSxcbiAgICAgICAgICAgIGZpZWxkcyA9IGRhdGFTdG9yZS5nZXRLZXlzKCk7XG4gICAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgICAgIGxldCBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IGRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY2F0ZWdvcmllcyBmb3IgY2hhcnRzIChpLmUuIG5vIHNvcnRpbmcgYXBwbGllZClcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdlbmVyYXRlIGtleXMgZnJvbSBkYXRhIHN0b3JlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5fY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlcixcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlUGFkZGluZyc6IDAuNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IHRoaXMuY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuX2NvbHVtbktleUFycltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjaGFydC1jZWxsICcgKyAoaiArIDEpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjb2xMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmouY2xhc3NOYW1lID0gJ2NoYXJ0LWNlbGwgbGFzdC1jb2wnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLCBmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlTWVhc3VyZUhlYWRpbmdzICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgLy8gaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLW1lYXN1cmVzICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyci5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICAgICAgdGFibGVbMF0ucHVzaChjb2xFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyAoY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICBoZWFkZXJEaXYsXG4gICAgICAgICAgICBkcmFnRGl2O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2RpbWVuc2lvbi1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ2RpbWVuc2lvbi1oZWFkZXIgJyArIHRoaXMuZGltZW5zaW9uc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyICs9ICcgZHJhZ2dhYmxlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZGltZW5zaW9uc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciAoKSB7XG4gICAgICAgIGxldCBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWhlYWRlci1jZWxsJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNyZWF0ZUNhcHRpb24gKG1heExlbmd0aCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2FwdGlvbi1jaGFydCcsXG4gICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29sT3JkZXIgPSB0aGlzLm1lYXN1cmVzLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgLy8gSW5zZXJ0IGRpbWVuc2lvbiBoZWFkaW5nc1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCB2ZXJ0aWNhbCBheGlzIGhlYWRlclxuICAgICAgICAgICAgdGFibGVbMF0ucHVzaCh0aGlzLmNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlcigpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCBtZWFzdXJlIGhlYWRpbmdzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU1lYXN1cmVIZWFkaW5ncyh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIC8vIEluc2VydCByb3dzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgLy8gRmluZCByb3cgd2l0aCBtYXggbGVuZ3RoIGluIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQdXNoIGJsYW5rIHBhZGRpbmcgY2VsbHMgdW5kZXIgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIHNhbWUgcm93IGFzIHRoZSBob3Jpem9udGFsIGF4aXNcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4dHJhIGNlbGwgZm9yIHkgYXhpcy4gRXNzZW50aWFsbHkgWSBheGlzIGZvb3Rlci5cbiAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWZvb3Rlci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFB1c2ggaG9yaXpvbnRhbCBheGVzIGludG8gdGhlIGxhc3Qgcm93IG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogdGhpcy5jYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIC8vIFBsYWNlIHRoZSBjYXB0aW9uIGNlbGwgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIHRhYmxlLnVuc2hpZnQodGhpcy5jcmVhdGVDYXB0aW9uKG1heExlbmd0aCkpO1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBObyBkYXRhIGZvciBjcm9zc3RhYi4gOihcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucy5zbGljZSgwLCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGRpbWVuc2lvbnMuZm9yRWFjaChkaW1lbnNpb24gPT4ge1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVtkaW1lbnNpb25dO1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKGRpbWVuc2lvbiwgdmFsdWUudG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5pbmRleE9mKGtleSkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAga2V5ICE9PSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIGFwcGVuZERyYWdIYW5kbGUgKG5vZGUsIG51bUhhbmRsZXMpIHtcbiAgICAgICAgbGV0IGksXG4gICAgICAgICAgICBoYW5kbGVTcGFuO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtSGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5tYXJnaW5MZWZ0ID0gJzFweCc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLmZvbnRTaXplID0gJzNweCc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLmxpbmVIZWlnaHQgPSAnMSc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAndG9wJztcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoaGFuZGxlU3Bhbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIHlBeGlzO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSBjcm9zc3RhYiBhcnJheVxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuXG4gICAgICAgIC8vIEZpbmQgdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtIGZvciB0aGUgYXhlc1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3dMYXN0Q2hhcnQgPSB0aGlzLmNyb3NzdGFiW2ldW3RoaXMuY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIFkgYXhpcyBjaGFydHMgaW4gdGhlIGNyb3NzdGFiIGFycmF5IHdpdGggdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0NoYXJ0ID0gdGhpcy5tYy5jaGFydChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jaGFydCA9IGF4aXNDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERyYXcgdGhlIGNyb3NzdGFiIHdpdGggb25seSB0aGUgYXhlcywgY2FwdGlvbiBhbmQgaHRtbCB0ZXh0LlxuICAgICAgICAvLyBSZXF1aXJlZCBzaW5jZSBheGVzIGNhbm5vdCByZXR1cm4gbGltaXRzIHVubGVzcyB0aGV5IGFyZSBkcmF3blxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gRmluZCBhIFkgQXhpcyBjaGFydFxuICAgICAgICB5QXhpcyA9IHlBeGlzIHx8IHRoaXMuZmluZFlBeGlzQ2hhcnQoKTtcblxuICAgICAgICAvLyBQbGFjZSBhIGNoYXJ0IG9iamVjdCB3aXRoIGxpbWl0cyBmcm9tIHRoZSBZIEF4aXMgaW4gdGhlIGNvcnJlY3QgY2VsbFxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmICh5QXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdheGlzLWZvb3Rlci1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0geUF4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRJbnN0YW5jZSA9IGNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydEluc3RhbmNlLmdldExpbWl0cygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLCBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdClbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydE9iajtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY3Jvc3N0YWJcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBjcm9zc3RhYiB3aGVuIHRoZSBtb2RlbCB1cGRhdGVzXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudExpc3QubW9kZWxVcGRhdGVkLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgaGlnaGxpZ2h0IHBsb3RzIHdoZW4gaG92ZXJlZCBpblxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyaW4nLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IHJlbW92ZSBoaWdobGlnaHRzIGZyb20gcGxvdHMgd2hlbiBob3ZlcmVkIG91dFxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZmlsdGVyZWRDcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIGksIGlpLFxuICAgICAgICAgICAgaiwgamosXG4gICAgICAgICAgICBvbGRDaGFydHMgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgYXhpc0xpbWl0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgIT09ICdjYXB0aW9uJyAmJiBjaGFydENvbmYudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5yb3dIYXNoICYmIGNlbGwuY29sSGFzaCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkQ2hhcnQgPSB0aGlzLmdldE9sZENoYXJ0KG9sZENoYXJ0cywgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2xkQ2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcywgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnQgPSBjaGFydE9ialsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0T2JqWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2hhcnQgPSBvbGRDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbWl0cykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1heCA9IGxpbWl0cy5tYXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1pbiA9IGxpbWl0cy5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwubWF4IHx8IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCBjZWxsLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gY2VsbC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSBjZWxsLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCAmJiBjZWxsLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gZmlsdGVyZWRDcm9zc3RhYjtcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KCk7XG4gICAgICAgIGF4aXNMaW1pdHMgPSB0aGlzLmdldFlBeGlzTGltaXRzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnY2FwdGlvbicgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLCBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMV0pWzFdO1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQudXBkYXRlKGNoYXJ0T2JqLmdldENvbmYoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFlBeGlzQ2hhcnQgKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRZQXhpc0xpbWl0cyAoKSB7XG4gICAgICAgIGxldCBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJyAmJiBjaGFydENvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2VsbC5jaGFydC5nZXRDaGFydEluc3RhbmNlKCkuZ2V0TGltaXRzKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0T2xkQ2hhcnQgKG9sZENoYXJ0cywgcm93SGFzaCwgY29sSGFzaCkge1xuICAgICAgICBmb3IgKHZhciBpID0gb2xkQ2hhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAob2xkQ2hhcnRzW2ldLnJvd0hhc2ggPT09IHJvd0hhc2ggJiYgb2xkQ2hhcnRzW2ldLmNvbEhhc2ggPT09IGNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2xkQ2hhcnRzW2ldLmNoYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ydENoYXJ0cyAoa2V5LCBvcmRlcikge1xuICAgICAgICBsZXQgc29ydFByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpLFxuICAgICAgICAgICAgc29ydEZuLFxuICAgICAgICAgICAgc29ydGVkRGF0YTtcblxuICAgICAgICB0aGlzLmRhdGFJc1NvcnRhYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKG9yZGVyID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IGFba2V5XSAtIGJba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBiW2tleV0gLSBhW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgc29ydFByb2Nlc3Nvci5zb3J0KHNvcnRGbik7XG4gICAgICAgIHNvcnRlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXRDaGlsZE1vZGVsKHNvcnRQcm9jZXNzb3IpO1xuICAgICAgICB0aGlzLmNyb3NzdGFiLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIGxldCByb3dDYXRlZ29yaWVzO1xuICAgICAgICAgICAgcm93LmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gY2VsbC5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZiA9IGNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlICE9PSAnY2FwdGlvbicgJiYgY2hhcnRDb25mLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaihzb3J0ZWREYXRhLCB0aGlzLmNhdGVnb3JpZXMsIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydE9ialsxXS5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q2F0ZWdvcmllcyA9IGNoYXJ0LmdldENvbmYoKS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNUeXBlID0gY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzVHlwZSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mLmNvbmZpZy5jYXRlZ29yaWVzID0gcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRDb25mKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCB0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChkYXRhU3RvcmUsIGNhdGVnb3JpZXMsIHJvd0ZpbHRlciwgY29sRmlsdGVyLCBtaW5MaW1pdCwgbWF4TGltaXQpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIC8vIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2hhcnQgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBkYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBpZiAobWluTGltaXQgIT09IHVuZGVmaW5lZCAmJiBtYXhMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzID0gW107XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRKU09OLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gdmFsW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29ydGVkQ2F0ZWdvcmllcy5pbmRleE9mKGNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZENhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzID0gc29ydGVkQ2F0ZWdvcmllcy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hhcnQgPSB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlOiBmaWx0ZXJlZERhdGEsXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGltaXRzID0gY2hhcnQuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCBjaGFydF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmFnTGlzdGVuZXIgKHBsYWNlSG9sZGVyKSB7XG4gICAgICAgIC8vIEdldHRpbmcgb25seSBsYWJlbHNcbiAgICAgICAgbGV0IG9yaWdDb25maWcgPSB0aGlzLnN0b3JlUGFyYW1zLmNvbmZpZyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBvcmlnQ29uZmlnLmRpbWVuc2lvbnMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlcyA9IG9yaWdDb25maWcubWVhc3VyZXMgfHwgW10sXG4gICAgICAgICAgICBtZWFzdXJlc0xlbmd0aCA9IG1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSAwLFxuICAgICAgICAgICAgZGltZW5zaW9uc0hvbGRlcixcbiAgICAgICAgICAgIG1lYXN1cmVzSG9sZGVyLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGxldCBlbmRcbiAgICAgICAgcGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlclsxXTtcbiAgICAgICAgLy8gT21pdHRpbmcgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgZGltZW5zaW9ucyA9IGRpbWVuc2lvbnMuc2xpY2UoMCwgZGltZW5zaW9ucy5sZW5ndGggLSAxKTtcbiAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IGRpbWVuc2lvbnMubGVuZ3RoO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIGRpbWVuc2lvbiBob2xkZXJcbiAgICAgICAgZGltZW5zaW9uc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKDAsIGRpbWVuc2lvbnNMZW5ndGgpO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIG1lYXN1cmVzIGhvbGRlclxuICAgICAgICAvLyBPbmUgc2hpZnQgZm9yIGJsYW5rIGJveFxuICAgICAgICBtZWFzdXJlc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKGRpbWVuc2lvbnNMZW5ndGggKyAxLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCArIG1lYXN1cmVzTGVuZ3RoICsgMSk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIoZGltZW5zaW9uc0hvbGRlciwgZGltZW5zaW9ucywgZGltZW5zaW9uc0xlbmd0aCwgdGhpcy5kaW1lbnNpb25zKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihtZWFzdXJlc0hvbGRlciwgbWVhc3VyZXMsIG1lYXN1cmVzTGVuZ3RoLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBMaXN0ZW5lciAoaG9sZGVyLCBhcnIsIGFyckxlbiwgZ2xvYmFsQXJyKSB7XG4gICAgICAgICAgICBsZXQgbGltaXRMZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gMCxcbiAgICAgICAgICAgICAgICBsYXN0ID0gYXJyTGVuIC0gMSxcbiAgICAgICAgICAgICAgICBsbiA9IE1hdGgubG9nMjtcblxuICAgICAgICAgICAgaWYgKGhvbGRlclswXSkge1xuICAgICAgICAgICAgICAgIGxpbWl0TGVmdCA9IHBhcnNlSW50KGhvbGRlclswXS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBsaW1pdFJpZ2h0ID0gcGFyc2VJbnQoaG9sZGVyW2xhc3RdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyckxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsID0gaG9sZGVyW2ldLmdyYXBoaWNzLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaG9sZGVyW2ldLFxuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXR1cERyYWcoaXRlbS5ncmFwaGljcywgZnVuY3Rpb24gZHJhZ1N0YXJ0IChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgZHggKyBpdGVtLmFkanVzdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0IDwgbGltaXRMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbGltaXRMZWZ0IC0gbkxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0TGVmdCAtIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA+IGxpbWl0UmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBuTGVmdCAtIGxpbWl0UmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGxpbWl0UmlnaHQgKyBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gbkxlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCBmYWxzZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgdHJ1ZSwgaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiBkcmFnRW5kICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5nZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gaXRlbS5vcmlnWjtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaiA8IGFyckxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsQXJyW2pdICE9PSBob2xkZXJbal0uY2VsbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQXJyW2pdID0gaG9sZGVyW2pdLmNlbGxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdsb2JhbERhdGEgPSBzZWxmLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWFuYWdlU2hpZnRpbmcgKGluZGV4LCBpc1JpZ2h0LCBob2xkZXIpIHtcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFtdLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gaG9sZGVyW2luZGV4XSxcbiAgICAgICAgICAgICAgICBuZXh0UG9zID0gaXNSaWdodCA/IGluZGV4ICsgMSA6IGluZGV4IC0gMSxcbiAgICAgICAgICAgICAgICBuZXh0SXRlbSA9IGhvbGRlcltuZXh0UG9zXTtcbiAgICAgICAgICAgIC8vIFNhdmluZyBkYXRhIGZvciBsYXRlciB1c2VcbiAgICAgICAgICAgIGlmIChuZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goIWlzUmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpIDwgbmV4dEl0ZW0ucmVkWm9uZSkpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2sucG9wKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGlzUmlnaHQgJiYgcGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPiBuZXh0SXRlbS5vcmlnTGVmdCkpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFjay5wb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLnJlZFpvbmUpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLm9yaWdMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0ICs9IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCAtPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ub3JpZ0xlZnQgPSBkcmFnSXRlbS5vcmlnTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0ucmVkWm9uZSA9IGRyYWdJdGVtLnJlZFpvbmU7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmluZGV4ID0gZHJhZ0l0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQgPSBuZXh0SXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goaG9sZGVyW25leHRQb3NdKTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW25leHRQb3NdID0gaG9sZGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaG9sZGVyW2luZGV4XSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldHRpbmcgbmV3IHZhbHVlcyBmb3IgZHJhZ2l0ZW1cbiAgICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5pbmRleCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLm9yaWdMZWZ0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ucmVkWm9uZSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwRHJhZyAoZWwsIGhhbmRsZXIsIGhhbmRsZXIyKSB7XG4gICAgICAgIGxldCB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjdXN0b21IYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGUuY2xpZW50WCAtIHgsIGUuY2xpZW50WSAtIHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgeSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVyMiwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=