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
	            'animation': '0',
	            'transposeAnimation': '1',
	            'alternateHGridAlpha': '0',
	            'canvasBorderAlpha': '100',
	            'alternateVGridAlpha': '0',
	            'paletteColors': '#B5B9BA',
	            'usePlotGradientColor': '0',
	            'valueFontColor': '#ffffff'
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
	                if (new Date().getTime() - window.time < 200) {
	                    return;
	                }
	                window.time = new Date().getTime();
	                if (data.data) {
	                    for (var _i2 = 0, _ii = matrix.length; _i2 < _ii; _i2++) {
	                        var _row = crosstab[_i2];
	                        for (var j = 0; j < _row.length; j++) {
	                            if (_row[j].chart) {
	                                if (!(_row[j].chart.type === 'caption' || _row[j].chart.type === 'axis')) {
	                                    var cellAdapter = _row[j].chart.configuration,
	                                        category = _this2.dimensions[_this2.dimensions.length - 1],
	                                        categoryVal = data.data[category];
	                                    // console.log(cellAdapter, category, categoryVal);
	                                    cellAdapter.highlight(categoryVal);
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
	                for (var _i3 = 0, _ii2 = filteredJSON.length; _i3 < _ii2; _i3++) {
	                    if (filteredJSON[_i3][this.measure] > max) {
	                        max = filteredJSON[_i3][this.measure];
	                    }
	                    if (filteredJSON[_i3][this.measure] < min) {
	                        min = filteredJSON[_i3][this.measure];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODhiNmIxY2Q5MGFkNzNkYTkxNmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJyb3dEaW1lbnNpb25zIiwiY29sRGltZW5zaW9ucyIsImNoYXJ0VHlwZSIsIm5vRGF0YU1lc3NhZ2UiLCJtZWFzdXJlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsImRpbWVuc2lvbnMiLCJtZXJnZURpbWVuc2lvbnMiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiY29sdW1uS2V5QXJyIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJjb3VudCIsImF4ZXMiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkIiwiZ2V0S2V5cyIsImZpZWxkcyIsImkiLCJpaSIsImxlbmd0aCIsImdldFVuaXF1ZVZhbHVlcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwicHVzaCIsImNyZWF0ZVJvdyIsImoiLCJjaGFydENlbGxPYmoiLCJyb3dIYXNoIiwiY29sSGFzaCIsImdldENoYXJ0T2JqIiwicGFyc2VJbnQiLCJhZGFwdGVyQ2ZnIiwiYWRhcHRlciIsImRhdGFhZGFwdGVyIiwiY29sT3JkZXIiLCJjb2xFbGVtZW50IiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3JlYXRlQ29sIiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpbmRleCIsIm1heExlbmd0aCIsInVuc2hpZnQiLCJzZWxmIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwieEF4aXNSb3ciLCJjcmVhdGVSb3dEaW1IZWFkaW5nIiwiY3JlYXRlQ29sRGltSGVhZGluZyIsImNhdGVnb3JpZXMiLCJjcmVhdGVDYXB0aW9uIiwic3ViamVjdCIsInRhcmdldCIsImJ1ZmZlciIsInNwbGljZSIsImluZGV4T2YiLCJNYXRoIiwiY3JlYXRlQ3Jvc3N0YWIiLCJmaWx0ZXJzIiwibWF0Y2hlZFZhbHVlcyIsImxlbiIsImZpbHRlckdlbiIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInNsaWNlIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJjcmVhdGVGaWx0ZXJzIiwiZGF0YUNvbWJvcyIsImNyZWF0ZURhdGFDb21ib3MiLCJoYXNoTWFwIiwiZGF0YUNvbWJvIiwidmFsdWUiLCJrIiwibWF0cml4IiwiY3JlYXRlTXVsdGlDaGFydCIsInQyIiwicm93IiwiamoiLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50Iiwicm93QXhpcyIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsImNvbmZpZ3VyYXRpb24iLCJGQ2pzb24iLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImN0UGVyZiIsInVwZGF0ZSIsImV2dCIsIkRhdGUiLCJnZXRUaW1lIiwidGltZSIsInR5cGUiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50IiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sdW1uRmlsdGVyIiwicm93RmlsdGVycyIsImNvbEZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWRKU09OIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0RGF0YSIsImdldEpTT04iLCJkaW1lbnNpb24iLCJzZXJpZXNUeXBlIiwiYWdncmVnYXRlTW9kZSIsImRhdGFzdG9yZSIsImpzb25EYXRhIl0sIm1hcHBp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Y0FBUyxLQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVE7QUFOWixFQXpjYSxFQWlkYjtBQUNJLGdCQUFXLE9BRGY7QUFFSSxjQUFTLFFBRmI7QUFHSSxhQUFRLE1BSFo7QUFJSSxjQUFTLE1BSmI7QUFLSSxnQkFBVyxNQUxmO0FBTUksYUFBUTtBQU5aLEVBamRhLEVBeWRiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRO0FBTlosRUF6ZGEsRUFpZWI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVE7QUFOWixFQWplYSxFQXllYjtBQUNJLGdCQUFXLE9BRGY7QUFFSSxjQUFTLFFBRmI7QUFHSSxhQUFRLE1BSFo7QUFJSSxjQUFTLEtBSmI7QUFLSSxnQkFBVyxRQUxmO0FBTUksYUFBUTtBQU5aLEVBemVhLEVBaWZiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRO0FBTlosRUFqZmEsRUF5ZmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVE7QUFOWixFQXpmYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4OGI2YjFjZDkwYWQ3M2RhOTE2YiIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIHJvd0RpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZSddLFxuICAgIGNvbERpbWVuc2lvbnM6IFsnWWVhcicsICdRdWFsaXR5JywgJ01vbnRoJ10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBtZWFzdXJlOiAnU2FsZScsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDEyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMDAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcxJyxcbiAgICAgICAgICAgICdzaG93WmVyb1BsYW5lVmFsdWUnOiAnMScsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzAnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICAvLyBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICAgICAgdGhpcy50MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gY29uZmlnLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IGNvbmZpZy5jb2xEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSBjb25maWcubWVhc3VyZTtcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb247XG4gICAgICAgIHRoaXMuYXhlcyA9IFtdO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcbiAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcigndGVtcEV2ZW50JywgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGdsb2JhbCBkYXRhIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpLFxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gdGhpcy5kYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgcm93RWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCh0aGlzLmNlbGxIZWlnaHQgLSAxMCkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLnJvd0RpbWVuc2lvbnNbY3VycmVudEluZGV4XSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMucm93RGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IG1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogbWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzQXhpc09wcG9zaXRlJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneS1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmNvbERpbWVuc2lvbnNbY3VycmVudEluZGV4XSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3dEaW1IZWFkaW5nICh0YWJsZSwgY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLnJvd0RpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMucm93RGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucm93RGltZW5zaW9uc1tpXSAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAgKiB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IGNvbE9yZGVyTGVuZ3RoLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY29ybmVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ybmVyQ2VsbEFycjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2xEaW1IZWFkaW5nICh0YWJsZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGkgPSBpbmRleCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG4gICAgICAgIGZvciAoOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuY29sRGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5jb2xEaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb2xEaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNhcHRpb24gKHRhYmxlLCBtYXhMZW5ndGgpIHtcbiAgICAgICAgbGV0IGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgIHRhYmxlLnVuc2hpZnQoW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2FwdGlvbi1jaGFydCcsXG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NhcHRpb24nLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlUm93RGltSGVhZGluZyh0YWJsZSwgY29sT3JkZXIubGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNvbERpbUhlYWRpbmcodGFibGUsIDApO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSAxIC0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhbnZhc1BhZGRpbmcnOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd4LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgcm93RGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zID0gdGhpcy5yb3dEaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnMuc3BsaWNlKHJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvd0RpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSByb3dEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gcm93RGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgcm93RGltZW5zaW9uc1tpICsgMV0gPSByb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93RGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IHJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbaSAtIDFdID0gcm93RGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgY29sRGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zID0gdGhpcy5jb2xEaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zLnNwbGljZShjb2xEaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gY29sRGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGNvbERpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbaSArIDFdID0gY29sRGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBjb2xEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb2xEaW1lbnNpb25zW2kgLSAxXSA9IGNvbERpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBjcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIG1hdHJpeCA9IHRoaXMuY3JlYXRlTXVsdGlDaGFydChjcm9zc3RhYiksXG4gICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IG1hdHJpeFtpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdLFxuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gcm93W3Jvdy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY29uZmlnLmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY2VsbC5jb25maWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gd2luZG93LnRpbWUgPCAyMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cudGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjZWxsQWRhcHRlciwgY2F0ZWdvcnksIGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XG4gICAgICAgICAgICB3aW5kb3cuY3RQZXJmID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnQxO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzLCBjb2xGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXSA+IG1heCkge1xuICAgICAgICAgICAgICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogdGhpcy5tZWFzdXJlT25Sb3dcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW3RoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV1dXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogW3RoaXMubWVhc3VyZV0sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YXN0b3JlOiBmaWx0ZXJlZERhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBtYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IG1pblxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkSlNPTixcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiBhZGFwdGVyXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9