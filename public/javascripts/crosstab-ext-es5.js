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
	    measures: ['Profit', 'Visitors', 'Sale'],
	    chartType: 'column2d',
	    noDataMessage: 'No data to display.',
	    measureOnRow: false,
	    cellWidth: 210,
	    cellHeight: 113,
	    showFilter: false,
	    draggableHeaders: false,
	    crosstabContainer: 'crosstab-div',
	    aggregation: 'sum',
	    chartConfig: {
	        chart: {
	            'showBorder': '0',
	            'showValues': '0',
	            'divLineAlpha': '0',
	            'numberPrefix': '₹',
	            'rotateValues': '1',
	            'rollOverBandColor': '#B2B6DD',
	            'columnHoverColor': '#616FF9',
	            'chartBottomMargin': '10',
	            'chartTopMargin': '10',
	            'chartLeftMargin': '5',
	            'chartRightMargin': '5',
	            'zeroPlaneThickness': '1',
	            'showZeroPlaneValue': '1',
	            'zeroPlaneAlpha': '100',
	            'bgColor': '#FFFFFF',
	            'showXAxisLine': '1',
	            'plotBorderAlpha': '0',
	            'showXaxisValues': '0',
	            'showYAxisValues': '0',
	            'animation': '0',
	            'transposeAnimation': '1',
	            'alternateHGridAlpha': '0',
	            'plotColorInTooltip': '0',
	            'canvasBorderAlpha': '100',
	            'alternateVGridAlpha': '0',
	            'paletteColors': '#B5B9BA',
	            'usePlotGradientColor': '0',
	            'valueFontColor': '#FFFFFF',
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
	
	        this.eventList = {
	            'modelUpdated': 'modelupdated',
	            'modelDeleted': 'modeldeleted',
	            'metaInfoUpdate': 'metainfoupdated',
	            'processorUpdated': 'processorupdated',
	            'processorDeleted': 'processordeleted'
	        };
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
	        this.showFilter = config.showFilter;
	        this.draggableHeaders = config.draggableHeaders;
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
	        if (typeof FCDataFilterExt === 'function' && this.showFilter) {
	            var filterConfig = {};
	            this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box');
	        }
	        this.dataStore.addEventListener(this.eventList.modelUpdated, function (e, d) {
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
	                htmlRef.style.marginTop = '6px';
	                // htmlRef.style.marginTop = ((30 * this.measures.length - 15) / 2) + 'px';
	                document.body.appendChild(htmlRef);
	                classStr += 'column-dimensions' + ' ' + this.measures[i].toLowerCase() + ' no-select';
	                if (this.draggableHeaders) {
	                    classStr += ' draggable';
	                }
	                this.cornerHeight = htmlRef.offsetHeight;
	                document.body.removeChild(htmlRef);
	                colElement = {
	                    width: this.cellWidth,
	                    height: 30,
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
	                htmlRef.style.marginTop = '6px';
	                cornerCellArr.push({
	                    width: this.dimensions[i] * 10,
	                    height: 30,
	                    rowspan: 1,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: 'corner-cell no-select'
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
	                                            'chartBottomMargin': 10,
	                                            'chartTopMargin': 10
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
	            if (this.draggableHeaders) {
	                this.dragListener(this.multichartObject.placeHolder);
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
	                filteredData = this.dataStore.getChildModel(dataProcessors);
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
	                el.classList.add('dragging');
	                window.document.addEventListener('mousemove', customHandler);
	                window.document.addEventListener('mouseup', mouseUpHandler);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjJhZTk4MWFmOTRlNjZiODJlZDciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwibWVhc3VyZU9uUm93IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsInNob3dGaWx0ZXIiLCJkcmFnZ2FibGVIZWFkZXJzIiwiY3Jvc3N0YWJDb250YWluZXIiLCJhZ2dyZWdhdGlvbiIsImNoYXJ0Q29uZmlnIiwiY2hhcnQiLCJ3aW5kb3ciLCJjcm9zc3RhYiIsInJlbmRlckNyb3NzdGFiIiwibW9kdWxlIiwiZXhwb3J0cyIsImV2ZW50TGlzdCIsIk11bHRpQ2hhcnRpbmciLCJtYyIsImRhdGFTdG9yZSIsImNyZWF0ZURhdGFTdG9yZSIsInNldERhdGEiLCJkYXRhU291cmNlIiwidDEiLCJwZXJmb3JtYW5jZSIsIm5vdyIsInRlc3QiLCJhIiwic3RvcmVQYXJhbXMiLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiY29sdW1uS2V5QXJyIiwiaGFzaCIsImdldEZpbHRlckhhc2hNYXAiLCJjb3VudCIsImF4ZXMiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vZGVsVXBkYXRlZCIsImUiLCJkIiwiZ2V0S2V5cyIsImZpZWxkcyIsImkiLCJpaSIsImxlbmd0aCIsImdldFVuaXF1ZVZhbHVlcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwicHVzaCIsImNyZWF0ZVJvdyIsImFkYXB0ZXJDZmciLCJhZGFwdGVyIiwiZGF0YUFkYXB0ZXIiLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImNvcm5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsImNvbE9yZGVyTGVuZ3RoIiwiY29ybmVyQ2VsbEFyciIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiaW5kZXgiLCJtYXhMZW5ndGgiLCJ1bnNoaWZ0Iiwic2VsZiIsIm9iaiIsImZpbHRlciIsInZhbCIsImFyciIsImNvbE9yZGVyIiwieEF4aXNSb3ciLCJjcmVhdGVSb3dEaW1IZWFkaW5nIiwiY3JlYXRlQ29sRGltSGVhZGluZyIsImNyZWF0ZUNvbCIsImNhdGVnb3JpZXMiLCJjcmVhdGVDYXB0aW9uIiwic3ViamVjdCIsInRhcmdldCIsImJ1ZmZlciIsInNwbGljZSIsImluZGV4T2YiLCJNYXRoIiwiY3JlYXRlQ3Jvc3N0YWIiLCJmaWx0ZXJzIiwiamoiLCJtYXRjaGVkVmFsdWVzIiwiZmlsdGVyR2VuIiwidG9TdHJpbmciLCJmaWx0ZXJWYWwiLCJyIiwiZ2xvYmFsQXJyYXkiLCJtYWtlR2xvYmFsQXJyYXkiLCJyZWN1cnNlIiwic2xpY2UiLCJ0ZW1wT2JqIiwidGVtcEFyciIsImtleSIsImhhc093blByb3BlcnR5IiwibWVhc3VyZSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJjcmVhdGVGaWx0ZXJzIiwiZGF0YUNvbWJvcyIsImNyZWF0ZURhdGFDb21ib3MiLCJoYXNoTWFwIiwiZGF0YUNvbWJvIiwidmFsdWUiLCJsZW4iLCJrIiwibWF0cml4IiwiY3JlYXRlTXVsdGlDaGFydCIsInQyIiwiZ2xvYmFsTWF4IiwiZ2xvYmFsTWluIiwicm93TGFzdENoYXJ0Iiwicm93Iiwicm93QXhpcyIsImNlbGwiLCJjcm9zc3RhYkVsZW1lbnQiLCJ0eXBlIiwiYXhpc1R5cGUiLCJjb25maWd1cmF0aW9uIiwidXBkYXRlIiwibGltaXRzIiwiY2hhcnRPYmoiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiRkNqc29uIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJjdFBlcmYiLCJldnQiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50IiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sRmlsdGVyIiwicm93RmlsdGVycyIsImRhdGFQcm9jZXNzb3JzIiwiZGF0YVByb2Nlc3NvciIsIm1hdGNoZWRIYXNoZXMiLCJmaWx0ZXJlZERhdGEiLCJhcHBseSIsIm1hdGNoSGFzaCIsImNyZWF0ZURhdGFQcm9jZXNzb3IiLCJnZXRDaGlsZE1vZGVsIiwiZGltZW5zaW9uIiwic2VyaWVzVHlwZSIsImFnZ3JlZ2F0ZU1vZGUiLCJkYXRhc3RvcmUiLCJnZXRMaW1pdCIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZXR1cExpc3RlbmVyIiwiaG9sZGVyIiwiYXJyTGVuIiwiZ2xvYmFsQXJyIiwiZWwiLCJncmFwaGljcyIsIml0ZW0iLCJjZWxsVmFsdWUiLCJvcmlnTGVmdCIsImxlZnQiLCJyZWRab25lIiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwib3BhY2l0eSIsImNsYXNzTGlzdCIsImFkZCIsIm1vdXNlVXBIYW5kbGVyIiwicmVtb3ZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdENBLEtBQU1BLGNBQWMsbUJBQUFDLENBQVEsQ0FBUixDQUFwQjtBQUFBLEtBQ0lDLE9BQU8sbUJBQUFELENBQVEsQ0FBUixDQURYOztBQUdBLEtBQUlFLFNBQVM7QUFDVEMsaUJBQVksQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQURIO0FBRVRDLGVBQVUsQ0FBQyxRQUFELEVBQVcs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QVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQS9rQmEsRUF5bEJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXpsQmEsRUFtbUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsS0FKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQW5tQmEsRUE2bUJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLE1BTGY7QUFNSSxhQUFRLEVBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQTdtQmEsRUF1bkJiO0FBQ0ksZ0JBQVcsT0FEZjtBQUVJLGNBQVMsUUFGYjtBQUdJLGFBQVEsTUFIWjtBQUlJLGNBQVMsTUFKYjtBQUtJLGdCQUFXLFFBTGY7QUFNSSxhQUFRLENBTlo7QUFPSSxlQUFVLENBUGQ7QUFRSSxpQkFBWTtBQVJoQixFQXZuQmEsQ0FBakIsQyIsImZpbGUiOiJjcm9zc3RhYi1leHQtZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjJhZTk4MWFmOTRlNjZiODJlZDciLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICBkaW1lbnNpb25zOiBbJ1Byb2R1Y3QnLCAnU3RhdGUnLCAnTW9udGgnXSxcbiAgICBtZWFzdXJlczogWydQcm9maXQnLCAnVmlzaXRvcnMnLCAnU2FsZSddLFxuICAgIGNoYXJ0VHlwZTogJ2NvbHVtbjJkJyxcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5LicsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDIxMCxcbiAgICBjZWxsSGVpZ2h0OiAxMTMsXG4gICAgc2hvd0ZpbHRlcjogZmFsc2UsXG4gICAgZHJhZ2dhYmxlSGVhZGVyczogZmFsc2UsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdkaXZMaW5lQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgJ3JvbGxPdmVyQmFuZENvbG9yJzogJyNCMkI2REQnLFxuICAgICAgICAgICAgJ2NvbHVtbkhvdmVyQ29sb3InOiAnIzYxNkZGOScsXG4gICAgICAgICAgICAnY2hhcnRCb3R0b21NYXJnaW4nOiAnMTAnLFxuICAgICAgICAgICAgJ2NoYXJ0VG9wTWFyZ2luJzogJzEwJyxcbiAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnY2hhcnRSaWdodE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICd6ZXJvUGxhbmVUaGlja25lc3MnOiAnMScsXG4gICAgICAgICAgICAnc2hvd1plcm9QbGFuZVZhbHVlJzogJzEnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcwJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnI0I1QjlCQScsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI0ZGRkZGRicsXG4gICAgICAgICAgICAnZHJhd1RyZW5kUmVnaW9uJzogJzEnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICB3aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbiAgICB3aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8qKlxuICogUmVwcmVzZW50cyBhIGNyb3NzdGFiLlxuICovXG5jbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdCA9IHtcbiAgICAgICAgICAgICdtb2RlbFVwZGF0ZWQnOiAnbW9kZWx1cGRhdGVkJyxcbiAgICAgICAgICAgICdtb2RlbERlbGV0ZWQnOiAnbW9kZWxkZWxldGVkJyxcbiAgICAgICAgICAgICdtZXRhSW5mb1VwZGF0ZSc6ICdtZXRhaW5mb3VwZGF0ZWQnLFxuICAgICAgICAgICAgJ3Byb2Nlc3NvclVwZGF0ZWQnOiAncHJvY2Vzc29ydXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yRGVsZXRlZCc6ICdwcm9jZXNzb3JkZWxldGVkJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBpZiAodHlwZW9mIE11bHRpQ2hhcnRpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JlUGFyYW1zID0ge1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5zaG93RmlsdGVyID0gY29uZmlnLnNob3dGaWx0ZXI7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVhZGVycyA9IGNvbmZpZy5kcmFnZ2FibGVIZWFkZXJzO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBjb25maWcuZGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5tZWFzdXJlcyA9IGNvbmZpZy5tZWFzdXJlcztcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWdncmVnYXRpb24gPSBjb25maWcuYWdncmVnYXRpb247XG4gICAgICAgIHRoaXMuYXhlcyA9IFtdO1xuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcbiAgICAgICAgaWYgKHR5cGVvZiBGQ0RhdGFGaWx0ZXJFeHQgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5zaG93RmlsdGVyKSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XG4gICAgICAgICAgICB0aGlzLmRhdGFGaWx0ZXJFeHQgPSBuZXcgRkNEYXRhRmlsdGVyRXh0KHRoaXMuZGF0YVN0b3JlLCBmaWx0ZXJDb25maWcsICdjb250cm9sLWJveCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudExpc3QubW9kZWxVcGRhdGVkLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZ2xvYmFsIGRhdGEgZnJvbSB0aGUgZGF0YSBzdG9yZSBmb3IgaW50ZXJuYWwgdXNlLlxuICAgICAqL1xuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdyb3ctZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXhdLnRvTG93ZXJDYXNlKCkgK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLmRpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ktYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0hhc2g6IGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAvLyAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgIC8vICAgICAgICAgZmllbGRDb21wb25lbnQgPSBjb2xPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgIC8vICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAvLyAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgLy8gICAgICAgICBjb2xFbGVtZW50LFxuICAgIC8vICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKGNvbE9yZGVyLmxlbmd0aCAtIDEpLFxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAvLyAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAvLyAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAvLyAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAvLyAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xuICAgIC8vICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAvLyAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgLy8gICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIC8vICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAvLyAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgIC8vICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbY3VycmVudEluZGV4XSArXG4gICAgLy8gICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICAvLyAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgIC8vICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAvLyAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgLy8gICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcbiAgICAvLyAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgIC8vICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgLy8gICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgLy8gICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgIC8vICAgICAgICAgfTtcblxuICAgIC8vICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAvLyAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgIC8vICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgIC8vICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gY29sc3BhbjtcbiAgICAvLyB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBtZWFzdXJlT3JkZXIpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgaSwgbCA9IHRoaXMubWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJycsXG4gICAgICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBtZWFzdXJlT3JkZXJbaV07XG4gICAgICAgICAgICAgICAgLy8gZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XTtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzZweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLm1lYXN1cmVzW2ldLnRvTG93ZXJDYXNlKCkgKyAnIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICAvLyB0YWJsZVtpXS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAvLyAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZVJvd0RpbUhlYWRpbmcgKHRhYmxlLCBjb2xPcmRlckxlbmd0aCkge1xuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNnB4JztcbiAgICAgICAgICAgIGNvcm5lckNlbGxBcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuZGltZW5zaW9uc1tpXSAqIDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbERpbUhlYWRpbmcgKHRhYmxlLCBpbmRleCkge1xuICAgICAgICB2YXIgaSA9IGluZGV4LFxuICAgICAgICAgICAgaHRtbFJlZjtcbiAgICAgICAgZm9yICg7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAodGFibGUsIG1heExlbmd0aCkge1xuICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMubWVhc3VyZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFibGUgPSBbXSxcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVSb3dEaW1IZWFkaW5nKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ29sRGltSGVhZGluZyh0YWJsZSwgMCk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYmxhbmstY2VsbCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXh0cmEgY2VsbCBmb3IgeSBheGlzLiBFc3NlbnRpYWxseSBZIGF4aXMgZm9vdGVyLlxuICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtZm9vdGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneC1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ2FwdGlvbih0YWJsZSwgbWF4TGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XG4gICAgICAgICAgICAgICAgaHRtbDogJzxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+JyArIHRoaXMubm9EYXRhTWVzc2FnZSArICc8L3A+JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLm1lYXN1cmVzLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICByb3dEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5zcGxpY2UoZGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IGRpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgKyAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gZGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uc1tpIC0gMV0gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBjb2xEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gdGhpcy5tZWFzdXJlcztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWVhc3VyZXMuc3BsaWNlKG1lYXN1cmVzLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWFzdXJlcy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IG1lYXN1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gbWVhc3VyZXNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2kgKyAxXSA9IG1lYXN1cmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVhc3VyZXNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSAtIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmRpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaWkgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgamogPSAwLFxuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xuICAgICAgICBsZXQgY3Jvc3N0YWIgPSB0aGlzLmNyZWF0ZUNyb3NzdGFiKCksXG4gICAgICAgICAgICBtYXRyaXggPSB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoY3Jvc3N0YWIpLFxuICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgICAgICAgIGdsb2JhbE1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIGdsb2JhbE1pbiA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gY3Jvc3N0YWJbaV1bY3Jvc3N0YWJbaV0ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAocm93TGFzdENoYXJ0Lm1heCB8fCByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IHJvd0xhc3RDaGFydC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF4ID0gcm93TGFzdENoYXJ0Lm1heDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1pbiA+IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWluID0gcm93TGFzdENoYXJ0Lm1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBtYXRyaXhbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdO1xuICAgICAgICAgICAgICAgIGlmIChjcm9zc3RhYkVsZW1lbnQuY2hhcnQgJiYgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0F4aXMuY2hhcnQuY2hhcnRDb25maWcuZGF0YVNvdXJjZS5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IGdsb2JhbE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1heCc6IGdsb2JhbE1heCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAxMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YUFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNvbmZpZy5jaGFydC5jb25maWd1cmF0aW9uID0gYWRhcHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMudXBkYXRlKHJvd0F4aXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm93QXhpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbWl0cyA9IHJvd0F4aXMuY2hhcnQuY2hhcnRPYmouZ2V0TGltaXRzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQgPSB0aGlzLmdldENoYXJ0T2JqKGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaClbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLkZDanNvbi5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbmZpZy5jaGFydCA9IGNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudXBkYXRlKGNlbGwuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbEFkYXB0ZXIgPSByb3dbal0uY2hhcnQuY29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5ID0gdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5VmFsID0gZGF0YS5kYXRhW2NhdGVnb3J5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KGNhdGVnb3J5VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1jLmFkZEV2ZW50TGlzdGVuZXIoJ2hvdmVyb3V0JywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0cml4Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tqXS5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LnR5cGUgPT09ICdjYXB0aW9uJyB8fCByb3dbal0uY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgd2luZG93LmN0UGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50MTtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlSGVhZGVycykge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIodGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIC8vIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIC8vIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge30sXG4gICAgICAgICAgICBhZGFwdGVyID0ge30sXG4gICAgICAgICAgICBsaW1pdHMgPSB7fSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSB0aGlzLmhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCB0aGlzLmhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2hpbGRNb2RlbChkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICAvLyBmaWx0ZXJlZEpTT04gPSBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpO1xuICAgICAgICAgICAgLy8gZm9yIChsZXQgaSA9IDAsIGlpID0gZmlsdGVyZWRKU09OLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIC8vICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl0gPiBtYXgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgbWF4ID0gZmlsdGVyZWRKU09OW2ldW2NvbEZpbHRlcl07XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA8IG1pbikge1xuICAgICAgICAgICAgLy8gICAgICAgICBtaW4gPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IFt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YXN0b3JlOiBmaWx0ZXJlZERhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGFkYXB0ZXIuZ2V0TGltaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICdtYXgnOiBsaW1pdHMubWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBsaW1pdHMubWluXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiBhZGFwdGVyXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYWdMaXN0ZW5lciAocGxhY2VIb2xkZXIpIHtcbiAgICAgICAgLy8gR2V0dGluZyBvbmx5IGxhYmVsc1xuICAgICAgICBsZXQgb3JpZ0NvbmZpZyA9IHRoaXMuc3RvcmVQYXJhbXMuY29uZmlnLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG9yaWdDb25maWcuZGltZW5zaW9ucyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzID0gb3JpZ0NvbmZpZy5tZWFzdXJlcyB8fCBbXSxcbiAgICAgICAgICAgIG1lYXN1cmVzTGVuZ3RoID0gbWVhc3VyZXMubGVuZ3RoLFxuICAgICAgICAgICAgZGltZW5zaW9uc0xlbmd0aCA9IDAsXG4gICAgICAgICAgICBkaW1lbnNpb25zSG9sZGVyLFxuICAgICAgICAgICAgbWVhc3VyZXNIb2xkZXIsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gbGV0IGVuZFxuICAgICAgICBwbGFjZUhvbGRlciA9IHBsYWNlSG9sZGVyWzFdO1xuICAgICAgICAvLyBPbWl0dGluZyBsYXN0IGRpbWVuc2lvblxuICAgICAgICBkaW1lbnNpb25zID0gZGltZW5zaW9ucy5zbGljZSgwLCBkaW1lbnNpb25zLmxlbmd0aCAtIDEpO1xuICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gZGltZW5zaW9ucy5sZW5ndGg7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgZGltZW5zaW9uIGhvbGRlclxuICAgICAgICBkaW1lbnNpb25zSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoMCwgZGltZW5zaW9uc0xlbmd0aCk7XG4gICAgICAgIC8vIFNldHRpbmcgdXAgbWVhc3VyZXMgaG9sZGVyXG4gICAgICAgIG1lYXN1cmVzSG9sZGVyID0gcGxhY2VIb2xkZXIuc2xpY2UoZGltZW5zaW9uc0xlbmd0aCArIDEsIGRpbWVuc2lvbnNMZW5ndGggKyBtZWFzdXJlc0xlbmd0aCArIDEpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKGRpbWVuc2lvbnNIb2xkZXIsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNMZW5ndGgsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIobWVhc3VyZXNIb2xkZXIsIG1lYXN1cmVzLCBtZWFzdXJlc0xlbmd0aCwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgIGZ1bmN0aW9uIHNldHVwTGlzdGVuZXIgKGhvbGRlciwgYXJyLCBhcnJMZW4sIGdsb2JhbEFycikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IGhvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGhvbGRlcltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWRab25lID0gaXRlbS5vcmlnTGVmdCArIHBhcnNlSW50KGVsLnN0eWxlLndpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ1ogPSBlbC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgZHggKyBpdGVtLmFkanVzdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIGZhbHNlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBtYW5hZ2VTaGlmdGluZyhpdGVtLmluZGV4LCB0cnVlLCBob2xkZXIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIGRyYWdFbmQgKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSBpdGVtLm9yaWdaO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gaXRlbS5vcmlnTGVmdCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgYXJyTGVuOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxBcnJbal0gIT09IGhvbGRlcltqXS5jZWxsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxBcnJbal0gPSBob2xkZXJbal0uY2VsbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJDcm9zc3RhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYW5hZ2VTaGlmdGluZyAoaW5kZXgsIGlzUmlnaHQsIGhvbGRlcikge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gW10sXG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0gPSBob2xkZXJbaW5kZXhdLFxuICAgICAgICAgICAgICAgIG5leHRQb3MgPSBpc1JpZ2h0ID8gaW5kZXggKyAxIDogaW5kZXggLSAxLFxuICAgICAgICAgICAgICAgIG5leHRJdGVtID0gaG9sZGVyW25leHRQb3NdO1xuICAgICAgICAgICAgLy8gU2F2aW5nIGRhdGEgZm9yIGxhdGVyIHVzZVxuICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCghaXNSaWdodCAmJiAocGFyc2VJbnQoZHJhZ0l0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCkgPCBuZXh0SXRlbS5yZWRab25lKSk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzdGFjay5wb3AoKSB8fCAoaXNSaWdodCAmJiBwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA+IG5leHRJdGVtLm9yaWdMZWZ0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ucmVkWm9uZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0ub3JpZ0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5leHRJdGVtLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgKz0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ0l0ZW0uYWRqdXN0IC09IHBhcnNlSW50KG5leHRJdGVtLmdyYXBoaWNzLnN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5vcmlnTGVmdCA9IGRyYWdJdGVtLm9yaWdMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5yZWRab25lID0gZHJhZ0l0ZW0ucmVkWm9uZTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uaW5kZXggPSBkcmFnSXRlbS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUubGVmdCA9IG5leHRJdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChob2xkZXJbbmV4dFBvc10pO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbbmV4dFBvc10gPSBob2xkZXJbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBob2xkZXJbaW5kZXhdID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0dGluZyBuZXcgdmFsdWVzIGZvciBkcmFnaXRlbVxuICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLmluZGV4ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0ub3JpZ0xlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5yZWRab25lID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBEcmFnIChlbCwgaGFuZGxlciwgaGFuZGxlcjIpIHtcbiAgICAgICAgbGV0IHggPSAwLFxuICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZS5jbGllbnRYIC0geCwgZS5jbGllbnRZIC0geSk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDAuODtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyIChlKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY3VzdG9tSGFuZGxlcik7XG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZXIyLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxM1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDEsXG4gICAgICAgICdWaXNpdG9ycyc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAzLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA1LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxN1xuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOSxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDEwLFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogMTMsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDE5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogNixcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA3LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGFyZ2VEYXRhLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==