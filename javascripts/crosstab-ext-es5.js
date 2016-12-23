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
	    measureUnits: ['₹', '$', ''],
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
	                headingTextNode,
	                htmlRef,
	                headerDiv,
	                dragDiv;
	
	            for (i = 0; i < l; i += 1) {
	                var classStr = '',
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
	                    var measureHeading = fieldComponent + ' ' + this.unitFunction(measureUnit);
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
	                marginValue = 1,
	                divWidth = 1;
	            for (i = 1; i <= numSteps; i++) {
	                node = document.createElement('span');
	                node.style.display = 'block';
	                node.className = 'sort-steps ascending';
	                divWidth = divWidth + i / divWidth * 3;
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
	                marginValue = 1,
	                divWidth = 9;
	            for (i = 1; i <= numSteps; i++) {
	                node = document.createElement('span');
	                node.style.display = 'block';
	                node.className = 'sort-steps descending';
	                divWidth = divWidth - i / divWidth * 4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDkwMzgzMjdhMDg5NjkwZDk5MzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJtZWFzdXJlVW5pdHMiLCJ1bml0RnVuY3Rpb24iLCJ1bml0IiwiY2hhcnRUeXBlIiwibm9EYXRhTWVzc2FnZSIsImNyb3NzdGFiQ29udGFpbmVyIiwiZGF0YUlzU29ydGFibGUiLCJjZWxsV2lkdGgiLCJjZWxsSGVpZ2h0IiwiZHJhZ2dhYmxlSGVhZGVycyIsImNoYXJ0Q29uZmlnIiwiY2hhcnQiLCJ3aW5kb3ciLCJjcm9zc3RhYiIsInJlbmRlckNyb3NzdGFiIiwibW9kdWxlIiwiZXhwb3J0cyIsImV2ZW50TGlzdCIsInN0b3JlUGFyYW1zIiwiX2NvbHVtbktleUFyciIsInNob3dGaWx0ZXIiLCJhZ2dyZWdhdGlvbiIsIk11bHRpQ2hhcnRpbmciLCJtYyIsImRhdGFTdG9yZSIsImNyZWF0ZURhdGFTdG9yZSIsInNldERhdGEiLCJkYXRhU291cmNlIiwiRXJyb3IiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY2hhcnRzQXJlU29ydGVkIiwiYm9vbCIsIm9yZGVyIiwibWVhc3VyZSIsImZpZWxkcyIsImdldEtleXMiLCJpIiwiaWkiLCJsZW5ndGgiLCJnZXRVbmlxdWVWYWx1ZXMiLCJjYXRlZ29yaWVzIiwidGFibGUiLCJyb3dPcmRlciIsImN1cnJlbnRJbmRleCIsImZpbHRlcmVkRGF0YVN0b3JlIiwicm93c3BhbiIsImZpZWxkQ29tcG9uZW50IiwiZmllbGRWYWx1ZXMiLCJsIiwicm93RWxlbWVudCIsImhhc0Z1cnRoZXJEZXB0aCIsImZpbHRlcmVkRGF0YUhhc2hLZXkiLCJjb2xMZW5ndGgiLCJodG1sUmVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJtaW5tYXhPYmoiLCJwdXNoIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwiY3JlYXRlUm93IiwiY2hhcnRUb3BNYXJnaW4iLCJjaGFydEJvdHRvbU1hcmdpbiIsInJldmVyc2UiLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImFzY2VuZGluZ1NvcnRCdG4iLCJkZXNjZW5kaW5nU29ydEJ0biIsImhlYWRpbmdUZXh0Tm9kZSIsImhlYWRlckRpdiIsImRyYWdEaXYiLCJtZWFzdXJlVW5pdCIsInNldEF0dHJpYnV0ZSIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwiYXBwZW5kRHJhZ0hhbmRsZSIsInBvc2l0aW9uIiwiaW5kZXhPZiIsIm1lYXN1cmVIZWFkaW5nIiwiY3JlYXRlVGV4dE5vZGUiLCJjcmVhdGVTb3J0QnV0dG9uIiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJtYXhMZW5ndGgiLCJvYmoiLCJmaWx0ZXIiLCJ2YWwiLCJhcnIiLCJjb2xPcmRlciIsInhBeGlzUm93IiwiY3JlYXRlRGltZW5zaW9uSGVhZGluZ3MiLCJjcmVhdGVWZXJ0aWNhbEF4aXNIZWFkZXIiLCJjcmVhdGVNZWFzdXJlSGVhZGluZ3MiLCJjaGFydExlZnRNYXJnaW4iLCJjaGFydFJpZ2h0TWFyZ2luIiwidW5zaGlmdCIsImNyZWF0ZUNhcHRpb24iLCJmaWx0ZXJzIiwic2xpY2UiLCJtYXRjaGVkVmFsdWVzIiwiZm9yRWFjaCIsImRpbWVuc2lvbiIsImZpbHRlckdlbiIsInZhbHVlIiwidG9TdHJpbmciLCJmaWx0ZXJWYWwiLCJyIiwiZ2xvYmFsQXJyYXkiLCJtYWtlR2xvYmFsQXJyYXkiLCJyZWN1cnNlIiwiYSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsImxlbiIsImsiLCJub2RlIiwibnVtSGFuZGxlcyIsImhhbmRsZVNwYW4iLCJtYXJnaW5MZWZ0IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwidmVydGljYWxBbGlnbiIsInNvcnRCdG4iLCJ0cmltIiwiYXBwZW5kQXNjZW5kaW5nU3RlcHMiLCJhcHBlbmREZXNjZW5kaW5nU3RlcHMiLCJidG4iLCJudW1TdGVwcyIsIm1hcmdpblZhbHVlIiwiZGl2V2lkdGgiLCJkaXNwbGF5IiwidG9GaXhlZCIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInlBeGlzIiwiY3JlYXRlQ3Jvc3N0YWIiLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiamoiLCJjcm9zc3RhYkVsZW1lbnQiLCJjb25mIiwidHlwZSIsImF4aXNUeXBlIiwiYXhpc0NoYXJ0IiwiY3JlYXRlTXVsdGlDaGFydCIsImZpbmRZQXhpc0NoYXJ0IiwiY2hhcnRJbnN0YW5jZSIsImdldENoYXJ0SW5zdGFuY2UiLCJsaW1pdHMiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiY2hhcnRPYmoiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kZWxVcGRhdGVkIiwiZSIsImQiLCJ1cGRhdGVDcm9zc3RhYiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsImZpbHRlcmVkQ3Jvc3N0YWIiLCJvbGRDaGFydHMiLCJheGlzTGltaXRzIiwiY2VsbCIsImNoYXJ0Q29uZiIsImdldENvbmYiLCJvbGRDaGFydCIsImdldE9sZENoYXJ0IiwiZ2V0WUF4aXNMaW1pdHMiLCJ1cGRhdGUiLCJzb3J0UHJvY2Vzc29yIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsInNvcnRGbiIsInNvcnRlZERhdGEiLCJiIiwic29ydCIsImdldENoaWxkTW9kZWwiLCJyb3dDYXRlZ29yaWVzIiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInNldHVwU29ydEJ1dHRvbnMiLCJyZXN1bHRzIiwicGVybXV0ZSIsIm1lbSIsImN1cnJlbnQiLCJzcGxpY2UiLCJjb25jYXQiLCJqb2luIiwicGVybXV0ZVN0cnMiLCJmaWx0ZXJTdHIiLCJzcGxpdCIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJmaWx0ZXJlZEpTT04iLCJnZXRKU09OIiwic29ydGVkQ2F0ZWdvcmllcyIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZ2V0TGltaXQiLCJhc2NlbmRpbmdCdG5zIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImRlc2NlbmRpbmdCdG5zIiwic29ydEJ0bnMiLCJjbGlja0VsZW0iLCJtZWFzdXJlTmFtZSIsInRhcmdldCIsInBhcmVudE5vZGUiLCJnZXRBdHRyaWJ1dGUiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVBY3RpdmVDbGFzcyIsImNsYXNzTGlzdCIsInNvcnRDaGFydHMiLCJlbGVtIiwiY2xhc3NObSIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZWxmIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImxpbWl0TGVmdCIsImxpbWl0UmlnaHQiLCJsYXN0IiwibG4iLCJNYXRoIiwibG9nMiIsImdyYXBoaWNzIiwibGVmdCIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0Q2xhc3NTdHIiLCJvcGFjaXR5IiwiYWRkIiwibW91c2VVcEhhbmRsZXIiLCJyZW1vdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUN0Q0Es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QUFLSSxnQkFBVyxNQUxmO0FBTUksYUFBUSxFQU5aO0FBT0ksZUFBVSxDQVBkO0FBUUksaUJBQVk7QUFSaEIsRUE3bUJhLEVBdW5CYjtBQUNJLGdCQUFXLE9BRGY7QUFFSSxjQUFTLFFBRmI7QUFHSSxhQUFRLE1BSFo7QUFJSSxjQUFTLE1BSmI7QUFLSSxnQkFBVyxRQUxmO0FBTUksYUFBUSxDQU5aO0FBT0ksZUFBVSxDQVBkO0FBUUksaUJBQVk7QUFSaEIsRUF2bkJhLENBQWpCLEMiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LWVzNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ5MDM4MzI3YTA4OTY5MGQ5OTM3IiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vbGFyZ2VEYXRhJyk7XG5cbnZhciBjb25maWcgPSB7XG4gICAgZGltZW5zaW9uczogWydQcm9kdWN0JywgJ1N0YXRlJywgJ01vbnRoJ10sXG4gICAgbWVhc3VyZXM6IFsnU2FsZScsICdQcm9maXQnLCAnVmlzaXRvcnMnXSxcbiAgICBtZWFzdXJlVW5pdHM6IFsn4oK5JywgJyQnLCAnJ10sXG4gICAgdW5pdEZ1bmN0aW9uOiAodW5pdCkgPT4gJygnICsgdW5pdCArICcpJyxcbiAgICBjaGFydFR5cGU6ICdiYXIyZCcsXG4gICAgbm9EYXRhTWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheS4nLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcbiAgICBkYXRhSXNTb3J0YWJsZTogdHJ1ZSxcbiAgICBjZWxsV2lkdGg6IDE1MCxcbiAgICBjZWxsSGVpZ2h0OiA4MCxcbiAgICAvLyBzaG93RmlsdGVyOiB0cnVlLFxuICAgIGRyYWdnYWJsZUhlYWRlcnM6IGZhbHNlLFxuICAgIC8vIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ3JvbGxPdmVyQmFuZENvbG9yJzogJyNiYWRhZjAnLFxuICAgICAgICAgICAgJ2NvbHVtbkhvdmVyQ29sb3InOiAnIzFiODNjYycsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNycsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyM1QjVCNUInLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlclRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIC8vIExpc3Qgb2YgcG9zc2libGUgZXZlbnRzIHJhaXNlZCBieSB0aGUgZGF0YSBzdG9yZS5cbiAgICAgICAgdGhpcy5ldmVudExpc3QgPSB7XG4gICAgICAgICAgICAnbW9kZWxVcGRhdGVkJzogJ21vZGVsdXBkYXRlZCcsXG4gICAgICAgICAgICAnbW9kZWxEZWxldGVkJzogJ21vZGVsZGVsZXRlZCcsXG4gICAgICAgICAgICAnbWV0YUluZm9VcGRhdGUnOiAnbWV0YWluZm91cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JVcGRhdGVkJzogJ3Byb2Nlc3NvcnVwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvckRlbGV0ZWQnOiAncHJvY2Vzc29yZGVsZXRlZCdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gUG90ZW50aWFsbHkgdW5uZWNlc3NhcnkgbWVtYmVyLlxuICAgICAgICAvLyBUT0RPOiBSZWZhY3RvciBjb2RlIGRlcGVuZGVudCBvbiB2YXJpYWJsZS5cbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHZhcmlhYmxlLlxuICAgICAgICB0aGlzLnN0b3JlUGFyYW1zID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIC8vIEFycmF5IG9mIGNvbHVtbiBuYW1lcyAobWVhc3VyZXMpIHVzZWQgd2hlbiBidWlsZGluZyB0aGUgY3Jvc3N0YWIgYXJyYXkuXG4gICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICAvLyBTYXZpbmcgcHJvdmlkZWQgY29uZmlndXJhdGlvbiBpbnRvIGluc3RhbmNlLlxuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLm1lYXN1cmVVbml0cyA9IGNvbmZpZy5tZWFzdXJlVW5pdHM7XG4gICAgICAgIHRoaXMuZGF0YUlzU29ydGFibGUgPSBjb25maWcuZGF0YUlzU29ydGFibGU7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aCB8fCAyMTA7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0IHx8IDExMztcbiAgICAgICAgdGhpcy5zaG93RmlsdGVyID0gY29uZmlnLnNob3dGaWx0ZXIgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb24gfHwgJ3N1bSc7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVhZGVycyA9IGNvbmZpZy5kcmFnZ2FibGVIZWFkZXJzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZSB8fCAnTm8gZGF0YSB0byBkaXNwbGF5Lic7XG4gICAgICAgIHRoaXMudW5pdEZ1bmN0aW9uID0gY29uZmlnLnVuaXRGdW5jdGlvbiB8fCBmdW5jdGlvbiAodW5pdCkgeyByZXR1cm4gJygnICsgdW5pdCArICcpJzsgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBNdWx0aUNoYXJ0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLm1jID0gbmV3IE11bHRpQ2hhcnRpbmcoKTtcbiAgICAgICAgICAgIC8vIENyZWF0aW5nIGFuIGVtcHR5IGRhdGEgc3RvcmVcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgICAgIC8vIEFkZGluZyBkYXRhIHRvIHRoZSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aUNoYXJ0bmcgbW9kdWxlIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zaG93RmlsdGVyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFGaWx0ZXJFeHQgPSBuZXcgRkNEYXRhRmlsdGVyRXh0KHRoaXMuZGF0YVN0b3JlLCBmaWx0ZXJDb25maWcsICdjb250cm9sLWJveCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGFGaWx0ZXIgbW9kdWxlIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBCdWlsZGluZyBhIGRhdGEgc3RydWN0dXJlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgaGFzaCBtYXAgb2YgYXBwbGljYWJsZSBmaWx0ZXJzIGFuZCB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgZnVuY3Rpb25zXG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgIGJvb2w6IGZhbHNlLFxuICAgICAgICAgICAgb3JkZXI6ICcnLFxuICAgICAgICAgICAgbWVhc3VyZTogJydcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbiBhcnJheSBvZiBhcnJheXMgZGF0YSBzdHJ1Y3R1cmUgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBhcnJheXMgZ2VuZXJhdGVkIGZyb20gdGhlIGRhdGFTdG9yZSdzIGFycmF5IG9mIG9iamVjdHNcbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBsZXQgZGF0YVN0b3JlID0gdGhpcy5kYXRhU3RvcmUsXG4gICAgICAgICAgICBmaWVsZHMgPSBkYXRhU3RvcmUuZ2V0S2V5cygpO1xuICAgICAgICBpZiAoZmllbGRzKSB7XG4gICAgICAgICAgICBsZXQgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSBkYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNhdGVnb3JpZXMgZm9yIGNoYXJ0cyAoaS5lLiBubyBzb3J0aW5nIGFwcGxpZWQpXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBnbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZW5lcmF0ZSBrZXlzIGZyb20gZGF0YSBzdG9yZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuX2NvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZlcnRpY2FsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXMucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZlcnRpY2FsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5fY29sdW1uS2V5QXJyW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcnQ6IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5fY29sdW1uS2V5QXJyW2pdKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NoYXJ0LWNlbGwgJyArIChqICsgMSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IGNvbExlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5jbGFzc05hbWUgPSAnY2hhcnQtY2VsbCBsYXN0LWNvbCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlTWVhc3VyZUhlYWRpbmdzICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgYXNjZW5kaW5nU29ydEJ0bixcbiAgICAgICAgICAgIGRlc2NlbmRpbmdTb3J0QnRuLFxuICAgICAgICAgICAgaGVhZGluZ1RleHROb2RlLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZVVuaXQgPSAnJztcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZWFzdXJlLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIGh0bWxSZWYuc2V0QXR0cmlidXRlKCdkYXRhLW1lYXN1cmUnLCBmaWVsZENvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIG1lYXN1cmVVbml0ID0gdGhpcy5tZWFzdXJlVW5pdHNbdGhpcy5tZWFzdXJlcy5pbmRleE9mKGZpZWxkQ29tcG9uZW50KV07XG4gICAgICAgICAgICBpZiAobWVhc3VyZVVuaXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBtZWFzdXJlSGVhZGluZyA9IGZpZWxkQ29tcG9uZW50ICsgJyAnICsgdGhpcy51bml0RnVuY3Rpb24obWVhc3VyZVVuaXQpO1xuICAgICAgICAgICAgICAgIGhlYWRpbmdUZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1lYXN1cmVIZWFkaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZ1RleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmllbGRDb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoZWFkaW5nVGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmaWVsZENvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2FzY2VuZGluZy1zb3J0Jyk7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgICAgIGRlc2NlbmRpbmdTb3J0QnRuID0gdGhpcy5jcmVhdGVTb3J0QnV0dG9uKCdkZXNjZW5kaW5nLXNvcnQnKTtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGRlc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoYXNjZW5kaW5nU29ydEJ0bik7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChoZWFkaW5nVGV4dE5vZGUpO1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoZGVzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGhlYWRpbmdUZXh0Tm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgLy8gaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLW1lYXN1cmVzICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbktleUFyci5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICAgICAgdGFibGVbMF0ucHVzaChjb2xFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyAoY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICBoZWFkZXJEaXYsXG4gICAgICAgICAgICBkcmFnRGl2O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2RpbWVuc2lvbi1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ2RpbWVuc2lvbi1oZWFkZXIgJyArIHRoaXMuZGltZW5zaW9uc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyICs9ICcgZHJhZ2dhYmxlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChkcmFnRGl2KTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZGltZW5zaW9uc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciAoKSB7XG4gICAgICAgIGxldCBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWhlYWRlci1jZWxsJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNyZWF0ZUNhcHRpb24gKG1heExlbmd0aCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2FwdGlvbi1jaGFydCcsXG4gICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29sT3JkZXIgPSB0aGlzLm1lYXN1cmVzLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgLy8gSW5zZXJ0IGRpbWVuc2lvbiBoZWFkaW5nc1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCB2ZXJ0aWNhbCBheGlzIGhlYWRlclxuICAgICAgICAgICAgdGFibGVbMF0ucHVzaCh0aGlzLmNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlcigpKTtcbiAgICAgICAgICAgIC8vIEluc2VydCBtZWFzdXJlIGhlYWRpbmdzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU1lYXN1cmVIZWFkaW5ncyh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIC8vIEluc2VydCByb3dzXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgLy8gRmluZCByb3cgd2l0aCBtYXggbGVuZ3RoIGluIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQdXNoIGJsYW5rIHBhZGRpbmcgY2VsbHMgdW5kZXIgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIHNhbWUgcm93IGFzIHRoZSBob3Jpem9udGFsIGF4aXNcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4dHJhIGNlbGwgZm9yIHkgYXhpcy4gRXNzZW50aWFsbHkgWSBheGlzIGZvb3Rlci5cbiAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWZvb3Rlci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFB1c2ggaG9yaXpvbnRhbCBheGVzIGludG8gdGhlIGxhc3Qgcm93IG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogdGhpcy5jYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIC8vIFBsYWNlIHRoZSBjYXB0aW9uIGNlbGwgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgdGFibGVcbiAgICAgICAgICAgIHRhYmxlLnVuc2hpZnQodGhpcy5jcmVhdGVDYXB0aW9uKG1heExlbmd0aCkpO1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBObyBkYXRhIGZvciBjcm9zc3RhYi4gOihcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucy5zbGljZSgwLCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGRpbWVuc2lvbnMuZm9yRWFjaChkaW1lbnNpb24gPT4ge1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVtkaW1lbnNpb25dO1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKGRpbWVuc2lvbiwgdmFsdWUudG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5pbmRleE9mKGtleSkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAga2V5ICE9PSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIGFwcGVuZERyYWdIYW5kbGUgKG5vZGUsIG51bUhhbmRsZXMpIHtcbiAgICAgICAgbGV0IGksXG4gICAgICAgICAgICBoYW5kbGVTcGFuO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtSGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5tYXJnaW5MZWZ0ID0gJzFweCc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLmZvbnRTaXplID0gJzNweCc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLmxpbmVIZWlnaHQgPSAnMSc7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAndG9wJztcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoaGFuZGxlU3Bhbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTb3J0QnV0dG9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgbGV0IHNvcnRCdG4sXG4gICAgICAgICAgICBjbGFzc1N0ciA9ICdzb3J0LWJ0bicgKyAnICcgKyAoY2xhc3NOYW1lIHx8ICcnKTtcbiAgICAgICAgc29ydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgc29ydEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIudHJpbSgpKTtcbiAgICAgICAgc29ydEJ0bi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGlmIChjbGFzc05hbWUgPT09ICdhc2NlbmRpbmctc29ydCcpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQXNjZW5kaW5nU3RlcHMoc29ydEJ0biwgNCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAnZGVzY2VuZGluZy1zb3J0Jykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREZXNjZW5kaW5nU3RlcHMoc29ydEJ0biwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvcnRCdG47XG4gICAgfVxuXG4gICAgYXBwZW5kQXNjZW5kaW5nU3RlcHMgKGJ0biwgbnVtU3RlcHMpIHtcbiAgICAgICAgbGV0IGksXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWFyZ2luVmFsdWUgPSAxLFxuICAgICAgICAgICAgZGl2V2lkdGggPSAxO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSAnc29ydC1zdGVwcyBhc2NlbmRpbmcnO1xuICAgICAgICAgICAgZGl2V2lkdGggPSBkaXZXaWR0aCArICgoaSAvIGRpdldpZHRoKSAqIDMpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IChkaXZXaWR0aC50b0ZpeGVkKCkpICsgJ3B4JztcbiAgICAgICAgICAgIGlmIChpID09PSAobnVtU3RlcHMgLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZERlc2NlbmRpbmdTdGVwcyAoYnRuLCBudW1TdGVwcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtYXJnaW5WYWx1ZSA9IDEsXG4gICAgICAgICAgICBkaXZXaWR0aCA9IDk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbnVtU3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdzb3J0LXN0ZXBzIGRlc2NlbmRpbmcnO1xuICAgICAgICAgICAgZGl2V2lkdGggPSBkaXZXaWR0aCAtICgoaSAvIGRpdldpZHRoKSAqIDQpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IChkaXZXaWR0aC50b0ZpeGVkKCkpICsgJ3B4JztcbiAgICAgICAgICAgIGlmIChpID09PSAobnVtU3RlcHMgLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgeUF4aXM7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdGhlIGNyb3NzdGFiIGFycmF5XG4gICAgICAgIHRoaXMuY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG5cbiAgICAgICAgLy8gRmluZCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW0gZm9yIHRoZSBheGVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvd0xhc3RDaGFydCA9IHRoaXMuY3Jvc3N0YWJbaV1bdGhpcy5jcm9zc3RhYltpXS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChyb3dMYXN0Q2hhcnQubWF4IHx8IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgcm93TGFzdENoYXJ0Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSByb3dMYXN0Q2hhcnQubWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSByb3dMYXN0Q2hhcnQubWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgWSBheGlzIGNoYXJ0cyBpbiB0aGUgY3Jvc3N0YWIgYXJyYXkgd2l0aCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXSxcbiAgICAgICAgICAgICAgICByb3dBeGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0F4aXMgPSBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgY3Jvc3N0YWIgd2l0aCBvbmx5IHRoZSBheGVzLCBjYXB0aW9uIGFuZCBodG1sIHRleHQuXG4gICAgICAgIC8vIFJlcXVpcmVkIHNpbmNlIGF4ZXMgY2Fubm90IHJldHVybiBsaW1pdHMgdW5sZXNzIHRoZXkgYXJlIGRyYXduXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBGaW5kIGEgWSBBeGlzIGNoYXJ0XG4gICAgICAgIHlBeGlzID0geUF4aXMgfHwgdGhpcy5maW5kWUF4aXNDaGFydCgpO1xuXG4gICAgICAgIC8vIFBsYWNlIGEgY2hhcnQgb2JqZWN0IHdpdGggbGltaXRzIGZyb20gdGhlIFkgQXhpcyBpbiB0aGUgY29ycmVjdCBjZWxsXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKHlBeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSB5QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydEluc3RhbmNlID0gY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0SW5zdGFuY2UuZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCwgbWluTGltaXQsIG1heExpbWl0KVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0T2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBjcm9zc3RhYlxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gVXBkYXRlIGNyb3NzdGFiIHdoZW4gdGhlIG1vZGVsIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmV2ZW50TGlzdC5tb2RlbFVwZGF0ZWQsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSBoaWdobGlnaHQgcGxvdHMgd2hlbiBob3ZlcmVkIGluXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbSBwbG90cyB3aGVuIGhvdmVyZWQgb3V0XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZENyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgaSwgaWksXG4gICAgICAgICAgICBqLCBqaixcbiAgICAgICAgICAgIG9sZENoYXJ0cyA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBheGlzTGltaXRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0cy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLnJvd0hhc2ggJiYgY2VsbC5jb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRDaGFydCA9IHRoaXMuZ2V0T2xkQ2hhcnQob2xkQ2hhcnRzLCBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRDaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0ID0gY2hhcnRPYmpbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydE9ialswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNoYXJ0ID0gb2xkQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW1pdHMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5tYXggPSBsaW1pdHMubWF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taW4gPSBsaW1pdHMubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLm1heCB8fCBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgY2VsbC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IGNlbGwubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gY2VsbC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQgJiYgY2VsbC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93QXhpcyA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IGZpbHRlcmVkQ3Jvc3N0YWI7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCgpO1xuICAgICAgICBheGlzTGltaXRzID0gdGhpcy5nZXRZQXhpc0xpbWl0cygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2NhcHRpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcywgY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzFdKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnVwZGF0ZShjaGFydE9iai5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRZQXhpc0NoYXJ0ICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0WUF4aXNMaW1pdHMgKCkge1xuICAgICAgICBsZXQgaSwgaWksXG4gICAgICAgICAgICBqLCBqajtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycgJiYgY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNlbGwuY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLmdldExpbWl0cygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE9sZENoYXJ0IChvbGRDaGFydHMsIHJvd0hhc2gsIGNvbEhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IG9sZENoYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKG9sZENoYXJ0c1tpXS5yb3dIYXNoID09PSByb3dIYXNoICYmIG9sZENoYXJ0c1tpXS5jb2xIYXNoID09PSBjb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9sZENoYXJ0c1tpXS5jaGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRDaGFydHMgKGtleSwgb3JkZXIpIHtcbiAgICAgICAgbGV0IHNvcnRQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKSxcbiAgICAgICAgICAgIHNvcnRGbixcbiAgICAgICAgICAgIHNvcnRlZERhdGE7XG4gICAgICAgIGlmIChvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBhW2tleV0gLSBiW2tleV07XG4gICAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09ICdkZXNjZW5kaW5nJykge1xuICAgICAgICAgICAgc29ydEZuID0gKGEsIGIpID0+IGJba2V5XSAtIGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiAwO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRQcm9jZXNzb3Iuc29ydChzb3J0Rm4pO1xuICAgICAgICBzb3J0ZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChzb3J0UHJvY2Vzc29yKTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYi5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICBsZXQgcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IGNlbGwuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYgPSBjaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooc29ydGVkRGF0YSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydE9ialsxXS5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q2F0ZWdvcmllcyA9IGNoYXJ0LmdldENvbmYoKS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNUeXBlID0gY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzVHlwZSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZi5jb25maWcuY2F0ZWdvcmllcyA9IHJvd0NhdGVnb3JpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydENvbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUodGhpcy5jcm9zc3RhYik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFNvcnRCdXR0b25zKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChkYXRhU3RvcmUsIGNhdGVnb3JpZXMsIHJvd0ZpbHRlciwgY29sRmlsdGVyLCBtaW5MaW1pdCwgbWF4TGltaXQpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIC8vIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2hhcnQgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBkYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBpZiAobWluTGltaXQgIT09IHVuZGVmaW5lZCAmJiBtYXhMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydENvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhSXNTb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzID0gW107XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRKU09OLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gdmFsW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29ydGVkQ2F0ZWdvcmllcy5pbmRleE9mKGNhdGVnb3J5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZENhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzID0gc29ydGVkQ2F0ZWdvcmllcy5zbGljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hhcnQgPSB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlOiBmaWx0ZXJlZERhdGEsXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGltaXRzID0gY2hhcnQuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCBjaGFydF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cFNvcnRCdXR0b25zICgpIHtcbiAgICAgICAgbGV0IGFzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgaWkgPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkZXNjZW5kaW5nQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Rlc2NlbmRpbmctc29ydCcpLFxuICAgICAgICAgICAgamogPSBhc2NlbmRpbmdCdG5zLmxlbmd0aCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBzb3J0QnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NvcnQtYnRuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gYXNjZW5kaW5nQnRuc1tpXTtcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xpY2tFbGVtLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NTdHI7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtc3RlcHMnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUgPSBjbGlja0VsZW0ucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWVhc3VyZScpO1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyID0gY2xpY2tFbGVtLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzb3J0QnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKHNvcnRCdG5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xpY2tFbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0cik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzQXJlU29ydGVkLmJvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzTGlzdCA9IGNsaWNrRWxlbS5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lYXN1cmVOYW1lID09PSB0aGlzLmNoYXJ0c0FyZVNvcnRlZC5tZWFzdXJlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QuaW5kZXhPZih0aGlzLmNoYXJ0c0FyZVNvcnRlZC5vcmRlcikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3MoY2xpY2tFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2FzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2FzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2FzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IG1lYXN1cmVOYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gZGVzY2VuZGluZ0J0bnNbal07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsaWNrRWxlbSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyO1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LXN0ZXBzJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lYXN1cmVOYW1lID0gY2xpY2tFbGVtLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1lYXN1cmUnKTtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciA9IGNsaWNrRWxlbS5jbGFzc05hbWUgKyAnIGFjdGl2ZSc7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc29ydEJ0bnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhzb3J0QnRuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsaWNrRWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c0FyZVNvcnRlZC5ib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc0xpc3QgPSBjbGlja0VsZW0uY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZWFzdXJlTmFtZSA9PT0gdGhpcy5jaGFydHNBcmVTb3J0ZWQubWVhc3VyZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmluZGV4T2YodGhpcy5jaGFydHNBcmVTb3J0ZWQub3JkZXIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKGNsaWNrRWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMobWVhc3VyZU5hbWUsICdkZXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyhtZWFzdXJlTmFtZSwgJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nLXNvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogbWVhc3VyZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZW1vdmVBY3RpdmVDbGFzcyAoZWxlbSkge1xuICAgICAgICBsZXQgY2xhc3NObSA9IGVsZW0uY2xhc3NOYW1lXG4gICAgICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAgICAgLmZpbHRlcigodmFsKSA9PiB2YWwgIT09ICdhY3RpdmUnKVxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NObSk7XG4gICAgfVxuXG4gICAgYWRkQWN0aXZlQ2xhc3MgKGVsZW0pIHtcbiAgICAgICAgbGV0IGNsYXNzTm0gPSBlbGVtLmNsYXNzTmFtZVxuICAgICAgICAgICAgLnNwbGl0KCcgJyk7XG4gICAgICAgIGNsYXNzTm0ucHVzaCgnYWN0aXZlJyk7XG4gICAgICAgIGNsYXNzTm0gPSBjbGFzc05tLmpvaW4oJyAnKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NObSk7XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgLy8gT25lIHNoaWZ0IGZvciBibGFuayBib3hcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggKyBtZWFzdXJlc0xlbmd0aCArIDEpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKGRpbWVuc2lvbnNIb2xkZXIsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNMZW5ndGgsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIobWVhc3VyZXNIb2xkZXIsIG1lYXN1cmVzLCBtZWFzdXJlc0xlbmd0aCwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgIGZ1bmN0aW9uIHNldHVwTGlzdGVuZXIgKGhvbGRlciwgYXJyLCBhcnJMZW4sIGdsb2JhbEFycikge1xuICAgICAgICAgICAgbGV0IGxpbWl0TGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IDAsXG4gICAgICAgICAgICAgICAgbGFzdCA9IGFyckxlbiAtIDEsXG4gICAgICAgICAgICAgICAgbG4gPSBNYXRoLmxvZzI7XG5cbiAgICAgICAgICAgIGlmIChob2xkZXJbMF0pIHtcbiAgICAgICAgICAgICAgICBsaW1pdExlZnQgPSBwYXJzZUludChob2xkZXJbMF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IHBhcnNlSW50KGhvbGRlcltsYXN0XS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IGhvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGhvbGRlcltpXSxcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICBkaWZmID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWRab25lID0gaXRlbS5vcmlnTGVmdCArIHBhcnNlSW50KGVsLnN0eWxlLndpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ1ogPSBlbC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gaXRlbS5vcmlnTGVmdCArIGR4ICsgaXRlbS5hZGp1c3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA8IGxpbWl0TGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGxpbWl0TGVmdCAtIG5MZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdExlZnQgLSBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPiBsaW1pdFJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbkxlZnQgLSBsaW1pdFJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdFJpZ2h0ICsgbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IG5MZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8XG4gICAgICAgICAgICAgICAgICAgIChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICAgICAgICAgIHRhcmdldENsYXNzU3RyID0gdGFyZ2V0LmNsYXNzTmFtZTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnJyB8fCB0YXJnZXRDbGFzc1N0ci5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtYnRuJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVyMiwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=