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
	    dimensions: ['Product', 'State', 'Quality', 'Year', 'Month'],
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
	                ascendingSortBtn,
	                descendingSortBtn,
	                headingTextNode,
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
	                htmlRef.style.position = 'relative';
	
	                ascendingSortBtn = this.createSortButton('ascending-sort');
	                ascendingSortBtn.style.left = '5px';
	                ascendingSortBtn.style.top = '1px';
	                ascendingSortBtn.innerHTML = 'A';
	                htmlRef.appendChild(ascendingSortBtn);
	
	                descendingSortBtn = this.createSortButton('descending-sort');
	                descendingSortBtn.style.right = '5px';
	                descendingSortBtn.style.top = '1px';
	                descendingSortBtn.innerHTML = 'D';
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
	            var sortBtn = void 0;
	            className = 'sort-btn' + ' ' + (className || '');
	            sortBtn = document.createElement('span');
	            sortBtn.setAttribute('class', className.trim());
	            sortBtn.style.position = 'absolute';
	            return sortBtn;
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
	                j = void 0;
	            for (i = 0; i < ii; i++) {
	                var btn = ascendingBtns[i];
	                btn.addEventListener('mousedown', function (e) {
	                    var targetChildren = e.target.parentNode.childNodes;
	                    targetChildren.forEach(function (val) {
	                        if (val.nodeType === 3) {
	                            _this5.sortCharts(val.nodeValue, 'ascending');
	                        }
	                    });
	                });
	            };
	            for (j = 0; j < jj; j++) {
	                var _btn = descendingBtns[j];
	                _btn.addEventListener('mousedown', function (e) {
	                    var targetChildren = e.target.parentNode.childNodes;
	                    targetChildren.forEach(function (val) {
	                        if (val.nodeType === 3) {
	                            _this5.sortCharts(val.nodeValue, 'descending');
	                        }
	                    });
	                });
	            };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTdmYTRmMzlmYWQ4YmQ5NjdiZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwiY3Jvc3N0YWJDb250YWluZXIiLCJkYXRhSXNTb3J0YWJsZSIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJkcmFnZ2FibGVIZWFkZXJzIiwiY2hhcnRDb25maWciLCJjaGFydCIsIndpbmRvdyIsImNyb3NzdGFiIiwicmVuZGVyQ3Jvc3N0YWIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXZlbnRMaXN0Iiwic3RvcmVQYXJhbXMiLCJfY29sdW1uS2V5QXJyIiwic2hvd0ZpbHRlciIsImFnZ3JlZ2F0aW9uIiwiTXVsdGlDaGFydGluZyIsIm1jIiwiZGF0YVN0b3JlIiwiY3JlYXRlRGF0YVN0b3JlIiwic2V0RGF0YSIsImRhdGFTb3VyY2UiLCJFcnJvciIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJmaWVsZHMiLCJnZXRLZXlzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwiY2F0ZWdvcmllcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwicHVzaCIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsImNyZWF0ZVJvdyIsImNoYXJ0VG9wTWFyZ2luIiwiY2hhcnRCb3R0b21NYXJnaW4iLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImFzY2VuZGluZ1NvcnRCdG4iLCJkZXNjZW5kaW5nU29ydEJ0biIsImhlYWRpbmdUZXh0Tm9kZSIsImhlYWRlckRpdiIsImRyYWdEaXYiLCJzZXRBdHRyaWJ1dGUiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsImFwcGVuZERyYWdIYW5kbGUiLCJwb3NpdGlvbiIsImNyZWF0ZVNvcnRCdXR0b24iLCJsZWZ0IiwidG9wIiwicmlnaHQiLCJjcmVhdGVUZXh0Tm9kZSIsImNvcm5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsImNvbE9yZGVyTGVuZ3RoIiwiY29ybmVyQ2VsbEFyciIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwibWF4TGVuZ3RoIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwiY29sT3JkZXIiLCJ4QXhpc1JvdyIsImNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIiwiY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyIiwiY3JlYXRlTWVhc3VyZUhlYWRpbmdzIiwiY2hhcnRMZWZ0TWFyZ2luIiwiY2hhcnRSaWdodE1hcmdpbiIsInVuc2hpZnQiLCJjcmVhdGVDYXB0aW9uIiwiZmlsdGVycyIsInNsaWNlIiwibWF0Y2hlZFZhbHVlcyIsImZvckVhY2giLCJkaW1lbnNpb24iLCJmaWx0ZXJHZW4iLCJ2YWx1ZSIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsImEiLCJ0ZW1wT2JqIiwidGVtcEFyciIsImtleSIsImhhc093blByb3BlcnR5IiwiaW5kZXhPZiIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJjcmVhdGVGaWx0ZXJzIiwiZGF0YUNvbWJvcyIsImNyZWF0ZURhdGFDb21ib3MiLCJoYXNoTWFwIiwiZGF0YUNvbWJvIiwibGVuIiwiayIsIm5vZGUiLCJudW1IYW5kbGVzIiwiaGFuZGxlU3BhbiIsIm1hcmdpbkxlZnQiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJ2ZXJ0aWNhbEFsaWduIiwic29ydEJ0biIsInRyaW0iLCJnbG9iYWxNYXgiLCJnbG9iYWxNaW4iLCJ5QXhpcyIsImNyZWF0ZUNyb3NzdGFiIiwicm93TGFzdENoYXJ0Iiwicm93Iiwicm93QXhpcyIsImpqIiwiY3Jvc3N0YWJFbGVtZW50IiwiY29uZiIsInR5cGUiLCJheGlzVHlwZSIsImF4aXNDaGFydCIsImNyZWF0ZU11bHRpQ2hhcnQiLCJmaW5kWUF4aXNDaGFydCIsImNoYXJ0SW5zdGFuY2UiLCJnZXRDaGFydEluc3RhbmNlIiwibGltaXRzIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsImNoYXJ0T2JqIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vZGVsVXBkYXRlZCIsImUiLCJkIiwidXBkYXRlQ3Jvc3N0YWIiLCJldnQiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJmaWx0ZXJlZENyb3NzdGFiIiwib2xkQ2hhcnRzIiwiYXhpc0xpbWl0cyIsImNlbGwiLCJjaGFydENvbmYiLCJnZXRDb25mIiwib2xkQ2hhcnQiLCJnZXRPbGRDaGFydCIsImdldFlBeGlzTGltaXRzIiwidXBkYXRlIiwib3JkZXIiLCJzb3J0UHJvY2Vzc29yIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsInNvcnRGbiIsInNvcnRlZERhdGEiLCJiIiwic29ydCIsImdldENoaWxkTW9kZWwiLCJyb3dDYXRlZ29yaWVzIiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInNldHVwU29ydEJ1dHRvbnMiLCJyZXN1bHRzIiwicGVybXV0ZSIsIm1lbSIsImN1cnJlbnQiLCJzcGxpY2UiLCJjb25jYXQiLCJqb2luIiwicGVybXV0ZVN0cnMiLCJmaWx0ZXJTdHIiLCJzcGxpdCIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJmaWx0ZXJlZEpTT04iLCJnZXRKU09OIiwic29ydGVkQ2F0ZWdvcmllcyIsIm1lYXN1cmUiLCJzZXJpZXNUeXBlIiwiYWdncmVnYXRlTW9kZSIsImdldExpbWl0IiwiYXNjZW5kaW5nQnRucyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJkZXNjZW5kaW5nQnRucyIsImJ0biIsInRhcmdldENoaWxkcmVuIiwidGFyZ2V0IiwicGFyZW50Tm9kZSIsImNoaWxkTm9kZXMiLCJub2RlVHlwZSIsInNvcnRDaGFydHMiLCJub2RlVmFsdWUiLCJvcmlnQ29uZmlnIiwibWVhc3VyZXNMZW5ndGgiLCJkaW1lbnNpb25zTGVuZ3RoIiwiZGltZW5zaW9uc0hvbGRlciIsIm1lYXN1cmVzSG9sZGVyIiwic2VsZiIsInNldHVwTGlzdGVuZXIiLCJob2xkZXIiLCJhcnJMZW4iLCJnbG9iYWxBcnIiLCJsaW1pdExlZnQiLCJsaW1pdFJpZ2h0IiwibGFzdCIsImxuIiwiTWF0aCIsImxvZzIiLCJncmFwaGljcyIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0Q2xhc3NTdHIiLCJvcGFjaXR5IiwiY2xhc3NMaXN0IiwiYWRkIiwibW91c2VVcEhhbmRsZXIiLCJyZW1vdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUN0Q0EsS0FBTUEsY0FBYyxtQkFBQUMsQ0FBUSxDQUFSLENBQXBCO0FBQUEsS0FDSUMsT0FBTyxtQkFBQUQsQ0FBUSxDQUFSLENBRFg7O0FBR0EsS0FBSUUsU0FBUztBQUNUQyxpQkFBWSxDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLFNBQXJCLEVBQWdDLE1BQWhDLEVBQXdDLE9BQXhDLENBREg7QUFFVEMsZUFBVSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFVBQW5CLENBRkQ7QUFHVEMsZ0JBQVcsT0FIRjtBQUlUQyxvQkFBZSxxQkFKTjtB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QUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXJrQmEsRUEra0JiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQS9rQmEsRUF5bEJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXpsQmEsRUFtbUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQW5tQmEsRUE2bUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQTdtQmEsRUF1bkJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXZuQmEsQ0FBakIsQyIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTdmYTRmMzlmYWQ4YmQ5NjdiZTgiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnUXVhbGl0eScsICdZZWFyJywgJ01vbnRoJ10sXG4gICAgbWVhc3VyZXM6IFsnU2FsZScsICdQcm9maXQnLCAnVmlzaXRvcnMnXSxcbiAgICBjaGFydFR5cGU6ICdiYXIyZCcsXG4gICAgbm9EYXRhTWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheS4nLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcbiAgICBkYXRhSXNTb3J0YWJsZTogdHJ1ZSxcbiAgICBjZWxsV2lkdGg6IDE1MCxcbiAgICBjZWxsSGVpZ2h0OiA4MCxcbiAgICAvLyBzaG93RmlsdGVyOiB0cnVlLFxuICAgIGRyYWdnYWJsZUhlYWRlcnM6IHRydWUsXG4gICAgLy8gYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAncm9sbE92ZXJCYW5kQ29sb3InOiAnI2JhZGFmMCcsXG4gICAgICAgICAgICAnY29sdW1uSG92ZXJDb2xvcic6ICcjMWI4M2NjJyxcbiAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6ICcyJyxcbiAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6ICc3JyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVUaGlja25lc3MnOiAnMCcsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzVCNUI1QicsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgLy8gTGlzdCBvZiBwb3NzaWJsZSBldmVudHMgcmFpc2VkIGJ5IHRoZSBkYXRhIHN0b3JlLlxuICAgICAgICB0aGlzLmV2ZW50TGlzdCA9IHtcbiAgICAgICAgICAgICdtb2RlbFVwZGF0ZWQnOiAnbW9kZWx1cGRhdGVkJyxcbiAgICAgICAgICAgICdtb2RlbERlbGV0ZWQnOiAnbW9kZWxkZWxldGVkJyxcbiAgICAgICAgICAgICdtZXRhSW5mb1VwZGF0ZSc6ICdtZXRhaW5mb3VwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvclVwZGF0ZWQnOiAncHJvY2Vzc29ydXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yRGVsZXRlZCc6ICdwcm9jZXNzb3JkZWxldGVkJ1xuICAgICAgICB9O1xuICAgICAgICAvLyBQb3RlbnRpYWxseSB1bm5lY2Vzc2FyeSBtZW1iZXIuXG4gICAgICAgIC8vIFRPRE86IFJlZmFjdG9yIGNvZGUgZGVwZW5kZW50IG9uIHZhcmlhYmxlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdmFyaWFibGUuXG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQXJyYXkgb2YgY29sdW1uIG5hbWVzIChtZWFzdXJlcykgdXNlZCB3aGVuIGJ1aWxkaW5nIHRoZSBjcm9zc3RhYiBhcnJheS5cbiAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIC8vIFNhdmluZyBwcm92aWRlZCBjb25maWd1cmF0aW9uIGludG8gaW5zdGFuY2UuXG4gICAgICAgIHRoaXMubWVhc3VyZXMgPSBjb25maWcubWVhc3VyZXM7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gY29uZmlnLmRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGF0YUlzU29ydGFibGUgPSBjb25maWcuZGF0YUlzU29ydGFibGU7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aCB8fCAyMTA7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0IHx8IDExMztcbiAgICAgICAgdGhpcy5zaG93RmlsdGVyID0gY29uZmlnLnNob3dGaWx0ZXIgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb24gfHwgJ3N1bSc7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVhZGVycyA9IGNvbmZpZy5kcmFnZ2FibGVIZWFkZXJzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZSB8fCAnTm8gZGF0YSB0byBkaXNwbGF5Lic7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICAvLyBDcmVhdGluZyBhbiBlbXB0eSBkYXRhIHN0b3JlXG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICAvLyBBZGRpbmcgZGF0YSB0byB0aGUgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTXVsdGlDaGFydG5nIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2hvd0ZpbHRlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhRmlsdGVyIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnVpbGRpbmcgYSBkYXRhIHN0cnVjdHVyZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAvLyBCdWlsZGluZyBhIGhhc2ggbWFwIG9mIGFwcGxpY2FibGUgZmlsdGVycyBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgZmlsdGVyIGZ1bmN0aW9uc1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbiBhcnJheSBvZiBhcnJheXMgZGF0YSBzdHJ1Y3R1cmUgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBhcnJheXMgZ2VuZXJhdGVkIGZyb20gdGhlIGRhdGFTdG9yZSdzIGFycmF5IG9mIG9iamVjdHNcbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBsZXQgZGF0YVN0b3JlID0gdGhpcy5kYXRhU3RvcmUsXG4gICAgICAgICAgICBmaWVsZHMgPSBkYXRhU3RvcmUuZ2V0S2V5cygpO1xuICAgICAgICBpZiAoZmllbGRzKSB7XG4gICAgICAgICAgICBsZXQgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSBkYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNhdGVnb3JpZXMgZm9yIGNoYXJ0cyAoaS5lLiBubyBzb3J0aW5nIGFwcGxpZWQpXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBnbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZW5lcmF0ZSBrZXlzIGZyb20gZGF0YSBzdG9yZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuX2NvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZlcnRpY2FsLWF4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmVydGljYWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLl9jb2x1bW5LZXlBcnJbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFydDogdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLl9jb2x1bW5LZXlBcnJbal0pWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2hhcnQtY2VsbCAnICsgKGogKyAxKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY29sTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLmNsYXNzTmFtZSA9ICdjaGFydC1jZWxsIGxhc3QtY29sJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMF07XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSAocGFyc2VJbnQobWlubWF4T2JqLm1pbikgPCBtaW4pID8gbWlubWF4T2JqLm1pbiA6IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1heCA9IG1heDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVNZWFzdXJlSGVhZGluZ3MgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBhc2NlbmRpbmdTb3J0QnRuLFxuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4sXG4gICAgICAgICAgICBoZWFkaW5nVGV4dE5vZGUsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgaGVhZGVyRGl2LFxuICAgICAgICAgICAgZHJhZ0RpdjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXTtcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZWFzdXJlLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgICAgICAgICAgYXNjZW5kaW5nU29ydEJ0biA9IHRoaXMuY3JlYXRlU29ydEJ1dHRvbignYXNjZW5kaW5nLXNvcnQnKTtcbiAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4uc3R5bGUubGVmdCA9ICc1cHgnO1xuICAgICAgICAgICAgYXNjZW5kaW5nU29ydEJ0bi5zdHlsZS50b3AgPSAnMXB4JztcbiAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4uaW5uZXJIVE1MID0gJ0EnO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2Rlc2NlbmRpbmctc29ydCcpO1xuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4uc3R5bGUucmlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRlc2NlbmRpbmdTb3J0QnRuLnN0eWxlLnRvcCA9ICcxcHgnO1xuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4uaW5uZXJIVE1MID0gJ0QnO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChkZXNjZW5kaW5nU29ydEJ0bik7XG5cbiAgICAgICAgICAgIGhlYWRpbmdUZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpZWxkQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcbiAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoaGVhZGluZ1RleHROb2RlKTtcbiAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoZGVzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tbWVhc3VyZXMgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIChjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGltZW5zaW9uLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuZGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5kaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgPSAnZGltZW5zaW9uLWhlYWRlciAnICsgdGhpcy5kaW1lbnNpb25zW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyICgpIHtcbiAgICAgICAgbGV0IGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAobWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnQgZGltZW5zaW9uIGhlYWRpbmdzXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlRGltZW5zaW9uSGVhZGluZ3ModGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHZlcnRpY2FsIGF4aXMgaGVhZGVyXG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKHRoaXMuY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyKCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IG1lYXN1cmUgaGVhZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTWVhc3VyZUhlYWRpbmdzKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHJvd3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICAvLyBGaW5kIHJvdyB3aXRoIG1heCBsZW5ndGggaW4gdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFB1c2ggYmxhbmsgcGFkZGluZyBjZWxscyB1bmRlciB0aGUgZGltZW5zaW9ucyBpbiB0aGUgc2FtZSByb3cgYXMgdGhlIGhvcml6b250YWwgYXhpc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUHVzaCBob3Jpem9udGFsIGF4ZXMgaW50byB0aGUgbGFzdCByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIGNhcHRpb24gY2VsbCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgdGFibGUudW5zaGlmdCh0aGlzLmNyZWF0ZUNhcHRpb24obWF4TGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGRhdGEgZm9yIGNyb3NzdGFiLiA6KFxuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zLnNsaWNlKDAsIHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW2RpbWVuc2lvbl07XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4oZGltZW5zaW9uLCB2YWx1ZS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT09IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgYXBwZW5kRHJhZ0hhbmRsZSAobm9kZSwgbnVtSGFuZGxlcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIGhhbmRsZVNwYW47XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1IYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLm1hcmdpbkxlZnQgPSAnMXB4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUuZm9udFNpemUgPSAnM3B4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubGluZUhlaWdodCA9ICcxJztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnO1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChoYW5kbGVTcGFuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVNvcnRCdXR0b24gKGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgc29ydEJ0bjtcbiAgICAgICAgY2xhc3NOYW1lID0gJ3NvcnQtYnRuJyArICcgJyArIChjbGFzc05hbWUgfHwgJycpO1xuICAgICAgICBzb3J0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzb3J0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc05hbWUudHJpbSgpKTtcbiAgICAgICAgc29ydEJ0bi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHJldHVybiBzb3J0QnRuO1xuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgeUF4aXM7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdGhlIGNyb3NzdGFiIGFycmF5XG4gICAgICAgIHRoaXMuY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG5cbiAgICAgICAgLy8gRmluZCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW0gZm9yIHRoZSBheGVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvd0xhc3RDaGFydCA9IHRoaXMuY3Jvc3N0YWJbaV1bdGhpcy5jcm9zc3RhYltpXS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChyb3dMYXN0Q2hhcnQubWF4IHx8IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgcm93TGFzdENoYXJ0Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSByb3dMYXN0Q2hhcnQubWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSByb3dMYXN0Q2hhcnQubWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgWSBheGlzIGNoYXJ0cyBpbiB0aGUgY3Jvc3N0YWIgYXJyYXkgd2l0aCB0aGUgZ2xvYmFsIG1heGltdW0gYW5kIG1pbmltdW1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXSxcbiAgICAgICAgICAgICAgICByb3dBeGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0F4aXMgPSBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgY3Jvc3N0YWIgd2l0aCBvbmx5IHRoZSBheGVzLCBjYXB0aW9uIGFuZCBodG1sIHRleHQuXG4gICAgICAgIC8vIFJlcXVpcmVkIHNpbmNlIGF4ZXMgY2Fubm90IHJldHVybiBsaW1pdHMgdW5sZXNzIHRoZXkgYXJlIGRyYXduXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBGaW5kIGEgWSBBeGlzIGNoYXJ0XG4gICAgICAgIHlBeGlzID0geUF4aXMgfHwgdGhpcy5maW5kWUF4aXNDaGFydCgpO1xuXG4gICAgICAgIC8vIFBsYWNlIGEgY2hhcnQgb2JqZWN0IHdpdGggbGltaXRzIGZyb20gdGhlIFkgQXhpcyBpbiB0aGUgY29ycmVjdCBjZWxsXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKHlBeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSB5QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydEluc3RhbmNlID0gY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0SW5zdGFuY2UuZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCwgbWluTGltaXQsIG1heExpbWl0KVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0T2JqO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBjcm9zc3RhYlxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG5cbiAgICAgICAgLy8gVXBkYXRlIGNyb3NzdGFiIHdoZW4gdGhlIG1vZGVsIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmV2ZW50TGlzdC5tb2RlbFVwZGF0ZWQsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSBoaWdobGlnaHQgcGxvdHMgd2hlbiBob3ZlcmVkIGluXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBjb25jdXJyZW50bHkgcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbSBwbG90cyB3aGVuIGhvdmVyZWQgb3V0XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZENyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgaSwgaWksXG4gICAgICAgICAgICBqLCBqaixcbiAgICAgICAgICAgIG9sZENoYXJ0cyA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBheGlzTGltaXRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0cy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLnJvd0hhc2ggJiYgY2VsbC5jb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRDaGFydCA9IHRoaXMuZ2V0T2xkQ2hhcnQob2xkQ2hhcnRzLCBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRDaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0ID0gY2hhcnRPYmpbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSBjaGFydE9ialswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNoYXJ0ID0gb2xkQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW1pdHMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5tYXggPSBsaW1pdHMubWF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5taW4gPSBsaW1pdHMubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLm1heCB8fCBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgY2VsbC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IGNlbGwubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiBjZWxsLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gY2VsbC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQgJiYgY2VsbC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93QXhpcyA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzQ2hhcnQgPSByb3dBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGF4aXNDaGFydC5jb25mO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydEJvdHRvbU1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0VG9wTWFyZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFJpZ2h0TWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IGZpbHRlcmVkQ3Jvc3N0YWI7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCgpO1xuICAgICAgICBheGlzTGltaXRzID0gdGhpcy5nZXRZQXhpc0xpbWl0cygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2NhcHRpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcywgY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzFdKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnVwZGF0ZShjaGFydE9iai5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRZQXhpc0NoYXJ0ICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcm9zc3RhYkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0WUF4aXNMaW1pdHMgKCkge1xuICAgICAgICBsZXQgaSwgaWksXG4gICAgICAgICAgICBqLCBqajtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycgJiYgY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNlbGwuY2hhcnQuZ2V0Q2hhcnRJbnN0YW5jZSgpLmdldExpbWl0cygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE9sZENoYXJ0IChvbGRDaGFydHMsIHJvd0hhc2gsIGNvbEhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IG9sZENoYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKG9sZENoYXJ0c1tpXS5yb3dIYXNoID09PSByb3dIYXNoICYmIG9sZENoYXJ0c1tpXS5jb2xIYXNoID09PSBjb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9sZENoYXJ0c1tpXS5jaGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRDaGFydHMgKGtleSwgb3JkZXIpIHtcbiAgICAgICAgbGV0IHNvcnRQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKSxcbiAgICAgICAgICAgIHNvcnRGbixcbiAgICAgICAgICAgIHNvcnRlZERhdGE7XG4gICAgICAgIGlmIChvcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBhW2tleV0gLSBiW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gYltrZXldIC0gYVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRQcm9jZXNzb3Iuc29ydChzb3J0Rm4pO1xuICAgICAgICBzb3J0ZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChzb3J0UHJvY2Vzc29yKTtcbiAgICAgICAgdGhpcy5jcm9zc3RhYi5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICBsZXQgcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IGNlbGwuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYgPSBjaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooc29ydGVkRGF0YSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZShjaGFydE9ialsxXS5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q2F0ZWdvcmllcyA9IGNoYXJ0LmdldENvbmYoKS5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNUeXBlID0gY2hhcnRDb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzVHlwZSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mLmNvbmZpZy5jYXRlZ29yaWVzID0gcm93Q2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRDb25mKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCB0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTb3J0QnV0dG9ucyh0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAoZGF0YVN0b3JlLCBjYXRlZ29yaWVzLCByb3dGaWx0ZXIsIGNvbEZpbHRlciwgbWluTGltaXQsIG1heExpbWl0KSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIC8vIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIC8vIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICAvLyBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBsaW1pdHMgPSB7fSxcbiAgICAgICAgICAgIGNoYXJ0ID0ge307XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgaWYgKG1pbkxpbWl0ICE9PSB1bmRlZmluZWQgJiYgbWF4TGltaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWRKU09OID0gZmlsdGVyZWREYXRhLmdldEpTT04oKSxcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkQ2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkSlNPTi5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeSA9IHZhbFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvcnRlZENhdGVnb3JpZXMuaW5kZXhPZihjYXRlZ29yeSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHNvcnRlZENhdGVnb3JpZXMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogZmlsdGVyZWREYXRhLFxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0LmdldExpbWl0KCk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbGltaXRzLm1heCxcbiAgICAgICAgICAgICAgICAnbWluJzogbGltaXRzLm1pblxuICAgICAgICAgICAgfSwgY2hhcnRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBTb3J0QnV0dG9ucyAoKSB7XG4gICAgICAgIGxldCBhc2NlbmRpbmdCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGlpID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGVzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGpqID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBqO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGFzY2VuZGluZ0J0bnNbaV07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldENoaWxkcmVuID0gZS50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKHZhbC5ub2RlVmFsdWUsICdhc2NlbmRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gZGVzY2VuZGluZ0J0bnNbal07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldENoaWxkcmVuID0gZS50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKHZhbC5ub2RlVmFsdWUsICdkZXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGRyYWdMaXN0ZW5lciAocGxhY2VIb2xkZXIpIHtcbiAgICAgICAgLy8gR2V0dGluZyBvbmx5IGxhYmVsc1xuICAgICAgICBsZXQgb3JpZ0NvbmZpZyA9IHRoaXMuc3RvcmVQYXJhbXMuY29uZmlnLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG9yaWdDb25maWcuZGltZW5zaW9ucyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gb3JpZ0NvbmZpZy5tZWFzdXJlcyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzTGVuZ3RoID0gbWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgbWVhc3VyZXNIb2xkZXIsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gbGV0IGVuZFxuICAgICAgICBwbGFjZUhvbGRlciA9IHBsYWNlSG9sZGVyWzFdO1xuICAgICAgICAvLyBPbWl0dGluZyBsYXN0IGRpbWVuc2lvblxuICAgICAgICBkaW1lbnNpb25zID0gZGltZW5zaW9ucy5zbGljZSgwLCBkaW1lbnNpb25zLmxlbmd0aCAtIDEpO1xuICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gZGltZW5zaW9ucy5sZW5ndGg7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgZGltZW5zaW9uIGhvbGRlclxuICAgICAgICBkaW1lbnNpb25zSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoMCwgZGltZW5zaW9uc0xlbmd0aCk7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgbWVhc3VyZXMgaG9sZGVyXG4gICAgICAgIC8vIE9uZSBzaGlmdCBmb3IgYmxhbmsgYm94XG4gICAgICAgIG1lYXN1cmVzSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoZGltZW5zaW9uc0xlbmd0aCArIDEsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoICsgbWVhc3VyZXNMZW5ndGggKyAxKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihkaW1lbnNpb25zSG9sZGVyLCBkaW1lbnNpb25zLCBkaW1lbnNpb25zTGVuZ3RoLCB0aGlzLmRpbWVuc2lvbnMpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKG1lYXN1cmVzSG9sZGVyLCBtZWFzdXJlcywgbWVhc3VyZXNMZW5ndGgsIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICBmdW5jdGlvbiBzZXR1cExpc3RlbmVyIChob2xkZXIsIGFyciwgYXJyTGVuLCBnbG9iYWxBcnIpIHtcbiAgICAgICAgICAgIGxldCBsaW1pdExlZnQgPSAwLFxuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSAwLFxuICAgICAgICAgICAgICAgIGxhc3QgPSBhcnJMZW4gLSAxLFxuICAgICAgICAgICAgICAgIGxuID0gTWF0aC5sb2cyO1xuXG4gICAgICAgICAgICBpZiAoaG9sZGVyWzBdKSB7XG4gICAgICAgICAgICAgICAgbGltaXRMZWZ0ID0gcGFyc2VJbnQoaG9sZGVyWzBdLmdyYXBoaWNzLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGxpbWl0UmlnaHQgPSBwYXJzZUludChob2xkZXJbbGFzdF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyTGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWwgPSBob2xkZXJbaV0uZ3JhcGhpY3MsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBob2xkZXJbaV0sXG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5jZWxsVmFsdWUgPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnTGVmdCA9IHBhcnNlSW50KGVsLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVkWm9uZSA9IGl0ZW0ub3JpZ0xlZnQgKyBwYXJzZUludChlbC5zdHlsZS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYWRqdXN0ID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdaID0gZWwuc3R5bGUuekluZGV4O1xuICAgICAgICAgICAgICAgIHNlbGYuX3NldHVwRHJhZyhpdGVtLmdyYXBoaWNzLCBmdW5jdGlvbiBkcmFnU3RhcnQgKGR4LCBkeSkge1xuICAgICAgICAgICAgICAgICAgICBuTGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPCBsaW1pdExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBsaW1pdExlZnQgLSBuTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRMZWZ0IC0gbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5MZWZ0ID4gbGltaXRSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IG5MZWZ0IC0gbGltaXRSaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gbGltaXRSaWdodCArIGxuKGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBuTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIGZhbHNlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCB0cnVlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGRyYWdFbmQgKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBpdGVtLm9yaWdaO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgYXJyTGVuOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxBcnJbal0gIT09IGhvbGRlcltqXS5jZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxBcnJbal0gPSBob2xkZXJbal0uY2VsbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDcm9zc3RhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VTaGlmdGluZyAoaW5kZXgsIGlzUmlnaHQsIGhvbGRlcikge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gW10sXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSBob2xkZXJbaW5kZXhdLFxuICAgICAgICAgICAgICAgIG5leHRQb3MgPSBpc1JpZ2h0ID8gaW5kZXggKyAxIDogaW5kZXggLSAxLFxuICAgICAgICAgICAgICAgIG5leHRJdGVtID0gaG9sZGVyW25leHRQb3NdO1xuICAgICAgICAgICAgLy8gU2F2aW5nIGRhdGEgZm9yIGxhdGVyIHVzZVxuICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCghaXNSaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPCBuZXh0SXRlbS5yZWRab25lKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFjay5wb3AoKSB8fFxuICAgICAgICAgICAgICAgICAgICAoaXNSaWdodCAmJiBwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA+IG5leHRJdGVtLm9yaWdMZWZ0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ucmVkWm9uZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ub3JpZ0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgKz0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0IC09IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5vcmlnTGVmdCA9IGRyYWdJdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5yZWRab25lID0gZHJhZ0l0ZW0ucmVkWm9uZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uaW5kZXggPSBkcmFnSXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCA9IG5leHRJdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChob2xkZXJbbmV4dFBvc10pO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbbmV4dFBvc10gPSBob2xkZXJbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbaW5kZXhdID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0dGluZyBuZXcgdmFsdWVzIGZvciBkcmFnaXRlbVxuICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLmluZGV4ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ub3JpZ0xlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5yZWRab25lID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBEcmFnIChlbCwgaGFuZGxlciwgaGFuZGxlcjIpIHtcbiAgICAgICAgbGV0IHggPSAwLFxuICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZS5jbGllbnRYIC0geCwgZS5jbGllbnRZIC0geSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldCxcbiAgICAgICAgICAgICAgICB0YXJnZXRDbGFzc1N0ciA9IHRhcmdldC5jbGFzc05hbWU7XG4gICAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PT0gJycgfHwgdGFyZ2V0Q2xhc3NTdHIuc3BsaXQoJyAnKS5pbmRleE9mKCdzb3J0LWJ0bicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgeSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gbW91c2VVcEhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoaGFuZGxlcjIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9