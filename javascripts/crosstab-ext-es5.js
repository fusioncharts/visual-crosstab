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
	    draggableHeaders: false,
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
	            this.dataStore.updateMetaData('Sale', {
	                type: 'measure',
	                scaleType: 'nominal',
	                dataType: 'number',
	                discrete: 'true',
	                precision: 2,
	                aggregationMode: 'sum',
	                unit: 'INR'
	            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzgzYjg4NTdiYWEwMDQ3NzRjYjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJtZWFzdXJlVW5pdHMiLCJ1bml0RnVuY3Rpb24iLCJ1bml0IiwiY2hhcnRUeXBlIiwibm9EYXRhTWVzc2FnZSIsImNyb3NzdGFiQ29udGFpbmVyIiwiZGF0YUlzU29ydGFibGUiLCJjZWxsV2lkdGgiLCJjZWxsSGVpZ2h0IiwiZHJhZ2dhYmxlSGVhZGVycyIsImFnZ3JlZ2F0aW9uIiwiY2hhcnRDb25maWciLCJjaGFydCIsIndpbmRvdyIsImNyb3NzdGFiIiwicmVuZGVyQ3Jvc3N0YWIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXZlbnRMaXN0Iiwic3RvcmVQYXJhbXMiLCJfY29sdW1uS2V5QXJyIiwic2hvd0ZpbHRlciIsIk11bHRpQ2hhcnRpbmciLCJtYyIsImRhdGFTdG9yZSIsImNyZWF0ZURhdGFTdG9yZSIsInNldERhdGEiLCJkYXRhU291cmNlIiwidXBkYXRlTWV0YURhdGEiLCJ0eXBlIiwic2NhbGVUeXBlIiwiZGF0YVR5cGUiLCJkaXNjcmV0ZSIsInByZWNpc2lvbiIsImFnZ3JlZ2F0aW9uTW9kZSIsIkVycm9yIiwiRkNEYXRhRmlsdGVyRXh0IiwiZmlsdGVyQ29uZmlnIiwiZGF0YUZpbHRlckV4dCIsImdsb2JhbERhdGEiLCJidWlsZEdsb2JhbERhdGEiLCJoYXNoIiwiZ2V0RmlsdGVySGFzaE1hcCIsImNoYXJ0c0FyZVNvcnRlZCIsImJvb2wiLCJvcmRlciIsIm1lYXN1cmUiLCJmaWVsZHMiLCJnZXRLZXlzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwiY2F0ZWdvcmllcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwicHVzaCIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsImNyZWF0ZVJvdyIsImNoYXJ0VG9wTWFyZ2luIiwiY2hhcnRCb3R0b21NYXJnaW4iLCJyZXZlcnNlIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJhc2NlbmRpbmdTb3J0QnRuIiwiZGVzY2VuZGluZ1NvcnRCdG4iLCJoZWFkaW5nVGV4dCIsImhlYWRpbmdUZXh0U3BhbiIsIm1lYXN1cmVIZWFkaW5nIiwiaGVhZGVyRGl2IiwiZHJhZ0RpdiIsIm1lYXN1cmVVbml0IiwiYWdncmVnYXRpb25Ob2RlIiwic2V0QXR0cmlidXRlIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJhcHBlbmREcmFnSGFuZGxlIiwicG9zaXRpb24iLCJpbmRleE9mIiwic3BsaXQiLCJyZWR1Y2UiLCJhIiwiYiIsImlkeCIsInRvVXBwZXJDYXNlIiwiY3JlYXRlU29ydEJ1dHRvbiIsImNvcm5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsImNvbE9yZGVyTGVuZ3RoIiwiY29ybmVyQ2VsbEFyciIsInN1YnN0ciIsIm1heExlbmd0aCIsIm9iaiIsImZpbHRlciIsInZhbCIsImFyciIsImNvbE9yZGVyIiwieEF4aXNSb3ciLCJjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyIsImNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciIsImNyZWF0ZU1lYXN1cmVIZWFkaW5ncyIsImNoYXJ0TGVmdE1hcmdpbiIsImNoYXJ0UmlnaHRNYXJnaW4iLCJ1bnNoaWZ0IiwiY3JlYXRlQ2FwdGlvbiIsImZpbHRlcnMiLCJzbGljZSIsIm1hdGNoZWRWYWx1ZXMiLCJmb3JFYWNoIiwiZGltZW5zaW9uIiwiZmlsdGVyR2VuIiwidmFsdWUiLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJ0ZW1wT2JqIiwidGVtcEFyciIsImtleSIsImhhc093blByb3BlcnR5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImNyZWF0ZUZpbHRlcnMiLCJkYXRhQ29tYm9zIiwiY3JlYXRlRGF0YUNvbWJvcyIsImhhc2hNYXAiLCJkYXRhQ29tYm8iLCJsZW4iLCJrIiwibm9kZSIsIm51bUhhbmRsZXMiLCJoYW5kbGVTcGFuIiwibWFyZ2luTGVmdCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsInZlcnRpY2FsQWxpZ24iLCJzb3J0QnRuIiwidHJpbSIsImRpc3BsYXkiLCJhcHBlbmRBc2NlbmRpbmdTdGVwcyIsImFwcGVuZERlc2NlbmRpbmdTdGVwcyIsImJ0biIsIm51bVN0ZXBzIiwibWFyZ2luVmFsdWUiLCJkaXZXaWR0aCIsInRvRml4ZWQiLCJnbG9iYWxNYXgiLCJnbG9iYWxNaW4iLCJ5QXhpcyIsImNyZWF0ZUNyb3NzdGFiIiwicm93TGFzdENoYXJ0Iiwicm93Iiwicm93QXhpcyIsImpqIiwiY3Jvc3N0YWJFbGVtZW50IiwiY29uZiIsImF4aXNUeXBlIiwiYXhpc0NoYXJ0IiwiY3JlYXRlTXVsdGlDaGFydCIsImZpbmRZQXhpc0NoYXJ0IiwiY2hhcnRJbnN0YW5jZSIsImdldENoYXJ0SW5zdGFuY2UiLCJsaW1pdHMiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiY2hhcnRPYmoiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kZWxVcGRhdGVkIiwiZSIsImQiLCJ1cGRhdGVDcm9zc3RhYiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsImZpbHRlcmVkQ3Jvc3N0YWIiLCJvbGRDaGFydHMiLCJheGlzTGltaXRzIiwiY2VsbCIsImNoYXJ0Q29uZiIsImdldENvbmYiLCJvbGRDaGFydCIsImdldE9sZENoYXJ0IiwiZ2V0WUF4aXNMaW1pdHMiLCJ1cGRhdGUiLCJzb3J0UHJvY2Vzc29yIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsInNvcnRGbiIsInNvcnRlZERhdGEiLCJzb3J0IiwiZ2V0Q2hpbGRNb2RlbCIsInJvd0NhdGVnb3JpZXMiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwic2V0dXBTb3J0QnV0dG9ucyIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsInNwbGljZSIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJmaWx0ZXJlZEpTT04iLCJnZXRKU09OIiwic29ydGVkQ2F0ZWdvcmllcyIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZ2V0TGltaXQiLCJhc2NlbmRpbmdCdG5zIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImRlc2NlbmRpbmdCdG5zIiwic29ydEJ0bnMiLCJjbGlja0VsZW0iLCJtZWFzdXJlTmFtZSIsInRhcmdldCIsInBhcmVudE5vZGUiLCJnZXRBdHRyaWJ1dGUiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVBY3RpdmVDbGFzcyIsImNsYXNzTGlzdCIsInNvcnRDaGFydHMiLCJlbGVtIiwiY2xhc3NObSIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZWxmIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImxpbWl0TGVmdCIsImxpbWl0UmlnaHQiLCJsYXN0IiwibG4iLCJNYXRoIiwibG9nMiIsImdyYXBoaWNzIiwibGVmdCIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0Q2xhc3NTdHIiLCJvcGFjaXR5IiwiYWRkIiwibW91c2VVcEhhbmRsZXIiLCJyZW1vdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFD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VyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzODNiODg1N2JhYTAwNDc3NGNiMiIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnUHJvZml0JywgJ1Zpc2l0b3JzJ10sXG4gICAgbWVhc3VyZVVuaXRzOiBbJ0lOUicsICckJywgJyddLFxuICAgIHVuaXRGdW5jdGlvbjogKHVuaXQpID0+ICcoJyArIHVuaXQgKyAnKScsXG4gICAgY2hhcnRUeXBlOiAnYmFyMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgZGF0YUlzU29ydGFibGU6IHRydWUsXG4gICAgY2VsbFdpZHRoOiAxNTAsXG4gICAgY2VsbEhlaWdodDogODAsXG4gICAgLy8gc2hvd0ZpbHRlcjogdHJ1ZSxcbiAgICBkcmFnZ2FibGVIZWFkZXJzOiBmYWxzZSxcbiAgICBhZ2dyZWdhdGlvbjogJ21pbicsXG4gICAgY2hhcnRDb25maWc6IHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICdzaG93Qm9yZGVyJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdyb2xsT3ZlckJhbmRDb2xvcic6ICcjYmFkYWYwJyxcbiAgICAgICAgICAgICdjb2x1bW5Ib3ZlckNvbG9yJzogJyMxYjgzY2MnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzInLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzcnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjNUI1QjVCJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnZHJhd1RyZW5kUmVnaW9uJzogJzEnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAvLyBMaXN0IG9mIHBvc3NpYmxlIGV2ZW50cyByYWlzZWQgYnkgdGhlIGRhdGEgc3RvcmUuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ID0ge1xuICAgICAgICAgICAgJ21vZGVsVXBkYXRlZCc6ICdtb2RlbHVwZGF0ZWQnLFxuICAgICAgICAgICAgJ21vZGVsRGVsZXRlZCc6ICdtb2RlbGRlbGV0ZWQnLFxuICAgICAgICAgICAgJ21ldGFJbmZvVXBkYXRlJzogJ21ldGFpbmZvdXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yVXBkYXRlZCc6ICdwcm9jZXNzb3J1cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JEZWxldGVkJzogJ3Byb2Nlc3NvcmRlbGV0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIC8vIFBvdGVudGlhbGx5IHVubmVjZXNzYXJ5IG1lbWJlci5cbiAgICAgICAgLy8gVE9ETzogUmVmYWN0b3IgY29kZSBkZXBlbmRlbnQgb24gdmFyaWFibGUuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB2YXJpYWJsZS5cbiAgICAgICAgdGhpcy5zdG9yZVBhcmFtcyA9IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICB9O1xuICAgICAgICAvLyBBcnJheSBvZiBjb2x1bW4gbmFtZXMgKG1lYXN1cmVzKSB1c2VkIHdoZW4gYnVpbGRpbmcgdGhlIGNyb3NzdGFiIGFycmF5LlxuICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgLy8gU2F2aW5nIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gaW50byBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5tZWFzdXJlVW5pdHMgPSBjb25maWcubWVhc3VyZVVuaXRzO1xuICAgICAgICB0aGlzLmRhdGFJc1NvcnRhYmxlID0gY29uZmlnLmRhdGFJc1NvcnRhYmxlO1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuc2hvd0ZpbHRlciA9IGNvbmZpZy5zaG93RmlsdGVyIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uIHx8ICdzdW0nO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZUhlYWRlcnMgPSBjb25maWcuZHJhZ2dhYmxlSGVhZGVycyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2UgfHwgJ05vIGRhdGEgdG8gZGlzcGxheS4nO1xuICAgICAgICB0aGlzLnVuaXRGdW5jdGlvbiA9IGNvbmZpZy51bml0RnVuY3Rpb24gfHwgZnVuY3Rpb24gKHVuaXQpIHsgcmV0dXJuICcoJyArIHVuaXQgKyAnKSc7IH07XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICAvLyBDcmVhdGluZyBhbiBlbXB0eSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICAvLyBBZGRpbmcgZGF0YSB0byB0aGUgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnVwZGF0ZU1ldGFEYXRhKCdTYWxlJywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdtZWFzdXJlJyxcbiAgICAgICAgICAgICAgICBzY2FsZVR5cGU6ICdub21pbmFsJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgZGlzY3JldGU6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IDIsXG4gICAgICAgICAgICAgICAgYWdncmVnYXRpb25Nb2RlOiAnc3VtJyxcbiAgICAgICAgICAgICAgICB1bml0OiAnSU5SJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpQ2hhcnRuZyBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YUZpbHRlciBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgZGF0YSBzdHJ1Y3R1cmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgLy8gQnVpbGRpbmcgYSBoYXNoIG1hcCBvZiBhcHBsaWNhYmxlIGZpbHRlcnMgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgYm9vbDogZmFsc2UsXG4gICAgICAgICAgICBvcmRlcjogJycsXG4gICAgICAgICAgICBtZWFzdXJlOiAnJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFuIGFycmF5IG9mIGFycmF5cyBkYXRhIHN0cnVjdHVyZSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIGFycmF5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgZGF0YVN0b3JlJ3MgYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBkYXRhU3RvcmUgPSB0aGlzLmRhdGFTdG9yZSxcbiAgICAgICAgICAgIGZpZWxkcyA9IGRhdGFTdG9yZS5nZXRLZXlzKCk7XG4gICAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgICAgIGxldCBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IGRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY2F0ZWdvcmllcyBmb3IgY2hhcnRzIChpLmUuIG5vIHNvcnRpbmcgYXBwbGllZClcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdlbmVyYXRlIGtleXMgZnJvbSBkYXRhIHN0b3JlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5fY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlcixcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlUGFkZGluZyc6IDAuNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IHRoaXMuY2F0ZWdvcmllcy5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLl9jb2x1bW5LZXlBcnJbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFydDogdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2hhcnQtY2VsbCAnICsgKGogKyAxKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY29sTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLmNsYXNzTmFtZSA9ICdjaGFydC1jZWxsIGxhc3QtY29sJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMF07XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSAocGFyc2VJbnQobWlubWF4T2JqLm1pbikgPCBtaW4pID8gbWlubWF4T2JqLm1pbiA6IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1heCA9IG1heDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVNZWFzdXJlSGVhZGluZ3MgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBhc2NlbmRpbmdTb3J0QnRuLFxuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4sXG4gICAgICAgICAgICBoZWFkaW5nVGV4dCxcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0U3BhbixcbiAgICAgICAgICAgIG1lYXN1cmVIZWFkaW5nLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZVVuaXQgPSAnJyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGlvbk5vZGU7XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVhc3VyZS1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERyYWdIYW5kbGUoZHJhZ0RpdiwgMjUpO1xuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIGh0bWxSZWYuc2V0QXR0cmlidXRlKCdkYXRhLW1lYXN1cmUnLCBmaWVsZENvbXBvbmVudCk7XG5cbiAgICAgICAgICAgIG1lYXN1cmVVbml0ID0gdGhpcy5tZWFzdXJlVW5pdHNbdGhpcy5tZWFzdXJlcy5pbmRleE9mKGZpZWxkQ29tcG9uZW50KV07XG4gICAgICAgICAgICBpZiAobWVhc3VyZVVuaXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVIZWFkaW5nID0gZmllbGRDb21wb25lbnQgKyAnICcgKyB0aGlzLnVuaXRGdW5jdGlvbihtZWFzdXJlVW5pdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVIZWFkaW5nID0gZmllbGRDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhlYWRpbmdUZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0U3Bhbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lYXN1cmUtc3BhbicpO1xuXG4gICAgICAgICAgICBoZWFkaW5nVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGluZ1RleHQuaW5uZXJIVE1MID0gbWVhc3VyZUhlYWRpbmc7XG4gICAgICAgICAgICBoZWFkaW5nVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lYXN1cmUtdGV4dCcpO1xuICAgICAgICAgICAgaGVhZGluZ1RleHRTcGFuLmFwcGVuZENoaWxkKGhlYWRpbmdUZXh0KTtcblxuICAgICAgICAgICAgYWdncmVnYXRpb25Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk5vZGUuaW5uZXJIVE1MID0gdGhpcy5hZ2dyZWdhdGlvbi5zcGxpdCgnJykucmVkdWNlKChhLCBiLCBpZHgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWR4ID09PSAxID8gYS50b1VwcGVyQ2FzZSgpICsgYiA6IGEgKyBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk5vZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZWFzdXJlLWFnZ3JlZ2F0aW9uJyk7XG4gICAgICAgICAgICBoZWFkaW5nVGV4dFNwYW4uYXBwZW5kQ2hpbGQoYWdncmVnYXRpb25Ob2RlKTtcblxuICAgICAgICAgICAgLy8gaGVhZGluZ1RleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmllbGRDb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICBhc2NlbmRpbmdTb3J0QnRuID0gdGhpcy5jcmVhdGVTb3J0QnV0dG9uKCdhc2NlbmRpbmctc29ydCcpO1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoYXNjZW5kaW5nU29ydEJ0bik7XG5cbiAgICAgICAgICAgICAgICBkZXNjZW5kaW5nU29ydEJ0biA9IHRoaXMuY3JlYXRlU29ydEJ1dHRvbignZGVzY2VuZGluZy1zb3J0Jyk7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChkZXNjZW5kaW5nU29ydEJ0bik7XG5cbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGFzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoaGVhZGluZ1RleHRTcGFuKTtcbiAgICAgICAgICAgICAgICBodG1sUmVmLmFwcGVuZENoaWxkKGRlc2NlbmRpbmdTb3J0QnRuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChoZWFkaW5nVGV4dFNwYW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIC8vIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgLy8gaHRtbFJlZi5hcHBlbmRDaGlsZChhZ2dyZWdhdGlvbk5vZGUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1tZWFzdXJlcyAnICsgdGhpcy5tZWFzdXJlc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgICAgIGNsYXNzU3RyICs9ICcgZHJhZ2dhYmxlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuXG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoZHJhZ0Rpdik7XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0ICsgNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIChjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGltZW5zaW9uLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuZGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5kaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgPSAnZGltZW5zaW9uLWhlYWRlciAnICsgdGhpcy5kaW1lbnNpb25zW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyICgpIHtcbiAgICAgICAgbGV0IGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAobWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnQgZGltZW5zaW9uIGhlYWRpbmdzXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlRGltZW5zaW9uSGVhZGluZ3ModGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHZlcnRpY2FsIGF4aXMgaGVhZGVyXG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKHRoaXMuY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyKCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IG1lYXN1cmUgaGVhZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTWVhc3VyZUhlYWRpbmdzKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHJvd3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICAvLyBGaW5kIHJvdyB3aXRoIG1heCBsZW5ndGggaW4gdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFB1c2ggYmxhbmsgcGFkZGluZyBjZWxscyB1bmRlciB0aGUgZGltZW5zaW9ucyBpbiB0aGUgc2FtZSByb3cgYXMgdGhlIGhvcml6b250YWwgYXhpc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUHVzaCBob3Jpem9udGFsIGF4ZXMgaW50byB0aGUgbGFzdCByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIGNhcHRpb24gY2VsbCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgdGFibGUudW5zaGlmdCh0aGlzLmNyZWF0ZUNhcHRpb24obWF4TGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGRhdGEgZm9yIGNyb3NzdGFiLiA6KFxuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zLnNsaWNlKDAsIHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW2RpbWVuc2lvbl07XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4oZGltZW5zaW9uLCB2YWx1ZS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT09IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgYXBwZW5kRHJhZ0hhbmRsZSAobm9kZSwgbnVtSGFuZGxlcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIGhhbmRsZVNwYW47XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1IYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLm1hcmdpbkxlZnQgPSAnMXB4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUuZm9udFNpemUgPSAnM3B4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubGluZUhlaWdodCA9ICcxJztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnO1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChoYW5kbGVTcGFuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVNvcnRCdXR0b24gKGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgc29ydEJ0bixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ3NvcnQtYnRuJyArICcgJyArIChjbGFzc05hbWUgfHwgJycpO1xuICAgICAgICBzb3J0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzb3J0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0ci50cmltKCkpO1xuICAgICAgICBzb3J0QnRuLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgc29ydEJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgICAgIGlmIChjbGFzc05hbWUgPT09ICdhc2NlbmRpbmctc29ydCcpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQXNjZW5kaW5nU3RlcHMoc29ydEJ0biwgNCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAnZGVzY2VuZGluZy1zb3J0Jykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREZXNjZW5kaW5nU3RlcHMoc29ydEJ0biwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvcnRCdG47XG4gICAgfVxuXG4gICAgYXBwZW5kQXNjZW5kaW5nU3RlcHMgKGJ0biwgbnVtU3RlcHMpIHtcbiAgICAgICAgbGV0IGksXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWFyZ2luVmFsdWUgPSAyLFxuICAgICAgICAgICAgZGl2V2lkdGggPSAxO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSAnc29ydC1zdGVwcyBhc2NlbmRpbmcnO1xuICAgICAgICAgICAgZGl2V2lkdGggPSBkaXZXaWR0aCArICgoaSAvIGRpdldpZHRoKSAqIDQpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IChkaXZXaWR0aC50b0ZpeGVkKCkpICsgJ3B4JztcbiAgICAgICAgICAgIGlmIChpID09PSAobnVtU3RlcHMgLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZERlc2NlbmRpbmdTdGVwcyAoYnRuLCBudW1TdGVwcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtYXJnaW5WYWx1ZSA9IDIsXG4gICAgICAgICAgICBkaXZXaWR0aCA9IDEwO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG51bVN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSAnc29ydC1zdGVwcyBkZXNjZW5kaW5nJztcbiAgICAgICAgICAgIGRpdldpZHRoID0gZGl2V2lkdGggLSAoKGkgLyBkaXZXaWR0aCkgKiA1KTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSAoZGl2V2lkdGgudG9GaXhlZCgpKSArICdweCc7XG4gICAgICAgICAgICBpZiAoaSA9PT0gKG51bVN0ZXBzIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlLm1hcmdpblRvcCA9IG1hcmdpblZhbHVlICsgJ3B4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIHlBeGlzO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSBjcm9zc3RhYiBhcnJheVxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuXG4gICAgICAgIC8vIEZpbmQgdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtIGZvciB0aGUgYXhlc1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3dMYXN0Q2hhcnQgPSB0aGlzLmNyb3NzdGFiW2ldW3RoaXMuY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIFkgYXhpcyBjaGFydHMgaW4gdGhlIGNyb3NzdGFiIGFycmF5IHdpdGggdGhlIGdsb2JhbCBtYXhpbXVtIGFuZCBtaW5pbXVtXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0NoYXJ0ID0gdGhpcy5tYy5jaGFydChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jaGFydCA9IGF4aXNDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERyYXcgdGhlIGNyb3NzdGFiIHdpdGggb25seSB0aGUgYXhlcywgY2FwdGlvbiBhbmQgaHRtbCB0ZXh0LlxuICAgICAgICAvLyBSZXF1aXJlZCBzaW5jZSBheGVzIGNhbm5vdCByZXR1cm4gbGltaXRzIHVubGVzcyB0aGV5IGFyZSBkcmF3blxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gRmluZCBhIFkgQXhpcyBjaGFydFxuICAgICAgICB5QXhpcyA9IHlBeGlzIHx8IHRoaXMuZmluZFlBeGlzQ2hhcnQoKTtcblxuICAgICAgICAvLyBQbGFjZSBhIGNoYXJ0IG9iamVjdCB3aXRoIGxpbWl0cyBmcm9tIHRoZSBZIEF4aXMgaW4gdGhlIGNvcnJlY3QgY2VsbFxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmICh5QXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdheGlzLWZvb3Rlci1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0geUF4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRJbnN0YW5jZSA9IGNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydEluc3RhbmNlLmdldExpbWl0cygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCwgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gsIG1pbkxpbWl0LCBtYXhMaW1pdClbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydE9iajtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY3Jvc3N0YWJcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBjcm9zc3RhYiB3aGVuIHRoZSBtb2RlbCB1cGRhdGVzXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudExpc3QubW9kZWxVcGRhdGVkLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgaGlnaGxpZ2h0IHBsb3RzIHdoZW4gaG92ZXJlZCBpblxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyaW4nLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IHJlbW92ZSBoaWdobGlnaHRzIGZyb20gcGxvdHMgd2hlbiBob3ZlcmVkIG91dFxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZmlsdGVyZWRDcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIGksIGlpLFxuICAgICAgICAgICAgaiwgamosXG4gICAgICAgICAgICBvbGRDaGFydHMgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgYXhpc0xpbWl0cyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgIT09ICdjYXB0aW9uJyAmJiBjaGFydENvbmYudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5yb3dIYXNoICYmIGNlbGwuY29sSGFzaCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkQ2hhcnQgPSB0aGlzLmdldE9sZENoYXJ0KG9sZENoYXJ0cywgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2xkQ2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydCA9IGNoYXJ0T2JqWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRPYmpbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jaGFydCA9IG9sZENoYXJ0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobGltaXRzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWF4ID0gbGltaXRzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWluID0gbGltaXRzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5tYXggfHwgY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IGNlbGwubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSBjZWxsLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IGNlbGwubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0ICYmIGNlbGwuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0F4aXMgPSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRMZWZ0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0NoYXJ0ID0gdGhpcy5tYy5jaGFydChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jaGFydCA9IGF4aXNDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3Jvc3N0YWIgPSBmaWx0ZXJlZENyb3NzdGFiO1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoKTtcbiAgICAgICAgYXhpc0xpbWl0cyA9IHRoaXMuZ2V0WUF4aXNMaW1pdHMoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmICghY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdheGlzLWZvb3Rlci1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuZ2V0Q29uZigpLnR5cGUgIT09ICdjYXB0aW9uJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuZ2V0Q29uZigpLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsIGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbWl0c1sxXSlbMV07XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC51cGRhdGUoY2hhcnRPYmouZ2V0Q29uZigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kWUF4aXNDaGFydCAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFlBeGlzTGltaXRzICgpIHtcbiAgICAgICAgbGV0IGksIGlpLFxuICAgICAgICAgICAgaiwgamo7XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSA9PT0gJ2F4aXMnICYmIGNoYXJ0Q29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjZWxsLmNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKS5nZXRMaW1pdHMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRPbGRDaGFydCAob2xkQ2hhcnRzLCByb3dIYXNoLCBjb2xIYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBvbGRDaGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChvbGRDaGFydHNbaV0ucm93SGFzaCA9PT0gcm93SGFzaCAmJiBvbGRDaGFydHNbaV0uY29sSGFzaCA9PT0gY29sSGFzaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGRDaGFydHNbaV0uY2hhcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0Q2hhcnRzIChrZXksIG9yZGVyKSB7XG4gICAgICAgIGxldCBzb3J0UHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCksXG4gICAgICAgICAgICBzb3J0Rm4sXG4gICAgICAgICAgICBzb3J0ZWREYXRhO1xuICAgICAgICBpZiAob3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gYVtrZXldIC0gYltrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBiW2tleV0gLSBhW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gMDtcbiAgICAgICAgfVxuICAgICAgICBzb3J0UHJvY2Vzc29yLnNvcnQoc29ydEZuKTtcbiAgICAgICAgc29ydGVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoc29ydFByb2Nlc3Nvcik7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWIuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgbGV0IHJvd0NhdGVnb3JpZXM7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgIT09ICdjYXB0aW9uJyAmJiBjaGFydENvbmYudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHNvcnRlZERhdGEsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRPYmpbMV0uZ2V0Q29uZigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NhdGVnb3JpZXMgPSBjaGFydC5nZXRDb25mKCkuY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcm93LmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gY2VsbC5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZiA9IGNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzVHlwZSA9IGNoYXJ0Q29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpc1R5cGUgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYuY29uZmlnLmNhdGVnb3JpZXMgPSByb3dDYXRlZ29yaWVzLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYuY29uZmlnLmNhdGVnb3JpZXMgPSByb3dDYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRDb25mKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCB0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTb3J0QnV0dG9ucyh0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAoZGF0YVN0b3JlLCBjYXRlZ29yaWVzLCByb3dGaWx0ZXIsIGNvbEZpbHRlciwgbWluTGltaXQsIG1heExpbWl0KSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIC8vIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIC8vIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICAvLyBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBsaW1pdHMgPSB7fSxcbiAgICAgICAgICAgIGNoYXJ0ID0ge307XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgaWYgKG1pbkxpbWl0ICE9PSB1bmRlZmluZWQgJiYgbWF4TGltaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWRKU09OID0gZmlsdGVyZWREYXRhLmdldEpTT04oKSxcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkQ2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkSlNPTi5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeSA9IHZhbFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvcnRlZENhdGVnb3JpZXMuaW5kZXhPZihjYXRlZ29yeSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHNvcnRlZENhdGVnb3JpZXMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogZmlsdGVyZWREYXRhLFxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0LmdldExpbWl0KCk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbGltaXRzLm1heCxcbiAgICAgICAgICAgICAgICAnbWluJzogbGltaXRzLm1pblxuICAgICAgICAgICAgfSwgY2hhcnRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBTb3J0QnV0dG9ucyAoKSB7XG4gICAgICAgIGxldCBhc2NlbmRpbmdCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGlpID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGVzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGpqID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgc29ydEJ0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzb3J0LWJ0bicpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGFzY2VuZGluZ0J0bnNbaV07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNsaWNrRWxlbSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyO1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LXN0ZXBzJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lYXN1cmVOYW1lID0gY2xpY2tFbGVtLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1lYXN1cmUnKTtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciA9IGNsaWNrRWxlbS5jbGFzc05hbWUgKyAnIGFjdGl2ZSc7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc29ydEJ0bnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhzb3J0QnRuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsaWNrRWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c0FyZVNvcnRlZC5ib29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc0xpc3QgPSBjbGlja0VsZW0uY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZWFzdXJlTmFtZSA9PT0gdGhpcy5jaGFydHNBcmVTb3J0ZWQubWVhc3VyZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmluZGV4T2YodGhpcy5jaGFydHNBcmVTb3J0ZWQub3JkZXIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKGNsaWNrRWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMobWVhc3VyZU5hbWUsICdhc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICdhc2NlbmRpbmctc29ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogbWVhc3VyZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMobWVhc3VyZU5hbWUsICdhc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib29sOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICdhc2NlbmRpbmctc29ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBtZWFzdXJlTmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGRlc2NlbmRpbmdCdG5zW2pdO1xuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjbGlja0VsZW0sXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc1N0cjtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1zdGVwcycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtZWFzdXJlTmFtZSA9IGNsaWNrRWxlbS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1tZWFzdXJlJyk7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgPSBjbGlja0VsZW0uY2xhc3NOYW1lICsgJyBhY3RpdmUnO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNvcnRCdG5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3Moc29ydEJ0bnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGlja0VsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzU3RyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNBcmVTb3J0ZWQuYm9vbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NMaXN0ID0gY2xpY2tFbGVtLmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVhc3VyZU5hbWUgPT09IHRoaXMuY2hhcnRzQXJlU29ydGVkLm1lYXN1cmUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5pbmRleE9mKHRoaXMuY2hhcnRzQXJlU29ydGVkLm9yZGVyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhjbGlja0VsZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKG1lYXN1cmVOYW1lLCAnZGVzY2VuZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmctc29ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogbWVhc3VyZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMobWVhc3VyZU5hbWUsICdkZXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZy1zb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IG1lYXN1cmVOYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmVtb3ZlQWN0aXZlQ2xhc3MgKGVsZW0pIHtcbiAgICAgICAgbGV0IGNsYXNzTm0gPSBlbGVtLmNsYXNzTmFtZVxuICAgICAgICAgICAgLnNwbGl0KCcgJylcbiAgICAgICAgICAgIC5maWx0ZXIoKHZhbCkgPT4gdmFsICE9PSAnYWN0aXZlJylcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzTm0pO1xuICAgIH1cblxuICAgIGFkZEFjdGl2ZUNsYXNzIChlbGVtKSB7XG4gICAgICAgIGxldCBjbGFzc05tID0gZWxlbS5jbGFzc05hbWVcbiAgICAgICAgICAgIC5zcGxpdCgnICcpO1xuICAgICAgICBjbGFzc05tLnB1c2goJ2FjdGl2ZScpO1xuICAgICAgICBjbGFzc05tID0gY2xhc3NObS5qb2luKCcgJyk7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzTm0pO1xuICAgIH1cblxuICAgIGRyYWdMaXN0ZW5lciAocGxhY2VIb2xkZXIpIHtcbiAgICAgICAgLy8gR2V0dGluZyBvbmx5IGxhYmVsc1xuICAgICAgICBsZXQgb3JpZ0NvbmZpZyA9IHRoaXMuc3RvcmVQYXJhbXMuY29uZmlnLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG9yaWdDb25maWcuZGltZW5zaW9ucyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gb3JpZ0NvbmZpZy5tZWFzdXJlcyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzTGVuZ3RoID0gbWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgbWVhc3VyZXNIb2xkZXIsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gbGV0IGVuZFxuICAgICAgICBwbGFjZUhvbGRlciA9IHBsYWNlSG9sZGVyWzFdO1xuICAgICAgICAvLyBPbWl0dGluZyBsYXN0IGRpbWVuc2lvblxuICAgICAgICBkaW1lbnNpb25zID0gZGltZW5zaW9ucy5zbGljZSgwLCBkaW1lbnNpb25zLmxlbmd0aCAtIDEpO1xuICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gZGltZW5zaW9ucy5sZW5ndGg7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgZGltZW5zaW9uIGhvbGRlclxuICAgICAgICBkaW1lbnNpb25zSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoMCwgZGltZW5zaW9uc0xlbmd0aCk7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgbWVhc3VyZXMgaG9sZGVyXG4gICAgICAgIC8vIE9uZSBzaGlmdCBmb3IgYmxhbmsgYm94XG4gICAgICAgIG1lYXN1cmVzSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoZGltZW5zaW9uc0xlbmd0aCArIDEsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoICsgbWVhc3VyZXNMZW5ndGggKyAxKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihkaW1lbnNpb25zSG9sZGVyLCBkaW1lbnNpb25zLCBkaW1lbnNpb25zTGVuZ3RoLCB0aGlzLmRpbWVuc2lvbnMpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKG1lYXN1cmVzSG9sZGVyLCBtZWFzdXJlcywgbWVhc3VyZXNMZW5ndGgsIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICBmdW5jdGlvbiBzZXR1cExpc3RlbmVyIChob2xkZXIsIGFyciwgYXJyTGVuLCBnbG9iYWxBcnIpIHtcbiAgICAgICAgICAgIGxldCBsaW1pdExlZnQgPSAwLFxuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSAwLFxuICAgICAgICAgICAgICAgIGxhc3QgPSBhcnJMZW4gLSAxLFxuICAgICAgICAgICAgICAgIGxuID0gTWF0aC5sb2cyO1xuXG4gICAgICAgICAgICBpZiAoaG9sZGVyWzBdKSB7XG4gICAgICAgICAgICAgICAgbGltaXRMZWZ0ID0gcGFyc2VJbnQoaG9sZGVyWzBdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSBwYXJzZUludChob2xkZXJbbGFzdF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyTGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWwgPSBob2xkZXJbaV0uZ3JhcGhpY3MsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBob2xkZXJbaV0sXG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5jZWxsVmFsdWUgPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnTGVmdCA9IHBhcnNlSW50KGVsLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVkWm9uZSA9IGl0ZW0ub3JpZ0xlZnQgKyBwYXJzZUludChlbC5zdHlsZS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdaID0gZWwuc3R5bGUuekluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuX3NldHVwRHJhZyhpdGVtLmdyYXBoaWNzLCBmdW5jdGlvbiBkcmFnU3RhcnQgKGR4LCBkeSkge1xuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPCBsaW1pdExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBsaW1pdExlZnQgLSBuTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRMZWZ0IC0gbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0ID4gbGltaXRSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IG5MZWZ0IC0gbGltaXRSaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRSaWdodCArIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBuTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIGZhbHNlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCB0cnVlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGRyYWdFbmQgKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBpdGVtLm9yaWdaO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgYXJyTGVuOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxBcnJbal0gIT09IGhvbGRlcltqXS5jZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxBcnJbal0gPSBob2xkZXJbal0uY2VsbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VTaGlmdGluZyAoaW5kZXgsIGlzUmlnaHQsIGhvbGRlcikge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gW10sXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSBob2xkZXJbaW5kZXhdLFxuICAgICAgICAgICAgICAgIG5leHRQb3MgPSBpc1JpZ2h0ID8gaW5kZXggKyAxIDogaW5kZXggLSAxLFxuICAgICAgICAgICAgICAgIG5leHRJdGVtID0gaG9sZGVyW25leHRQb3NdO1xuICAgICAgICAgICAgLy8gU2F2aW5nIGRhdGEgZm9yIGxhdGVyIHVzZVxuICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCghaXNSaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPCBuZXh0SXRlbS5yZWRab25lKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFjay5wb3AoKSB8fFxuICAgICAgICAgICAgICAgICAgICAoaXNSaWdodCAmJiBwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA+IG5leHRJdGVtLm9yaWdMZWZ0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ucmVkWm9uZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ub3JpZ0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgKz0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0IC09IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5vcmlnTGVmdCA9IGRyYWdJdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5yZWRab25lID0gZHJhZ0l0ZW0ucmVkWm9uZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uaW5kZXggPSBkcmFnSXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCA9IG5leHRJdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChob2xkZXJbbmV4dFBvc10pO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbbmV4dFBvc10gPSBob2xkZXJbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbaW5kZXhdID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0dGluZyBuZXcgdmFsdWVzIGZvciBkcmFnaXRlbVxuICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLmluZGV4ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ub3JpZ0xlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5yZWRab25lID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBEcmFnIChlbCwgaGFuZGxlciwgaGFuZGxlcjIpIHtcbiAgICAgICAgbGV0IHggPSAwLFxuICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZS5jbGllbnRYIC0geCwgZS5jbGllbnRZIC0geSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldCxcbiAgICAgICAgICAgICAgICB0YXJnZXRDbGFzc1N0ciA9IHRhcmdldC5jbGFzc05hbWU7XG4gICAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PT0gJycgfHwgdGFyZ2V0Q2xhc3NTdHIuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LWJ0bicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgeSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gbW91c2VVcEhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoaGFuZGxlcjIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9