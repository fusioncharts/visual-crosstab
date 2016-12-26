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
	    measureUnits: ['INR', '$', ''],
	    unitFunction: function unitFunction(unit) {
	        return '(' + unit + ')';
	    },
	    chartType: 'bar2d',
	    noDataMessage: 'No data to display.',
	    crosstabContainer: 'crosstab-div',
	    dataIsSortable: true,
	    cellWidth: 150,
	    cellHeight: 80,
	    // showFilter: true,
	    draggableHeaders: true,
	    aggregation: 'min',
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
	        this.measureUnits = config.measureUnits;
	        this.dataIsSortable = config.dataIsSortable;
	        this.crosstabContainer = config.crosstabContainer;
	        this.cellWidth = config.cellWidth || 210;
	        this.cellHeight = config.cellHeight || 113;
	        this.showFilter = config.showFilter || false;
	        this.aggregation = config.aggregation || 'sum';
	        this.draggableHeaders = config.draggableHeaders || false;
	        this.noDataMessage = config.noDataMessage || 'No data to display.';
	        this.unitFunction = config.unitFunction || function (unit) {
	            return '(' + unit + ')';
	        };
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
	                ascendingSortBtn,
	                descendingSortBtn,
	                headingText,
	                headingTextSpan,
	                measureHeading,
	                htmlRef,
	                headerDiv,
	                dragDiv;
	
	            for (i = 0; i < l; i += 1) {
	                var classStr = '',
	                    fieldComponent = measureOrder[i],
	                    measureUnit = '',
	                    aggregationNode = void 0;
	                // fieldValues = data[fieldComponent];
	                headerDiv = document.createElement('div');
	                headerDiv.style.textAlign = 'center';
	
	                dragDiv = document.createElement('div');
	                dragDiv.setAttribute('class', 'measure-drag-handle');
	                dragDiv.style.height = '5px';
	                dragDiv.style.paddingTop = '3px';
	                dragDiv.style.paddingBottom = '1px';
	                this.appendDragHandle(dragDiv, 25);
	
	                htmlRef = document.createElement('div');
	                htmlRef.style.position = 'relative';
	                htmlRef.setAttribute('data-measure', fieldComponent);
	
	                measureUnit = this.measureUnits[this.measures.indexOf(fieldComponent)];
	                if (measureUnit.length > 0) {
	                    measureHeading = fieldComponent + ' ' + this.unitFunction(measureUnit);
	                } else {
	                    measureHeading = fieldComponent;
	                }
	
	                headingTextSpan = document.createElement('span');
	                headingTextSpan.setAttribute('class', 'measure-span');
	
	                headingText = document.createElement('div');
	                headingText.innerHTML = measureHeading;
	                headingText.setAttribute('class', 'measure-text');
	                headingTextSpan.appendChild(headingText);
	
	                aggregationNode = document.createElement('div');
	                aggregationNode.innerHTML = this.aggregation.split('').reduce(function (a, b, idx) {
	                    return idx === 1 ? a.toUpperCase() + b : a + b;
	                });
	                aggregationNode.setAttribute('class', 'measure-aggregation');
	                headingTextSpan.appendChild(aggregationNode);
	
	                // headingTextSpan = document.createTextNode(fieldComponent);
	                if (this.dataIsSortable) {
	                    ascendingSortBtn = this.createSortButton('ascending-sort');
	                    htmlRef.appendChild(ascendingSortBtn);
	
	                    descendingSortBtn = this.createSortButton('descending-sort');
	                    htmlRef.appendChild(descendingSortBtn);
	
	                    htmlRef.appendChild(ascendingSortBtn);
	                    htmlRef.appendChild(headingTextSpan);
	                    htmlRef.appendChild(descendingSortBtn);
	                } else {
	                    htmlRef.appendChild(headingTextSpan);
	                }
	
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = '5px';
	                // htmlRef.style.marginTop = ((30 * this.measures.length - 15) / 2) + 'px';
	                // htmlRef.appendChild(aggregationNode);
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
	                    height: this.cornerHeight + 5,
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
	        key: 'createSortButton',
	        value: function createSortButton(className) {
	            var sortBtn = void 0,
	                classStr = 'sort-btn' + ' ' + (className || '');
	            sortBtn = document.createElement('span');
	            sortBtn.setAttribute('class', classStr.trim());
	            sortBtn.style.position = 'absolute';
	            sortBtn.style.display = 'inline-block';
	            if (className === 'ascending-sort') {
	                this.appendAscendingSteps(sortBtn, 4);
	            } else if (className === 'descending-sort') {
	                this.appendDescendingSteps(sortBtn, 4);
	            }
	            return sortBtn;
	        }
	    }, {
	        key: 'appendAscendingSteps',
	        value: function appendAscendingSteps(btn, numSteps) {
	            var i = void 0,
	                node = void 0,
	                marginValue = 2,
	                divWidth = 1;
	            for (i = 1; i <= numSteps; i++) {
	                node = document.createElement('span');
	                node.style.display = 'block';
	                node.className = 'sort-steps ascending';
	                divWidth = divWidth + i / divWidth * 4;
	                node.style.width = divWidth.toFixed() + 'px';
	                if (i === numSteps - 1) {
	                    node.style.marginTop = marginValue + 'px';
	                } else {
	                    node.style.marginTop = marginValue + 'px';
	                }
	                btn.appendChild(node);
	            }
	        }
	    }, {
	        key: 'appendDescendingSteps',
	        value: function appendDescendingSteps(btn, numSteps) {
	            var i = void 0,
	                node = void 0,
	                marginValue = 2,
	                divWidth = 10;
	            for (i = 1; i <= numSteps; i++) {
	                node = document.createElement('span');
	                node.style.display = 'block';
	                node.className = 'sort-steps descending';
	                divWidth = divWidth - i / divWidth * 5;
	                node.style.width = divWidth.toFixed() + 'px';
	                if (i === numSteps - 1) {
	                    node.style.marginTop = marginValue + 'px';
	                } else {
	                    node.style.marginTop = marginValue + 'px';
	                }
	                btn.appendChild(node);
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
	            if (order === 'ascending') {
	                sortFn = function sortFn(a, b) {
	                    return a[key] - b[key];
	                };
	            } else if (order === 'descending') {
	                sortFn = function sortFn(a, b) {
	                    return b[key] - a[key];
	                };
	            } else {
	                sortFn = function sortFn(a, b) {
	                    return 0;
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
	                                if (_this3.chartType === 'bar2d') {
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
	            if (this.dataIsSortable) {
	                this.setupSortButtons(this.multichartObject.placeHolder);
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
	        key: 'setupSortButtons',
	        value: function setupSortButtons() {
	            var _this5 = this;
	
	            var ascendingBtns = document.getElementsByClassName('ascending-sort'),
	                ii = ascendingBtns.length,
	                i = void 0,
	                descendingBtns = document.getElementsByClassName('descending-sort'),
	                jj = ascendingBtns.length,
	                j = void 0,
	                sortBtns = document.getElementsByClassName('sort-btn');
	            for (i = 0; i < ii; i++) {
	                var btn = ascendingBtns[i];
	                btn.addEventListener('mousedown', function (e) {
	                    var clickElem = void 0,
	                        measureName = void 0,
	                        classStr = void 0;
	                    if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                        clickElem = e.target.parentNode;
	                    } else {
	                        clickElem = e.target;
	                    }
	                    measureName = clickElem.parentNode.getAttribute('data-measure');
	                    classStr = clickElem.className + ' active';
	                    e.stopPropagation();
	                    for (var i = sortBtns.length - 1; i >= 0; i--) {
	                        _this5.removeActiveClass(sortBtns[i]);
	                    }
	                    clickElem.setAttribute('class', classStr);
	                    if (_this5.chartsAreSorted.bool) {
	                        var classList = clickElem.className.split(' ');
	                        if (measureName === _this5.chartsAreSorted.measure && classList.indexOf(_this5.chartsAreSorted.order) !== -1) {
	                            _this5.sortCharts();
	                            _this5.chartsAreSorted = {
	                                bool: false,
	                                order: '',
	                                measure: ''
	                            };
	                            _this5.removeActiveClass(clickElem);
	                        } else {
	                            _this5.sortCharts(measureName, 'ascending');
	                            _this5.chartsAreSorted = {
	                                bool: true,
	                                order: 'ascending-sort',
	                                measure: measureName
	                            };
	                        }
	                    } else {
	                        _this5.sortCharts(measureName, 'ascending');
	                        _this5.chartsAreSorted = {
	                            bool: true,
	                            order: 'ascending-sort',
	                            measure: measureName
	                        };
	                    }
	                });
	            };
	            for (j = 0; j < jj; j++) {
	                var _btn = descendingBtns[j];
	                _btn.addEventListener('mousedown', function (e) {
	                    var clickElem = void 0,
	                        measureName = void 0,
	                        classStr = void 0;
	                    if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                        clickElem = e.target.parentNode;
	                    } else {
	                        clickElem = e.target;
	                    }
	                    measureName = clickElem.parentNode.getAttribute('data-measure');
	                    classStr = clickElem.className + ' active';
	                    e.stopPropagation();
	                    for (var i = sortBtns.length - 1; i >= 0; i--) {
	                        _this5.removeActiveClass(sortBtns[i]);
	                    }
	                    clickElem.setAttribute('class', classStr);
	                    if (_this5.chartsAreSorted.bool) {
	                        var classList = clickElem.className.split(' ');
	                        if (measureName === _this5.chartsAreSorted.measure && classList.indexOf(_this5.chartsAreSorted.order) !== -1) {
	                            _this5.sortCharts();
	                            _this5.chartsAreSorted = {
	                                bool: false,
	                                order: '',
	                                measure: ''
	                            };
	                            _this5.removeActiveClass(clickElem);
	                        } else {
	                            _this5.sortCharts(measureName, 'descending');
	                            _this5.chartsAreSorted = {
	                                bool: true,
	                                order: 'descending-sort',
	                                measure: measureName
	                            };
	                        }
	                    } else {
	                        _this5.sortCharts(measureName, 'descending');
	                        _this5.chartsAreSorted = {
	                            bool: true,
	                            order: 'descending-sort',
	                            measure: measureName
	                        };
	                    }
	                });
	            };
	        }
	    }, {
	        key: 'removeActiveClass',
	        value: function removeActiveClass(elem) {
	            var classNm = elem.className.split(' ').filter(function (val) {
	                return val !== 'active';
	            }).join(' ');
	            elem.setAttribute('class', classNm);
	        }
	    }, {
	        key: 'addActiveClass',
	        value: function addActiveClass(elem) {
	            var classNm = elem.className.split(' ');
	            classNm.push('active');
	            classNm = classNm.join(' ');
	            elem.setAttribute('class', classNm);
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
	                var target = e.target,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjUxN2Q1NGU5ZTUxYzJkNzkwNDMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJtZWFzdXJlVW5pdHMiLCJ1bml0RnVuY3Rpb24iLCJ1bml0IiwiY2hhcnRUeXBlIiwibm9EYXRhTWVzc2FnZSIsImNyb3NzdGFiQ29udGFpbmVyIiwiZGF0YUlzU29ydGFibGUiLCJjZWxsV2lkdGgiLCJjZWxsSGVpZ2h0IiwiZHJhZ2dhYmxlSGVhZGVycyIsImFnZ3JlZ2F0aW9uIiwiY2hhcnRDb25maWciLCJjaGFydCIsIndpbmRvdyIsImNyb3NzdGFiIiwicmVuZGVyQ3Jvc3N0YWIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXZlbnRMaXN0Iiwic3RvcmVQYXJhbXMiLCJfY29sdW1uS2V5QXJyIiwic2hvd0ZpbHRlciIsIk11bHRpQ2hhcnRpbmciLCJtYyIsImRhdGFTdG9yZSIsImNyZWF0ZURhdGFTdG9yZSIsInNldERhdGEiLCJkYXRhU291cmNlIiwiRXJyb3IiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY2hhcnRzQXJlU29ydGVkIiwiYm9vbCIsIm9yZGVyIiwibWVhc3VyZSIsImZpZWxkcyIsImdldEtleXMiLCJpIiwiaWkiLCJsZW5ndGgiLCJnZXRVbmlxdWVWYWx1ZXMiLCJjYXRlZ29yaWVzIiwidGFibGUiLCJyb3dPcmRlciIsImN1cnJlbnRJbmRleCIsImZpbHRlcmVkRGF0YVN0b3JlIiwicm93c3BhbiIsImZpZWxkQ29tcG9uZW50IiwiZmllbGRWYWx1ZXMiLCJsIiwicm93RWxlbWVudCIsImhhc0Z1cnRoZXJEZXB0aCIsImZpbHRlcmVkRGF0YUhhc2hLZXkiLCJjb2xMZW5ndGgiLCJodG1sUmVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJtaW5tYXhPYmoiLCJwdXNoIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwiY3JlYXRlUm93IiwiY2hhcnRUb3BNYXJnaW4iLCJjaGFydEJvdHRvbU1hcmdpbiIsInJldmVyc2UiLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImFzY2VuZGluZ1NvcnRCdG4iLCJkZXNjZW5kaW5nU29ydEJ0biIsImhlYWRpbmdUZXh0IiwiaGVhZGluZ1RleHRTcGFuIiwibWVhc3VyZUhlYWRpbmciLCJoZWFkZXJEaXYiLCJkcmFnRGl2IiwibWVhc3VyZVVuaXQiLCJhZ2dyZWdhdGlvbk5vZGUiLCJzZXRBdHRyaWJ1dGUiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsImFwcGVuZERyYWdIYW5kbGUiLCJwb3NpdGlvbiIsImluZGV4T2YiLCJzcGxpdCIsInJlZHVjZSIsImEiLCJiIiwiaWR4IiwidG9VcHBlckNhc2UiLCJjcmVhdGVTb3J0QnV0dG9uIiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwic3Vic3RyIiwibWF4TGVuZ3RoIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwiY29sT3JkZXIiLCJ4QXhpc1JvdyIsImNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIiwiY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyIiwiY3JlYXRlTWVhc3VyZUhlYWRpbmdzIiwiY2hhcnRMZWZ0TWFyZ2luIiwiY2hhcnRSaWdodE1hcmdpbiIsInVuc2hpZnQiLCJjcmVhdGVDYXB0aW9uIiwiZmlsdGVycyIsInNsaWNlIiwibWF0Y2hlZFZhbHVlcyIsImZvckVhY2giLCJkaW1lbnNpb24iLCJmaWx0ZXJHZW4iLCJ2YWx1ZSIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsImxlbiIsImsiLCJub2RlIiwibnVtSGFuZGxlcyIsImhhbmRsZVNwYW4iLCJtYXJnaW5MZWZ0IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwidmVydGljYWxBbGlnbiIsInNvcnRCdG4iLCJ0cmltIiwiZGlzcGxheSIsImFwcGVuZEFzY2VuZGluZ1N0ZXBzIiwiYXBwZW5kRGVzY2VuZGluZ1N0ZXBzIiwiYnRuIiwibnVtU3RlcHMiLCJtYXJnaW5WYWx1ZSIsImRpdldpZHRoIiwidG9GaXhlZCIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInlBeGlzIiwiY3JlYXRlQ3Jvc3N0YWIiLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiamoiLCJjcm9zc3RhYkVsZW1lbnQiLCJjb25mIiwidHlwZSIsImF4aXNUeXBlIiwiYXhpc0NoYXJ0IiwiY3JlYXRlTXVsdGlDaGFydCIsImZpbmRZQXhpc0NoYXJ0IiwiY2hhcnRJbnN0YW5jZSIsImdldENoYXJ0SW5zdGFuY2UiLCJsaW1pdHMiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiY2hhcnRPYmoiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kZWxVcGRhdGVkIiwiZSIsImQiLCJ1cGRhdGVDcm9zc3RhYiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsImZpbHRlcmVkQ3Jvc3N0YWIiLCJvbGRDaGFydHMiLCJheGlzTGltaXRzIiwiY2VsbCIsImNoYXJ0Q29uZiIsImdldENvbmYiLCJvbGRDaGFydCIsImdldE9sZENoYXJ0IiwiZ2V0WUF4aXNMaW1pdHMiLCJ1cGRhdGUiLCJzb3J0UHJvY2Vzc29yIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsInNvcnRGbiIsInNvcnRlZERhdGEiLCJzb3J0IiwiZ2V0Q2hpbGRNb2RlbCIsInJvd0NhdGVnb3JpZXMiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwic2V0dXBTb3J0QnV0dG9ucyIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsInNwbGljZSIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJmaWx0ZXJlZEpTT04iLCJnZXRKU09OIiwic29ydGVkQ2F0ZWdvcmllcyIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZ2V0TGltaXQiLCJhc2NlbmRpbmdCdG5zIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImRlc2NlbmRpbmdCdG5zIiwic29ydEJ0bnMiLCJjbGlja0VsZW0iLCJtZWFzdXJlTmFtZSIsInRhcmdldCIsInBhcmVudE5vZGUiLCJnZXRBdHRyaWJ1dGUiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVBY3RpdmVDbGFzcyIsImNsYXNzTGlzdCIsInNvcnRDaGFydHMiLCJlbGVtIiwiY2xhc3NObSIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZWxmIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImxpbWl0TGVmdCIsImxpbWl0UmlnaHQiLCJsYXN0IiwibG4iLCJNYXRoIiwibG9nMiIsImdyYXBoaWNzIiwibGVmdCIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0Q2xhc3NTdHIiLCJvcGFjaXR5IiwiYWRkIiwibW91c2VVcEhhbmRsZXIiLCJyZW1vdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FB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Yi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjUxN2Q1NGU5ZTUxYzJkNzkwNDMiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnTW9udGgnXSxcbiAgICBtZWFzdXJlczogWydTYWxlJywgJ1Byb2ZpdCcsICdWaXNpdG9ycyddLFxuICAgIG1lYXN1cmVVbml0czogWydJTlInLCAnJCcsICcnXSxcbiAgICB1bml0RnVuY3Rpb246ICh1bml0KSA9PiAnKCcgKyB1bml0ICsgJyknLFxuICAgIGNoYXJ0VHlwZTogJ2JhcjJkJyxcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5LicsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGRhdGFJc1NvcnRhYmxlOiB0cnVlLFxuICAgIGNlbGxXaWR0aDogMTUwLFxuICAgIGNlbGxIZWlnaHQ6IDgwLFxuICAgIC8vIHNob3dGaWx0ZXI6IHRydWUsXG4gICAgZHJhZ2dhYmxlSGVhZGVyczogdHJ1ZSxcbiAgICBhZ2dyZWdhdGlvbjogJ21pbicsXG4gICAgY2hhcnRDb25maWc6IHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICdzaG93Qm9yZGVyJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdyb2xsT3ZlckJhbmRDb2xvcic6ICcjYmFkYWYwJyxcbiAgICAgICAgICAgICdjb2x1bW5Ib3ZlckNvbG9yJzogJyMxYjgzY2MnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzcnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjNUI1QjVCJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnZHJhd1RyZW5kUmVnaW9uJzogJzEnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAvLyBMaXN0IG9mIHBvc3NpYmxlIGV2ZW50cyByYWlzZWQgYnkgdGhlIGRhdGEgc3RvcmUuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ID0ge1xuICAgICAgICAgICAgJ21vZGVsVXBkYXRlZCc6ICdtb2RlbHVwZGF0ZWQnLFxuICAgICAgICAgICAgJ21vZGVsRGVsZXRlZCc6ICdtb2RlbGRlbGV0ZWQnLFxuICAgICAgICAgICAgJ21ldGFJbmZvVXBkYXRlJzogJ21ldGFpbmZvdXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yVXBkYXRlZCc6ICdwcm9jZXNzb3J1cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JEZWxldGVkJzogJ3Byb2Nlc3NvcmRlbGV0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIC8vIFBvdGVudGlhbGx5IHVubmVjZXNzYXJ5IG1lbWJlci5cbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgY29kZSBkZXBlbmRlbnQgb24gdmFyaWFibGUuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB2YXJpYWJsZS5cbiAgICAgICAgdGhpcy5zdG9yZVBhcmFtcyA9IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICB9O1xuICAgICAgICAvLyBBcnJheSBvZiBjb2x1bW4gbmFtZXMgKG1lYXN1cmVzKSB1c2VkIHdoZW4gYnVpbGRpbmcgdGhlIGNyb3NzdGFiIGFycmF5LlxuICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgLy8gU2F2aW5nIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gaW50byBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5tZWFzdXJlVW5pdHMgPSBjb25maWcubWVhc3VyZVVuaXRzO1xuICAgICAgICB0aGlzLmRhdGFJc1NvcnRhYmxlID0gY29uZmlnLmRhdGFJc1NvcnRhYmxlO1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuc2hvd0ZpbHRlciA9IGNvbmZpZy5zaG93RmlsdGVyIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uIHx8ICdzdW0nO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZUhlYWRlcnMgPSBjb25maWcuZHJhZ2dhYmxlSGVhZGVycyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2UgfHwgJ05vIGRhdGEgdG8gZGlzcGxheS4nO1xuICAgICAgICB0aGlzLnVuaXRGdW5jdGlvbiA9IGNvbmZpZy51bml0RnVuY3Rpb24gfHwgZnVuY3Rpb24gKHVuaXQpIHsgcmV0dXJuICcoJyArIHVuaXQgKyAnKSc7IH07XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICAvLyBDcmVhdGluZyBhbiBlbXB0eSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICAvLyBBZGRpbmcgZGF0YSB0byB0aGUgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTXVsdGlDaGFydG5nIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2hvd0ZpbHRlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhRmlsdGVyIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnVpbGRpbmcgYSBkYXRhIHN0cnVjdHVyZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAvLyBCdWlsZGluZyBhIGhhc2ggbWFwIG9mIGFwcGxpY2FibGUgZmlsdGVycyBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgZmlsdGVyIGZ1bmN0aW9uc1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICBib29sOiBmYWxzZSxcbiAgICAgICAgICAgIG9yZGVyOiAnJyxcbiAgICAgICAgICAgIG1lYXN1cmU6ICcnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYW4gYXJyYXkgb2YgYXJyYXlzIGRhdGEgc3RydWN0dXJlIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgYXJyYXlzIGdlbmVyYXRlZCBmcm9tIHRoZSBkYXRhU3RvcmUncyBhcnJheSBvZiBvYmplY3RzXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgbGV0IGRhdGFTdG9yZSA9IHRoaXMuZGF0YVN0b3JlLFxuICAgICAgICAgICAgZmllbGRzID0gZGF0YVN0b3JlLmdldEtleXMoKTtcbiAgICAgICAgaWYgKGZpZWxkcykge1xuICAgICAgICAgICAgbGV0IGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjYXRlZ29yaWVzIGZvciBjaGFydHMgKGkuZS4gbm8gc29ydGluZyBhcHBsaWVkKVxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2VuZXJhdGUga2V5cyBmcm9tIGRhdGEgc3RvcmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgcm93RWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLl9jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCh0aGlzLmNlbGxIZWlnaHQgLSAxMCkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4XS50b0xvd2VyQ2FzZSgpICtcbiAgICAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgLy8gaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHJvd0VsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29ybmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogdGhpcy5jYXRlZ29yaWVzLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuX2NvbHVtbktleUFycltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjaGFydC1jZWxsICcgKyAoaiArIDEpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjb2xMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmouY2xhc3NOYW1lID0gJ2NoYXJ0LWNlbGwgbGFzdC1jb2wnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5fY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWF4ID0gbWF4O1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWluID0gbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZU1lYXN1cmVIZWFkaW5ncyAodGFibGUsIGRhdGEsIG1lYXN1cmVPcmRlcikge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4sXG4gICAgICAgICAgICBkZXNjZW5kaW5nU29ydEJ0bixcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0LFxuICAgICAgICAgICAgaGVhZGluZ1RleHRTcGFuLFxuICAgICAgICAgICAgbWVhc3VyZUhlYWRpbmcsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgaGVhZGVyRGl2LFxuICAgICAgICAgICAgZHJhZ0RpdjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlVW5pdCA9ICcnLFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0aW9uTm9kZTtcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZWFzdXJlLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgaHRtbFJlZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWVhc3VyZScsIGZpZWxkQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgbWVhc3VyZVVuaXQgPSB0aGlzLm1lYXN1cmVVbml0c1t0aGlzLm1lYXN1cmVzLmluZGV4T2YoZmllbGRDb21wb25lbnQpXTtcbiAgICAgICAgICAgIGlmIChtZWFzdXJlVW5pdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZUhlYWRpbmcgPSBmaWVsZENvbXBvbmVudCArICcgJyArIHRoaXMudW5pdEZ1bmN0aW9uKG1lYXN1cmVVbml0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZUhlYWRpbmcgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVhZGluZ1RleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaGVhZGluZ1RleHRTcGFuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS1zcGFuJyk7XG5cbiAgICAgICAgICAgIGhlYWRpbmdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkaW5nVGV4dC5pbm5lckhUTUwgPSBtZWFzdXJlSGVhZGluZztcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS10ZXh0Jyk7XG4gICAgICAgICAgICBoZWFkaW5nVGV4dFNwYW4uYXBwZW5kQ2hpbGQoaGVhZGluZ1RleHQpO1xuXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uTm9kZS5pbm5lckhUTUwgPSB0aGlzLmFnZ3JlZ2F0aW9uLnNwbGl0KCcnKS5yZWR1Y2UoKGEsIGIsIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZHggPT09IDEgPyBhLnRvVXBwZXJDYXNlKCkgKyBiIDogYSArIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uTm9kZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lYXN1cmUtYWdncmVnYXRpb24nKTtcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0U3Bhbi5hcHBlbmRDaGlsZChhZ2dyZWdhdGlvbk5vZGUpO1xuXG4gICAgICAgICAgICAvLyBoZWFkaW5nVGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmaWVsZENvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2FzY2VuZGluZy1zb3J0Jyk7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgICAgIGRlc2NlbmRpbmdTb3J0QnRuID0gdGhpcy5jcmVhdGVTb3J0QnV0dG9uKCdkZXNjZW5kaW5nLXNvcnQnKTtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGRlc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoYXNjZW5kaW5nU29ydEJ0bik7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChoZWFkaW5nVGV4dFNwYW4pO1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoZGVzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGhlYWRpbmdUZXh0U3Bhbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgLy8gaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLmFwcGVuZENoaWxkKGFnZ3JlZ2F0aW9uTm9kZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLW1lYXN1cmVzICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQgKyA1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlRGltZW5zaW9uSGVhZGluZ3MgKGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgaGVhZGVyRGl2LFxuICAgICAgICAgICAgZHJhZ0RpdjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdkaW1lbnNpb24tZHJhZy1oYW5kbGUnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUuaGVpZ2h0ID0gJzVweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAnM3B4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ0JvdHRvbSA9ICcxcHgnO1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREcmFnSGFuZGxlKGRyYWdEaXYsIDI1KTtcblxuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5kaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmRpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciA9ICdkaW1lbnNpb24taGVhZGVyICcgKyB0aGlzLmRpbWVuc2lvbnNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoZHJhZ0Rpdik7XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0ubGVuZ3RoICogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ybmVyQ2VsbEFycjtcbiAgICB9XG5cbiAgICBjcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIgKCkge1xuICAgICAgICBsZXQgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1oZWFkZXItY2VsbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uIChtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NhcHRpb24nLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XTtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFibGUgPSBbXSxcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIC8vIEluc2VydCBkaW1lbnNpb24gaGVhZGluZ3NcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVEaW1lbnNpb25IZWFkaW5ncyh0YWJsZSwgY29sT3JkZXIubGVuZ3RoKSk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgdmVydGljYWwgYXhpcyBoZWFkZXJcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2godGhpcy5jcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIoKSk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgbWVhc3VyZSBoZWFkaW5nc1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVNZWFzdXJlSGVhZGluZ3ModGFibGUsIG9iaiwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgICAgICAvLyBJbnNlcnQgcm93c1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIC8vIEZpbmQgcm93IHdpdGggbWF4IGxlbmd0aCBpbiB0aGUgdGFibGVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHVzaCBibGFuayBwYWRkaW5nIGNlbGxzIHVuZGVyIHRoZSBkaW1lbnNpb25zIGluIHRoZSBzYW1lIHJvdyBhcyB0aGUgaG9yaXpvbnRhbCBheGlzXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeHRyYSBjZWxsIGZvciB5IGF4aXMuIEVzc2VudGlhbGx5IFkgYXhpcyBmb290ZXIuXG4gICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1mb290ZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBQdXNoIGhvcml6b250YWwgYXhlcyBpbnRvIHRoZSBsYXN0IHJvdyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlUGFkZGluZyc6IDAuNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IHRoaXMuY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICAvLyBQbGFjZSB0aGUgY2FwdGlvbiBjZWxsIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICB0YWJsZS51bnNoaWZ0KHRoaXMuY3JlYXRlQ2FwdGlvbihtYXhMZW5ndGgpKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm8gZGF0YSBmb3IgY3Jvc3N0YWIuIDooXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnMuc2xpY2UoMCwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBkaW1lbnNpb25zLmZvckVhY2goZGltZW5zaW9uID0+IHtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbZGltZW5zaW9uXTtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbihkaW1lbnNpb24sIHZhbHVlLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZihrZXkpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgIGtleSAhPT0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBhcHBlbmREcmFnSGFuZGxlIChub2RlLCBudW1IYW5kbGVzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgaGFuZGxlU3BhbjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG51bUhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubWFyZ2luTGVmdCA9ICcxcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5mb250U2l6ZSA9ICczcHgnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEnO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ3RvcCc7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGhhbmRsZVNwYW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU29ydEJ1dHRvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGxldCBzb3J0QnRuLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnc29ydC1idG4nICsgJyAnICsgKGNsYXNzTmFtZSB8fCAnJyk7XG4gICAgICAgIHNvcnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNvcnRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzU3RyLnRyaW0oKSk7XG4gICAgICAgIHNvcnRCdG4uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBzb3J0QnRuLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ2FzY2VuZGluZy1zb3J0Jykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRBc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc05hbWUgPT09ICdkZXNjZW5kaW5nLXNvcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERlc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc29ydEJ0bjtcbiAgICB9XG5cbiAgICBhcHBlbmRBc2NlbmRpbmdTdGVwcyAoYnRuLCBudW1TdGVwcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtYXJnaW5WYWx1ZSA9IDIsXG4gICAgICAgICAgICBkaXZXaWR0aCA9IDE7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbnVtU3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdzb3J0LXN0ZXBzIGFzY2VuZGluZyc7XG4gICAgICAgICAgICBkaXZXaWR0aCA9IGRpdldpZHRoICsgKChpIC8gZGl2V2lkdGgpICogNCk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gKGRpdldpZHRoLnRvRml4ZWQoKSkgKyAncHgnO1xuICAgICAgICAgICAgaWYgKGkgPT09IChudW1TdGVwcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kRGVzY2VuZGluZ1N0ZXBzIChidG4sIG51bVN0ZXBzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1hcmdpblZhbHVlID0gMixcbiAgICAgICAgICAgIGRpdldpZHRoID0gMTA7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbnVtU3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdzb3J0LXN0ZXBzIGRlc2NlbmRpbmcnO1xuICAgICAgICAgICAgZGl2V2lkdGggPSBkaXZXaWR0aCAtICgoaSAvIGRpdldpZHRoKSAqIDUpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IChkaXZXaWR0aC50b0ZpeGVkKCkpICsgJ3B4JztcbiAgICAgICAgICAgIGlmIChpID09PSAobnVtU3RlcHMgLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgeUF4aXM7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdGhlIGNyb3NzdGFiIGFycmF5XG4gICAgICAgIHRoaXMuY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG5cbiAgICAgICAgLy8gRmluZCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW0gZm9yIHRoZSBheGVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvd0xhc3RDaGFydCA9IHRoaXMuY3Jvc3N0YWJbaV1bdGhpcy5jcm9zc3RhYltpXS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChyb3dMYXN0Q2hhcnQubWF4IHx8IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgcm93TGFzdENoYXJ0Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSByb3dMYXN0Q2hhcnQubWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSByb3dMYXN0Q2hhcnQubWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgWSBheGlzIGNoYXJ0cyBpbiB0aGUgY3Jvc3N0YWIgYXJyYXkgd2l0aCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXSxcbiAgICAgICAgICAgICAgICByb3dBeGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0F4aXMgPSBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgY3Jvc3N0YWIgd2l0aCBvbmx5IHRoZSBheGVzLCBjYXB0aW9uIGFuZCBodG1sIHRleHQuXG4gICAgICAgIC8vIFJlcXVpcmVkIHNpbmNlIGF4ZXMgY2Fubm90IHJldHVybiBsaW1pdHMgdW5sZXNzIHRoZXkgYXJlIGRyYXduXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBGaW5kIGEgWSBBeGlzIGNoYXJ0XG4gICAgICAgIHlBeGlzID0geUF4aXMgfHwgdGhpcy5maW5kWUF4aXNDaGFydCgpO1xuXG4gICAgICAgIC8vIFBsYWNlIGEgY2hhcnQgb2JqZWN0IHdpdGggbGltaXRzIGZyb20gdGhlIFkgQXhpcyBpbiB0aGUgY29ycmVjdCBjZWxsXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKHlBeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSB5QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydEluc3RhbmNlID0gY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0SW5zdGFuY2UuZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCwgbWluTGltaXQsIG1heExpbWl0KVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0T2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBjcm9zc3RhYlxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gVXBkYXRlIGNyb3NzdGFiIHdoZW4gdGhlIG1vZGVsIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmV2ZW50TGlzdC5tb2RlbFVwZGF0ZWQsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSBoaWdobGlnaHQgcGxvdHMgd2hlbiBob3ZlcmVkIGluXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbSBwbG90cyB3aGVuIGhvdmVyZWQgb3V0XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZENyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgaSwgaWksXG4gICAgICAgICAgICBqLCBqaixcbiAgICAgICAgICAgIG9sZENoYXJ0cyA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBheGlzTGltaXRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0cy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLnJvd0hhc2ggJiYgY2VsbC5jb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRDaGFydCA9IHRoaXMuZ2V0T2xkQ2hhcnQob2xkQ2hhcnRzLCBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRDaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0ID0gY2hhcnRPYmpbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydE9ialswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNoYXJ0ID0gb2xkQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW1pdHMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5tYXggPSBsaW1pdHMubWF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taW4gPSBsaW1pdHMubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLm1heCB8fCBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgY2VsbC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IGNlbGwubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gY2VsbC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQgJiYgY2VsbC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93QXhpcyA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IGZpbHRlcmVkQ3Jvc3N0YWI7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCgpO1xuICAgICAgICBheGlzTGltaXRzID0gdGhpcy5nZXRZQXhpc0xpbWl0cygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2NhcHRpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcywgY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzFdKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnVwZGF0ZShjaGFydE9iai5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRZQXhpc0NoYXJ0ICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0WUF4aXNMaW1pdHMgKCkge1xuICAgICAgICBsZXQgaSwgaWksXG4gICAgICAgICAgICBqLCBqajtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycgJiYgY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNlbGwuY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLmdldExpbWl0cygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE9sZENoYXJ0IChvbGRDaGFydHMsIHJvd0hhc2gsIGNvbEhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IG9sZENoYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKG9sZENoYXJ0c1tpXS5yb3dIYXNoID09PSByb3dIYXNoICYmIG9sZENoYXJ0c1tpXS5jb2xIYXNoID09PSBjb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9sZENoYXJ0c1tpXS5jaGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRDaGFydHMgKGtleSwgb3JkZXIpIHtcbiAgICAgICAgbGV0IHNvcnRQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKSxcbiAgICAgICAgICAgIHNvcnRGbixcbiAgICAgICAgICAgIHNvcnRlZERhdGE7XG4gICAgICAgIGlmIChvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBhW2tleV0gLSBiW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IGJba2V5XSAtIGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiAwO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRQcm9jZXNzb3Iuc29ydChzb3J0Rm4pO1xuICAgICAgICBzb3J0ZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChzb3J0UHJvY2Vzc29yKTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYi5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICBsZXQgcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IGNlbGwuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYgPSBjaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooc29ydGVkRGF0YSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydE9ialsxXS5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q2F0ZWdvcmllcyA9IGNoYXJ0LmdldENvbmYoKS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNUeXBlID0gY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzVHlwZSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydENvbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUodGhpcy5jcm9zc3RhYik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFNvcnRCdXR0b25zKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChkYXRhU3RvcmUsIGNhdGVnb3JpZXMsIHJvd0ZpbHRlciwgY29sRmlsdGVyLCBtaW5MaW1pdCwgbWF4TGltaXQpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIC8vIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2hhcnQgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBkYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBpZiAobWluTGltaXQgIT09IHVuZGVmaW5lZCAmJiBtYXhMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzID0gW107XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRKU09OLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gdmFsW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29ydGVkQ2F0ZWdvcmllcy5pbmRleE9mKGNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZENhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzID0gc29ydGVkQ2F0ZWdvcmllcy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hhcnQgPSB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlOiBmaWx0ZXJlZERhdGEsXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGltaXRzID0gY2hhcnQuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCBjaGFydF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFNvcnRCdXR0b25zICgpIHtcbiAgICAgICAgbGV0IGFzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgaWkgPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkZXNjZW5kaW5nQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Rlc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgamogPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBzb3J0QnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NvcnQtYnRuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gYXNjZW5kaW5nQnRuc1tpXTtcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xpY2tFbGVtLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NTdHI7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtc3RlcHMnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUgPSBjbGlja0VsZW0ucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWVhc3VyZScpO1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyID0gY2xpY2tFbGVtLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzb3J0QnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKHNvcnRCdG5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xpY2tFbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0cik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzQXJlU29ydGVkLmJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzTGlzdCA9IGNsaWNrRWxlbS5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lYXN1cmVOYW1lID09PSB0aGlzLmNoYXJ0c0FyZVNvcnRlZC5tZWFzdXJlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QuaW5kZXhPZih0aGlzLmNoYXJ0c0FyZVNvcnRlZC5vcmRlcikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3MoY2xpY2tFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2FzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2FzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IG1lYXN1cmVOYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gZGVzY2VuZGluZ0J0bnNbal07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsaWNrRWxlbSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyO1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LXN0ZXBzJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lYXN1cmVOYW1lID0gY2xpY2tFbGVtLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1lYXN1cmUnKTtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciA9IGNsaWNrRWxlbS5jbGFzc05hbWUgKyAnIGFjdGl2ZSc7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc29ydEJ0bnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhzb3J0QnRuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsaWNrRWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c0FyZVNvcnRlZC5ib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc0xpc3QgPSBjbGlja0VsZW0uY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZWFzdXJlTmFtZSA9PT0gdGhpcy5jaGFydHNBcmVTb3J0ZWQubWVhc3VyZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmluZGV4T2YodGhpcy5jaGFydHNBcmVTb3J0ZWQub3JkZXIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKGNsaWNrRWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMobWVhc3VyZU5hbWUsICdkZXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nLXNvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogbWVhc3VyZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZW1vdmVBY3RpdmVDbGFzcyAoZWxlbSkge1xuICAgICAgICBsZXQgY2xhc3NObSA9IGVsZW0uY2xhc3NOYW1lXG4gICAgICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAgICAgLmZpbHRlcigodmFsKSA9PiB2YWwgIT09ICdhY3RpdmUnKVxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NObSk7XG4gICAgfVxuXG4gICAgYWRkQWN0aXZlQ2xhc3MgKGVsZW0pIHtcbiAgICAgICAgbGV0IGNsYXNzTm0gPSBlbGVtLmNsYXNzTmFtZVxuICAgICAgICAgICAgLnNwbGl0KCcgJyk7XG4gICAgICAgIGNsYXNzTm0ucHVzaCgnYWN0aXZlJyk7XG4gICAgICAgIGNsYXNzTm0gPSBjbGFzc05tLmpvaW4oJyAnKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NObSk7XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgLy8gT25lIHNoaWZ0IGZvciBibGFuayBib3hcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggKyBtZWFzdXJlc0xlbmd0aCArIDEpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKGRpbWVuc2lvbnNIb2xkZXIsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNMZW5ndGgsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIobWVhc3VyZXNIb2xkZXIsIG1lYXN1cmVzLCBtZWFzdXJlc0xlbmd0aCwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgIGZ1bmN0aW9uIHNldHVwTGlzdGVuZXIgKGhvbGRlciwgYXJyLCBhcnJMZW4sIGdsb2JhbEFycikge1xuICAgICAgICAgICAgbGV0IGxpbWl0TGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IDAsXG4gICAgICAgICAgICAgICAgbGFzdCA9IGFyckxlbiAtIDEsXG4gICAgICAgICAgICAgICAgbG4gPSBNYXRoLmxvZzI7XG5cbiAgICAgICAgICAgIGlmIChob2xkZXJbMF0pIHtcbiAgICAgICAgICAgICAgICBsaW1pdExlZnQgPSBwYXJzZUludChob2xkZXJbMF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IHBhcnNlSW50KGhvbGRlcltsYXN0XS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IGhvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGhvbGRlcltpXSxcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICBkaWZmID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWRab25lID0gaXRlbS5vcmlnTGVmdCArIHBhcnNlSW50KGVsLnN0eWxlLndpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ1ogPSBlbC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gaXRlbS5vcmlnTGVmdCArIGR4ICsgaXRlbS5hZGp1c3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA8IGxpbWl0TGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGxpbWl0TGVmdCAtIG5MZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdExlZnQgLSBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPiBsaW1pdFJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbkxlZnQgLSBsaW1pdFJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdFJpZ2h0ICsgbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IG5MZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8XG4gICAgICAgICAgICAgICAgICAgIChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICAgICAgICAgIHRhcmdldENsYXNzU3RyID0gdGFyZ2V0LmNsYXNzTmFtZTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnJyB8fCB0YXJnZXRDbGFzc1N0ci5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtYnRuJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVyMiwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=