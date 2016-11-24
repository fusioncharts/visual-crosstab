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
	    crosstabContainer: 'crosstab-div',
	    // cellWidth: 210,
	    // cellHeight: 113,
	    // showFilter: false,
	    // draggableHeaders: true,
	    // aggregation: 'sum',
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
	        this.showFilter = config.showFilter || false;
	        this.draggableHeaders = config.draggableHeaders || false;
	        this.chartConfig = config.chartConfig;
	        this.dimensions = config.dimensions;
	        this.measures = config.measures;
	        this.measureOnRow = false;
	        this.globalData = this.buildGlobalData();
	        this.columnKeyArr = [];
	        this.cellWidth = config.cellWidth || 210;
	        this.cellHeight = config.cellHeight || 113;
	        this.crosstabContainer = config.crosstabContainer;
	        this.hash = this.getFilterHashMap();
	        this.count = 0;
	        this.aggregation = config.aggregation || 'sum';
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
	                htmlRef,
	                classStr = '';
	
	            for (i = 0; i < this.dimensions.length - 1; i++) {
	                htmlRef = document.createElement('p');
	                htmlRef.innerHTML = this.dimensions[i][0].toUpperCase() + this.dimensions[i].substr(1);
	                htmlRef.style.textAlign = 'center';
	                htmlRef.style.marginTop = '6px';
	                classStr = 'corner-cell no-select';
	                if (this.draggableHeaders) {
	                    classStr += ' draggable';
	                }
	                cornerCellArr.push({
	                    width: this.dimensions[i] * 10,
	                    height: 30,
	                    rowspan: 1,
	                    colspan: 1,
	                    html: htmlRef.outerHTML,
	                    className: classStr
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjYwNzI1ZTYzYTAxMmViNTQ2NzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbIkNyb3NzdGFiRXh0IiwicmVxdWlyZSIsImRhdGEiLCJjb25maWciLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJjaGFydFR5cGUiLCJub0RhdGFNZXNzYWdlIiwiY3Jvc3N0YWJDb250YWluZXIiLCJjaGFydENvbmZpZyIsImNoYXJ0Iiwid2luZG93IiwiY3Jvc3N0YWIiLCJyZW5kZXJDcm9zc3RhYiIsIm1vZHVsZSIsImV4cG9ydHMiLCJldmVudExpc3QiLCJNdWx0aUNoYXJ0aW5nIiwibWMiLCJkYXRhU3RvcmUiLCJjcmVhdGVEYXRhU3RvcmUiLCJzZXREYXRhIiwiZGF0YVNvdXJjZSIsInQxIiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0ZXN0IiwiYSIsInN0b3JlUGFyYW1zIiwic2hvd0ZpbHRlciIsImRyYWdnYWJsZUhlYWRlcnMiLCJtZWFzdXJlT25Sb3ciLCJnbG9iYWxEYXRhIiwiYnVpbGRHbG9iYWxEYXRhIiwiY29sdW1uS2V5QXJyIiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImhhc2giLCJnZXRGaWx0ZXJIYXNoTWFwIiwiY291bnQiLCJhZ2dyZWdhdGlvbiIsImF4ZXMiLCJGQ0RhdGFGaWx0ZXJFeHQiLCJmaWx0ZXJDb25maWciLCJkYXRhRmlsdGVyRXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vZGVsVXBkYXRlZCIsImUiLCJkIiwiZ2V0S2V5cyIsImZpZWxkcyIsImkiLCJpaSIsImxlbmd0aCIsImdldFVuaXF1ZVZhbHVlcyIsInRhYmxlIiwicm93T3JkZXIiLCJjdXJyZW50SW5kZXgiLCJmaWx0ZXJlZERhdGFTdG9yZSIsInJvd3NwYW4iLCJmaWVsZENvbXBvbmVudCIsImZpZWxkVmFsdWVzIiwibCIsInJvd0VsZW1lbnQiLCJoYXNGdXJ0aGVyRGVwdGgiLCJmaWx0ZXJlZERhdGFIYXNoS2V5IiwiY29sTGVuZ3RoIiwiaHRtbFJlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwibWlubWF4T2JqIiwiY2xhc3NTdHIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1hcmdpblRvcCIsInRvTG93ZXJDYXNlIiwidmlzaWJpbGl0eSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvcm5lcldpZHRoIiwicmVtb3ZlQ2hpbGQiLCJ3aWR0aCIsImhlaWdodCIsImNvbHNwYW4iLCJodG1sIiwib3V0ZXJIVE1MIiwiY2xhc3NOYW1lIiwicHVzaCIsImNyZWF0ZVJvdyIsImFkYXB0ZXJDZmciLCJhZGFwdGVyIiwiZGF0YUFkYXB0ZXIiLCJqIiwiY2hhcnRDZWxsT2JqIiwicm93SGFzaCIsImNvbEhhc2giLCJnZXRDaGFydE9iaiIsInBhcnNlSW50IiwibWVhc3VyZU9yZGVyIiwiY29sRWxlbWVudCIsImNvcm5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsImNvbE9yZGVyTGVuZ3RoIiwiY29ybmVyQ2VsbEFyciIsInRvVXBwZXJDYXNlIiwic3Vic3RyIiwiaW5kZXgiLCJtYXhMZW5ndGgiLCJ1bnNoaWZ0Iiwic2VsZiIsIm9iaiIsImZpbHRlciIsInZhbCIsImFyciIsImNvbE9yZGVyIiwieEF4aXNSb3ciLCJjcmVhdGVSb3dEaW1IZWFkaW5nIiwiY3JlYXRlQ29sRGltSGVhZGluZyIsImNyZWF0ZUNvbCIsImNhdGVnb3JpZXMiLCJjcmVhdGVDYXB0aW9uIiwic3ViamVjdCIsInRhcmdldCIsImJ1ZmZlciIsInNwbGljZSIsImluZGV4T2YiLCJNYXRoIiwiY3JlYXRlQ3Jvc3N0YWIiLCJmaWx0ZXJzIiwiamoiLCJtYXRjaGVkVmFsdWVzIiwiZmlsdGVyR2VuIiwidG9TdHJpbmciLCJmaWx0ZXJWYWwiLCJyIiwiZ2xvYmFsQXJyYXkiLCJtYWtlR2xvYmFsQXJyYXkiLCJyZWN1cnNlIiwic2xpY2UiLCJ0ZW1wT2JqIiwidGVtcEFyciIsImtleSIsImhhc093blByb3BlcnR5IiwibWVhc3VyZSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJjcmVhdGVGaWx0ZXJzIiwiZGF0YUNvbWJvcyIsImNyZWF0ZURhdGFDb21ib3MiLCJoYXNoTWFwIiwiZGF0YUNvbWJvIiwidmFsdWUiLCJsZW4iLCJrIiwibWF0cml4IiwiY3JlYXRlTXVsdGlDaGFydCIsInQyIiwiZ2xvYmFsTWF4IiwiZ2xvYmFsTWluIiwicm93TGFzdENoYXJ0Iiwicm93Iiwicm93QXhpcyIsImNlbGwiLCJjcm9zc3RhYkVsZW1lbnQiLCJ0eXBlIiwiYXhpc1R5cGUiLCJjb25maWd1cmF0aW9uIiwidXBkYXRlIiwibGltaXRzIiwiY2hhcnRPYmoiLCJnZXRMaW1pdHMiLCJtaW5MaW1pdCIsIm1heExpbWl0IiwiRkNqc29uIiwieUF4aXNNaW5WYWx1ZSIsInlBeGlzTWF4VmFsdWUiLCJjdFBlcmYiLCJldnQiLCJjZWxsQWRhcHRlciIsImNhdGVnb3J5IiwiY2F0ZWdvcnlWYWwiLCJoaWdobGlnaHQiLCJtdWx0aWNoYXJ0T2JqZWN0IiwidW5kZWZpbmVkIiwiY3JlYXRlTWF0cml4IiwiZHJhdyIsImRyYWdMaXN0ZW5lciIsInBsYWNlSG9sZGVyIiwicmVzdWx0cyIsInBlcm11dGUiLCJtZW0iLCJjdXJyZW50IiwiY29uY2F0Iiwiam9pbiIsInBlcm11dGVTdHJzIiwiZmlsdGVyU3RyIiwic3BsaXQiLCJrZXlQZXJtdXRhdGlvbnMiLCJwZXJtdXRlQXJyIiwicm93RmlsdGVyIiwiY29sRmlsdGVyIiwicm93RmlsdGVycyIsImRhdGFQcm9jZXNzb3JzIiwiZGF0YVByb2Nlc3NvciIsIm1hdGNoZWRIYXNoZXMiLCJmaWx0ZXJlZERhdGEiLCJhcHBseSIsIm1hdGNoSGFzaCIsImNyZWF0ZURhdGFQcm9jZXNzb3IiLCJnZXRDaGlsZE1vZGVsIiwiZGltZW5zaW9uIiwic2VyaWVzVHlwZSIsImFnZ3JlZ2F0ZU1vZGUiLCJkYXRhc3RvcmUiLCJnZXRMaW1pdCIsIm9yaWdDb25maWciLCJtZWFzdXJlc0xlbmd0aCIsImRpbWVuc2lvbnNMZW5ndGgiLCJkaW1lbnNpb25zSG9sZGVyIiwibWVhc3VyZXNIb2xkZXIiLCJzZXR1cExpc3RlbmVyIiwiaG9sZGVyIiwiYXJyTGVuIiwiZ2xvYmFsQXJyIiwiZWwiLCJncmFwaGljcyIsIml0ZW0iLCJjZWxsVmFsdWUiLCJvcmlnTGVmdCIsImxlZnQiLCJyZWRab25lIiwiYWRqdXN0Iiwib3JpZ1oiLCJ6SW5kZXgiLCJfc2V0dXBEcmFnIiwiZHJhZ1N0YXJ0IiwiZHgiLCJkeSIsIm1hbmFnZVNoaWZ0aW5nIiwiZHJhZ0VuZCIsImNoYW5nZSIsInNldFRpbWVvdXQiLCJpc1JpZ2h0Iiwic3RhY2siLCJkcmFnSXRlbSIsIm5leHRQb3MiLCJuZXh0SXRlbSIsInBvcCIsImhhbmRsZXIiLCJoYW5kbGVyMiIsIngiLCJ5IiwiY3VzdG9tSGFuZGxlciIsImNsaWVudFgiLCJjbGllbnRZIiwib3BhY2l0eSIsImNsYXNzTGlzdCIsImFkZCIsIm1vdXNlVXBIYW5kbGVyIiwicmVtb3ZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdENBLEtBQU1BLGNBQWMsbUJBQUFDLENBQVEsQ0FBUixDQUFwQjtBQUFBLEtBQ0lDLE9BQU8sbUJBQUFELENBQVEsQ0FBUixDQURYOztBQUdBLEtBQUlFLFNBQVM7QUFDVEMsaUJBQVksQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQURIO0FBRVRDLGVBQVUsQ0FBQyxRQUFELEVBQVcs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RUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBcmtCYSxFQStrQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBL2tCYSxFQXlsQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBemxCYSxFQW1tQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxLQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBbm1CYSxFQTZtQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsTUFMZjtBQU1JLGFBQVEsRUFOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBN21CYSxFQXVuQmI7QUFDSSxnQkFBVyxPQURmO0FBRUksY0FBUyxRQUZiO0FBR0ksYUFBUSxNQUhaO0FBSUksY0FBUyxNQUpiO0FBS0ksZ0JBQVcsUUFMZjtBQU1JLGFBQVEsQ0FOWjtBQU9JLGVBQVUsQ0FQZDtBQVFJLGlCQUFZO0FBUmhCLEVBdm5CYSxDQUFqQixDIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2NjA3MjVlNjNhMDEyZWI1NDY3NyIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1Byb2ZpdCcsICdWaXNpdG9ycycsICdTYWxlJ10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgLy8gY2VsbFdpZHRoOiAyMTAsXG4gICAgLy8gY2VsbEhlaWdodDogMTEzLFxuICAgIC8vIHNob3dGaWx0ZXI6IGZhbHNlLFxuICAgIC8vIGRyYWdnYWJsZUhlYWRlcnM6IHRydWUsXG4gICAgLy8gYWdncmVnYXRpb246ICdzdW0nLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAncm9sbE92ZXJCYW5kQ29sb3InOiAnI0IyQjZERCcsXG4gICAgICAgICAgICAnY29sdW1uSG92ZXJDb2xvcic6ICcjNjE2RkY5JyxcbiAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6ICcxMCcsXG4gICAgICAgICAgICAnY2hhcnRUb3BNYXJnaW4nOiAnMTAnLFxuICAgICAgICAgICAgJ2NoYXJ0TGVmdE1hcmdpbic6ICc1JyxcbiAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZVRoaWNrbmVzcyc6ICcxJyxcbiAgICAgICAgICAgICdzaG93WmVyb1BsYW5lVmFsdWUnOiAnMScsXG4gICAgICAgICAgICAnemVyb1BsYW5lQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAncGxvdEJvcmRlckFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnYW5pbWF0aW9uJzogJzAnLFxuICAgICAgICAgICAgJ3RyYW5zcG9zZUFuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3Bsb3RDb2xvckluVG9vbHRpcCc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZVZHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjQjVCOUJBJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ID0ge1xuICAgICAgICAgICAgJ21vZGVsVXBkYXRlZCc6ICdtb2RlbHVwZGF0ZWQnLFxuICAgICAgICAgICAgJ21vZGVsRGVsZXRlZCc6ICdtb2RlbGRlbGV0ZWQnLFxuICAgICAgICAgICAgJ21ldGFJbmZvVXBkYXRlJzogJ21ldGFpbmZvdXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yVXBkYXRlZCc6ICdwcm9jZXNzb3J1cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JEZWxldGVkJzogJ3Byb2Nlc3NvcmRlbGV0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICAgICAgdGhpcy50MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLnNob3dGaWx0ZXIgPSBjb25maWcuc2hvd0ZpbHRlciB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVIZWFkZXJzID0gY29uZmlnLmRyYWdnYWJsZUhlYWRlcnMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbiB8fCAnc3VtJztcbiAgICAgICAgdGhpcy5heGVzID0gW107XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmV2ZW50TGlzdC5tb2RlbFVwZGF0ZWQsIChlLCBkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJDcm9zc3RhYigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBnbG9iYWwgZGF0YSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YUFkYXB0ZXIoYWRhcHRlckNmZyk7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAneS1heGlzLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiBhZGFwdGVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93SGFzaDogZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEhhc2g6IHRoaXMuY29sdW1uS2V5QXJyW2pdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgbWlubWF4T2JqID0gdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLmNvbHVtbktleUFycltqXSlbMF07XG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSAocGFyc2VJbnQobWlubWF4T2JqLm1pbikgPCBtaW4pID8gbWlubWF4T2JqLm1pbiA6IG1pbjtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1heCA9IG1heDtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRDZWxsT2JqLm1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgIC8vICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgLy8gICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgLy8gICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgIC8vICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAvLyAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgLy8gICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgLy8gICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgIC8vICAgICAgICAgaHRtbFJlZjtcblxuICAgIC8vICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xuICAgIC8vICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgIC8vICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgLy8gICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIC8vICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAvLyAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgLy8gICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgIC8vICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgLy8gICAgICAgICAgICAgJyAnICsgdGhpcy5tZWFzdXJlc1tjdXJyZW50SW5kZXhdICtcbiAgICAvLyAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpO1xuICAgIC8vICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgLy8gICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgIC8vICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAvLyAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgIC8vICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgLy8gICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAvLyAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAvLyAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgLy8gICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgIC8vICAgICAgICAgdGFibGVbY3VycmVudEluZGV4XS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgLy8gICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgLy8gICAgICAgICAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiBjb2xzcGFuO1xuICAgIC8vIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIG1lYXN1cmVPcmRlcikge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBpLCBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXTtcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRDb21wb25lbnQ7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNnB4JztcbiAgICAgICAgICAgIC8vIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tZGltZW5zaW9ucycgK1xuICAgICAgICAgICAgICAgICcgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICAgICAgdGFibGVbMF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIC8vIHRhYmxlW2ldLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIpO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlUm93RGltSGVhZGluZyAodGFibGUsIGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBjbGFzc1N0ciA9ICcnO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNnB4JztcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ2Nvcm5lci1jZWxsIG5vLXNlbGVjdCc7XG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NTdHIgKz0gJyBkcmFnZ2FibGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5kaW1lbnNpb25zW2ldICogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc1N0clxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1oZWFkZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdWJjYXB0aW9uJzogJ0Fjcm9zcyBTdGF0ZXMsIEFjcm9zcyBZZWFycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICB0YWJsZS51bnNoaWZ0KFt7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgIGNvbHNwYW46IG1heExlbmd0aCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2NhcHRpb24tY2hhcnQnLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDb2xEaW1IZWFkaW5nKHRhYmxlLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeHRyYSBjZWxsIGZvciB5IGF4aXMuIEVzc2VudGlhbGx5IFkgYXhpcyBmb290ZXIuXG4gICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1mb290ZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhbnZhc1BhZGRpbmcnOiAxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydExlZnRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd4LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnNwbGljZShkaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gZGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSArIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgLSAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSB0aGlzLm1lYXN1cmVzO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZWFzdXJlcy5zcGxpY2UobWVhc3VyZXMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lYXN1cmVzLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gbWVhc3VyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSArIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpIC0gMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuZGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBpaSA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBqaiA9IDAsXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBjcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcbiAgICAgICAgICAgIG1hdHJpeCA9IHRoaXMuY3JlYXRlTXVsdGlDaGFydChjcm9zc3RhYiksXG4gICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3dMYXN0Q2hhcnQgPSBjcm9zc3RhYltpXVtjcm9zc3RhYltpXS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChyb3dMYXN0Q2hhcnQubWF4IHx8IHJvd0xhc3RDaGFydC5taW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWF4IDwgcm93TGFzdENoYXJ0Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSByb3dMYXN0Q2hhcnQubWF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxNaW4gPSByb3dMYXN0Q2hhcnQubWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IG1hdHJpeFtpXSxcbiAgICAgICAgICAgICAgICByb3dBeGlzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXSxcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50ID0gY3Jvc3N0YWJbaV1bal07XG4gICAgICAgICAgICAgICAgaWYgKGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJiBjcm9zc3RhYkVsZW1lbnQuY2hhcnQudHlwZSA9PT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0F4aXMgPSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jaGFydENvbmZpZy5kYXRhU291cmNlLmNoYXJ0LmF4aXNUeXBlID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhZGFwdGVyQ2ZnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogZ2xvYmFsTWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0F4aXMuY29uZmlnLmNoYXJ0LmNvbmZpZ3VyYXRpb24gPSBhZGFwdGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93QXhpcy51cGRhdGUocm93QXhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb3dBeGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSB8fCBjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uRkNqc29uLmNoYXJ0LnlBeGlzTWF4VmFsdWUgPSBtYXhMaW1pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY29uZmlnLmNoYXJ0ID0gY2hhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgKz0gKHBlcmZvcm1hbmNlLm5vdygpIC0gdDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY2VsbC5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHQyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYy5hZGRFdmVudExpc3RlbmVyKCdob3ZlcmluJywgKGV2dCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dbal0uY2hhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjZWxsQWRhcHRlciA9IHJvd1tqXS5jaGFydC5jb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSBjcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQudHlwZSA9PT0gJ2NhcHRpb24nIHx8IHJvd1tqXS5jaGFydC50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LmNvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEFkYXB0ZXIuaGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XG4gICAgICAgICAgICB3aW5kb3cuY3RQZXJmID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnQxO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcih0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAocm93RmlsdGVyLCBjb2xGaWx0ZXIpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IFtdLFxuICAgICAgICAgICAgLy8gbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgLy8gbWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7fSxcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB7fSxcbiAgICAgICAgICAgIGxpbWl0cyA9IHt9LFxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXRDaGlsZE1vZGVsKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA+IG1heCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdIDwgbWluKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogW3RoaXMuZGltZW5zaW9uc1t0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbY29sRmlsdGVyXSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllczogY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhc3RvcmU6IGZpbHRlcmVkRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFBZGFwdGVyKGFkYXB0ZXJDZmcpO1xuICAgICAgICAgICAgbGltaXRzID0gYWRhcHRlci5nZXRMaW1pdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgJ21heCc6IGxpbWl0cy5tYXgsXG4gICAgICAgICAgICAgICAgJ21pbic6IGxpbWl0cy5taW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGFkYXB0ZXJcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSwgZGltZW5zaW9uc0xlbmd0aCArIG1lYXN1cmVzTGVuZ3RoICsgMSk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIoZGltZW5zaW9uc0hvbGRlciwgZGltZW5zaW9ucywgZGltZW5zaW9uc0xlbmd0aCwgdGhpcy5kaW1lbnNpb25zKTtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcihtZWFzdXJlc0hvbGRlciwgbWVhc3VyZXMsIG1lYXN1cmVzTGVuZ3RoLCB0aGlzLm1lYXN1cmVzKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBMaXN0ZW5lciAoaG9sZGVyLCBhcnIsIGFyckxlbiwgZ2xvYmFsQXJyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyckxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsID0gaG9sZGVyW2ldLmdyYXBoaWNzLFxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaG9sZGVyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2VsbFZhbHVlID0gYXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ0xlZnQgPSBwYXJzZUludChlbC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICBpdGVtLnJlZFpvbmUgPSBpdGVtLm9yaWdMZWZ0ICsgcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgaXRlbS5vcmlnWiA9IGVsLnN0eWxlLnpJbmRleDtcbiAgICAgICAgICAgICAgICBzZWxmLl9zZXR1cERyYWcoaXRlbS5ncmFwaGljcywgZnVuY3Rpb24gZHJhZ1N0YXJ0IChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IGl0ZW0ub3JpZ0xlZnQgKyBkeCArIGl0ZW0uYWRqdXN0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8IChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gbW91c2VVcEhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoaGFuZGxlcjIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXJnZURhdGEuanMiXSwic291cmNlUm9vdCI6IiJ9