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
	                    var adapterCfg = {
	                        config: {
	                            config: {
	                                chart: {
	                                    'axisType': 'y'
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
	                        chartCellObj.max = max;
	                        chartCellObj.min = min;
	                    }
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
	                table = this.createColDimHeading(table, 0);
	                this.createCol(table, obj, this.measures);
	                table.push([]);
	                this.createRow(table, obj, rowOrder, 0, '');
	                for (i = 0; i < table.length; i++) {
	                    maxLength = maxLength < table[i].length ? table[i].length : maxLength;
	                }
	                for (i = 0; i < this.dimensions.length; i++) {
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
	                t2 = performance.now(),
	                globalMax = -Infinity,
	                globalMin = Infinity;
	            for (var i = 0, ii = crosstab.length; i < ii; i++) {
	                var rowLastChart = crosstab[i][crosstab[i].length - 1];
	                if (rowLastChart.max || rowLastChart.min) {
	                    if (globalMax < rowLastChart.max) {
	                        globalMax = rowLastChart.max;
	                    }
	                    if (globalMin > rowLastChart.min) {
	                        globalMin = rowLastChart.min;
	                    }
	                }
	            }
	            for (var _i2 = 0, _ii = matrix.length; _i2 < _ii; _i2++) {
	                var row = matrix[_i2],
	                    rowAxis = {};
	                for (var j = 0, jj = row.length; j < jj; j++) {
	                    var cell = row[j],
	                        crosstabElement = crosstab[_i2][j];
	                    if (crosstabElement.chart && crosstabElement.chart.type === 'axis') {
	                        rowAxis = cell;
	                        if (rowAxis.chart.chartConfig.dataSource.chart.axisType === 'y') {
	                            var adapterCfg = {
	                                config: {
	                                    config: {
	                                        chart: {
	                                            'dataMin': globalMin,
	                                            'axisType': 'y',
	                                            'dataMax': globalMax,
	                                            'borderthickness': 0,
	                                            'chartBottomMargin': 5,
	                                            'chartTopMargin': 5
	                                        }
	                                    }
	                                }
	                            },
	                                adapter = this.mc.dataadapter(adapterCfg);
	                            rowAxis.config.chart.configuration = adapter;
	                            rowAxis.update(rowAxis.config);
	                        }
	                    }
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
	                    for (var _i3 = 0, _ii2 = matrix.length; _i3 < _ii2; _i3++) {
	                        var _row = crosstab[_i3];
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
	                    for (var _i4 = 0, _ii3 = matrix.length; _i4 < _ii3; _i4++) {
	                        var _row2 = crosstab[_i4];
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
	
	            // filteredJSON = [],
	            // max = -Infinity,
	            // min = Infinity,
	            filteredData = {},
	                adapterCfg = {},
	                adapter = {},
	                limits = {},
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
	                // filteredJSON = filteredData.getJSON();
	                // for (let i = 0, ii = filteredJSON.length; i < ii; i++) {
	                //     if (filteredJSON[i][colFilter] > max) {
	                //         max = filteredJSON[i][colFilter];
	                //     }
	                //     if (filteredJSON[i][colFilter] < min) {
	                //         min = filteredJSON[i][colFilter];
	                //     }
	                // }
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
	                limits = adapter.getLimit();
	                return [{
	                    'max': limits.max,
	                    'min': limits.min
	                }, {
	                    type: this.chartType,
	                    width: '100%',
	                    height: '100%',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDI4OTQ0ZjBhNWZmYzI4MDUxMGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsImdsb2JhbERhdGEiLCJidWlsZEdsb2JhbERhdGEiLCJjb2x1bW5LZXlBcnIiLCJoYXNoIiwiZ2V0RmlsdGVySGFzaE1hcCIsImNvdW50IiwiYXhlcyIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImQiLCJnZXRLZXlzIiwiZmllbGRzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwidGFibGUiLCJyb3dPcmRlciIsImN1cnJlbnRJbmRleCIsImZpbHRlcmVkRGF0YVN0b3JlIiwicm93c3BhbiIsImZpZWxkQ29tcG9uZW50IiwiZmllbGRWYWx1ZXMiLCJsIiwicm93RWxlbWVudCIsImhhc0Z1cnRoZXJEZXB0aCIsImZpbHRlcmVkRGF0YUhhc2hLZXkiLCJjb2xMZW5ndGgiLCJodG1sUmVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJtaW5tYXhPYmoiLCJjbGFzc1N0ciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInN0eWxlIiwidGV4dEFsaWduIiwibWFyZ2luVG9wIiwidG9Mb3dlckNhc2UiLCJ2aXNpYmlsaXR5IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY29ybmVyV2lkdGgiLCJyZW1vdmVDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiY29sc3BhbiIsImh0bWwiLCJvdXRlckhUTUwiLCJjbGFzc05hbWUiLCJwdXNoIiwiY3JlYXRlUm93IiwiYWRhcHRlckNmZyIsImFkYXB0ZXIiLCJkYXRhYWRhcHRlciIsImoiLCJjaGFydENlbGxPYmoiLCJyb3dIYXNoIiwiY29sSGFzaCIsImdldENoYXJ0T2JqIiwicGFyc2VJbnQiLCJtZWFzdXJlT3JkZXIiLCJjb2xFbGVtZW50IiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpbmRleCIsIm1heExlbmd0aCIsInVuc2hpZnQiLCJzZWxmIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwiY29sT3JkZXIiLCJ4QXhpc1JvdyIsImNyZWF0ZVJvd0RpbUhlYWRpbmciLCJjcmVhdGVDb2xEaW1IZWFkaW5nIiwiY3JlYXRlQ29sIiwiY2F0ZWdvcmllcyIsImNyZWF0ZUNhcHRpb24iLCJzdWJqZWN0IiwidGFyZ2V0IiwiYnVmZmVyIiwic3BsaWNlIiwiaW5kZXhPZiIsIk1hdGgiLCJjcmVhdGVDcm9zc3RhYiIsImZpbHRlcnMiLCJqaiIsIm1hdGNoZWRWYWx1ZXMiLCJmaWx0ZXJHZW4iLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJzbGljZSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJtZWFzdXJlIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImNyZWF0ZUZpbHRlcnMiLCJkYXRhQ29tYm9zIiwiY3JlYXRlRGF0YUNvbWJvcyIsImhhc2hNYXAiLCJkYXRhQ29tYm8iLCJ2YWx1ZSIsImxlbiIsImsiLCJtYXRyaXgiLCJjcmVhdGVNdWx0aUNoYXJ0IiwidDIiLCJnbG9iYWxNYXgiLCJnbG9iYWxNaW4iLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiY2VsbCIsImNyb3NzdGFiRWxlbWVudCIsInR5cGUiLCJheGlzVHlwZSIsImNvbmZpZ3VyYXRpb24iLCJ1cGRhdGUiLCJsaW1pdHMiLCJjaGFydE9iaiIsImdldExpbWl0cyIsIm1pbkxpbWl0IiwibWF4TGltaXQiLCJGQ2pzb24iLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImN0UGVyZiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsIm11bHRpY2hhcnRPYmplY3QiLCJ1bmRlZmluZWQiLCJjcmVhdGVNYXRyaXgiLCJkcmF3IiwicGxhY2VIb2xkZXIiLCJyZXN1bHRzIiwicGVybXV0ZSIsIm1lbSIsImN1cnJlbnQiLCJjb25jYXQiLCJqb2luIiwicGVybXV0ZVN0cnMiLCJmaWx0ZXJTdHIiLCJzcGxpdCIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsImdldERhdGEiLCJkaW1lbnNpb24iLCJzZXJpZXNUeXBlIiwiYWdncmVnYXRlTW9kZSIsImRhdGFzdG9yZSIsImdldExpbWl0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7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VyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBemxCYSxFQW1tQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBbm1CYSxFQTZtQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkMjg5NDRmMGE1ZmZjMjgwNTEwYyIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnVmlzaXRvcnMnLCAnUHJvZml0J10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBtZWFzdXJlT25Sb3c6IGZhbHNlLFxuICAgIGNlbGxXaWR0aDogMTIwLFxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzEnLFxuICAgICAgICAgICAgJ3Nob3daZXJvUGxhbmVWYWx1ZSc6ICcxJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgLy8gbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGNvbmZpZy5tZWFzdXJlT25Sb3c7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbjtcbiAgICAgICAgdGhpcy5heGVzID0gW107XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKCd0ZW1wRXZlbnQnLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZ2xvYmFsIGRhdGEgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd5LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5jb2x1bW5LZXlBcnJbal1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWF4ID0gbWF4O1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWluID0gbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgLy8gICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAvLyAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAvLyAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgLy8gICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgIC8vICAgICAgICAgY29sRWxlbWVudCxcbiAgICAvLyAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgLy8gICAgICAgICBodG1sUmVmO1xuXG4gICAgLy8gICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgLy8gICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgLy8gICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAvLyAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgLy8gICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgIC8vICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgLy8gICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAvLyAgICAgICAgICAgICAnICcgKyB0aGlzLm1lYXN1cmVzW2N1cnJlbnRJbmRleF0gK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgLy8gICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgIC8vICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgLy8gICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAvLyAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgIC8vICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAvLyAgICAgICAgIH07XG5cbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgLy8gICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAvLyAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAvLyAgICAgICAgICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgLy8gfVxuXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gbWVhc3VyZU9yZGVyW2ldO1xuICAgICAgICAgICAgICAgIC8vIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF07XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5tZWFzdXJlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICAvLyB0YWJsZVtpXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAvLyAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZVJvd0RpbUhlYWRpbmcgKHRhYmxlLCBjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5tZWFzdXJlc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICB0YWJsZS51bnNoaWZ0KFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDb2xEaW1IZWFkaW5nKHRhYmxlLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2FudmFzUGFkZGluZyc6IDEzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3gtYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNhcHRpb24odGFibGUsIG1heExlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgcm93RGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMuc3BsaWNlKGRpbWVuc2lvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBkaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gZGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1tpICsgMV0gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSAtIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgY29sRGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBtZWFzdXJlcyA9IHRoaXMubWVhc3VyZXM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1lYXN1cmVzLnNwbGljZShtZWFzdXJlcy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVhc3VyZXMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBtZWFzdXJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpICsgMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gbWVhc3VyZXNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2kgLSAxXSA9IG1lYXN1cmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVhc3VyZXNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5kaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGlpID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIGpqID0gMCxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgbWF0cml4ID0gdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KGNyb3NzdGFiKSxcbiAgICAgICAgICAgIHQyID0gcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgICAgICBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvd0xhc3RDaGFydCA9IGNyb3NzdGFiW2ldW2Nyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gbWF0cml4W2ldLFxuICAgICAgICAgICAgICAgIHJvd0F4aXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY2hhcnRDb25maWcuZGF0YVNvdXJjZS5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jb25maWcuY2hhcnQuY29uZmlndXJhdGlvbiA9IGFkYXB0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLnVwZGF0ZShyb3dBeGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpIHx8IGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbWl0cyA9IHJvd0F4aXMuY2hhcnQuY2hhcnRPYmouZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQgPSB0aGlzLmdldENoYXJ0T2JqKGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaClbMV07XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbmZpZy5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmN0UGVyZiArPSAocGVyZm9ybWFuY2Uubm93KCkgLSB0Mik7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwudXBkYXRlKGNlbGwuY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XG4gICAgICAgICAgICB3aW5kb3cuY3RQZXJmID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnQxO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIC8vIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIC8vIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBsaW1pdHMgPSB7fSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFbZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gZmlsdGVyZWREYXRhLmdldEpTT04oKTtcbiAgICAgICAgICAgIC8vIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpbHRlcmVkSlNPTi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdID4gbWF4KSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1heCA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl0gPCBtaW4pIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgbWluID0gZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl07XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFtjb2xGaWx0ZXJdLFxuICAgICAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFzdG9yZTogZmlsdGVyZWREYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICBsaW1pdHMgPSBhZGFwdGVyLmdldExpbWl0KCk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbGltaXRzLm1heCxcbiAgICAgICAgICAgICAgICAnbWluJzogbGltaXRzLm1pblxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjogYWRhcHRlclxuICAgICAgICAgICAgfV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGFyZ2VEYXRhLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==