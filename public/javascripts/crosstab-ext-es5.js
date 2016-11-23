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
	    measures: ['Sale', 'Visitors', 'Profit'],
	    chartType: 'column2d',
	    noDataMessage: 'No data to display.',
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
	        this.dimensions = config.dimensions;
	        this.measures = config.measures;
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
	                classStr += 'row-dimensions' + ' ' + this.dimensions[currentIndex].toLowerCase() + ' ' + fieldValues[i].toLowerCase();
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
	
	        // createCol (table, data, colOrder, currentIndex, filteredDataStore) {
	        //     var colspan = 0,
	        //         fieldComponent = colOrder[currentIndex],
	        //         fieldValues = data[fieldComponent],
	        //         i, l = fieldValues.length,
	        //         colElement,
	        //         hasFurtherDepth = currentIndex < (colOrder.length - 1),
	        //         filteredDataHashKey,
	        //         htmlRef;
	
	        //     if (table.length <= currentIndex) {
	        //         table.push([]);
	        //     }
	        //     for (i = 0; i < l; i += 1) {
	        //         let classStr = '';
	        //         htmlRef = document.createElement('p');
	        //         htmlRef.innerHTML = fieldValues[i];
	        //         htmlRef.style.textAlign = 'center';
	        //         document.body.appendChild(htmlRef);
	        //         classStr += 'column-dimensions' +
	        //             ' ' + this.measures[currentIndex] +
	        //             ' ' + fieldValues[i].toLowerCase();
	        //         this.cornerHeight = htmlRef.offsetHeight;
	        //         document.body.removeChild(htmlRef);
	        //         colElement = {
	        //             width: this.cellWidth,
	        //             height: this.cornerHeight,
	        //             rowspan: 1,
	        //             colspan: 1,
	        //             html: htmlRef.outerHTML,
	        //             className: classStr
	        //         };
	
	        //         filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
	
	        //         table[currentIndex].push(colElement);
	
	        //         if (hasFurtherDepth) {
	        //             colElement.colspan = this.createCol(table, data, colOrder, currentIndex + 1, filteredDataHashKey);
	        //         } else {
	        //             this.columnKeyArr.push(filteredDataHashKey);
	        //         }
	        //         colspan += colElement.colspan;
	        //     }
	        //     return colspan;
	        // }
	
	    }, {
	        key: 'createCol',
	        value: function createCol(table, data, measureOrder) {
	            var colspan = 0,
	                i,
	                l = this.measures.length,
	                colElement,
	                htmlRef;
	
	            for (i = 0; i < l; i += 1) {
	                var classStr = '',
	                    fieldComponent = measureOrder[i];
	                // fieldValues = data[fieldComponent];
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = fieldComponent;
	                htmlRef.style.textAlign = 'center';
	                document.body.appendChild(htmlRef);
	                classStr += 'column-dimensions' + ' ' + this.measures[i].toLowerCase();
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
	                this.columnKeyArr.push(this.measures[i]);
	                table[0].push(colElement);
	
	                // filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
	
	                // table[i].push(colElement);
	
	                // if (hasFurtherDepth) {
	                //     colElement.colspan = this.createCol(table, data, colOrder);
	                // } else {
	                //     this.columnKeyArr.push(filteredDataHashKey);
	                // }
	                // colspan += colElement.colspan;
	            }
	            return colspan;
	        }
	    }, {
	        key: 'createRowDimHeading',
	        value: function createRowDimHeading(table, colOrderLength) {
	            var cornerCellArr = [],
	                i = 0,
	                htmlRef;
	
	            for (i = 0; i < this.dimensions.length - 1; i++) {
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = this.dimensions[i][0].toUpperCase() + this.dimensions[i].substr(1);
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = (30 * this.measures.length - 15) / 2 + 'px';
	                cornerCellArr.push({
	                    width: this.dimensions[i] * 10,
	                    height: 30 * this.measures.length,
	                    rowspan: 1,
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
	                htmlRef.innerHTML = '';
	                htmlRef.style.textAlign = 'center';
	                table[i].push({
	                    width: this.measures[i].length * 10,
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
	                rowOrder = this.dimensions.filter(function (val, i, arr) {
	                if (val !== arr[arr.length - 1]) {
	                    return true;
	                }
	            }),
	                colOrder = this.measures.filter(function (val, i, arr) {
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
	                // this.createCol(table, obj, colOrder, 0, '');
	                this.createCol(table, obj, this.measures);
	                table = this.createColDimHeading(table, 0);
	                table.push([]);
	                this.createRow(table, obj, rowOrder, 0, '');
	                for (i = 0; i < table.length; i++) {
	                    maxLength = maxLength < table[i].length ? table[i].length : maxLength;
	                }
	                for (i = 0; i < this.dimensions.length - 1; i++) {
	                    xAxisRow.push({
	                        rowspan: 1,
	                        colspan: 1,
	                        height: 30,
	                        className: 'blank-cell'
	                    });
	                }
	
	                for (i = 0; i < maxLength - this.dimensions.length; i++) {
	                    var categories = this.globalData[this.dimensions[this.dimensions.length - 1]],
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
	                    colspan: this.dimensions.length * this.measures.length
	                }]);
	            }
	            return table;
	        }
	    }, {
	        key: 'rowDimReorder',
	        value: function rowDimReorder(subject, target) {
	            var buffer = '',
	                i,
	                dimensions = this.dimensions;
	            if (this.measureOnRow === true) {
	                dimensions.splice(dimensions.length - 1, 1);
	            }
	            if (dimensions.indexOf(Math.max(subject, target)) >= dimensions.length) {
	                return 'wrong index';
	            } else if (subject > target) {
	                buffer = dimensions[subject];
	                for (i = subject - 1; i >= target; i--) {
	                    dimensions[i + 1] = dimensions[i];
	                }
	                dimensions[target] = buffer;
	            } else if (subject < target) {
	                buffer = dimensions[subject];
	                for (i = subject + 1; i <= target; i++) {
	                    dimensions[i - 1] = dimensions[i];
	                }
	                dimensions[target] = buffer;
	            }
	            this.createCrosstab();
	        }
	    }, {
	        key: 'colDimReorder',
	        value: function colDimReorder(subject, target) {
	            var buffer = '',
	                i,
	                measures = this.measures;
	            if (this.measureOnRow === false) {
	                measures.splice(measures.length - 1, 1);
	            }
	            if (measures.indexOf(Math.max(subject, target)) >= measures.length) {
	                return 'wrong index';
	            } else if (subject > target) {
	                buffer = measures[subject];
	                for (i = subject - 1; i >= target; i--) {
	                    measures[i + 1] = measures[i];
	                }
	                measures[target] = buffer;
	            } else if (subject < target) {
	                buffer = measures[subject];
	                for (i = subject + 1; i <= target; i++) {
	                    measures[i - 1] = measures[i];
	                }
	                measures[target] = buffer;
	            }
	            this.createCrosstab();
	        }
	    }, {
	        key: 'mergeDimensions',
	        value: function mergeDimensions() {
	            var dimensions = [];
	            for (var i = 0, l = this.dimensions.length; i < l; i++) {
	                dimensions.push(this.dimensions[i]);
	            }
	            for (var _i = 0, _l = this.measures.length; _i < _l; _i++) {
	                dimensions.push(this.measures[_i]);
	            }
	            return dimensions;
	        }
	    }, {
	        key: 'createFilters',
	        value: function createFilters() {
	            var filters = [],
	                i = 0,
	                ii = this.dimensions.length - 1,
	                j = 0,
	                jj = 0,
	                matchedValues = void 0;
	
	            for (i = 0; i < ii; i++) {
	                matchedValues = this.globalData[this.dimensions[i]];
	                for (j = 0, jj = matchedValues.length; j < jj; j++) {
	                    filters.push({
	                        filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
	                        filterVal: matchedValues[j]
	                    });
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
	        value: function getChartObj(rowFilter, colFilter) {
	            var filters = [],
	                filterStr = '',
	                rowFilters = rowFilter.split('|'),
	                dataProcessors = [],
	                dataProcessor = {},
	                matchedHashes = [],
	                filteredJSON = [],
	                max = -Infinity,
	                min = Infinity,
	                filteredData = {},
	                adapterCfg = {},
	                adapter = {},
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
	                filteredData = this.dataStore.getData(dataProcessors);
	                filteredData = filteredData[filteredData.length - 1];
	                filteredJSON = filteredData.getJSON();
	                for (var _i4 = 0, _ii3 = filteredJSON.length; _i4 < _ii3; _i4++) {
	                    if (filteredJSON[_i4][colFilter] > max) {
	                        max = filteredJSON[_i4][colFilter];
	                    }
	                    if (filteredJSON[_i4][colFilter] < min) {
	                        min = filteredJSON[_i4][colFilter];
	                    }
	                }
	                adapterCfg = {
	                    config: {
	                        dimension: [this.dimensions[this.dimensions.length - 1]],
	                        measure: [colFilter],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTg5YjBlMjc1ZGQxODY4YTNjY2IiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsImdsb2JhbERhdGEiLCJidWlsZEdsb2JhbERhdGEiLCJjb2x1bW5LZXlBcnIiLCJoYXNoIiwiZ2V0RmlsdGVySGFzaE1hcCIsImNvdW50IiwiYXhlcyIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImQiLCJnZXRLZXlzIiwiZmllbGRzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwidGFibGUiLCJyb3dPcmRlciIsImN1cnJlbnRJbmRleCIsImZpbHRlcmVkRGF0YVN0b3JlIiwicm93c3BhbiIsImZpZWxkQ29tcG9uZW50IiwiZmllbGRWYWx1ZXMiLCJsIiwicm93RWxlbWVudCIsImhhc0Z1cnRoZXJEZXB0aCIsImZpbHRlcmVkRGF0YUhhc2hLZXkiLCJjb2xMZW5ndGgiLCJodG1sUmVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJtaW5tYXhPYmoiLCJjbGFzc1N0ciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInN0eWxlIiwidGV4dEFsaWduIiwibWFyZ2luVG9wIiwidG9Mb3dlckNhc2UiLCJ2aXNpYmlsaXR5IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY29ybmVyV2lkdGgiLCJyZW1vdmVDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiY29sc3BhbiIsImh0bWwiLCJvdXRlckhUTUwiLCJjbGFzc05hbWUiLCJwdXNoIiwiY3JlYXRlUm93IiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsImFkYXB0ZXJDZmciLCJhZGFwdGVyIiwiZGF0YWFkYXB0ZXIiLCJtZWFzdXJlT3JkZXIiLCJjb2xFbGVtZW50IiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpbmRleCIsIm1heExlbmd0aCIsInVuc2hpZnQiLCJzZWxmIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwiY29sT3JkZXIiLCJ4QXhpc1JvdyIsImNyZWF0ZVJvd0RpbUhlYWRpbmciLCJjcmVhdGVDb2wiLCJjcmVhdGVDb2xEaW1IZWFkaW5nIiwiY2F0ZWdvcmllcyIsImNyZWF0ZUNhcHRpb24iLCJzdWJqZWN0IiwidGFyZ2V0IiwiYnVmZmVyIiwic3BsaWNlIiwiaW5kZXhPZiIsIk1hdGgiLCJjcmVhdGVDcm9zc3RhYiIsImZpbHRlcnMiLCJqaiIsIm1hdGNoZWRWYWx1ZXMiLCJmaWx0ZXJHZW4iLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJzbGljZSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJtZWFzdXJlIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImNyZWF0ZUZpbHRlcnMiLCJkYXRhQ29tYm9zIiwiY3JlYXRlRGF0YUNvbWJvcyIsImhhc2hNYXAiLCJkYXRhQ29tYm8iLCJ2YWx1ZSIsImxlbiIsImsiLCJtYXRyaXgiLCJjcmVhdGVNdWx0aUNoYXJ0IiwidDIiLCJyb3ciLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50Iiwicm93QXhpcyIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsImNvbmZpZ3VyYXRpb24iLCJGQ2pzb24iLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImN0UGVyZiIsInVwZGF0ZSIsImV2dCIsInR5cGUiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50IiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sRmlsdGVyIiwicm93RmlsdGVycyIsImRhdGFQcm9jZXNzb3JzIiwiZGF0YVByb2Nlc3NvciIsIm1hdGNoZWRIYXNoZXMiLCJmaWx0ZXJlZEpTT04iLCJmaWx0ZXJlZERhdGEiLCJhcHBseSIsIm1hdGNoSGFzaCIsImNyZWF0ZURhdGFQcm9jZXNzb3IiLCJnZXREYXRhIiwiZ2V0SlNPTiIsImRpbWVuc2lvbiIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZGF0YXN0b3JlIiwianNvbkRhdGEiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFB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Z0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXJrQmEsRUEra0JiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQS9rQmEsRUF5bEJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXpsQmEsRUFtbUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQW5tQmEsRUE2bUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQTdtQmEsRUF1bkJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXZuQmEsQ0FBakIsQyIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTg5YjBlMjc1ZGQxODY4YTNjY2IiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnTW9udGgnXSxcbiAgICBtZWFzdXJlczogWydTYWxlJywgJ1Zpc2l0b3JzJywgJ1Byb2ZpdCddLFxuICAgIGNoYXJ0VHlwZTogJ2NvbHVtbjJkJyxcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5LicsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDEyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMDAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcxJyxcbiAgICAgICAgICAgICdzaG93WmVyb1BsYW5lVmFsdWUnOiAnMScsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjQjVCOUJBJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIC8vIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBNdWx0aUNoYXJ0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLm1jID0gbmV3IE11bHRpQ2hhcnRpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgICAgICB0aGlzLnQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb247XG4gICAgICAgIHRoaXMuYXhlcyA9IFtdO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcbiAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcigndGVtcEV2ZW50JywgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGdsb2JhbCBkYXRhIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpLFxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gdGhpcy5kYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgcm93RWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCh0aGlzLmNlbGxIZWlnaHQgLSAxMCkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4XS50b0xvd2VyQ2FzZSgpICtcbiAgICAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHJvd0VsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29ybmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IG1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogbWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzQXhpc09wcG9zaXRlJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneS1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgLy8gICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAvLyAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAvLyAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgLy8gICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgIC8vICAgICAgICAgY29sRWxlbWVudCxcbiAgICAvLyAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgLy8gICAgICAgICBodG1sUmVmO1xuXG4gICAgLy8gICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgLy8gICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgLy8gICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAvLyAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgLy8gICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgIC8vICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgLy8gICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAvLyAgICAgICAgICAgICAnICcgKyB0aGlzLm1lYXN1cmVzW2N1cnJlbnRJbmRleF0gK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgLy8gICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgIC8vICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgLy8gICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAvLyAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgIC8vICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAvLyAgICAgICAgIH07XG5cbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgLy8gICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAvLyAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAvLyAgICAgICAgICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgLy8gfVxuXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gbWVhc3VyZU9yZGVyW2ldO1xuICAgICAgICAgICAgICAgIC8vIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF07XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5tZWFzdXJlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICAvLyB0YWJsZVtpXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAvLyAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZVJvd0RpbUhlYWRpbmcgKHRhYmxlLCBjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5tZWFzdXJlc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICB0YWJsZS51bnNoaWZ0KFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNvbERpbUhlYWRpbmcodGFibGUsIDApO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhbnZhc1BhZGRpbmcnOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd4LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnNwbGljZShkaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gZGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSArIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgLSAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSB0aGlzLm1lYXN1cmVzO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZWFzdXJlcy5zcGxpY2UobWVhc3VyZXMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lYXN1cmVzLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gbWVhc3VyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSArIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpIC0gMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuZGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBpaSA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBqaiA9IDAsXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBjcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIG1hdHJpeCA9IHRoaXMuY3JlYXRlTXVsdGlDaGFydChjcm9zc3RhYiksXG4gICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IG1hdHJpeFtpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdLFxuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gcm93W3Jvdy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY29uZmlnLmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY2VsbC5jb25maWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IGNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC50eXBlID09PSAnY2FwdGlvbicgfHwgcm93W2pdLmNoYXJ0LnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LmNvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlTXVsdGlDaGFydCAobWF0cml4KSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpY2hhcnRPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID0gdGhpcy5tYy5jcmVhdGVNYXRyaXgodGhpcy5jcm9zc3RhYkNvbnRhaW5lciwgbWF0cml4KTtcbiAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMudDE7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QuZHJhdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZShtYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAocm93RmlsdGVyLCBjb2xGaWx0ZXIpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFbZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgZmlsdGVyZWRKU09OID0gZmlsdGVyZWREYXRhLmdldEpTT04oKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpbHRlcmVkSlNPTi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl0gPCBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFtjb2xGaWx0ZXJdLFxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFzdG9yZTogZmlsdGVyZWREYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBtaW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGpzb25EYXRhOiBmaWx0ZXJlZEpTT04sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjogYWRhcHRlclxuICAgICAgICAgICAgfV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGFyZ2VEYXRhLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==