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
	        this.storeParams = {
	            data: data,
	            config: config
	        };
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
	                        adapter = this.mc.dataAdapter(adapterCfg);
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
	                adapter = this.mc.dataAdapter(adapterCfg);
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
	                        adapter = this.mc.dataAdapter(adapterCfg);
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
	                                adapter = this.mc.dataAdapter(adapterCfg);
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
	            this.dragListener(this.multichartObject.placeHolder);
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
	                filteredData = this.dataStore.getChildModel(dataProcessors);
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
	                adapter = this.mc.dataAdapter(adapterCfg);
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
	            measuresHolder = placeHolder.slice(dimensionsLength + 1, dimensionsLength + measuresLength + 1);
	            setupListener(dimensionsHolder, dimensions, dimensionsLength, this.dimensions);
	            setupListener(measuresHolder, measures, measuresLength, this.measures);
	            function setupListener(holder, arr, arrLen, globalArr) {
	                var _loop = function _loop(i) {
	                    var el = holder[i].graphics,
	                        item = holder[i];
	                    item.cellValue = arr[i];
	                    item.origLeft = parseInt(el.style.left);
	                    item.redZone = item.origLeft + parseInt(el.style.width) / 2;
	                    item.index = i;
	                    item.adjust = 0;
	                    item.origZ = el.style.zIndex;
	                    self._setupDrag(item.graphics, function dragStart(dx, dy) {
	                        el.style.left = item.origLeft + dx + item.adjust + 'px';
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
	                                self.renderCrosstab();
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
	                x = e.clientX;
	                y = e.clientY;
	                el.style.opacity = 0.8;
	                window.document.addEventListener('mousemove', customHandler);
	                window.document.addEventListener('mouseup', mouseUpHandler);
	            });
	            function mouseUpHandler(e) {
	                el.style.opacity = 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2ViYzAwNTJiZTgwODdiMjc5Y2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsInN0b3JlUGFyYW1zIiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImNvbHVtbktleUFyciIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY291bnQiLCJheGVzIiwiRkNEYXRhRmlsdGVyRXh0IiwiZmlsdGVyQ29uZmlnIiwiZGF0YUZpbHRlckV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZCIsImdldEtleXMiLCJmaWVsZHMiLCJpIiwiaWkiLCJsZW5ndGgiLCJnZXRVbmlxdWVWYWx1ZXMiLCJ0YWJsZSIsInJvd09yZGVyIiwiY3VycmVudEluZGV4IiwiZmlsdGVyZWREYXRhU3RvcmUiLCJyb3dzcGFuIiwiZmllbGRDb21wb25lbnQiLCJmaWVsZFZhbHVlcyIsImwiLCJyb3dFbGVtZW50IiwiaGFzRnVydGhlckRlcHRoIiwiZmlsdGVyZWREYXRhSGFzaEtleSIsImNvbExlbmd0aCIsImh0bWxSZWYiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsIm1pbm1heE9iaiIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsInB1c2giLCJjcmVhdGVSb3ciLCJhZGFwdGVyQ2ZnIiwiYWRhcHRlciIsImRhdGFBZGFwdGVyIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJjb3JuZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjb2xPcmRlckxlbmd0aCIsImNvcm5lckNlbGxBcnIiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsImluZGV4IiwibWF4TGVuZ3RoIiwidW5zaGlmdCIsInNlbGYiLCJvYmoiLCJmaWx0ZXIiLCJ2YWwiLCJhcnIiLCJjb2xPcmRlciIsInhBeGlzUm93IiwiY3JlYXRlUm93RGltSGVhZGluZyIsImNyZWF0ZUNvbERpbUhlYWRpbmciLCJjcmVhdGVDb2wiLCJjYXRlZ29yaWVzIiwiY3JlYXRlQ2FwdGlvbiIsInN1YmplY3QiLCJ0YXJnZXQiLCJidWZmZXIiLCJzcGxpY2UiLCJpbmRleE9mIiwiTWF0aCIsImNyZWF0ZUNyb3NzdGFiIiwiZmlsdGVycyIsImpqIiwibWF0Y2hlZFZhbHVlcyIsImZpbHRlckdlbiIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInNsaWNlIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIm1lYXN1cmUiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsInZhbHVlIiwibGVuIiwiayIsIm1hdHJpeCIsImNyZWF0ZU11bHRpQ2hhcnQiLCJ0MiIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInJvd0xhc3RDaGFydCIsInJvdyIsInJvd0F4aXMiLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50IiwidHlwZSIsImF4aXNUeXBlIiwiY29uZmlndXJhdGlvbiIsInVwZGF0ZSIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsIkZDanNvbiIsInlBeGlzTWluVmFsdWUiLCJ5QXhpc01heFZhbHVlIiwiY3RQZXJmIiwiZXZ0IiwiY2VsbEFkYXB0ZXIiLCJjYXRlZ29yeSIsImNhdGVnb3J5VmFsIiwiaGlnaGxpZ2h0IiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsInNwbGl0Iiwia2V5UGVybXV0YXRpb25zIiwicGVybXV0ZUFyciIsInJvd0ZpbHRlciIsImNvbEZpbHRlciIsInJvd0ZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0Q2hpbGRNb2RlbCIsImRpbWVuc2lvbiIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZGF0YXN0b3JlIiwiZ2V0TGltaXQiLCJvcmlnQ29uZmlnIiwibWVhc3VyZXNMZW5ndGgiLCJkaW1lbnNpb25zTGVuZ3RoIiwiZGltZW5zaW9uc0hvbGRlciIsIm1lYXN1cmVzSG9sZGVyIiwic2V0dXBMaXN0ZW5lciIsImhvbGRlciIsImFyckxlbiIsImdsb2JhbEFyciIsImVsIiwiZ3JhcGhpY3MiLCJpdGVtIiwiY2VsbFZhbHVlIiwib3JpZ0xlZnQiLCJsZWZ0IiwicmVkWm9uZSIsImFkanVzdCIsIm9yaWdaIiwiekluZGV4IiwiX3NldHVwRHJhZyIsImRyYWdTdGFydCIsImR4IiwiZHkiLCJtYW5hZ2VTaGlmdGluZyIsImRyYWdFbmQiLCJjaGFuZ2UiLCJzZXRUaW1lb3V0IiwiaXNSaWdodCIsInN0YWNrIiwiZHJhZ0l0ZW0iLCJuZXh0UG9zIiwibmV4dEl0ZW0iLCJwb3AiLCJoYW5kbGVyIiwiaGFuZGxlcjIiLCJ4IiwieSIsImN1c3RvbUhhbmRsZXIiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9wYWNpdHkiLCJtb3VzZVVwSGFuZGxlciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3RDQSxLQUFNQSxjQUFjLG1CQUFBQyxDQUFRLENBQVIsQ0FBcEI7QUFBQSxLQUNJQyxPQUFPLG1CQUFBRCxDQUFRLENBQVIsQ0FEWDs7QUFHQSxLQUFJRSxTQUFTO0FBQ1RDLGlCQUFZLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsT0FBckIsQ0FESDtBQUVUQyxlQUFVLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsUUFBckIsQ0FGRDtBQUdUQyxnQkFBVyxVQUhGO0FBSVRDLG9CQUFlLHFCQUpOO0FBS1RDLG1CQUFjLEtBTEw7QUFNVEMsZ0JBQVcs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QUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQW5tQmEsRUE2bUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQTdtQmEsRUF1bkJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXZuQmEsQ0FBakIsQyIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgM2ViYzAwNTJiZTgwODdiMjc5Y2EiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnTW9udGgnXSxcbiAgICBtZWFzdXJlczogWydTYWxlJywgJ1Zpc2l0b3JzJywgJ1Byb2ZpdCddLFxuICAgIGNoYXJ0VHlwZTogJ2NvbHVtbjJkJyxcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5LicsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDEyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMDAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcxJyxcbiAgICAgICAgICAgICdzaG93WmVyb1BsYW5lVmFsdWUnOiAnMScsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjQjVCOUJBJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIC8vIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBNdWx0aUNoYXJ0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLm1jID0gbmV3IE11bHRpQ2hhcnRpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgICAgICB0aGlzLnQxID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yZVBhcmFtcyA9IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGNvbmZpZy5tZWFzdXJlT25Sb3c7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbjtcbiAgICAgICAgdGhpcy5heGVzID0gW107XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5hZGRFdmVudExpc3RlbmVyKCd0ZW1wRXZlbnQnLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZ2xvYmFsIGRhdGEgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ktYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAvLyAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgIC8vICAgICAgICAgZmllbGRDb21wb25lbnQgPSBjb2xPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgIC8vICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAvLyAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgLy8gICAgICAgICBjb2xFbGVtZW50LFxuICAgIC8vICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKGNvbE9yZGVyLmxlbmd0aCAtIDEpLFxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAvLyAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAvLyAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAvLyAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAvLyAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgIC8vICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAvLyAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgLy8gICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbY3VycmVudEluZGV4XSArXG4gICAgLy8gICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAvLyAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgIC8vICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAvLyAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgLy8gICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAvLyAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgLy8gICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgLy8gICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgIC8vICAgICAgICAgfTtcblxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAvLyAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgIC8vICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgIC8vICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gY29sc3BhbjtcbiAgICAvLyB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSwgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgICAgICB0YWJsZVswXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgLy8gdGFibGVbaV0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgLy8gICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlcik7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3dEaW1IZWFkaW5nICh0YWJsZSwgY29sT3JkZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcm5lckNlbGxBcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5kaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmRpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldICogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbERpbUhlYWRpbmcgKHRhYmxlLCBpbmRleCkge1xuICAgICAgICB2YXIgaSA9IGluZGV4LFxuICAgICAgICAgICAgaHRtbFJlZjtcbiAgICAgICAgZm9yICg7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAodGFibGUsIG1heExlbmd0aCkge1xuICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFibGUgPSBbXSxcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVSb3dEaW1IZWFkaW5nKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ29sRGltSGVhZGluZyh0YWJsZSwgMCk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneC1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ2FwdGlvbih0YWJsZSwgbWF4TGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICByb3dEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5zcGxpY2UoZGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IGRpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgKyAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gZGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1tpIC0gMV0gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBjb2xEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gdGhpcy5tZWFzdXJlcztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWVhc3VyZXMuc3BsaWNlKG1lYXN1cmVzLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWFzdXJlcy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IG1lYXN1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gbWVhc3VyZXNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2kgKyAxXSA9IG1lYXN1cmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVhc3VyZXNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSAtIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmRpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaWkgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgamogPSAwLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBtYXRyaXggPSB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoY3Jvc3N0YWIpLFxuICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gY3Jvc3N0YWJbaV1bY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBtYXRyaXhbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY2hhcnRDb25maWcuZGF0YVNvdXJjZS5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy5jb25maWcuY2hhcnQuY29uZmlndXJhdGlvbiA9IGFkYXB0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLnVwZGF0ZShyb3dBeGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdjaGFydCcpIHx8IGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnaHRtbCcpKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaW1pdHMgPSByb3dBeGlzLmNoYXJ0LmNoYXJ0T2JqLmdldExpbWl0cygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5nZXRDaGFydE9iaihjcm9zc3RhYkVsZW1lbnQucm93SGFzaCwgY3Jvc3N0YWJFbGVtZW50LmNvbEhhc2gpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNaW5WYWx1ZSA9IG1pbkxpbWl0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5GQ2pzb24uY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jb25maWcuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmN0UGVyZiArPSAocGVyZm9ybWFuY2Uubm93KCkgLSB0Mik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnVwZGF0ZShjZWxsLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyaW4nLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IGNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC50eXBlID09PSAnY2FwdGlvbicgfHwgcm93W2pdLmNoYXJ0LnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LmNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVZhbCA9IGRhdGEuZGF0YVtjYXRlZ29yeV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodChjYXRlZ29yeVZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3Zlcm91dCcsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgd2luZG93LmN0UGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50MTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChyb3dGaWx0ZXIsIGNvbEZpbHRlcikge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gW10sXG4gICAgICAgICAgICAvLyBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICAvLyBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlckNmZyA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlciA9IHt9LFxuICAgICAgICAgICAgbGltaXRzID0ge30sXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldENoaWxkTW9kZWwoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA+IG1heCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdIDwgbWluKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhc3RvcmU6IGZpbHRlcmVkRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgbGltaXRzID0gYWRhcHRlci5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGFkYXB0ZXJcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSwgZGltZW5zaW9uc0xlbmd0aCArIG1lYXN1cmVzTGVuZ3RoICsgMSk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIoZGltZW5zaW9uc0hvbGRlciwgZGltZW5zaW9ucywgZGltZW5zaW9uc0xlbmd0aCwgdGhpcy5kaW1lbnNpb25zKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihtZWFzdXJlc0hvbGRlciwgbWVhc3VyZXMsIG1lYXN1cmVzTGVuZ3RoLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBMaXN0ZW5lciAoaG9sZGVyLCBhcnIsIGFyckxlbiwgZ2xvYmFsQXJyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyckxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsID0gaG9sZGVyW2ldLmdyYXBoaWNzLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaG9sZGVyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXR1cERyYWcoaXRlbS5ncmFwaGljcywgZnVuY3Rpb24gZHJhZ1N0YXJ0IChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8IChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGN1c3RvbUhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZXIyLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGFyZ2VEYXRhLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==