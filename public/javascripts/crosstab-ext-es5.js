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
	    dimensions: ['Product', 'Month', 'Year', 'State'],
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
	            var _this3 = this;
	
	            // Getting only labels
	            var origConfig = this.storeParams.config,
	                dimensions = origConfig.dimensions || [],
	                dimensionsLength = 0,
	                dimensionsHolder = void 0,
	                self = this;
	            // let end
	            placeHolder = placeHolder[1];
	            // Omitting last dimension
	            dimensions = dimensions.slice(0, dimensions.length - 1);
	            dimensionsLength = dimensions.length;
	            // Setting up dimension holder
	            dimensionsHolder = placeHolder.slice(0, dimensionsLength);
	
	            var _loop = function _loop(i) {
	                var el = dimensionsHolder[i].graphics,
	                    item = dimensionsHolder[i];
	                item.cellValue = dimensions[i];
	                item.origLeft = parseInt(el.style.left);
	                item.redZone = item.origLeft + parseInt(el.style.width) / 2;
	                item.index = i;
	                item.adjust = 0;
	                item.origZ = el.style.zIndex;
	                _this3._setupDrag(item.graphics, function dragStart(dx, dy) {
	                    el.style.left = item.origLeft + dx + item.adjust + 'px';
	                    el.style.zIndex = 1000;
	                    manageShifting(item.index);
	                }, function dragEnd() {
	                    var change = false,
	                        j = 0;
	                    item.adjust = 0;
	                    el.style.zIndex = item.origZ;
	                    el.style.left = item.origLeft + 'px';
	                    for (; j < dimensionsLength; ++j) {
	                        if (self.dimensions[j] !== dimensionsHolder[j].cellValue) {
	                            self.dimensions[j] = dimensionsHolder[j].cellValue;
	                            change = true;
	                        }
	                    }
	                    if (change) {
	                        window.setTimeout(function () {
	                            self.globalData = self.buildGlobalData();
	                            self.renderCrosstab();
	                        }, 0);
	                    }
	                });
	            };
	
	            for (var i = 0; i < dimensionsLength; ++i) {
	                _loop(i);
	            }
	            function manageShifting(index) {
	                var i = 0,
	                    dragItem = dimensionsHolder[index],
	                    trd = dragItem.redZone,
	                    tl = dragItem.origLeft,
	                    ti = dragItem.index,
	                    temp = {},
	                    item = void 0,
	                    nextItem = void 0;
	                for (i = index; i--;) {
	                    item = dimensionsHolder[i];
	                    nextItem = dimensionsHolder[i + 1];
	                    if (parseInt(dragItem.graphics.style.left) < item.redZone) {
	                        trd = item.redZone;
	                        tl = item.origLeft;
	                        ti = item.index;
	                        nextItem.adjust += parseInt(item.graphics.style.width);
	                        item.origLeft = nextItem.origLeft;
	                        item.redZone = nextItem.redZone;
	                        item.index = nextItem.index;
	                        item.graphics.style.left = item.origLeft + 'px';
	                        temp = dimensionsHolder[i + 1];
	                        dimensionsHolder[i + 1] = dimensionsHolder[i];
	                        dimensionsHolder[i] = temp;
	                    }
	                }
	                // Setting new values for dragitem
	                dragItem.origLeft = tl;
	                dragItem.redZone = trd;
	                dragItem.index = ti;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzdhNTBiMjM5MmY0Y2VjNTgzOTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsInN0b3JlUGFyYW1zIiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImNvbHVtbktleUFyciIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY291bnQiLCJheGVzIiwiRkNEYXRhRmlsdGVyRXh0IiwiZmlsdGVyQ29uZmlnIiwiZGF0YUZpbHRlckV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZCIsImdldEtleXMiLCJmaWVsZHMiLCJpIiwiaWkiLCJsZW5ndGgiLCJnZXRVbmlxdWVWYWx1ZXMiLCJ0YWJsZSIsInJvd09yZGVyIiwiY3VycmVudEluZGV4IiwiZmlsdGVyZWREYXRhU3RvcmUiLCJyb3dzcGFuIiwiZmllbGRDb21wb25lbnQiLCJmaWVsZFZhbHVlcyIsImwiLCJyb3dFbGVtZW50IiwiaGFzRnVydGhlckRlcHRoIiwiZmlsdGVyZWREYXRhSGFzaEtleSIsImNvbExlbmd0aCIsImh0bWxSZWYiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsIm1pbm1heE9iaiIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsInB1c2giLCJjcmVhdGVSb3ciLCJhZGFwdGVyQ2ZnIiwiYWRhcHRlciIsImRhdGFBZGFwdGVyIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJjb3JuZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjb2xPcmRlckxlbmd0aCIsImNvcm5lckNlbGxBcnIiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsImluZGV4IiwibWF4TGVuZ3RoIiwidW5zaGlmdCIsInNlbGYiLCJvYmoiLCJmaWx0ZXIiLCJ2YWwiLCJhcnIiLCJjb2xPcmRlciIsInhBeGlzUm93IiwiY3JlYXRlUm93RGltSGVhZGluZyIsImNyZWF0ZUNvbERpbUhlYWRpbmciLCJjcmVhdGVDb2wiLCJjYXRlZ29yaWVzIiwiY3JlYXRlQ2FwdGlvbiIsInN1YmplY3QiLCJ0YXJnZXQiLCJidWZmZXIiLCJzcGxpY2UiLCJpbmRleE9mIiwiTWF0aCIsImNyZWF0ZUNyb3NzdGFiIiwiZmlsdGVycyIsImpqIiwibWF0Y2hlZFZhbHVlcyIsImZpbHRlckdlbiIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInNsaWNlIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIm1lYXN1cmUiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsInZhbHVlIiwibGVuIiwiayIsIm1hdHJpeCIsImNyZWF0ZU11bHRpQ2hhcnQiLCJ0MiIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInJvd0xhc3RDaGFydCIsInJvdyIsInJvd0F4aXMiLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50IiwidHlwZSIsImF4aXNUeXBlIiwiY29uZmlndXJhdGlvbiIsInVwZGF0ZSIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsIkZDanNvbiIsInlBeGlzTWluVmFsdWUiLCJ5QXhpc01heFZhbHVlIiwiY3RQZXJmIiwiZXZ0IiwiY2VsbEFkYXB0ZXIiLCJjYXRlZ29yeSIsImNhdGVnb3J5VmFsIiwiaGlnaGxpZ2h0IiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsInNwbGl0Iiwia2V5UGVybXV0YXRpb25zIiwicGVybXV0ZUFyciIsInJvd0ZpbHRlciIsImNvbEZpbHRlciIsInJvd0ZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0RGF0YSIsImRpbWVuc2lvbiIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZGF0YXN0b3JlIiwiZ2V0TGltaXQiLCJvcmlnQ29uZmlnIiwiZGltZW5zaW9uc0xlbmd0aCIsImRpbWVuc2lvbnNIb2xkZXIiLCJlbCIsImdyYXBoaWNzIiwiaXRlbSIsImNlbGxWYWx1ZSIsIm9yaWdMZWZ0IiwibGVmdCIsInJlZFpvbmUiLCJhZGp1c3QiLCJvcmlnWiIsInpJbmRleCIsIl9zZXR1cERyYWciLCJkcmFnU3RhcnQiLCJkeCIsImR5IiwibWFuYWdlU2hpZnRpbmciLCJkcmFnRW5kIiwiY2hhbmdlIiwic2V0VGltZW91dCIsImRyYWdJdGVtIiwidHJkIiwidGwiLCJ0aSIsInRlbXAiLCJuZXh0SXRlbSIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwib3BhY2l0eSIsIm1vdXNlVXBIYW5kbGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdENBLEtBQU1BLGNBQWMsbUJBQUFDLENBQVEsQ0FBUixDQUFwQjtBQUFBLEtBQ0lDLE9BQU8sbUJBQUFELENBQVEsQ0FBUixDQURYOztBQUdBLEtBQUlFLFNBQVM7QUFDVEMsaUJBQVksQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixPQUE3QixDQURIO0FBRVRDLGVBQVUsQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixRQUFyQixDQUZEO0FBR1RDLGdCQUFXLFVBSEY7QUFJVEMsb0JBQWUscUJBSk47QUFLVEMsbUJBQWMsS0FMTDtBQU1UQyxnQkFBVyxHQU5GO0FBT1RDLGlCQUFZLEdBUEg7QUFRVEMsd0JBQW1CLGNBUlY7QUFTVEMsa0JBQWEsS0FUSjtBQVVUQyxrQkFBYTtBQUNUQyxnQkFBTztBQUNI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YjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQW5tQmEsRUE2bUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQTdtQmEsRUF1bkJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXZuQmEsQ0FBakIsQyIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzdhNTBiMjM5MmY0Y2VjNTgzOTYiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnTW9udGgnLCAnWWVhcicsICdTdGF0ZSddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnVmlzaXRvcnMnLCAnUHJvZml0J10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBtZWFzdXJlT25Sb3c6IGZhbHNlLFxuICAgIGNlbGxXaWR0aDogMTIwLFxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzEnLFxuICAgICAgICAgICAgJ3Nob3daZXJvUGxhbmVWYWx1ZSc6ICcxJyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdhbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAndHJhbnNwb3NlQW5pbWF0aW9uJzogJzEnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGxvdENvbG9ySW5Ub29sdGlwJzogJzAnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlckFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ2RyYXdUcmVuZFJlZ2lvbic6ICcxJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgd2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG4gICAgd2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBjcm9zc3RhYi5cbiAqL1xuY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgLy8gbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JlUGFyYW1zID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gY29uZmlnLmRpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMubWVhc3VyZXMgPSBjb25maWcubWVhc3VyZXM7XG4gICAgICAgIHRoaXMubWVhc3VyZU9uUm93ID0gY29uZmlnLm1lYXN1cmVPblJvdztcbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodDtcbiAgICAgICAgdGhpcy5jcm9zc3RhYkNvbnRhaW5lciA9IGNvbmZpZy5jcm9zc3RhYkNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0aW9uID0gY29uZmlnLmFnZ3JlZ2F0aW9uO1xuICAgICAgICB0aGlzLmF4ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5ub0RhdGFNZXNzYWdlID0gY29uZmlnLm5vRGF0YU1lc3NhZ2U7XG4gICAgICAgIGlmICh0eXBlb2YgRkNEYXRhRmlsdGVyRXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICB0aGlzLmRhdGFGaWx0ZXJFeHQgPSBuZXcgRkNEYXRhRmlsdGVyRXh0KHRoaXMuZGF0YVN0b3JlLCBmaWx0ZXJDb25maWcsICdjb250cm9sLWJveCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ3RlbXBFdmVudCcsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJDcm9zc3RhYigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBnbG9iYWwgZGF0YSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YUFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneS1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuY29sdW1uS2V5QXJyW2pdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLmNvbHVtbktleUFycltqXSlbMF07XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSAocGFyc2VJbnQobWlubWF4T2JqLm1pbikgPCBtaW4pID8gbWlubWF4T2JqLm1pbiA6IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1heCA9IG1heDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgIC8vICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgLy8gICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgLy8gICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgIC8vICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAvLyAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgLy8gICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgLy8gICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgIC8vICAgICAgICAgaHRtbFJlZjtcblxuICAgIC8vICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xuICAgIC8vICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgIC8vICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgLy8gICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIC8vICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAvLyAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgIC8vICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgLy8gICAgICAgICAgICAgJyAnICsgdGhpcy5tZWFzdXJlc1tjdXJyZW50SW5kZXhdICtcbiAgICAvLyAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgIC8vICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgLy8gICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgIC8vICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAvLyAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgIC8vICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgLy8gICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAvLyAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAvLyAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgLy8gICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgIC8vICAgICAgICAgdGFibGVbY3VycmVudEluZGV4XS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgLy8gICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgLy8gICAgICAgICAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiBjb2xzcGFuO1xuICAgIC8vIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIG1lYXN1cmVPcmRlcikge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBpLCBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXTtcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRDb21wb25lbnQ7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5tZWFzdXJlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICAvLyB0YWJsZVtpXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAvLyAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZVJvd0RpbUhlYWRpbmcgKHRhYmxlLCBjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1oZWFkZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICB0YWJsZS51bnNoaWZ0KFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDb2xEaW1IZWFkaW5nKHRhYmxlLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeHRyYSBjZWxsIGZvciB5IGF4aXMuIEVzc2VudGlhbGx5IFkgYXhpcyBmb290ZXIuXG4gICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1mb290ZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhbnZhc1BhZGRpbmcnOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd4LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnNwbGljZShkaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gZGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSArIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgLSAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSB0aGlzLm1lYXN1cmVzO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZWFzdXJlcy5zcGxpY2UobWVhc3VyZXMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lYXN1cmVzLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gbWVhc3VyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSArIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpIC0gMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuZGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBpaSA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBqaiA9IDAsXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBjcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIG1hdHJpeCA9IHRoaXMuY3JlYXRlTXVsdGlDaGFydChjcm9zc3RhYiksXG4gICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3dMYXN0Q2hhcnQgPSBjcm9zc3RhYltpXVtjcm9zc3RhYltpXS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChyb3dMYXN0Q2hhcnQubWF4IHx8IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgcm93TGFzdENoYXJ0Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSByb3dMYXN0Q2hhcnQubWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSByb3dMYXN0Q2hhcnQubWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IG1hdHJpeFtpXSxcbiAgICAgICAgICAgICAgICByb3dBeGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXSxcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50ID0gY3Jvc3N0YWJbaV1bal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJiBjcm9zc3RhYkVsZW1lbnQuY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0F4aXMgPSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jaGFydENvbmZpZy5kYXRhU291cmNlLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YUFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNvbmZpZy5jaGFydC5jb25maWd1cmF0aW9uID0gYWRhcHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMudXBkYXRlKHJvd0F4aXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm93QXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbWl0cyA9IHJvd0F4aXMuY2hhcnQuY2hhcnRPYmouZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQgPSB0aGlzLmdldENoYXJ0T2JqKGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaClbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbmZpZy5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudXBkYXRlKGNlbGwuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgd2luZG93LmN0UGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50MTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcjtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChyb3dGaWx0ZXIsIGNvbEZpbHRlcikge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gW10sXG4gICAgICAgICAgICAvLyBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICAvLyBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlckNmZyA9IHt9LFxuICAgICAgICAgICAgYWRhcHRlciA9IHt9LFxuICAgICAgICAgICAgbGltaXRzID0ge30sXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA+IG1heCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdIDwgbWluKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhc3RvcmU6IGZpbHRlcmVkRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgbGltaXRzID0gYWRhcHRlci5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGFkYXB0ZXJcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGxldCBlbmRcbiAgICAgICAgcGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlclsxXTtcbiAgICAgICAgLy8gT21pdHRpbmcgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgZGltZW5zaW9ucyA9IGRpbWVuc2lvbnMuc2xpY2UoMCwgZGltZW5zaW9ucy5sZW5ndGggLSAxKTtcbiAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IGRpbWVuc2lvbnMubGVuZ3RoO1xuICAgICAgICAvLyBTZXR0aW5nIHVwIGRpbWVuc2lvbiBob2xkZXJcbiAgICAgICAgZGltZW5zaW9uc0hvbGRlciA9IHBsYWNlSG9sZGVyLnNsaWNlKDAsIGRpbWVuc2lvbnNMZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbWVuc2lvbnNMZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGVsID0gZGltZW5zaW9uc0hvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICBpdGVtID0gZGltZW5zaW9uc0hvbGRlcltpXTtcbiAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgIGl0ZW0ucmVkWm9uZSA9IGl0ZW0ub3JpZ0xlZnQgKyBwYXJzZUludChlbC5zdHlsZS53aWR0aCkgLyAyO1xuICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICBpdGVtLm9yaWdaID0gZWwuc3R5bGUuekluZGV4O1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoYW5nZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gaXRlbS5vcmlnWjtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgZm9yICg7IGogPCBkaW1lbnNpb25zTGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZGltZW5zaW9uc1tqXSAhPT0gZGltZW5zaW9uc0hvbGRlcltqXS5jZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGltZW5zaW9uc1tqXSA9IGRpbWVuc2lvbnNIb2xkZXJbal0uY2VsbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gZGltZW5zaW9uc0hvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgdHJkID0gZHJhZ0l0ZW0ucmVkWm9uZSxcbiAgICAgICAgICAgICAgICB0bCA9IGRyYWdJdGVtLm9yaWdMZWZ0LFxuICAgICAgICAgICAgICAgIHRpID0gZHJhZ0l0ZW0uaW5kZXgsXG4gICAgICAgICAgICAgICAgdGVtcCA9IHt9LFxuICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW07XG4gICAgICAgICAgICBmb3IgKGkgPSBpbmRleDsgaS0tOykge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBkaW1lbnNpb25zSG9sZGVyW2ldO1xuICAgICAgICAgICAgICAgIG5leHRJdGVtID0gZGltZW5zaW9uc0hvbGRlcltpICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpIDwgaXRlbS5yZWRab25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyZCA9IGl0ZW0ucmVkWm9uZTtcbiAgICAgICAgICAgICAgICAgICAgdGwgPSBpdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB0aSA9IGl0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmFkanVzdCArPSBwYXJzZUludChpdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5vcmlnTGVmdCA9IG5leHRJdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBuZXh0SXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gbmV4dEl0ZW0uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wID0gZGltZW5zaW9uc0hvbGRlcltpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXJbaSArIDFdID0gZGltZW5zaW9uc0hvbGRlcltpXTtcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uc0hvbGRlcltpXSA9IHRlbXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0dGluZyBuZXcgdmFsdWVzIGZvciBkcmFnaXRlbVxuICAgICAgICAgICAgZHJhZ0l0ZW0ub3JpZ0xlZnQgPSB0bDtcbiAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSB0cmQ7XG4gICAgICAgICAgICBkcmFnSXRlbS5pbmRleCA9IHRpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldHVwRHJhZyAoZWwsIGhhbmRsZXIsIGhhbmRsZXIyKSB7XG4gICAgICAgIGxldCB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICBmdW5jdGlvbiBjdXN0b21IYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGUuY2xpZW50WCAtIHgsIGUuY2xpZW50WSAtIHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgeSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoaGFuZGxlcjIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9