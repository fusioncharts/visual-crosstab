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
	    rowDimensions: ['Product', 'State'],
	    colDimensions: ['Year', 'Quality', 'Month'],
	    chartType: 'column2d',
	    noDataMessage: 'No data to display.',
	    measure: 'Sale',
	    measureOnRow: false,
	    cellWidth: 120,
	    cellHeight: 100,
	    crosstabContainer: 'crosstab-div',
	    aggregation: 'sum',
	    chartConfig: {
	        chart: {
	            'showBorder': '0',
	            'showValues': '0',
	            'divLineAlpha': '0',
	            'numberPrefix': '₹',
	            'rotateValues': '1',
	            'chartBottomMargin': '5',
	            'chartTopMargin': '5',
	            'chartLeftMargin': '5',
	            'chartRightMargin': '5',
	            'zeroPlaneThickness': '1',
	            'showZeroPlaneValue': '1',
	            'zeroPlaneAlpha': '100',
	            'bgColor': '#ffffff',
	            'showXAxisLine': '1',
	            'plotBorderAlpha': '0',
	            'showXaxisValues': '0',
	            'showYAxisValues': '0',
	            'animation': '1',
	            'transposeAnimation': '1',
	            'alternateHGridAlpha': '0',
	            'plotColorInTooltip': '0',
	            'canvasBorderAlpha': '100',
	            'alternateVGridAlpha': '0',
	            'paletteColors': '#B5B9BA',
	            'usePlotGradientColor': '0',
	            'valueFontColor': '#ffffff',
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
	        var _this = this;
	
	        _classCallCheck(this, CrosstabExt);
	
	        // let self = this;
	        this.data = data;
	        if (typeof MultiCharting === 'function') {
	            this.mc = new MultiCharting();
	            this.dataStore = this.mc.createDataStore();
	            this.dataStore.setData({ dataSource: this.data });
	            this.t1 = performance.now();
	        } else {
	            return {
	                test: function test(a) {
	                    return a;
	                }
	            };
	        }
	        this.chartType = config.chartType;
	        this.chartConfig = config.chartConfig;
	        this.rowDimensions = config.rowDimensions;
	        this.colDimensions = config.colDimensions;
	        this.dimensions = this.mergeDimensions();
	        this.measure = config.measure;
	        this.measureOnRow = config.measureOnRow;
	        this.globalData = this.buildGlobalData();
	        this.columnKeyArr = [];
	        this.cellWidth = config.cellWidth;
	        this.cellHeight = config.cellHeight;
	        this.crosstabContainer = config.crosstabContainer;
	        this.hash = this.getFilterHashMap();
	        this.count = 0;
	        this.aggregation = config.aggregation;
	        this.axes = [];
	        this.noDataMessage = config.noDataMessage;
	        if (typeof FCDataFilterExt === 'function') {
	            var filterConfig = {};
	            this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box');
	        }
	        this.dataStore.addEventListener('tempEvent', function (e, d) {
	            _this.globalData = _this.buildGlobalData();
	            _this.renderCrosstab();
	        });
	    }
	
	    /**
	     * Build global data from the data store for internal use.
	     */
	
	
	    _createClass(CrosstabExt, [{
	        key: 'buildGlobalData',
	        value: function buildGlobalData() {
	            if (this.dataStore.getKeys()) {
	                var fields = this.dataStore.getKeys(),
	                    globalData = {};
	                for (var i = 0, ii = fields.length; i < ii; i++) {
	                    globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
	                }
	                return globalData;
	            } else {
	                return false;
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
	                colLength = this.columnKeyArr.length,
	                htmlRef,
	                min = Infinity,
	                max = -Infinity,
	                minmaxObj = {};
	
	            for (i = 0; i < l; i += 1) {
	                var classStr = '';
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = fieldValues[i];
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = (this.cellHeight - 10) / 2 + 'px';
	                classStr += 'row-dimensions' + ' ' + this.rowDimensions[currentIndex] + ' ' + fieldValues[i].toLowerCase();
	                // if (currentIndex > 0) {
	                //     htmlRef.classList.add(this.rowDimensions[currentIndex - 1].toLowerCase());
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
	                    for (var j = 0; j < colLength; j += 1) {
	                        var chartCellObj = {
	                            width: this.cellWidth,
	                            height: this.cellHeight,
	                            rowspan: 1,
	                            colspan: 1,
	                            rowHash: filteredDataHashKey,
	                            colHash: this.columnKeyArr[j]
	                        };
	                        table[table.length - 1].push(chartCellObj);
	                        minmaxObj = this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])[0];
	                        max = parseInt(minmaxObj.max) > max ? minmaxObj.max : max;
	                        min = parseInt(minmaxObj.min) < min ? minmaxObj.min : min;
	                    }
	                    var adapterCfg = {
	                        config: {
	                            config: {
	                                chart: {
	                                    'dataMin': min,
	                                    'axisType': 'y',
	                                    'dataMax': max,
	                                    'isAxisOpposite': true,
	                                    'borderthickness': 0,
	                                    'chartBottomMargin': 5
	                                }
	                            }
	                        }
	                    },
	                        adapter = this.mc.dataadapter(adapterCfg);
	                    table[table.length - 1].push({
	                        rowspan: 1,
	                        colspan: 1,
	                        className: 'y-axis-chart',
	                        chart: {
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'configuration': adapter
	                        }
	                    });
	                }
	                rowspan += rowElement.rowspan;
	            }
	            return rowspan;
	        }
	    }, {
	        key: 'createCol',
	        value: function createCol(table, data, colOrder, currentIndex, filteredDataStore) {
	            var colspan = 0,
	                fieldComponent = colOrder[currentIndex],
	                fieldValues = data[fieldComponent],
	                i,
	                l = fieldValues.length,
	                colElement,
	                hasFurtherDepth = currentIndex < colOrder.length - 1,
	                filteredDataHashKey,
	                htmlRef;
	
	            if (table.length <= currentIndex) {
	                table.push([]);
	            }
	            for (i = 0; i < l; i += 1) {
	                var classStr = '';
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = fieldValues[i];
	                htmlRef.style.textAlign = 'center';
	                document.body.appendChild(htmlRef);
	                classStr += 'column-dimensions' + ' ' + this.colDimensions[currentIndex] + ' ' + fieldValues[i].toLowerCase();
	                this.cornerHeight = htmlRef.offsetHeight;
	                document.body.removeChild(htmlRef);
	                colElement = {
	                    width: this.cellWidth,
	                    height: this.cornerHeight,
	                    rowspan: 1,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: classStr
	                };
	
	                filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
	
	                table[currentIndex].push(colElement);
	
	                if (hasFurtherDepth) {
	                    colElement.colspan = this.createCol(table, data, colOrder, currentIndex + 1, filteredDataHashKey);
	                } else {
	                    this.columnKeyArr.push(filteredDataHashKey);
	                }
	                colspan += colElement.colspan;
	            }
	            return colspan;
	        }
	    }, {
	        key: 'createRowDimHeading',
	        value: function createRowDimHeading(table, colOrderLength) {
	            var cornerCellArr = [],
	                i = 0,
	                htmlRef;
	
	            for (i = 0; i < this.rowDimensions.length; i++) {
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = this.rowDimensions[i][0].toUpperCase() + this.rowDimensions[i].substr(1);
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = (30 * this.colDimensions.length - 15) / 2 + 'px';
	                cornerCellArr.push({
	                    width: this.rowDimensions[i] * 10,
	                    height: 30 * this.colDimensions.length,
	                    rowspan: colOrderLength,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: 'corner-cell'
	                });
	            }
	            return cornerCellArr;
	        }
	    }, {
	        key: 'createColDimHeading',
	        value: function createColDimHeading(table, index) {
	            var i = index,
	                htmlRef;
	            for (; i < table.length; i++) {
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = this.colDimensions[i][0].toUpperCase() + this.colDimensions[i].substr(1);
	                htmlRef.style.textAlign = 'center';
	                table[i].push({
	                    width: this.colDimensions[i].length * 10,
	                    height: 30,
	                    rowspan: 1,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: 'corner-cell'
	                });
	            }
	            return table;
	        }
	    }, {
	        key: 'createCaption',
	        value: function createCaption(table, maxLength) {
	            var adapterCfg = {
	                config: {
	                    config: {
	                        chart: {
	                            'caption': 'Sale of Cereal',
	                            'subcaption': 'Across States, Across Years',
	                            'borderthickness': '0'
	                        }
	                    }
	                }
	            },
	                adapter = this.mc.dataadapter(adapterCfg);
	            table.unshift([{
	                height: 50,
	                rowspan: 1,
	                colspan: maxLength,
	                className: 'caption-chart',
	                chart: {
	                    'type': 'caption',
	                    'width': '100%',
	                    'height': '100%',
	                    'dataFormat': 'json',
	                    'configuration': adapter
	                }
	            }]);
	            return table;
	        }
	    }, {
	        key: 'createCrosstab',
	        value: function createCrosstab() {
	            var self = this,
	                obj = this.globalData,
	                rowOrder = this.rowDimensions.filter(function (val, i, arr) {
	                if (self.measureOnRow) {
	                    if (val !== arr[arr.length - 1]) {
	                        return true;
	                    }
	                } else {
	                    return true;
	                }
	            }),
	                colOrder = this.colDimensions.filter(function (val, i, arr) {
	                if (self.measureOnRow) {
	                    return true;
	                } else {
	                    if (val !== arr[arr.length - 1]) {
	                        return true;
	                    }
	                }
	            }),
	                table = [],
	                xAxisRow = [],
	                i = 0,
	                maxLength = 0;
	            if (obj) {
	                table.push(this.createRowDimHeading(table, colOrder.length));
	                this.createCol(table, obj, colOrder, 0, '');
	                table = this.createColDimHeading(table, 0);
	                table.push([]);
	                this.createRow(table, obj, rowOrder, 0, '');
	                for (i = 0; i < table.length; i++) {
	                    maxLength = maxLength < table[i].length ? table[i].length : maxLength;
	                }
	                for (i = 0; i < this.rowDimensions.length; i++) {
	                    xAxisRow.push({
	                        rowspan: 1,
	                        colspan: 1,
	                        height: 30,
	                        className: 'blank-cell'
	                    });
	                }
	
	                for (i = 0; i < maxLength - 1 - this.rowDimensions.length; i++) {
	                    var categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]],
	                        adapterCfg = {
	                        config: {
	                            config: {
	                                chart: {
	                                    'axisType': 'x',
	                                    'borderthickness': 0,
	                                    'canvasPadding': 13,
	                                    'chartLeftMargin': 5,
	                                    'chartRightMargin': 5
	                                },
	                                categories: categories
	                            }
	                        }
	                    },
	                        adapter = this.mc.dataadapter(adapterCfg);
	                    xAxisRow.push({
	                        width: '100%',
	                        height: 20,
	                        rowspan: 1,
	                        colspan: 1,
	                        className: 'x-axis-chart',
	                        chart: {
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'configuration': adapter
	                        }
	                    });
	                }
	
	                table.push(xAxisRow);
	                table = this.createCaption(table, maxLength);
	                this.columnKeyArr = [];
	            } else {
	                table.push([{
	                    html: '<p style="text-align: center">' + this.noDataMessage + '</p>',
	                    height: 50,
	                    colspan: this.rowDimensions.length * this.colDimensions.length
	                }]);
	            }
	            return table;
	        }
	    }, {
	        key: 'rowDimReorder',
	        value: function rowDimReorder(subject, target) {
	            var buffer = '',
	                i,
	                rowDimensions = this.rowDimensions;
	            if (this.measureOnRow === true) {
	                rowDimensions.splice(rowDimensions.length - 1, 1);
	            }
	            if (rowDimensions.indexOf(Math.max(subject, target)) >= rowDimensions.length) {
	                return 'wrong index';
	            } else if (subject > target) {
	                buffer = rowDimensions[subject];
	                for (i = subject - 1; i >= target; i--) {
	                    rowDimensions[i + 1] = rowDimensions[i];
	                }
	                rowDimensions[target] = buffer;
	            } else if (subject < target) {
	                buffer = rowDimensions[subject];
	                for (i = subject + 1; i <= target; i++) {
	                    rowDimensions[i - 1] = rowDimensions[i];
	                }
	                rowDimensions[target] = buffer;
	            }
	            this.createCrosstab();
	        }
	    }, {
	        key: 'colDimReorder',
	        value: function colDimReorder(subject, target) {
	            var buffer = '',
	                i,
	                colDimensions = this.colDimensions;
	            if (this.measureOnRow === false) {
	                colDimensions.splice(colDimensions.length - 1, 1);
	            }
	            if (colDimensions.indexOf(Math.max(subject, target)) >= colDimensions.length) {
	                return 'wrong index';
	            } else if (subject > target) {
	                buffer = colDimensions[subject];
	                for (i = subject - 1; i >= target; i--) {
	                    colDimensions[i + 1] = colDimensions[i];
	                }
	                colDimensions[target] = buffer;
	            } else if (subject < target) {
	                buffer = colDimensions[subject];
	                for (i = subject + 1; i <= target; i++) {
	                    colDimensions[i - 1] = colDimensions[i];
	                }
	                colDimensions[target] = buffer;
	            }
	            this.createCrosstab();
	        }
	    }, {
	        key: 'mergeDimensions',
	        value: function mergeDimensions() {
	            var dimensions = [];
	            for (var i = 0, l = this.rowDimensions.length; i < l; i++) {
	                dimensions.push(this.rowDimensions[i]);
	            }
	            for (var _i = 0, _l = this.colDimensions.length; _i < _l; _i++) {
	                dimensions.push(this.colDimensions[_i]);
	            }
	            return dimensions;
	        }
	    }, {
	        key: 'createFilters',
	        value: function createFilters() {
	            var filters = [];
	            for (var i = 0, l = this.dimensions.length; i < l; i++) {
	                if (this.measureOnRow && this.dimensions[i] !== this.rowDimensions[this.rowDimensions.length - 1]) {
	                    var matchedValues = this.globalData[this.dimensions[i]];
	                    for (var j = 0, len = matchedValues.length; j < len; j++) {
	                        filters.push({
	                            filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
	                            filterVal: matchedValues[j]
	                        });
	                    }
	                } else if (!this.measureOnRow && this.dimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
	                    var _matchedValues = this.globalData[this.dimensions[i]];
	                    for (var _j = 0, _len = _matchedValues.length; _j < _len; _j++) {
	                        filters.push({
	                            filter: this.filterGen(this.dimensions[i], _matchedValues[_j].toString()),
	                            filterVal: _matchedValues[_j]
	                        });
	                    }
	                }
	            }
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
	                if (this.globalData.hasOwnProperty(key) && key !== this.measure) {
	                    if (this.measureOnRow && key !== this.rowDimensions[this.rowDimensions.length - 1]) {
	                        tempObj[key] = this.globalData[key];
	                    } else if (!this.measureOnRow && key !== this.colDimensions[this.colDimensions.length - 1]) {
	                        tempObj[key] = this.globalData[key];
	                    }
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
	        key: 'renderCrosstab',
	        value: function renderCrosstab() {
	            var _this2 = this;
	
	            var crosstab = this.createCrosstab(),
	                matrix = this.createMultiChart(crosstab),
	                t2 = performance.now();
	            for (var i = 0, ii = matrix.length; i < ii; i++) {
	                var row = matrix[i];
	                for (var j = 0, jj = row.length; j < jj; j++) {
	                    var cell = row[j],
	                        crosstabElement = crosstab[i][j],
	                        rowAxis = row[row.length - 1];
	                    if (!(crosstabElement.hasOwnProperty('chart') || crosstabElement.hasOwnProperty('html')) && crosstabElement.className !== 'blank-cell') {
	                        var limits = rowAxis.chart.chartObj.getLimits(),
	                            minLimit = limits[0],
	                            maxLimit = limits[1],
	                            chart = this.getChartObj(crosstabElement.rowHash, crosstabElement.colHash)[1];
	                        chart.configuration.FCjson.chart.yAxisMinValue = minLimit;
	                        chart.configuration.FCjson.chart.yAxisMaxValue = maxLimit;
	                        cell.config.chart = chart;
	                        crosstabElement.chart = chart;
	                        window.ctPerf += performance.now() - t2;
	                        cell.update(cell.config);
	                    }
	                    t2 = performance.now();
	                }
	            }
	
	            this.mc.addEventListener('hoverin', function (evt, data) {
	                if (data.data) {
	                    for (var _i2 = 0, _ii = matrix.length; _i2 < _ii; _i2++) {
	                        var _row = crosstab[_i2];
	                        for (var j = 0; j < _row.length; j++) {
	                            if (_row[j].chart) {
	                                if (!(_row[j].chart.type === 'caption' || _row[j].chart.type === 'axis')) {
	                                    var cellAdapter = _row[j].chart.configuration,
	                                        category = _this2.dimensions[_this2.dimensions.length - 1],
	                                        categoryVal = data.data[category];
	                                    cellAdapter.highlight(categoryVal);
	                                }
	                            }
	                        }
	                    }
	                }
	            });
	            this.mc.addEventListener('hoverout', function (evt, data) {
	                if (data.data) {
	                    for (var _i3 = 0, _ii2 = matrix.length; _i3 < _ii2; _i3++) {
	                        var _row2 = crosstab[_i3];
	                        for (var j = 0; j < _row2.length; j++) {
	                            if (_row2[j].chart) {
	                                if (!(_row2[j].chart.type === 'caption' || _row2[j].chart.type === 'axis')) {
	                                    var cellAdapter = _row2[j].chart.configuration;
	                                    cellAdapter.highlight();
	                                }
	                            }
	                        }
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'createMultiChart',
	        value: function createMultiChart(matrix) {
	            if (this.multichartObject === undefined) {
	                this.multichartObject = this.mc.createMatrix(this.crosstabContainer, matrix);
	                window.ctPerf = performance.now() - this.t1;
	                this.multichartObject.draw();
	            } else {
	                this.multichartObject.update(matrix);
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
	        value: function getChartObj(rowFilter, columnFilter) {
	            var filters = [],
	                filterStr = '',
	                rowFilters = rowFilter.split('|'),
	                colFilters = columnFilter.split('|'),
	                dataProcessors = [],
	                dataProcessor = {},
	                matchedHashes = [],
	                filteredJSON = [],
	                max = -Infinity,
	                min = Infinity,
	                filteredData = {},
	                adapterCfg = {},
	                adapter = {},
	                categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]];
	
	            rowFilters.push.apply(rowFilters, colFilters);
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
	                filteredData = this.dataStore.getData(dataProcessors);
	                filteredData = filteredData[filteredData.length - 1];
	                filteredJSON = filteredData.getJSON();
	                for (var _i4 = 0, _ii3 = filteredJSON.length; _i4 < _ii3; _i4++) {
	                    if (filteredJSON[_i4][this.measure] > max) {
	                        max = filteredJSON[_i4][this.measure];
	                    }
	                    if (filteredJSON[_i4][this.measure] < min) {
	                        min = filteredJSON[_i4][this.measure];
	                    }
	                }
	                adapterCfg = {
	                    config: {
	                        dimension: this.measureOnRow ? [this.rowDimensions[this.rowDimensions.length - 1]] : [this.colDimensions[this.colDimensions.length - 1]],
	                        measure: [this.measure],
	                        seriesType: 'SS',
	                        aggregateMode: this.aggregation,
	                        categories: categories,
	                        config: this.chartConfig
	                    },
	                    datastore: filteredData
	                };
	                adapter = this.mc.dataadapter(adapterCfg);
	                return [{
	                    'max': max,
	                    'min': min
	                }, {
	                    type: this.chartType,
	                    width: '100%',
	                    height: '100%',
	                    jsonData: filteredJSON,
	                    configuration: adapter
	                }];
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
	    'Sale': 2
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 7
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 1
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 6
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 6
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 2
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 1
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 3
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 6
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 3
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 9
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 8
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 1
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 10
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5
	}, {
	    'Product': 'Rice',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 3
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 2
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 2
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 3
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 1
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 1
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 9
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bihar',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 6
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 9
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 6
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 2
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 5
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2015',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Good',
	    'Sale': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Jun',
	    'Quality': 'Medium',
	    'Sale': 4
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Good',
	    'Sale': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'July',
	    'Quality': 'Medium',
	    'Sale': 7
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Good',
	    'Sale': 8
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Aug',
	    'Quality': 'Medium',
	    'Sale': 6
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Good',
	    'Sale': 10
	}, {
	    'Product': 'Wheat',
	    'State': 'Bengal',
	    'Year': '2016',
	    'Month': 'Sept',
	    'Quality': 'Medium',
	    'Sale': 7
	}];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzYwOWExMmQ1YzFiOWY1ZTQzMTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJyb3dEaW1lbnNpb25zIiwiY29sRGltZW5zaW9ucyIsImNoYXJ0VHlwZSIsIm5vRGF0YU1lc3NhZ2UiLCJtZWFzdXJlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsImRpbWVuc2lvbnMiLCJtZXJnZURpbWVuc2lvbnMiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiY29sdW1uS2V5QXJyIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJjb3VudCIsImF4ZXMiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkIiwiZ2V0S2V5cyIsImZpZWxkcyIsImkiLCJpaSIsImxlbmd0aCIsImdldFVuaXF1ZVZhbHVlcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwicHVzaCIsImNyZWF0ZVJvdyIsImoiLCJjaGFydENlbGxPYmoiLCJyb3dIYXNoIiwiY29sSGFzaCIsImdldENoYXJ0T2JqIiwicGFyc2VJbnQiLCJhZGFwdGVyQ2ZnIiwiYWRhcHRlciIsImRhdGFhZGFwdGVyIiwiY29sT3JkZXIiLCJjb2xFbGVtZW50IiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3JlYXRlQ29sIiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpbmRleCIsIm1heExlbmd0aCIsInVuc2hpZnQiLCJzZWxmIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwieEF4aXNSb3ciLCJjcmVhdGVSb3dEaW1IZWFkaW5nIiwiY3JlYXRlQ29sRGltSGVhZGluZyIsImNhdGVnb3JpZXMiLCJjcmVhdGVDYXB0aW9uIiwic3ViamVjdCIsInRhcmdldCIsImJ1ZmZlciIsInNwbGljZSIsImluZGV4T2YiLCJNYXRoIiwiY3JlYXRlQ3Jvc3N0YWIiLCJmaWx0ZXJzIiwibWF0Y2hlZFZhbHVlcyIsImxlbiIsImZpbHRlckdlbiIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInNsaWNlIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJjcmVhdGVGaWx0ZXJzIiwiZGF0YUNvbWJvcyIsImNyZWF0ZURhdGFDb21ib3MiLCJoYXNoTWFwIiwiZGF0YUNvbWJvIiwidmFsdWUiLCJrIiwibWF0cml4IiwiY3JlYXRlTXVsdGlDaGFydCIsInQyIiwicm93IiwiamoiLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50Iiwicm93QXhpcyIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsImNvbmZpZ3VyYXRpb24iLCJGQ2pzb24iLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImN0UGVyZiIsInVwZGF0ZSIsImV2dCIsInR5cGUiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50IiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sdW1uRmlsdGVyIiwicm93RmlsdGVycyIsImNvbEZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWRKU09OIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0RGF0YSIsImdldEpTT04iLCJkaW1lbnNpb24iLCJzZXJpZXNUeXBlIiwiYWdncmVnYXRlTW9kZSIsImRhdGFzdG9yZSIsImpzb25EYXRhIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtB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QUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRO0FBTlosRUF6ZWEsRUFpZmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVE7QUFOWixFQWpmYSxFQXlmYjtBQUNJLGdCQUFXLE9BRGY7QUFFSSxjQUFTLFFBRmI7QUFHSSxhQUFRLE1BSFo7QUFJSSxjQUFTLE1BSmI7QUFLSSxnQkFBVyxRQUxmO0FBTUksYUFBUTtBQU5aLEVBemZhLENBQWpCLEMiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LWVzNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM2MDlhMTJkNWMxYjlmNWU0MzExIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vbGFyZ2VEYXRhJyk7XG5cbnZhciBjb25maWcgPSB7XG4gICAgcm93RGltZW5zaW9uczogWydQcm9kdWN0JywgJ1N0YXRlJ10sXG4gICAgY29sRGltZW5zaW9uczogWydZZWFyJywgJ1F1YWxpdHknLCAnTW9udGgnXSxcbiAgICBjaGFydFR5cGU6ICdjb2x1bW4yZCcsXG4gICAgbm9EYXRhTWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheS4nLFxuICAgIG1lYXN1cmU6ICdTYWxlJyxcbiAgICBtZWFzdXJlT25Sb3c6IGZhbHNlLFxuICAgIGNlbGxXaWR0aDogMTIwLFxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzEnLFxuICAgICAgICAgICAgJ3Nob3daZXJvUGxhbmVWYWx1ZSc6ICcxJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgLy8gbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMucm93RGltZW5zaW9ucyA9IGNvbmZpZy5yb3dEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnMgPSBjb25maWcuY29sRGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5tZXJnZURpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5tZWFzdXJlID0gY29uZmlnLm1lYXN1cmU7XG4gICAgICAgIHRoaXMubWVhc3VyZU9uUm93ID0gY29uZmlnLm1lYXN1cmVPblJvdztcbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodDtcbiAgICAgICAgdGhpcy5jcm9zc3RhYkNvbnRhaW5lciA9IGNvbmZpZy5jcm9zc3RhYkNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uO1xuICAgICAgICB0aGlzLmF4ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2U7XG4gICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICB0aGlzLmRhdGFGaWx0ZXJFeHQgPSBuZXcgRkNEYXRhRmlsdGVyRXh0KHRoaXMuZGF0YVN0b3JlLCBmaWx0ZXJDb25maWcsICdjb250cm9sLWJveCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ3RlbXBFdmVudCcsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJDcm9zc3RhYigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBnbG9iYWwgZGF0YSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5yb3dEaW1lbnNpb25zW2N1cnJlbnRJbmRleF0gK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLnJvd0RpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5jb2x1bW5LZXlBcnJbal1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBtaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IG1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpc0F4aXNPcHBvc2l0ZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ktYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5jb2xEaW1lbnNpb25zW2N1cnJlbnRJbmRleF0gK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlUm93RGltSGVhZGluZyAodGFibGUsIGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnJvd0RpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJvd0RpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBjb2xPcmRlckxlbmd0aCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmNvbERpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuY29sRGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29sRGltZW5zaW9uc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICB0YWJsZS51bnNoaWZ0KFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMucm93RGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMuY29sRGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDb2xEaW1IZWFkaW5nKHRhYmxlLCAwKTtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gMSAtIHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneC1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ2FwdGlvbih0YWJsZSwgbWF4TGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcm93RGltZW5zaW9ucyA9IHRoaXMucm93RGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByb3dEaW1lbnNpb25zLnNwbGljZShyb3dEaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyb3dEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gcm93RGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IHJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbaSArIDFdID0gcm93RGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSByb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3dEaW1lbnNpb25zW2kgLSAxXSA9IHJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY29sRGltZW5zaW9ucyA9IHRoaXMuY29sRGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29sRGltZW5zaW9ucy5zcGxpY2UoY29sRGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sRGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IGNvbERpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBjb2xEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBjb2xEaW1lbnNpb25zW2kgKyAxXSA9IGNvbERpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gY29sRGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29sRGltZW5zaW9uc1tpIC0gMV0gPSBjb2xEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sRGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLnJvd0RpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuY29sRGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIHRoaXMuZGltZW5zaW9uc1tpXSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIHRoaXMuZGltZW5zaW9uc1tpXSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBtYXRyaXggPSB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoY3Jvc3N0YWIpLFxuICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBtYXRyaXhbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdLFxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQgPSBjcm9zc3RhYltpXVtqXSxcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IHJvd1tyb3cubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKCEoY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpIHx8IGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbWl0cyA9IHJvd0F4aXMuY2hhcnQuY2hhcnRPYmouZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQgPSB0aGlzLmdldENoYXJ0T2JqKGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaClbMV07XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbmZpZy5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmN0UGVyZiArPSAocGVyZm9ybWFuY2Uubm93KCkgLSB0Mik7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwudXBkYXRlKGNlbGwuY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XG4gICAgICAgICAgICB3aW5kb3cuY3RQZXJmID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnQxO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzLCBjb2xGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXSA+IG1heCkge1xuICAgICAgICAgICAgICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogdGhpcy5tZWFzdXJlT25Sb3dcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW3RoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV1dXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogW3RoaXMubWVhc3VyZV0sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YXN0b3JlOiBmaWx0ZXJlZERhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBtYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IG1pblxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkSlNPTixcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiBhZGFwdGVyXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9