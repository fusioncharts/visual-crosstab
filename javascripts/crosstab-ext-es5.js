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
	        this.chartsAreSorted = false;
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
	                node.style.borderBottom = '1px solid #59595C';
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
	                node.style.borderBottom = '1px solid #59595C';
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
	            this.chartsAreSorted = true;
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
	                    e.stopPropagation();
	                    for (var i = sortBtns.length - 1; i >= 0; i--) {
	                        _this5.removeActiveClass(sortBtns[i]);
	                    }
	                    if (_this5.chartsAreSorted) {
	                        _this5.sortCharts();
	                        _this5.chartsAreSorted = false;
	                    } else {
	                        var clickElem = void 0,
	                            targetChildren = void 0,
	                            classStr = void 0;
	                        if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                            clickElem = e.target.parentNode;
	                        } else {
	                            clickElem = e.target;
	                        }
	                        if (clickElem) {
	                            targetChildren = clickElem.parentNode.childNodes;
	                            classStr = clickElem.className + ' active';
	                            clickElem.setAttribute('class', classStr);
	                            targetChildren.forEach(function (val) {
	                                if (val.nodeType === 3) {
	                                    _this5.sortCharts(val.nodeValue, 'ascending');
	                                }
	                            });
	                        }
	                    }
	                });
	            };
	            for (j = 0; j < jj; j++) {
	                var _btn = descendingBtns[j];
	                _btn.addEventListener('mousedown', function (e) {
	                    e.stopPropagation();
	                    for (var i = sortBtns.length - 1; i >= 0; i--) {
	                        _this5.removeActiveClass(sortBtns[i]);
	                    }
	                    if (_this5.chartsAreSorted) {
	                        _this5.sortCharts();
	                        _this5.chartsAreSorted = false;
	                    } else {
	                        var clickElem = void 0,
	                            targetChildren = void 0,
	                            classStr = void 0;
	                        if (e.target.className.split(' ').indexOf('sort-steps') !== -1) {
	                            clickElem = e.target.parentNode;
	                        } else {
	                            clickElem = e.target;
	                        }
	                        if (clickElem) {
	                            targetChildren = clickElem.parentNode.childNodes;
	                            classStr = clickElem.className + ' active';
	                            clickElem.setAttribute('class', classStr);
	                            targetChildren.forEach(function (val) {
	                                if (val.nodeType === 3) {
	                                    _this5.sortCharts(val.nodeValue, 'descending');
	                                }
	                            });
	                        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDg0ZTg0NzQwODFhNThkMmY0YmUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwiY3Jvc3N0YWJDb250YWluZXIiLCJkYXRhSXNTb3J0YWJsZSIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJkcmFnZ2FibGVIZWFkZXJzIiwiY2hhcnRDb25maWciLCJjaGFydCIsIndpbmRvdyIsImNyb3NzdGFiIiwicmVuZGVyQ3Jvc3N0YWIiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXZlbnRMaXN0Iiwic3RvcmVQYXJhbXMiLCJfY29sdW1uS2V5QXJyIiwic2hvd0ZpbHRlciIsImFnZ3JlZ2F0aW9uIiwiTXVsdGlDaGFydGluZyIsIm1jIiwiZGF0YVN0b3JlIiwiY3JlYXRlRGF0YVN0b3JlIiwic2V0RGF0YSIsImRhdGFTb3VyY2UiLCJFcnJvciIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJjaGFydHNBcmVTb3J0ZWQiLCJmaWVsZHMiLCJnZXRLZXlzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwiY2F0ZWdvcmllcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwicHVzaCIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsImNyZWF0ZVJvdyIsImNoYXJ0VG9wTWFyZ2luIiwiY2hhcnRCb3R0b21NYXJnaW4iLCJyZXZlcnNlIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJhc2NlbmRpbmdTb3J0QnRuIiwiZGVzY2VuZGluZ1NvcnRCdG4iLCJoZWFkaW5nVGV4dE5vZGUiLCJoZWFkZXJEaXYiLCJkcmFnRGl2Iiwic2V0QXR0cmlidXRlIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJhcHBlbmREcmFnSGFuZGxlIiwicG9zaXRpb24iLCJjcmVhdGVTb3J0QnV0dG9uIiwiY3JlYXRlVGV4dE5vZGUiLCJjb3JuZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjb2xPcmRlckxlbmd0aCIsImNvcm5lckNlbGxBcnIiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIm1heExlbmd0aCIsIm9iaiIsImZpbHRlciIsInZhbCIsImFyciIsImNvbE9yZGVyIiwieEF4aXNSb3ciLCJjcmVhdGVEaW1lbnNpb25IZWFkaW5ncyIsImNyZWF0ZVZlcnRpY2FsQXhpc0hlYWRlciIsImNyZWF0ZU1lYXN1cmVIZWFkaW5ncyIsImNoYXJ0TGVmdE1hcmdpbiIsImNoYXJ0UmlnaHRNYXJnaW4iLCJ1bnNoaWZ0IiwiY3JlYXRlQ2FwdGlvbiIsImZpbHRlcnMiLCJzbGljZSIsIm1hdGNoZWRWYWx1ZXMiLCJmb3JFYWNoIiwiZGltZW5zaW9uIiwiZmlsdGVyR2VuIiwidmFsdWUiLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJhIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImluZGV4T2YiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsImxlbiIsImsiLCJub2RlIiwibnVtSGFuZGxlcyIsImhhbmRsZVNwYW4iLCJtYXJnaW5MZWZ0IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwidmVydGljYWxBbGlnbiIsInNvcnRCdG4iLCJ0cmltIiwiYXBwZW5kQXNjZW5kaW5nU3RlcHMiLCJhcHBlbmREZXNjZW5kaW5nU3RlcHMiLCJidG4iLCJudW1TdGVwcyIsIm1hcmdpblZhbHVlIiwiZGl2V2lkdGgiLCJkaXNwbGF5IiwiYm9yZGVyQm90dG9tIiwidG9GaXhlZCIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInlBeGlzIiwiY3JlYXRlQ3Jvc3N0YWIiLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiamoiLCJjcm9zc3RhYkVsZW1lbnQiLCJjb25mIiwidHlwZSIsImF4aXNUeXBlIiwiYXhpc0NoYXJ0IiwiY3JlYXRlTXVsdGlDaGFydCIsImZpbmRZQXhpc0NoYXJ0IiwiY2hhcnRJbnN0YW5jZSIsImdldENoYXJ0SW5zdGFuY2UiLCJsaW1pdHMiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiY2hhcnRPYmoiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kZWxVcGRhdGVkIiwiZSIsImQiLCJ1cGRhdGVDcm9zc3RhYiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsImZpbHRlcmVkQ3Jvc3N0YWIiLCJvbGRDaGFydHMiLCJheGlzTGltaXRzIiwiY2VsbCIsImNoYXJ0Q29uZiIsImdldENvbmYiLCJvbGRDaGFydCIsImdldE9sZENoYXJ0IiwiZ2V0WUF4aXNMaW1pdHMiLCJ1cGRhdGUiLCJvcmRlciIsInNvcnRQcm9jZXNzb3IiLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwic29ydEZuIiwic29ydGVkRGF0YSIsImIiLCJzb3J0IiwiZ2V0Q2hpbGRNb2RlbCIsInJvd0NhdGVnb3JpZXMiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwic2V0dXBTb3J0QnV0dG9ucyIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsInNwbGljZSIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsInNwbGl0Iiwia2V5UGVybXV0YXRpb25zIiwicGVybXV0ZUFyciIsInJvd0ZpbHRlciIsImNvbEZpbHRlciIsInJvd0ZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImZpbHRlcmVkSlNPTiIsImdldEpTT04iLCJzb3J0ZWRDYXRlZ29yaWVzIiwibWVhc3VyZSIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZ2V0TGltaXQiLCJhc2NlbmRpbmdCdG5zIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImRlc2NlbmRpbmdCdG5zIiwic29ydEJ0bnMiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVBY3RpdmVDbGFzcyIsInNvcnRDaGFydHMiLCJjbGlja0VsZW0iLCJ0YXJnZXRDaGlsZHJlbiIsInRhcmdldCIsInBhcmVudE5vZGUiLCJjaGlsZE5vZGVzIiwibm9kZVR5cGUiLCJub2RlVmFsdWUiLCJlbGVtIiwiY2xhc3NObSIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZWxmIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImxpbWl0TGVmdCIsImxpbWl0UmlnaHQiLCJsYXN0IiwibG4iLCJNYXRoIiwibG9nMiIsImdyYXBoaWNzIiwibGVmdCIsImVsIiwiaXRlbSIsIm5MZWZ0IiwiZGlmZiIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwicmVkWm9uZSIsImluZGV4IiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0Q2xhc3NTdHIiLCJvcGFjaXR5IiwiY2xhc3NMaXN0IiwiYWRkIiwibW91c2VVcEhhbmRsZXIiLCJyZW1vdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUN0Q0EsS0FBTUEsY0FBYyxtQkFBQUMsQ0FBUSxDQUFSLENBQXBCO0FB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QVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBbm1CYSxFQTZtQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkODRlODQ3NDA4MWE1OGQyZjRiZSIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnUHJvZml0JywgJ1Zpc2l0b3JzJ10sXG4gICAgY2hhcnRUeXBlOiAnYmFyMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgZGF0YUlzU29ydGFibGU6IHRydWUsXG4gICAgY2VsbFdpZHRoOiAxNTAsXG4gICAgY2VsbEhlaWdodDogODAsXG4gICAgLy8gc2hvd0ZpbHRlcjogdHJ1ZSxcbiAgICBkcmFnZ2FibGVIZWFkZXJzOiB0cnVlLFxuICAgIC8vIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ3JvbGxPdmVyQmFuZENvbG9yJzogJyNiYWRhZjAnLFxuICAgICAgICAgICAgJ2NvbHVtbkhvdmVyQ29sb3InOiAnIzFiODNjYycsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnMicsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNycsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyM1QjVCNUInLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlclRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIC8vIExpc3Qgb2YgcG9zc2libGUgZXZlbnRzIHJhaXNlZCBieSB0aGUgZGF0YSBzdG9yZS5cbiAgICAgICAgdGhpcy5ldmVudExpc3QgPSB7XG4gICAgICAgICAgICAnbW9kZWxVcGRhdGVkJzogJ21vZGVsdXBkYXRlZCcsXG4gICAgICAgICAgICAnbW9kZWxEZWxldGVkJzogJ21vZGVsZGVsZXRlZCcsXG4gICAgICAgICAgICAnbWV0YUluZm9VcGRhdGUnOiAnbWV0YWluZm91cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JVcGRhdGVkJzogJ3Byb2Nlc3NvcnVwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvckRlbGV0ZWQnOiAncHJvY2Vzc29yZGVsZXRlZCdcbiAgICAgICAgfTtcbiAgICAgICAgLy8gUG90ZW50aWFsbHkgdW5uZWNlc3NhcnkgbWVtYmVyLlxuICAgICAgICAvLyBUT0RPOiBSZWZhY3RvciBjb2RlIGRlcGVuZGVudCBvbiB2YXJpYWJsZS5cbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHZhcmlhYmxlLlxuICAgICAgICB0aGlzLnN0b3JlUGFyYW1zID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIC8vIEFycmF5IG9mIGNvbHVtbiBuYW1lcyAobWVhc3VyZXMpIHVzZWQgd2hlbiBidWlsZGluZyB0aGUgY3Jvc3N0YWIgYXJyYXkuXG4gICAgICAgIHRoaXMuX2NvbHVtbktleUFyciA9IFtdO1xuICAgICAgICAvLyBTYXZpbmcgcHJvdmlkZWQgY29uZmlndXJhdGlvbiBpbnRvIGluc3RhbmNlLlxuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLmRhdGFJc1NvcnRhYmxlID0gY29uZmlnLmRhdGFJc1NvcnRhYmxlO1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuc2hvd0ZpbHRlciA9IGNvbmZpZy5zaG93RmlsdGVyIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uIHx8ICdzdW0nO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZUhlYWRlcnMgPSBjb25maWcuZHJhZ2dhYmxlSGVhZGVycyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2UgfHwgJ05vIGRhdGEgdG8gZGlzcGxheS4nO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgLy8gQ3JlYXRpbmcgYW4gZW1wdHkgZGF0YSBzdG9yZVxuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgLy8gQWRkaW5nIGRhdGEgdG8gdGhlIGRhdGEgc3RvcmVcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpQ2hhcnRuZyBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YUZpbHRlciBtb2R1bGUgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIGEgZGF0YSBzdHJ1Y3R1cmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgLy8gQnVpbGRpbmcgYSBoYXNoIG1hcCBvZiBhcHBsaWNhYmxlIGZpbHRlcnMgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGZpbHRlciBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuY2hhcnRzQXJlU29ydGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYW4gYXJyYXkgb2YgYXJyYXlzIGRhdGEgc3RydWN0dXJlIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgYXJyYXlzIGdlbmVyYXRlZCBmcm9tIHRoZSBkYXRhU3RvcmUncyBhcnJheSBvZiBvYmplY3RzXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgbGV0IGRhdGFTdG9yZSA9IHRoaXMuZGF0YVN0b3JlLFxuICAgICAgICAgICAgZmllbGRzID0gZGF0YVN0b3JlLmdldEtleXMoKTtcbiAgICAgICAgaWYgKGZpZWxkcykge1xuICAgICAgICAgICAgbGV0IGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjYXRlZ29yaWVzIGZvciBjaGFydHMgKGkuZS4gbm8gc29ydGluZyBhcHBsaWVkKVxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2VuZXJhdGUga2V5cyBmcm9tIGRhdGEgc3RvcmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgcm93RWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLl9jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCh0aGlzLmNlbGxIZWlnaHQgLSAxMCkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4XS50b0xvd2VyQ2FzZSgpICtcbiAgICAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgLy8gaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHJvd0VsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29ybmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydFRvcE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRCb3R0b21NYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogdGhpcy5jYXRlZ29yaWVzLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2ZXJ0aWNhbC1heGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuX2NvbHVtbktleUFycltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuX2NvbHVtbktleUFycltqXSlbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjaGFydC1jZWxsICcgKyAoaiArIDEpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjb2xMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmouY2xhc3NOYW1lID0gJ2NoYXJ0LWNlbGwgbGFzdC1jb2wnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5fY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWF4ID0gbWF4O1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWluID0gbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZU1lYXN1cmVIZWFkaW5ncyAodGFibGUsIGRhdGEsIG1lYXN1cmVPcmRlcikge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGFzY2VuZGluZ1NvcnRCdG4sXG4gICAgICAgICAgICBkZXNjZW5kaW5nU29ydEJ0bixcbiAgICAgICAgICAgIGhlYWRpbmdUZXh0Tm9kZSxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBoZWFkZXJEaXYsXG4gICAgICAgICAgICBkcmFnRGl2O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gbWVhc3VyZU9yZGVyW2ldO1xuICAgICAgICAgICAgICAgIC8vIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF07XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lYXN1cmUtZHJhZy1oYW5kbGUnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUuaGVpZ2h0ID0gJzVweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdUb3AgPSAnM3B4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ0JvdHRvbSA9ICcxcHgnO1xuICAgICAgICAgICAgdGhpcy5hcHBlbmREcmFnSGFuZGxlKGRyYWdEaXYsIDI1KTtcblxuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gICAgICAgICAgICBhc2NlbmRpbmdTb3J0QnRuID0gdGhpcy5jcmVhdGVTb3J0QnV0dG9uKCdhc2NlbmRpbmctc29ydCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcblxuICAgICAgICAgICAgZGVzY2VuZGluZ1NvcnRCdG4gPSB0aGlzLmNyZWF0ZVNvcnRCdXR0b24oJ2Rlc2NlbmRpbmctc29ydCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChkZXNjZW5kaW5nU29ydEJ0bik7XG5cbiAgICAgICAgICAgIGhlYWRpbmdUZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpZWxkQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgaHRtbFJlZi5hcHBlbmRDaGlsZChhc2NlbmRpbmdTb3J0QnRuKTtcbiAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoaGVhZGluZ1RleHROb2RlKTtcbiAgICAgICAgICAgIGh0bWxSZWYuYXBwZW5kQ2hpbGQoZGVzY2VuZGluZ1NvcnRCdG4pO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tbWVhc3VyZXMgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZURpbWVuc2lvbkhlYWRpbmdzIChjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGhlYWRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXG4gICAgICAgICAgICBkcmFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmFnRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZGltZW5zaW9uLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kRHJhZ0hhbmRsZShkcmFnRGl2LCAyNSk7XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuZGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5kaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICc1cHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgPSAnZGltZW5zaW9uLWhlYWRlciAnICsgdGhpcy5kaW1lbnNpb25zW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlckRpdi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyICgpIHtcbiAgICAgICAgbGV0IGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAobWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnQgZGltZW5zaW9uIGhlYWRpbmdzXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlRGltZW5zaW9uSGVhZGluZ3ModGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHZlcnRpY2FsIGF4aXMgaGVhZGVyXG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKHRoaXMuY3JlYXRlVmVydGljYWxBeGlzSGVhZGVyKCkpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IG1lYXN1cmUgaGVhZGluZ3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTWVhc3VyZUhlYWRpbmdzKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHJvd3NcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICAvLyBGaW5kIHJvdyB3aXRoIG1heCBsZW5ndGggaW4gdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFB1c2ggYmxhbmsgcGFkZGluZyBjZWxscyB1bmRlciB0aGUgZGltZW5zaW9ucyBpbiB0aGUgc2FtZSByb3cgYXMgdGhlIGhvcml6b250YWwgYXhpc1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUHVzaCBob3Jpem9udGFsIGF4ZXMgaW50byB0aGUgbGFzdCByb3cgb2YgdGhlIHRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWwtYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogdGhpcy5jaGFydENvbmZpZy5jaGFydC5jaGFydExlZnRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRSaWdodE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiB0aGlzLmNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgLy8gUGxhY2UgdGhlIGNhcHRpb24gY2VsbCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWJsZVxuICAgICAgICAgICAgdGFibGUudW5zaGlmdCh0aGlzLmNyZWF0ZUNhcHRpb24obWF4TGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLl9jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGRhdGEgZm9yIGNyb3NzdGFiLiA6KFxuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zLnNsaWNlKDAsIHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW2RpbWVuc2lvbl07XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4oZGltZW5zaW9uLCB2YWx1ZS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICBrZXkgIT09IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgYXBwZW5kRHJhZ0hhbmRsZSAobm9kZSwgbnVtSGFuZGxlcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIGhhbmRsZVNwYW47XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1IYW5kbGVzOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLm1hcmdpbkxlZnQgPSAnMXB4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUuZm9udFNpemUgPSAnM3B4JztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubGluZUhlaWdodCA9ICcxJztcbiAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnO1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChoYW5kbGVTcGFuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVNvcnRCdXR0b24gKGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgc29ydEJ0bixcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ3NvcnQtYnRuJyArICcgJyArIChjbGFzc05hbWUgfHwgJycpO1xuICAgICAgICBzb3J0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzb3J0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc1N0ci50cmltKCkpO1xuICAgICAgICBzb3J0QnRuLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ2FzY2VuZGluZy1zb3J0Jykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRBc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc05hbWUgPT09ICdkZXNjZW5kaW5nLXNvcnQnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZERlc2NlbmRpbmdTdGVwcyhzb3J0QnRuLCA0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc29ydEJ0bjtcbiAgICB9XG5cbiAgICBhcHBlbmRBc2NlbmRpbmdTdGVwcyAoYnRuLCBudW1TdGVwcykge1xuICAgICAgICBsZXQgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtYXJnaW5WYWx1ZSA9IDEsXG4gICAgICAgICAgICBkaXZXaWR0aCA9IDE7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbnVtU3RlcHM7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9ICdzb3J0LXN0ZXBzIGFzY2VuZGluZyc7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmJvcmRlckJvdHRvbSA9ICcxcHggc29saWQgIzU5NTk1Qyc7XG4gICAgICAgICAgICBkaXZXaWR0aCA9IGRpdldpZHRoICsgKChpIC8gZGl2V2lkdGgpICogMyk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gKGRpdldpZHRoLnRvRml4ZWQoKSkgKyAncHgnO1xuICAgICAgICAgICAgaWYgKGkgPT09IChudW1TdGVwcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kRGVzY2VuZGluZ1N0ZXBzIChidG4sIG51bVN0ZXBzKSB7XG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1hcmdpblZhbHVlID0gMSxcbiAgICAgICAgICAgIGRpdldpZHRoID0gOTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBudW1TdGVwczsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ3NvcnQtc3RlcHMgZGVzY2VuZGluZyc7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmJvcmRlckJvdHRvbSA9ICcxcHggc29saWQgIzU5NTk1Qyc7XG4gICAgICAgICAgICBkaXZXaWR0aCA9IGRpdldpZHRoIC0gKChpIC8gZGl2V2lkdGgpICogNCk7XG4gICAgICAgICAgICBub2RlLnN0eWxlLndpZHRoID0gKGRpdldpZHRoLnRvRml4ZWQoKSkgKyAncHgnO1xuICAgICAgICAgICAgaWYgKGkgPT09IChudW1TdGVwcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBtYXJnaW5WYWx1ZSArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gbWFyZ2luVmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICB5QXhpcztcblxuICAgICAgICAvLyBHZW5lcmF0ZSB0aGUgY3Jvc3N0YWIgYXJyYXlcbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuICAgICAgICAvLyBGaW5kIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bSBmb3IgdGhlIGF4ZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gdGhpcy5jcm9zc3RhYltpXVt0aGlzLmNyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBZIGF4aXMgY2hhcnRzIGluIHRoZSBjcm9zc3RhYiBhcnJheSB3aXRoIHRoZSBnbG9iYWwgbWF4aW11bSBhbmQgbWluaW11bVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldLFxuICAgICAgICAgICAgICAgIHJvd0F4aXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJiBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IHRoZSBjcm9zc3RhYiB3aXRoIG9ubHkgdGhlIGF4ZXMsIGNhcHRpb24gYW5kIGh0bWwgdGV4dC5cbiAgICAgICAgLy8gUmVxdWlyZWQgc2luY2UgYXhlcyBjYW5ub3QgcmV0dXJuIGxpbWl0cyB1bmxlc3MgdGhleSBhcmUgZHJhd25cbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRoaXMuY3Jvc3N0YWIpO1xuXG4gICAgICAgIC8vIEZpbmQgYSBZIEF4aXMgY2hhcnRcbiAgICAgICAgeUF4aXMgPSB5QXhpcyB8fCB0aGlzLmZpbmRZQXhpc0NoYXJ0KCk7XG5cbiAgICAgICAgLy8gUGxhY2UgYSBjaGFydCBvYmplY3Qgd2l0aCBsaW1pdHMgZnJvbSB0aGUgWSBBeGlzIGluIHRoZSBjb3JyZWN0IGNlbGxcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoeUF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IHlBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2UgPSBjaGFydC5nZXRDaGFydEluc3RhbmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRJbnN0YW5jZS5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmoodGhpcy5kYXRhU3RvcmUsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLCBtaW5MaW1pdCwgbWF4TGltaXQpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnRPYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIGNyb3NzdGFiXG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcblxuICAgICAgICAvLyBVcGRhdGUgY3Jvc3N0YWIgd2hlbiB0aGUgbW9kZWwgdXBkYXRlc1xuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKHRoaXMuZXZlbnRMaXN0Lm1vZGVsVXBkYXRlZCwgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gY29uY3VycmVudGx5IGhpZ2hsaWdodCBwbG90cyB3aGVuIGhvdmVyZWQgaW5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbCA9IGRhdGEuZGF0YVtjYXRlZ29yeV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodChjYXRlZ29yeVZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNvbmN1cnJlbnRseSByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tIHBsb3RzIHdoZW4gaG92ZXJlZCBvdXRcbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3Zlcm91dCcsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdjYXB0aW9uJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcmVkQ3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqLFxuICAgICAgICAgICAgb2xkQ2hhcnRzID0gW10sXG4gICAgICAgICAgICBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGF4aXNMaW1pdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENvbmYgPSBjZWxsLmNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlICE9PSAnY2FwdGlvbicgJiYgY2hhcnRDb25mLnR5cGUgIT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnRzLnB1c2goY2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwucm93SGFzaCAmJiBjZWxsLmNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZENoYXJ0ID0gdGhpcy5nZXRPbGRDaGFydChvbGRDaGFydHMsIGNlbGwucm93SGFzaCwgY2VsbC5jb2xIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9sZENoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHRoaXMuZGF0YVN0b3JlLCB0aGlzLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5yb3dIYXNoLCBjZWxsLmNvbEhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQ2hhcnQgPSBjaGFydE9ialsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0T2JqWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2hhcnQgPSBvbGRDaGFydDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbWl0cykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1heCA9IGxpbWl0cy5tYXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLm1pbiA9IGxpbWl0cy5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGZpbHRlcmVkQ3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IGZpbHRlcmVkQ3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwubWF4IHx8IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCBjZWxsLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gY2VsbC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IGNlbGwubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSBjZWxsLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCAmJiBjZWxsLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF4aXNDaGFydCA9IHJvd0F4aXMuY2hhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gYXhpc0NoYXJ0LmNvbmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0Qm90dG9tTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IHRoaXMuY2hhcnRDb25maWcuY2hhcnQuY2hhcnRUb3BNYXJnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09ICdiYXIyZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuY29uZmlnLmNoYXJ0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0TGVmdE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LmNoYXJ0UmlnaHRNYXJnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0hvcml6b250YWwnOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNDaGFydCA9IHRoaXMubWMuY2hhcnQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY2hhcnQgPSBheGlzQ2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyb3NzdGFiID0gZmlsdGVyZWRDcm9zc3RhYjtcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KCk7XG4gICAgICAgIGF4aXNMaW1pdHMgPSB0aGlzLmdldFlBeGlzTGltaXRzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJyAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnY2FwdGlvbicgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmdldENvbmYoKS50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaih0aGlzLmRhdGFTdG9yZSwgdGhpcy5jYXRlZ29yaWVzLCBjcm9zc3RhYkVsZW1lbnQucm93SGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMV0pWzFdO1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQudXBkYXRlKGNoYXJ0T2JqLmdldENvbmYoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFlBeGlzQ2hhcnQgKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLmNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3N0YWJFbGVtZW50ID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LmNvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRZQXhpc0xpbWl0cyAoKSB7XG4gICAgICAgIGxldCBpLCBpaSxcbiAgICAgICAgICAgIGosIGpqO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q29uZiA9IGNlbGwuY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgPT09ICdheGlzJyAmJiBjaGFydENvbmYuY29uZmlnLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2VsbC5jaGFydC5nZXRDaGFydEluc3RhbmNlKCkuZ2V0TGltaXRzKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0T2xkQ2hhcnQgKG9sZENoYXJ0cywgcm93SGFzaCwgY29sSGFzaCkge1xuICAgICAgICBmb3IgKHZhciBpID0gb2xkQ2hhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAob2xkQ2hhcnRzW2ldLnJvd0hhc2ggPT09IHJvd0hhc2ggJiYgb2xkQ2hhcnRzW2ldLmNvbEhhc2ggPT09IGNvbEhhc2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2xkQ2hhcnRzW2ldLmNoYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ydENoYXJ0cyAoa2V5LCBvcmRlcikge1xuICAgICAgICBsZXQgc29ydFByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpLFxuICAgICAgICAgICAgc29ydEZuLFxuICAgICAgICAgICAgc29ydGVkRGF0YTtcbiAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAob3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gYVtrZXldIC0gYltrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKG9yZGVyID09PSAnZGVzY2VuZGluZycpIHtcbiAgICAgICAgICAgIHNvcnRGbiA9IChhLCBiKSA9PiBiW2tleV0gLSBhW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb3J0Rm4gPSAoYSwgYikgPT4gMDtcbiAgICAgICAgfVxuICAgICAgICBzb3J0UHJvY2Vzc29yLnNvcnQoc29ydEZuKTtcbiAgICAgICAgc29ydGVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoc29ydFByb2Nlc3Nvcik7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWIuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgbGV0IHJvd0NhdGVnb3JpZXM7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBjZWxsLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnRDb25mID0gY2hhcnQuZ2V0Q29uZigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnRDb25mLnR5cGUgIT09ICdjYXB0aW9uJyAmJiBjaGFydENvbmYudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRPYmogPSB0aGlzLmdldENoYXJ0T2JqKHNvcnRlZERhdGEsIHRoaXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRPYmpbMV0uZ2V0Q29uZigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NhdGVnb3JpZXMgPSBjaGFydC5nZXRDb25mKCkuY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcm93LmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gY2VsbC5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0Q29uZiA9IGNoYXJ0LmdldENvbmYoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0Q29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBheGlzVHlwZSA9IGNoYXJ0Q29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpc1R5cGUgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYuY29uZmlnLmNhdGVnb3JpZXMgPSByb3dDYXRlZ29yaWVzLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydENvbmYuY29uZmlnLmNhdGVnb3JpZXMgPSByb3dDYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC51cGRhdGUoY2hhcnRDb25mKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCB0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKHRoaXMuY3Jvc3N0YWIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTb3J0QnV0dG9ucyh0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAoZGF0YVN0b3JlLCBjYXRlZ29yaWVzLCByb3dGaWx0ZXIsIGNvbEZpbHRlciwgbWluTGltaXQsIG1heExpbWl0KSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIC8vIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIC8vIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICAvLyBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBsaW1pdHMgPSB7fSxcbiAgICAgICAgICAgIGNoYXJ0ID0ge307XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgaWYgKG1pbkxpbWl0ICE9PSB1bmRlZmluZWQgJiYgbWF4TGltaXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb25maWcuY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUlzU29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWRKU09OID0gZmlsdGVyZWREYXRhLmdldEpTT04oKSxcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkQ2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkSlNPTi5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeSA9IHZhbFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvcnRlZENhdGVnb3JpZXMuaW5kZXhPZihjYXRlZ29yeSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHNvcnRlZENhdGVnb3JpZXMuc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogZmlsdGVyZWREYXRhLFxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0LmdldExpbWl0KCk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbGltaXRzLm1heCxcbiAgICAgICAgICAgICAgICAnbWluJzogbGltaXRzLm1pblxuICAgICAgICAgICAgfSwgY2hhcnRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBTb3J0QnV0dG9ucyAoKSB7XG4gICAgICAgIGxldCBhc2NlbmRpbmdCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGlpID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGVzY2VuZGluZ0J0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXNjZW5kaW5nLXNvcnQnKSxcbiAgICAgICAgICAgIGpqID0gYXNjZW5kaW5nQnRucy5sZW5ndGgsXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgc29ydEJ0bnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzb3J0LWJ0bicpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ0biA9IGFzY2VuZGluZ0J0bnNbaV07XG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc29ydEJ0bnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDbGFzcyhzb3J0QnRuc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c0FyZVNvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRDaGFydHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFydHNBcmVTb3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xpY2tFbGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc1N0cjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtc3RlcHMnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0gPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xpY2tFbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRDaGlsZHJlbiA9IGNsaWNrRWxlbS5wYXJlbnROb2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc1N0ciA9IGNsaWNrRWxlbS5jbGFzc05hbWUgKyAnIGFjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0VsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzU3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cyh2YWwubm9kZVZhbHVlLCAnYXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBkZXNjZW5kaW5nQnRuc1tqXTtcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzb3J0QnRucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNsYXNzKHNvcnRCdG5zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzQXJlU29ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydENoYXJ0cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0c0FyZVNvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGlja0VsZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRDaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZignc29ydC1zdGVwcycpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tFbGVtID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGlja0VsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENoaWxkcmVuID0gY2xpY2tFbGVtLnBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzU3RyID0gY2xpY2tFbGVtLmNsYXNzTmFtZSArICcgYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrRWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NTdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q2hpbGRyZW4uZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0Q2hhcnRzKHZhbC5ub2RlVmFsdWUsICdkZXNjZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZW1vdmVBY3RpdmVDbGFzcyAoZWxlbSkge1xuICAgICAgICBsZXQgY2xhc3NObSA9IGVsZW0uY2xhc3NOYW1lXG4gICAgICAgICAgICAuc3BsaXQoJyAnKVxuICAgICAgICAgICAgLmZpbHRlcigodmFsKSA9PiB2YWwgIT09ICdhY3RpdmUnKVxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NObSk7XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgLy8gT25lIHNoaWZ0IGZvciBibGFuayBib3hcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggKyBtZWFzdXJlc0xlbmd0aCArIDEpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKGRpbWVuc2lvbnNIb2xkZXIsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNMZW5ndGgsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIobWVhc3VyZXNIb2xkZXIsIG1lYXN1cmVzLCBtZWFzdXJlc0xlbmd0aCwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgIGZ1bmN0aW9uIHNldHVwTGlzdGVuZXIgKGhvbGRlciwgYXJyLCBhcnJMZW4sIGdsb2JhbEFycikge1xuICAgICAgICAgICAgbGV0IGxpbWl0TGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IDAsXG4gICAgICAgICAgICAgICAgbGFzdCA9IGFyckxlbiAtIDEsXG4gICAgICAgICAgICAgICAgbG4gPSBNYXRoLmxvZzI7XG5cbiAgICAgICAgICAgIGlmIChob2xkZXJbMF0pIHtcbiAgICAgICAgICAgICAgICBsaW1pdExlZnQgPSBwYXJzZUludChob2xkZXJbMF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IHBhcnNlSW50KGhvbGRlcltsYXN0XS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IGhvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGhvbGRlcltpXSxcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICBkaWZmID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWRab25lID0gaXRlbS5vcmlnTGVmdCArIHBhcnNlSW50KGVsLnN0eWxlLndpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ1ogPSBlbC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gaXRlbS5vcmlnTGVmdCArIGR4ICsgaXRlbS5hZGp1c3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA8IGxpbWl0TGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGxpbWl0TGVmdCAtIG5MZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdExlZnQgLSBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPiBsaW1pdFJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbkxlZnQgLSBsaW1pdFJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdFJpZ2h0ICsgbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IG5MZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8XG4gICAgICAgICAgICAgICAgICAgIChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICAgICAgICAgIHRhcmdldENsYXNzU3RyID0gdGFyZ2V0LmNsYXNzTmFtZTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnJyB8fCB0YXJnZXRDbGFzc1N0ci5zcGxpdCgnICcpLmluZGV4T2YoJ3NvcnQtYnRuJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVyMiwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=