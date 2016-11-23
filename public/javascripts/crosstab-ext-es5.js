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
	        key: 'dragListener',
	        value: function dragListener(placeHolder) {
	            var _this3 = this;
	
	            // Getting only labels
	            var origData = this.storeParams.data,
	                origConfig = this.storeParams.config,
	                dimensions = origConfig.dimensions || [],
	                measures = origConfig.measures || [],
	                dimensionsLength = 0,
	                measuresLength = 0,
	                dimensionsHolder = void 0,
	                self = this;
	            // let end
	            placeHolder = placeHolder[1];
	            // Omitting last dimension
	            dimensions = dimensions.slice(0, dimensions.length - 1);
	            dimensionsLength = dimensions.length;
	            measuresLength = measures.length;
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
	                        if (self.dimensions[i] !== dimensionsHolder[i].cellValue) {
	                            self.dimensions[i] = dimensionsHolder[i].cellValue;
	                            change = true;
	                        }
	                    }
	                    if (change) {
	                        self.globalData = self.buildGlobalData();
	                        self.renderCrosstab();
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
	            });
	            window.document.addEventListener('mouseup', function (e) {
	                el.style.opacity = 1;
	                handler2();
	                window.document.removeEventListener('mousemove', customHandler);
	            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjVlN2U2MzAxOTI3MDUwZDAyMmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNyb3NzdGFiQ29udGFpbmVyIiwiYWdncmVnYXRpb24iLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsInN0b3JlUGFyYW1zIiwiZ2xvYmFsRGF0YSIsImJ1aWxkR2xvYmFsRGF0YSIsImNvbHVtbktleUFyciIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY291bnQiLCJheGVzIiwiRkNEYXRhRmlsdGVyRXh0IiwiZmlsdGVyQ29uZmlnIiwiZGF0YUZpbHRlckV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZCIsImdldEtleXMiLCJmaWVsZHMiLCJpIiwiaWkiLCJsZW5ndGgiLCJnZXRVbmlxdWVWYWx1ZXMiLCJ0YWJsZSIsInJvd09yZGVyIiwiY3VycmVudEluZGV4IiwiZmlsdGVyZWREYXRhU3RvcmUiLCJyb3dzcGFuIiwiZmllbGRDb21wb25lbnQiLCJmaWVsZFZhbHVlcyIsImwiLCJyb3dFbGVtZW50IiwiaGFzRnVydGhlckRlcHRoIiwiZmlsdGVyZWREYXRhSGFzaEtleSIsImNvbExlbmd0aCIsImh0bWxSZWYiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsIm1pbm1heE9iaiIsImNsYXNzU3RyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJ0b0xvd2VyQ2FzZSIsInZpc2liaWxpdHkiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb3JuZXJXaWR0aCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJoZWlnaHQiLCJjb2xzcGFuIiwiaHRtbCIsIm91dGVySFRNTCIsImNsYXNzTmFtZSIsInB1c2giLCJjcmVhdGVSb3ciLCJhZGFwdGVyQ2ZnIiwiYWRhcHRlciIsImRhdGFhZGFwdGVyIiwiaiIsImNoYXJ0Q2VsbE9iaiIsInJvd0hhc2giLCJjb2xIYXNoIiwiZ2V0Q2hhcnRPYmoiLCJwYXJzZUludCIsIm1lYXN1cmVPcmRlciIsImNvbEVsZW1lbnQiLCJjb3JuZXJIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjb2xPcmRlckxlbmd0aCIsImNvcm5lckNlbGxBcnIiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsImluZGV4IiwibWF4TGVuZ3RoIiwidW5zaGlmdCIsInNlbGYiLCJvYmoiLCJmaWx0ZXIiLCJ2YWwiLCJhcnIiLCJjb2xPcmRlciIsInhBeGlzUm93IiwiY3JlYXRlUm93RGltSGVhZGluZyIsImNyZWF0ZUNvbERpbUhlYWRpbmciLCJjcmVhdGVDb2wiLCJjYXRlZ29yaWVzIiwiY3JlYXRlQ2FwdGlvbiIsInN1YmplY3QiLCJ0YXJnZXQiLCJidWZmZXIiLCJzcGxpY2UiLCJpbmRleE9mIiwiTWF0aCIsImNyZWF0ZUNyb3NzdGFiIiwiZmlsdGVycyIsImpqIiwibWF0Y2hlZFZhbHVlcyIsImZpbHRlckdlbiIsInRvU3RyaW5nIiwiZmlsdGVyVmFsIiwiciIsImdsb2JhbEFycmF5IiwibWFrZUdsb2JhbEFycmF5IiwicmVjdXJzZSIsInNsaWNlIiwidGVtcE9iaiIsInRlbXBBcnIiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIm1lYXN1cmUiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY3JlYXRlRmlsdGVycyIsImRhdGFDb21ib3MiLCJjcmVhdGVEYXRhQ29tYm9zIiwiaGFzaE1hcCIsImRhdGFDb21ibyIsInZhbHVlIiwibGVuIiwiayIsIm1hdHJpeCIsImNyZWF0ZU11bHRpQ2hhcnQiLCJ0MiIsImdsb2JhbE1heCIsImdsb2JhbE1pbiIsInJvd0xhc3RDaGFydCIsInJvdyIsInJvd0F4aXMiLCJjZWxsIiwiY3Jvc3N0YWJFbGVtZW50IiwidHlwZSIsImF4aXNUeXBlIiwiY29uZmlndXJhdGlvbiIsInVwZGF0ZSIsImxpbWl0cyIsImNoYXJ0T2JqIiwiZ2V0TGltaXRzIiwibWluTGltaXQiLCJtYXhMaW1pdCIsIkZDanNvbiIsInlBeGlzTWluVmFsdWUiLCJ5QXhpc01heFZhbHVlIiwiY3RQZXJmIiwiZXZ0IiwiY2VsbEFkYXB0ZXIiLCJjYXRlZ29yeSIsImNhdGVnb3J5VmFsIiwiaGlnaGxpZ2h0IiwibXVsdGljaGFydE9iamVjdCIsInVuZGVmaW5lZCIsImNyZWF0ZU1hdHJpeCIsImRyYXciLCJkcmFnTGlzdGVuZXIiLCJwbGFjZUhvbGRlciIsInJlc3VsdHMiLCJwZXJtdXRlIiwibWVtIiwiY3VycmVudCIsImNvbmNhdCIsImpvaW4iLCJwZXJtdXRlU3RycyIsImZpbHRlclN0ciIsInNwbGl0Iiwia2V5UGVybXV0YXRpb25zIiwicGVybXV0ZUFyciIsInJvd0ZpbHRlciIsImNvbEZpbHRlciIsInJvd0ZpbHRlcnMiLCJkYXRhUHJvY2Vzc29ycyIsImRhdGFQcm9jZXNzb3IiLCJtYXRjaGVkSGFzaGVzIiwiZmlsdGVyZWREYXRhIiwiYXBwbHkiLCJtYXRjaEhhc2giLCJjcmVhdGVEYXRhUHJvY2Vzc29yIiwiZ2V0RGF0YSIsImRpbWVuc2lvbiIsInNlcmllc1R5cGUiLCJhZ2dyZWdhdGVNb2RlIiwiZGF0YXN0b3JlIiwiZ2V0TGltaXQiLCJvcmlnRGF0YSIsIm9yaWdDb25maWciLCJkaW1lbnNpb25zTGVuZ3RoIiwibWVhc3VyZXNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwiZWwiLCJncmFwaGljcyIsIml0ZW0iLCJjZWxsVmFsdWUiLCJvcmlnTGVmdCIsImxlZnQiLCJyZWRab25lIiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsImRyYWdJdGVtIiwidHJkIiwidGwiLCJ0aSIsInRlbXAiLCJuZXh0SXRlbSIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwib3BhY2l0eSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3RDQSxLQUFNQSxjQUFjLG1CQUFBQyxDQUFRLENBQVIsQ0FBcEI7QUFBQSxLQUNJQyxPQUFPLG1CQUFBRCxDQUFRLENBQVIsQ0FEWDs7QUFHQSxLQUFJRSxTQUFTO0FBQ1RDLGlCQUFZLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsTUFBckIsRUFBNkIsT0FBN0IsQ0FESDtBQUVUQyxlQUFVLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsUUFBckIsQ0FGRDtBQUdUQyxnQkFBVyxVQUhGO0FBSVRDLG9CQUFlLHFCQUpOO0FBS1RDLG1CQUFjLEtBTEw7QUFNVEMsZ0JBQVcsR0FORjtBQU9UQyxpQkFBWSxHQVBIO0FBUVRDLHdCQUFtQixjQVJWO0FBU1RDLGtCQUFhLEtBVEo7QUFVVEMsa0JBQWE7QUFDVEMsZ0JBQU87QUFDSCwy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O0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBbm1CYSxFQTZtQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmNWU3ZTYzMDE5MjcwNTBkMDIyYyIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdNb250aCcsICdZZWFyJywgJ1N0YXRlJ10sXG4gICAgbWVhc3VyZXM6IFsnU2FsZScsICdWaXNpdG9ycycsICdQcm9maXQnXSxcbiAgICBjaGFydFR5cGU6ICdjb2x1bW4yZCcsXG4gICAgbm9EYXRhTWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheS4nLFxuICAgIG1lYXN1cmVPblJvdzogZmFsc2UsXG4gICAgY2VsbFdpZHRoOiAxMjAsXG4gICAgY2VsbEhlaWdodDogMTAwLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcbiAgICBhZ2dyZWdhdGlvbjogJ3N1bScsXG4gICAgY2hhcnRDb25maWc6IHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICdzaG93Qm9yZGVyJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVUaGlja25lc3MnOiAnMScsXG4gICAgICAgICAgICAnc2hvd1plcm9QbGFuZVZhbHVlJzogJzEnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnI0I1QjlCQScsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnZHJhd1RyZW5kUmVnaW9uJzogJzEnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICAvLyBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICAgICAgdGhpcy50MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb247XG4gICAgICAgIHRoaXMuYXhlcyA9IFtdO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcbiAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcigndGVtcEV2ZW50JywgKGUsIGQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGdsb2JhbCBkYXRhIGZyb20gdGhlIGRhdGEgc3RvcmUgZm9yIGludGVybmFsIHVzZS5cbiAgICAgKi9cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpLFxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gdGhpcy5kYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgcm93RWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGgsXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBtaW5tYXhPYmogPSB7fTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCh0aGlzLmNlbGxIZWlnaHQgLSAxMCkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4XS50b0xvd2VyQ2FzZSgpICtcbiAgICAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHJvd0VsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29ybmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd5LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5jb2x1bW5LZXlBcnJbal1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWF4ID0gbWF4O1xuICAgICAgICAgICAgICAgICAgICBjaGFydENlbGxPYmoubWluID0gbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgLy8gICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAvLyAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAvLyAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgLy8gICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgIC8vICAgICAgICAgY29sRWxlbWVudCxcbiAgICAvLyAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgLy8gICAgICAgICBodG1sUmVmO1xuXG4gICAgLy8gICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgLy8gICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgLy8gICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcbiAgICAvLyAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgLy8gICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgIC8vICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgLy8gICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAvLyAgICAgICAgICAgICAnICcgKyB0aGlzLm1lYXN1cmVzW2N1cnJlbnRJbmRleF0gK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgLy8gICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgIC8vICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgLy8gICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAvLyAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgIC8vICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAvLyAgICAgICAgIH07XG5cbiAgICAvLyAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgLy8gICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAvLyAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAvLyAgICAgICAgICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgLy8gfVxuXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnLFxuICAgICAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gbWVhc3VyZU9yZGVyW2ldO1xuICAgICAgICAgICAgICAgIC8vIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF07XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZENvbXBvbmVudDtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICAgICAgdGFibGVbMF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIC8vIHRhYmxlW2ldLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIpO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlUm93RGltSGVhZGluZyAodGFibGUsIGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuZGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5kaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZGltZW5zaW9uc1tpXSAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY29ybmVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ybmVyQ2VsbEFycjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2xEaW1IZWFkaW5nICh0YWJsZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGkgPSBpbmRleCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG4gICAgICAgIGZvciAoOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIHRhYmxlW2ldLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWhlYWRlci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNhcHRpb24gKHRhYmxlLCBtYXhMZW5ndGgpIHtcbiAgICAgICAgbGV0IGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgIHRhYmxlLnVuc2hpZnQoW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY2FwdGlvbi1jaGFydCcsXG4gICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2NhcHRpb24nLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29sT3JkZXIgPSB0aGlzLm1lYXN1cmVzLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlUm93RGltSGVhZGluZyh0YWJsZSwgY29sT3JkZXIubGVuZ3RoKSk7XG4gICAgICAgICAgICAvLyB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNvbERpbUhlYWRpbmcodGFibGUsIDApO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4dHJhIGNlbGwgZm9yIHkgYXhpcy4gRXNzZW50aWFsbHkgWSBheGlzIGZvb3Rlci5cbiAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdheGlzLWZvb3Rlci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2FudmFzUGFkZGluZyc6IDEzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3gtYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNhcHRpb24odGFibGUsIG1heExlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFibGUucHVzaChbe1xuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5tZWFzdXJlcy5sZW5ndGhcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgcm93RGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5kaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMuc3BsaWNlKGRpbWVuc2lvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBkaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gZGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1tpICsgMV0gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSAtIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgY29sRGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBtZWFzdXJlcyA9IHRoaXMubWVhc3VyZXM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1lYXN1cmVzLnNwbGljZShtZWFzdXJlcy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVhc3VyZXMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBtZWFzdXJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpICsgMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gbWVhc3VyZXNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2kgLSAxXSA9IG1lYXN1cmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVhc3VyZXNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5kaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5tZWFzdXJlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGlpID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIGpqID0gMCxcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXM7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgbWF0cml4ID0gdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KGNyb3NzdGFiKSxcbiAgICAgICAgICAgIHQyID0gcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICAgICAgICBnbG9iYWxNYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICBnbG9iYWxNaW4gPSBJbmZpbml0eTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvd0xhc3RDaGFydCA9IGNyb3NzdGFiW2ldW2Nyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gbWF0cml4W2ldLFxuICAgICAgICAgICAgICAgIHJvd0F4aXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdLFxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQgPSBjcm9zc3RhYltpXVtqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydC50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzLmNoYXJ0LmNoYXJ0Q29uZmlnLmRhdGFTb3VyY2UuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY29uZmlnLmNoYXJ0LmNvbmZpZ3VyYXRpb24gPSBhZGFwdGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy51cGRhdGUocm93QXhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSB8fCBjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWF4VmFsdWUgPSBtYXhMaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY29uZmlnLmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgKz0gKHBlcmZvcm1hbmNlLm5vdygpIC0gdDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY2VsbC5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHQyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IGNyb3NzdGFiW2ldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHJvd1tqXS5jaGFydC50eXBlID09PSAnY2FwdGlvbicgfHwgcm93W2pdLmNoYXJ0LnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LmNvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlTXVsdGlDaGFydCAobWF0cml4KSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpY2hhcnRPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID0gdGhpcy5tYy5jcmVhdGVNYXRyaXgodGhpcy5jcm9zc3RhYkNvbnRhaW5lciwgbWF0cml4KTtcbiAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMudDE7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QuZHJhdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZShtYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKHRoaXMubXVsdGljaGFydE9iamVjdC5wbGFjZUhvbGRlcik7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAocm93RmlsdGVyLCBjb2xGaWx0ZXIpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXREYXRhKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVtmaWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpO1xuICAgICAgICAgICAgLy8gZm9yIChsZXQgaSA9IDAsIGlpID0gZmlsdGVyZWRKU09OLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIC8vICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl0gPiBtYXgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgbWF4ID0gZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl07XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA8IG1pbikge1xuICAgICAgICAgICAgLy8gICAgICAgICBtaW4gPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YXN0b3JlOiBmaWx0ZXJlZERhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhYWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGFkYXB0ZXIuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiBhZGFwdGVyXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYWdMaXN0ZW5lciAocGxhY2VIb2xkZXIpIHtcbiAgICAgICAgLy8gR2V0dGluZyBvbmx5IGxhYmVsc1xuICAgICAgICBsZXQgb3JpZ0RhdGEgPSB0aGlzLnN0b3JlUGFyYW1zLmRhdGEsXG4gICAgICAgICAgICBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBtZWFzdXJlc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGxldCBlbmRcbiAgICAgICAgcGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlclsxXTtcbiAgICAgICAgLy8gT21pdHRpbmcgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgZGltZW5zaW9ucyA9IGRpbWVuc2lvbnMuc2xpY2UoMCwgZGltZW5zaW9ucy5sZW5ndGggLSAxKTtcbiAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IGRpbWVuc2lvbnMubGVuZ3RoO1xuICAgICAgICBtZWFzdXJlc0xlbmd0aCA9IG1lYXN1cmVzLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1lbnNpb25zTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBlbCA9IGRpbWVuc2lvbnNIb2xkZXJbaV0uZ3JhcGhpY3MsXG4gICAgICAgICAgICAgICAgaXRlbSA9IGRpbWVuc2lvbnNIb2xkZXJbaV07XG4gICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBpO1xuICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwRHJhZyhpdGVtLmdyYXBoaWNzLCBmdW5jdGlvbiBkcmFnU3RhcnQgKGR4LCBkeSkge1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgZHggKyBpdGVtLmFkanVzdCArICdweCc7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGRyYWdFbmQgKCkge1xuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgZGltZW5zaW9uc0xlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmRpbWVuc2lvbnNbaV0gIT09IGRpbWVuc2lvbnNIb2xkZXJbaV0uY2VsbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRpbWVuc2lvbnNbaV0gPSBkaW1lbnNpb25zSG9sZGVyW2ldLmNlbGxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdsb2JhbERhdGEgPSBzZWxmLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWFuYWdlU2hpZnRpbmcgKGluZGV4KSB7XG4gICAgICAgICAgICBsZXQgaSA9IDAsXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSBkaW1lbnNpb25zSG9sZGVyW2luZGV4XSxcbiAgICAgICAgICAgICAgICB0cmQgPSBkcmFnSXRlbS5yZWRab25lLFxuICAgICAgICAgICAgICAgIHRsID0gZHJhZ0l0ZW0ub3JpZ0xlZnQsXG4gICAgICAgICAgICAgICAgdGkgPSBkcmFnSXRlbS5pbmRleCxcbiAgICAgICAgICAgICAgICB0ZW1wID0ge30sXG4gICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICBuZXh0SXRlbTtcbiAgICAgICAgICAgIGZvciAoaSA9IGluZGV4OyBpLS07KSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGRpbWVuc2lvbnNIb2xkZXJbaV07XG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBkaW1lbnNpb25zSG9sZGVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPCBpdGVtLnJlZFpvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJkID0gaXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICB0bCA9IGl0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRpID0gaXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uYWRqdXN0ICs9IHBhcnNlSW50KGl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVkWm9uZSA9IG5leHRJdGVtLnJlZFpvbmU7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBuZXh0SXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSBkaW1lbnNpb25zSG9sZGVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uc0hvbGRlcltpICsgMV0gPSBkaW1lbnNpb25zSG9sZGVyW2ldO1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyW2ldID0gdGVtcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHRsO1xuICAgICAgICAgICAgZHJhZ0l0ZW0ucmVkWm9uZSA9IHRyZDtcbiAgICAgICAgICAgIGRyYWdJdGVtLmluZGV4ID0gdGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBEcmFnIChlbCwgaGFuZGxlciwgaGFuZGxlcjIpIHtcbiAgICAgICAgbGV0IHggPSAwLFxuICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZS5jbGllbnRYIC0geCwgZS5jbGllbnRZIC0geSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgaGFuZGxlcjIoKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDksXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDEzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDExXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhcmdlRGF0YS5qcyJdLCJzb3VyY2VSb290IjoiIn0=