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
	                        width: 40,
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
	                htmlRef.style.marginTop = (30 * this.measures.length - 15) / 2 + 'px';
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
	                    width: 40,
	                    height: 30,
	                    rowspan: 1,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: 'axis-header-cell'
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
	                    rowAxis = void 0;
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
	                    if (rowAxis) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzgwYzE3NDQ3ZTI3OGQwOGQ0YWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsImdsb2JhbERhdGEiLCJidWlsZEdsb2JhbERhdGEiLCJjb2x1bW5LZXlBcnIiLCJoYXNoIiwiZ2V0RmlsdGVySGFzaE1hcCIsImNvdW50IiwiYXhlcyIsIkZDRGF0YUZpbHRlckV4dCIsImZpbHRlckNvbmZpZyIsImRhdGFGaWx0ZXJFeHQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImQiLCJnZXRLZXlzIiwiZmllbGRzIiwiaSIsImlpIiwibGVuZ3RoIiwiZ2V0VW5pcXVlVmFsdWVzIiwidGFibGUiLCJyb3dPcmRlciIsImN1cnJlbnRJbmRleCIsImZpbHRlcmVkRGF0YVN0b3JlIiwicm93c3BhbiIsImZpZWxkQ29tcG9uZW50IiwiZmllbGRWYWx1ZXMiLCJsIiwicm93RWxlbWVudCIsImhhc0Z1cnRoZXJEZXB0aCIsImZpbHRlcmVkRGF0YUhhc2hLZXkiLCJjb2xMZW5ndGgiLCJodG1sUmVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJtaW5tYXhPYmoiLCJjbGFzc1N0ciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInN0eWxlIiwidGV4dEFsaWduIiwibWFyZ2luVG9wIiwidG9Mb3dlckNhc2UiLCJ2aXNpYmlsaXR5IiwiYm9keSIsImFwcGVuZENoaWxkIiwiY29ybmVyV2lkdGgiLCJyZW1vdmVDaGlsZCIsIndpZHRoIiwiaGVpZ2h0IiwiY29sc3BhbiIsImh0bWwiLCJvdXRlckhUTUwiLCJjbGFzc05hbWUiLCJwdXNoIiwiY3JlYXRlUm93IiwiYWRhcHRlckNmZyIsImFkYXB0ZXIiLCJkYXRhYWRhcHRlciIsImoiLCJjaGFydENlbGxPYmoiLCJyb3dIYXNoIiwiY29sSGFzaCIsImdldENoYXJ0T2JqIiwicGFyc2VJbnQiLCJtZWFzdXJlT3JkZXIiLCJjb2xFbGVtZW50IiwiY29ybmVySGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY29sT3JkZXJMZW5ndGgiLCJjb3JuZXJDZWxsQXJyIiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpbmRleCIsIm1heExlbmd0aCIsInVuc2hpZnQiLCJzZWxmIiwib2JqIiwiZmlsdGVyIiwidmFsIiwiYXJyIiwiY29sT3JkZXIiLCJ4QXhpc1JvdyIsImNyZWF0ZVJvd0RpbUhlYWRpbmciLCJjcmVhdGVDb2xEaW1IZWFkaW5nIiwiY3JlYXRlQ29sIiwiY2F0ZWdvcmllcyIsImNyZWF0ZUNhcHRpb24iLCJzdWJqZWN0IiwidGFyZ2V0IiwiYnVmZmVyIiwic3BsaWNlIiwiaW5kZXhPZiIsIk1hdGgiLCJjcmVhdGVDcm9zc3RhYiIsImZpbHRlcnMiLCJqaiIsIm1hdGNoZWRWYWx1ZXMiLCJmaWx0ZXJHZW4iLCJ0b1N0cmluZyIsImZpbHRlclZhbCIsInIiLCJnbG9iYWxBcnJheSIsIm1ha2VHbG9iYWxBcnJheSIsInJlY3Vyc2UiLCJzbGljZSIsInRlbXBPYmoiLCJ0ZW1wQXJyIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJtZWFzdXJlIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImNyZWF0ZUZpbHRlcnMiLCJkYXRhQ29tYm9zIiwiY3JlYXRlRGF0YUNvbWJvcyIsImhhc2hNYXAiLCJkYXRhQ29tYm8iLCJ2YWx1ZSIsImxlbiIsImsiLCJtYXRyaXgiLCJjcmVhdGVNdWx0aUNoYXJ0IiwidDIiLCJnbG9iYWxNYXgiLCJnbG9iYWxNaW4iLCJyb3dMYXN0Q2hhcnQiLCJyb3ciLCJyb3dBeGlzIiwiY2VsbCIsImNyb3NzdGFiRWxlbWVudCIsInR5cGUiLCJheGlzVHlwZSIsImNvbmZpZ3VyYXRpb24iLCJ1cGRhdGUiLCJsaW1pdHMiLCJjaGFydE9iaiIsImdldExpbWl0cyIsIm1pbkxpbWl0IiwibWF4TGltaXQiLCJGQ2pzb24iLCJ5QXhpc01pblZhbHVlIiwieUF4aXNNYXhWYWx1ZSIsImN0UGVyZiIsImV2dCIsImNlbGxBZGFwdGVyIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeVZhbCIsImhpZ2hsaWdodCIsIm11bHRpY2hhcnRPYmplY3QiLCJ1bmRlZmluZWQiLCJjcmVhdGVNYXRyaXgiLCJkcmF3IiwicGxhY2VIb2xkZXIiLCJyZXN1bHRzIiwicGVybXV0ZSIsIm1lbSIsImN1cnJlbnQiLCJjb25jYXQiLCJqb2luIiwicGVybXV0ZVN0cnMiLCJmaWx0ZXJTdHIiLCJzcGxpdCIsImtleVBlcm11dGF0aW9ucyIsInBlcm11dGVBcnIiLCJyb3dGaWx0ZXIiLCJjb2xGaWx0ZXIiLCJyb3dGaWx0ZXJzIiwiZGF0YVByb2Nlc3NvcnMiLCJkYXRhUHJvY2Vzc29yIiwibWF0Y2hlZEhhc2hlcyIsImZpbHRlcmVkRGF0YSIsImFwcGx5IiwibWF0Y2hIYXNoIiwiY3JlYXRlRGF0YVByb2Nlc3NvciIsImdldERhdGEiLCJkaW1lbnNpb24iLCJzZXJpZXNUeXBlIiwiYWdncmVnYXRlTW9kZSIsImRhdGFzdG9yZSIsImdldExpbWl0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7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O0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBcmtCYSxFQStrQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBL2tCYSxFQXlsQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBemxCYSxFQW1tQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBbm1CYSxFQTZtQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzODBjMTc0NDdlMjc4ZDA4ZDRhZiIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnVmlzaXRvcnMnLCAnUHJvZml0J10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBtZWFzdXJlT25Sb3c6IGZhbHNlLFxuICAgIGNlbGxXaWR0aDogMTIwLFxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzEnLFxuICAgICAgICAgICAgJ3Nob3daZXJvUGxhbmVWYWx1ZSc6ICcxJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgLy8gbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGNvbmZpZy5tZWFzdXJlT25Sb3c7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbjtcbiAgICAgICAgdGhpcy5heGVzID0gW107XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKCd0ZW1wRXZlbnQnLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZ2xvYmFsIGRhdGEgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ktYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAvLyAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgIC8vICAgICAgICAgZmllbGRDb21wb25lbnQgPSBjb2xPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgIC8vICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAvLyAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgLy8gICAgICAgICBjb2xFbGVtZW50LFxuICAgIC8vICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKGNvbE9yZGVyLmxlbmd0aCAtIDEpLFxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAvLyAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAvLyAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAvLyAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAvLyAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgIC8vICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAvLyAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgLy8gICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbY3VycmVudEluZGV4XSArXG4gICAgLy8gICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAvLyAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgIC8vICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAvLyAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgLy8gICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAvLyAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgLy8gICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgLy8gICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgIC8vICAgICAgICAgfTtcblxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAvLyAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgIC8vICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgIC8vICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gY29sc3BhbjtcbiAgICAvLyB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSwgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgLy8gdGFibGVbaV0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgLy8gICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlcik7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3dEaW1IZWFkaW5nICh0YWJsZSwgY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5kaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmRpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldICogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbERpbUhlYWRpbmcgKHRhYmxlLCBpbmRleCkge1xuICAgICAgICB2YXIgaSA9IGluZGV4LFxuICAgICAgICAgICAgaHRtbFJlZjtcbiAgICAgICAgZm9yICg7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAodGFibGUsIG1heExlbmd0aCkge1xuICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFibGUgPSBbXSxcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVSb3dEaW1IZWFkaW5nKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ29sRGltSGVhZGluZyh0YWJsZSwgMCk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneC1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ2FwdGlvbih0YWJsZSwgbWF4TGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICByb3dEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5zcGxpY2UoZGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IGRpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgKyAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gZGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1tpIC0gMV0gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBjb2xEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gdGhpcy5tZWFzdXJlcztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWVhc3VyZXMuc3BsaWNlKG1lYXN1cmVzLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWFzdXJlcy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IG1lYXN1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gbWVhc3VyZXNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2kgKyAxXSA9IG1lYXN1cmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVhc3VyZXNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSAtIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmRpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaWkgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgamogPSAwLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBtYXRyaXggPSB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoY3Jvc3N0YWIpLFxuICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gY3Jvc3N0YWJbaV1bY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBtYXRyaXhbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY2hhcnRDb25maWcuZGF0YVNvdXJjZS5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jb25maWcuY2hhcnQuY29uZmlndXJhdGlvbiA9IGFkYXB0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLnVwZGF0ZShyb3dBeGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpIHx8IGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaW1pdHMgPSByb3dBeGlzLmNoYXJ0LmNoYXJ0T2JqLmdldExpbWl0cygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5nZXRDaGFydE9iaihjcm9zc3RhYkVsZW1lbnQucm93SGFzaCwgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jb25maWcuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmN0UGVyZiArPSAocGVyZm9ybWFuY2Uubm93KCkgLSB0Mik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnVwZGF0ZShjZWxsLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyaW4nLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IGNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC50eXBlID09PSAnY2FwdGlvbicgfHwgcm93W2pdLmNoYXJ0LnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LmNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbCA9IGRhdGEuZGF0YVtjYXRlZ29yeV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodChjYXRlZ29yeVZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3Zlcm91dCcsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgd2luZG93LmN0UGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50MTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChyb3dGaWx0ZXIsIGNvbEZpbHRlcikge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gW10sXG4gICAgICAgICAgICAvLyBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICAvLyBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlckNmZyA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlciA9IHt9LFxuICAgICAgICAgICAgbGltaXRzID0ge30sXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA+IG1heCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdIDwgbWluKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhc3RvcmU6IGZpbHRlcmVkRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgbGltaXRzID0gYWRhcHRlci5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGFkYXB0ZXJcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=