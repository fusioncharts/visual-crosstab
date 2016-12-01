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

	const CrosstabExt = __webpack_require__(1),
	    data = __webpack_require__(2);
	
	var config = {
	    dimensions: ['Product', 'State', 'Month'],
	    measures: ['Sale', 'Profit', 'Visitors'],
	    chartType: 'column2d',
	    noDataMessage: 'No data to display.',
	    crosstabContainer: 'crosstab-div',
	    cellWidth: 150,
	    cellHeight: 113,
	    showFilter: true,
	    draggableHeaders: true,
	    // aggregation: 'sum',
	    chartConfig: {
	        chart: {
	            'showBorder': '0',
	            'showValues': '0',
	            'divLineAlpha': '0',
	            'numberPrefix': '₹',
	            'rotateValues': '1',
	            'rollOverBandColor': '#badaf0',
	            'columnHoverColor': '#1b83cc',
	            'chartBottomMargin': '10',
	            'chartTopMargin': '10',
	            'chartLeftMargin': '5',
	            'chartRightMargin': '5',
	            'zeroPlaneThickness': '0',
	            'zeroPlaneAlpha': '100',
	            'bgColor': '#FFFFFF',
	            'showXAxisLine': '1',
	            'plotBorderAlpha': '0',
	            'showXaxisValues': '0',
	            'showYAxisValues': '0',
	            'animation': '1',
	            'transposeAnimation': '1',
	            'alternateHGridAlpha': '0',
	            'plotColorInTooltip': '0',
	            'canvasBorderAlpha': '0',
	            'alternateVGridAlpha': '0',
	            'paletteColors': '#B5B9BA',
	            'usePlotGradientColor': '0',
	            'valueFontColor': '#FFFFFF',
	            'canvasBorderThickness': '0',
	            'drawTrendRegion': '1'
	        }
	    }
	};
	
	if (typeof window === 'object') {
	    window.crosstab = new CrosstabExt(data, config);
	    window.crosstab.renderCrosstab();
	} else {
	    module.exports = CrosstabExt;
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Represents a crosstab.
	 */
	class CrosstabExt {
	    constructor (data, config) {
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
	                test: function (a) {
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
	            let filterConfig = {};
	            this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box');
	        }
	    }
	
	    /**
	     * Build global data from the data store for internal use.
	     */
	    buildGlobalData () {
	        if (this.dataStore.getKeys()) {
	            let fields = this.dataStore.getKeys(),
	                globalData = {};
	            for (let i = 0, ii = fields.length; i < ii; i++) {
	                globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
	            }
	            return globalData;
	        } else {
	            return false;
	        }
	    }
	
	    createRow (table, data, rowOrder, currentIndex, filteredDataStore) {
	        var rowspan = 0,
	            fieldComponent = rowOrder[currentIndex],
	            fieldValues = data[fieldComponent],
	            i, l = fieldValues.length,
	            rowElement,
	            hasFurtherDepth = currentIndex < (rowOrder.length - 1),
	            filteredDataHashKey,
	            colLength = this.columnKeyArr.length,
	            htmlRef,
	            min = Infinity,
	            max = -Infinity,
	            minmaxObj = {};
	
	        for (i = 0; i < l; i += 1) {
	            let classStr = '';
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = fieldValues[i];
	            htmlRef.style.textAlign = 'center';
	            htmlRef.style.marginTop = ((this.cellHeight - 10) / 2) + 'px';
	            classStr += 'row-dimensions' +
	                ' ' + this.dimensions[currentIndex].toLowerCase() +
	                ' ' + fieldValues[i].toLowerCase() + ' no-select';
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
	                rowElement.rowspan = this.createRow(table, data, rowOrder,
	                    currentIndex + 1, filteredDataHashKey);
	            } else {
	                if (this.chartType === 'bar2d') {
	                    let categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
	                    table[table.length - 1].push({
	                        rowspan: 1,
	                        colspan: 1,
	                        width: 40,
	                        className: 'y-axis-chart',
	                        chart: this.mc.chart({
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'config': {
	                                'chart': {
	                                    'axisType': 'x',
	                                    'borderthickness': 0,
	                                    'isHorizontal': 0,
	                                    'chartTopMargin': 10,
	                                    'chartBottomMargin': 10,
	                                    'valuePadding': 0.5
	                                },
	                                'categories': categories
	                            }
	                        })
	                    });
	                } else {
	                    table[table.length - 1].push({
	                        rowspan: 1,
	                        colspan: 1,
	                        width: 40,
	                        className: 'y-axis-chart',
	                        chart: this.mc.chart({
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'config': {
	                                'chart': {
	                                    'axisType': 'y'
	                                }
	                            }
	                        })
	                    });
	                }
	                for (let j = 0; j < colLength; j += 1) {
	                    let chartCellObj = {
	                        width: this.cellWidth,
	                        height: this.cellHeight,
	                        rowspan: 1,
	                        colspan: 1,
	                        rowHash: filteredDataHashKey,
	                        colHash: this.columnKeyArr[j],
	                        // chart: this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])[1],
	                        className: 'chart-cell'
	                    };
	                    table[table.length - 1].push(chartCellObj);
	                    minmaxObj = this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])[0];
	                    max = (parseInt(minmaxObj.max) > max) ? minmaxObj.max : max;
	                    min = (parseInt(minmaxObj.min) < min) ? minmaxObj.min : min;
	                    chartCellObj.max = max;
	                    chartCellObj.min = min;
	                }
	            }
	            rowspan += rowElement.rowspan;
	        }
	        return rowspan;
	    }
	
	    createCol (table, data, measureOrder) {
	        var colspan = 0,
	            i,
	            l = this.measures.length,
	            j,
	            colElement,
	            htmlRef,
	            headerDiv,
	            dragDiv,
	            handleSpan;
	
	        for (i = 0; i < l; i += 1) {
	            let classStr = '',
	                fieldComponent = measureOrder[i];
	                // fieldValues = data[fieldComponent];
	            headerDiv = document.createElement('div');
	            headerDiv.style.textAlign = 'center';
	
	            dragDiv = document.createElement('div');
	            dragDiv.setAttribute('class', 'measure-drag-handle');
	            dragDiv.style.height = '5px';
	            dragDiv.style.paddingTop = '3px';
	            dragDiv.style.paddingBottom = '1px';
	            for (j = 0; j < 25; j++) {
	                handleSpan = document.createElement('span');
	                handleSpan.style.marginLeft = '1px';
	                handleSpan.style.fontSize = '3px';
	                handleSpan.style.lineHeight = '1';
	                handleSpan.style.verticalAlign = 'top';
	                dragDiv.appendChild(handleSpan);
	            }
	
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = fieldComponent;
	            htmlRef.style.textAlign = 'center';
	            htmlRef.style.marginTop = '5px';
	            // htmlRef.style.marginTop = ((30 * this.measures.length - 15) / 2) + 'px';
	            document.body.appendChild(htmlRef);
	
	            classStr += 'column-measures ' + this.measures[i].toLowerCase() + ' no-select';
	            if (this.draggableHeaders) {
	                classStr += ' draggable';
	            }
	            this.cornerHeight = htmlRef.offsetHeight;
	            document.body.removeChild(htmlRef);
	
	            headerDiv.appendChild(dragDiv);
	            headerDiv.appendChild(htmlRef);
	            colElement = {
	                width: this.cellWidth,
	                height: 35,
	                rowspan: 1,
	                colspan: 1,
	                html: headerDiv.outerHTML,
	                className: classStr
	            };
	            this.columnKeyArr.push(this.measures[i]);
	            table[0].push(colElement);
	        }
	        return colspan;
	    }
	
	    createRowDimHeading (table, colOrderLength) {
	        var cornerCellArr = [],
	            i = 0,
	            j,
	            htmlRef,
	            classStr = '',
	            headerDiv,
	            dragDiv,
	            handleSpan;
	
	        for (i = 0; i < this.dimensions.length - 1; i++) {
	            headerDiv = document.createElement('div');
	            headerDiv.style.textAlign = 'center';
	
	            dragDiv = document.createElement('div');
	            dragDiv.setAttribute('class', 'dimension-drag-handle');
	            dragDiv.style.height = '5px';
	            dragDiv.style.paddingTop = '3px';
	            dragDiv.style.paddingBottom = '1px';
	            for (j = 0; j < 25; j++) {
	                handleSpan = document.createElement('span');
	                handleSpan.style.marginLeft = '1px';
	                handleSpan.style.fontSize = '3px';
	                handleSpan.style.lineHeight = '1';
	                handleSpan.style.verticalAlign = 'top';
	                dragDiv.appendChild(handleSpan);
	            }
	
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = this.dimensions[i][0].toUpperCase() + this.dimensions[i].substr(1);
	            htmlRef.style.textAlign = 'center';
	            htmlRef.style.marginTop = '5px';
	            classStr = 'corner-cell ' + this.dimensions[i].toLowerCase() + ' no-select';
	            if (this.draggableHeaders) {
	                classStr += ' draggable';
	            }
	            headerDiv.appendChild(dragDiv);
	            headerDiv.appendChild(htmlRef);
	            cornerCellArr.push({
	                width: this.dimensions[i] * 10,
	                height: 35,
	                rowspan: 1,
	                colspan: 1,
	                html: headerDiv.outerHTML,
	                className: classStr
	            });
	        }
	        return cornerCellArr;
	    }
	
	    createColDimHeading (table, index) {
	        var i = index,
	            htmlRef;
	        for (; i < table.length; i++) {
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = '';
	            htmlRef.style.textAlign = 'center';
	            table[i].push({
	                width: 40,
	                height: 35,
	                rowspan: 1,
	                colspan: 1,
	                html: htmlRef.outerHTML,
	                className: 'axis-header-cell'
	            });
	        }
	        return table;
	    }
	
	    createCaption (table, maxLength) {
	        // let adapterCfg = {
	        //         config: {
	        //             config: {
	        //                 chart: {
	        //                     'caption': 'Sale of Cereal',
	        //                     'subcaption': 'Across States, Across Years',
	        //                     'borderthickness': '0'
	        //                 }
	        //             }
	        //         }
	        //     },
	            // adapter = this.mc.dataAdapter(adapterCfg);
	        table.unshift([{
	            height: 50,
	            rowspan: 1,
	            colspan: maxLength,
	            className: 'caption-chart',
	            chart: this.mc.chart({
	                'type': 'caption',
	                'width': '100%',
	                'height': '100%',
	                'dataFormat': 'json',
	                'config': {
	                    'chart': {
	                        'caption': 'Sale of Cereal',
	                        'subcaption': 'Across States, Across Years',
	                        'borderthickness': '0'
	                    }
	                }
	            })
	        }]);
	        return table;
	    }
	
	    createCrosstab () {
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
	                maxLength = (maxLength < table[i].length) ? table[i].length : maxLength;
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
	                let categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
	                if (this.chartType === 'bar2d') {
	                    xAxisRow.push({
	                        width: '100%',
	                        height: 20,
	                        rowspan: 1,
	                        colspan: 1,
	                        className: 'x-axis-chart',
	                        chart: this.mc.chart({
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'config': {
	                                'chart': {
	                                    'axisType': 'y',
	                                    'isHorizontal': 1
	                                }
	                            }
	                        })
	                    });
	                } else {
	                    xAxisRow.push({
	                        width: '100%',
	                        height: 20,
	                        rowspan: 1,
	                        colspan: 1,
	                        className: 'x-axis-chart',
	                        chart: this.mc.chart({
	                            'type': 'axis',
	                            'width': '100%',
	                            'height': '100%',
	                            'dataFormat': 'json',
	                            'config': {
	                                'chart': {
	                                    'axisType': 'x',
	                                    'borderthickness': 0,
	                                    'chartLeftMargin': 5,
	                                    'chartRightMargin': 5,
	                                    'valuePadding': 0.5
	                                },
	                                'categories': categories
	                            }
	                        })
	                    });
	                }
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
	
	    rowDimReorder (subject, target) {
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
	
	    colDimReorder (subject, target) {
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
	
	    mergeDimensions () {
	        let dimensions = [];
	        for (let i = 0, l = this.dimensions.length; i < l; i++) {
	            dimensions.push(this.dimensions[i]);
	        }
	        for (let i = 0, l = this.measures.length; i < l; i++) {
	            dimensions.push(this.measures[i]);
	        }
	        return dimensions;
	    }
	
	    createFilters () {
	        let filters = [],
	            i = 0,
	            ii = this.dimensions.length - 1,
	            j = 0,
	            jj = 0,
	            matchedValues;
	
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
	
	    createDataCombos () {
	        let r = [],
	            globalArray = this.makeGlobalArray(),
	            max = globalArray.length - 1;
	
	        function recurse (arr, i) {
	            for (let j = 0, l = globalArray[i].length; j < l; j++) {
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
	
	    makeGlobalArray () {
	        let tempObj = {},
	            tempArr = [];
	
	        for (let key in this.globalData) {
	            if (this.globalData.hasOwnProperty(key) && key !== this.measure) {
	                tempObj[key] = this.globalData[key];
	            }
	        }
	        tempArr = Object.keys(tempObj).map(key => tempObj[key]);
	        return tempArr;
	    }
	
	    getFilterHashMap () {
	        let filters = this.createFilters(),
	            dataCombos = this.createDataCombos(),
	            hashMap = {};
	
	        for (let i = 0, l = dataCombos.length; i < l; i++) {
	            let dataCombo = dataCombos[i],
	                key = '',
	                value = [];
	
	            for (let j = 0, len = dataCombo.length; j < len; j++) {
	                for (let k = 0, length = filters.length; k < length; k++) {
	                    let filterVal = filters[k].filterVal;
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
	
	    renderCrosstab () {
	        let t2 = performance.now(),
	            globalMax = -Infinity,
	            globalMin = Infinity,
	            yAxis;
	        this.crosstab = this.createCrosstab();
	        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let rowLastChart = this.crosstab[i][this.crosstab[i].length - 1];
	            if (rowLastChart.max || rowLastChart.min) {
	                if (globalMax < rowLastChart.max) {
	                    globalMax = rowLastChart.max;
	                }
	                if (globalMin > rowLastChart.min) {
	                    globalMin = rowLastChart.min;
	                }
	            }
	        }
	        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i],
	                rowAxis;
	            for (let j = 0, jj = row.length; j < jj; j++) {
	                let crosstabElement = row[j];
	                if (crosstabElement.chart && crosstabElement.chart.conf.type === 'axis') {
	                    rowAxis = crosstabElement;
	                    if (rowAxis.chart.conf.config.chart.axisType === 'y') {
	                        let axisChart = rowAxis.chart,
	                            config = axisChart.conf;
	                        config.config.chart = {
	                            'dataMin': globalMin,
	                            'axisType': 'y',
	                            'dataMax': globalMax,
	                            'borderthickness': 0,
	                            'chartBottomMargin': 10,
	                            'chartTopMargin': 10
	                        };
	                        if (this.chartType === 'bar2d') {
	                            config.config.chart = {
	                                'dataMin': globalMin,
	                                'axisType': 'y',
	                                'dataMax': globalMax,
	                                'borderthickness': 0,
	                                'chartLeftMargin': 5,
	                                'chartRightMargin': 5,
	                                'isHorizontal': 1
	                            };
	                        }
	                        axisChart = this.mc.chart(config);
	                        rowAxis.chart = axisChart;
	                    }
	                }
	            }
	        }
	        this.createMultiChart(this.crosstab);
	        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i];
	            for (let j = 0, jj = row.length; j < jj; j++) {
	                let crosstabElement = row[j];
	                if (!yAxis && crosstabElement.chart &&
	                    crosstabElement.chart.conf.config.chart.axisType === 'y') {
	                    yAxis = crosstabElement;
	                }
	            }
	        }
	        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i];
	            for (let j = 0, jj = row.length; j < jj; j++) {
	                let crosstabElement = row[j];
	                if (yAxis) {
	                    if (!crosstabElement.hasOwnProperty('html') &&
	                        !crosstabElement.hasOwnProperty('chart') &&
	                        crosstabElement.className !== 'blank-cell' &&
	                        crosstabElement.className !== 'axis-footer-cell') {
	                        let chart = yAxis.chart,
	                            chartInstance = chart.getChartInstance(),
	                            limits = chartInstance.getLimits(),
	                            minLimit = limits[0],
	                            maxLimit = limits[1],
	                            chartObj = this.getChartObj(crosstabElement.rowHash,
	                                crosstabElement.colHash,
	                                minLimit,
	                                maxLimit)[1];
	                        crosstabElement.chart = chartObj;
	                        window.ctPerf += (performance.now() - t2);
	                    }
	                    t2 = performance.now();
	                }
	            }
	        }
	        this.createMultiChart(this.crosstab);
	        this.dataStore.addEventListener(this.eventList.modelUpdated, (e, d) => {
	            this.globalData = this.buildGlobalData();
	            this.updateCrosstab();
	        });
	        this.mc.addEventListener('hoverin', (evt, data) => {
	            if (data.data) {
	                for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	                    let row = this.crosstab[i];
	                    for (var j = 0; j < row.length; j++) {
	                        if (row[j].chart) {
	                            if (!(row[j].chart.conf.type === 'caption' ||
	                                row[j].chart.conf.type === 'axis')) {
	                                let cellAdapter = row[j].chart,
	                                    category = this.dimensions[this.dimensions.length - 1],
	                                    categoryVal = data.data[category];
	                                cellAdapter.highlight(categoryVal);
	                            }
	                        }
	                    }
	                }
	            }
	        });
	        this.mc.addEventListener('hoverout', (evt, data) => {
	            for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	                let row = this.crosstab[i];
	                for (var j = 0; j < row.length; j++) {
	                    if (row[j].chart) {
	                        if (!(row[j].chart.conf.type === 'caption' ||
	                            row[j].chart.conf.type === 'axis')) {
	                            let cellAdapter = row[j].chart;
	                            cellAdapter.highlight();
	                        }
	                    }
	                }
	            }
	        });
	    }
	
	    updateCrosstab () {
	        let filteredCrosstab = this.createCrosstab(),
	            i, ii,
	            j, jj,
	            oldCharts = [],
	            globalMax = -Infinity,
	            globalMin = Infinity,
	            axisLimits = [];
	        for (i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i];
	            for (j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j];
	                if (cell.chart) {
	                    let chartConf = cell.chart.getConf();
	                    if (chartConf.type !== 'caption' && chartConf.type !== 'axis') {
	                        oldCharts.push(cell);
	                    }
	                }
	            }
	        }
	
	        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	            let row = filteredCrosstab[i];
	            for (j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j];
	                if (cell.rowHash && cell.colHash) {
	                    let oldChart = this.getOldChart(oldCharts, cell.rowHash, cell.colHash),
	                        limits = {};
	                    if (!oldChart) {
	                        let chartObj = this.getChartObj(cell.rowHash, cell.colHash);
	                        oldChart = chartObj[1];
	                        limits = chartObj[0];
	                    }
	                    cell.chart = oldChart;
	                    if (Object.keys(limits).length !== 0) {
	                        cell.max = limits.max;
	                        cell.min = limits.min;
	                    }
	                }
	            }
	        }
	
	        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	            let row = filteredCrosstab[i];
	            for (j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j];
	                if (cell.max || cell.min) {
	                    if (globalMax < cell.max) {
	                        globalMax = cell.max;
	                    }
	                    if (globalMin > cell.min) {
	                        globalMin = cell.min;
	                    }
	                }
	            }
	        }
	
	        for (i = 0, ii = filteredCrosstab.length; i < ii; i++) {
	            let row = filteredCrosstab[i];
	            for (j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j];
	                if (cell.chart && cell.chart.conf.type === 'axis') {
	                    let rowAxis = cell;
	                    if (rowAxis.chart.conf.config.chart.axisType === 'y') {
	                        let axisChart = rowAxis.chart,
	                            config = axisChart.conf;
	                        config.config.chart = {
	                            'dataMin': globalMin,
	                            'axisType': 'y',
	                            'dataMax': globalMax,
	                            'borderthickness': 0,
	                            'chartBottomMargin': 10,
	                            'chartTopMargin': 10
	                        };
	                        if (this.chartType === 'bar2d') {
	                            config.config.chart = {
	                                'dataMin': globalMin,
	                                'axisType': 'y',
	                                'dataMax': globalMax,
	                                'borderthickness': 0,
	                                'chartLeftMargin': 5,
	                                'chartRightMargin': 5,
	                                'isHorizontal': 1
	                            };
	                        }
	                        axisChart = this.mc.chart(config);
	                        rowAxis.chart = axisChart;
	                    }
	                }
	            }
	        }
	
	        this.crosstab = filteredCrosstab;
	        this.createMultiChart();
	        axisLimits = this.getYAxisLimits();
	
	        for (let i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i];
	            for (let j = 0, jj = row.length; j < jj; j++) {
	                let crosstabElement = row[j];
	                if (!crosstabElement.hasOwnProperty('html') &&
	                    crosstabElement.className !== 'blank-cell' &&
	                    crosstabElement.className !== 'axis-footer-cell' &&
	                    crosstabElement.chart.getConf().type !== 'caption' &&
	                    crosstabElement.chart.getConf().type !== 'axis') {
	                    let chartObj = this.getChartObj(crosstabElement.rowHash,
	                        crosstabElement.colHash,
	                        axisLimits[0],
	                        axisLimits[1])[1];
	                    crosstabElement.chart.update(chartObj.getConf());
	                }
	            }
	        }
	    }
	
	    getYAxisLimits () {
	        let i, ii,
	            j, jj;
	        for (i = 0, ii = this.crosstab.length; i < ii; i++) {
	            let row = this.crosstab[i];
	            for (j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j];
	                if (cell.chart) {
	                    let chartConf = cell.chart.getConf();
	                    if (chartConf.type === 'axis' && chartConf.config.chart.axisType === 'y') {
	                        return (cell.chart.getChartInstance().getLimits());
	                    }
	                }
	            }
	        }
	    }
	
	    getOldChart (oldCharts, rowHash, colHash) {
	        for (var i = oldCharts.length - 1; i >= 0; i--) {
	            if (oldCharts[i].rowHash === rowHash && oldCharts[i].colHash === colHash) {
	                return oldCharts[i].chart;
	            }
	        }
	    }
	
	    createMultiChart () {
	        if (this.multichartObject === undefined) {
	            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, this.crosstab);
	            window.ctPerf = performance.now() - this.t1;
	            this.multichartObject.draw();
	        } else {
	            this.multichartObject.update(this.crosstab);
	        }
	        if (this.draggableHeaders) {
	            this.dragListener(this.multichartObject.placeHolder);
	        }
	        return this.multichartObject.placeHolder;
	    }
	
	    permuteArr (arr) {
	        let results = [];
	        function permute (arr, mem) {
	            let current;
	            mem = mem || [];
	
	            for (let i = 0, ii = arr.length; i < ii; i++) {
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
	
	    matchHash (filterStr, hash) {
	        for (var key in hash) {
	            if (hash.hasOwnProperty(key)) {
	                let keys = key.split('|'),
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
	
	    getChartObj (rowFilter, colFilter, minLimit, maxLimit) {
	        let filters = [],
	            filterStr = '',
	            rowFilters = rowFilter.split('|'),
	            dataProcessors = [],
	            dataProcessor = {},
	            matchedHashes = [],
	            // filteredJSON = [],
	            // max = -Infinity,
	            // min = Infinity,
	            filteredData = {},
	            // adapter = {},
	            limits = {},
	            chart = {},
	            categories = this.globalData[this.dimensions[this.dimensions.length - 1]];
	
	        rowFilters.push.apply(rowFilters);
	        filters = rowFilters.filter((a) => {
	            return (a !== '');
	        });
	        filterStr = filters.join('|');
	        matchedHashes = this.hash[this.matchHash(filterStr, this.hash)];
	        if (matchedHashes) {
	            for (let i = 0, ii = matchedHashes.length; i < ii; i++) {
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
	            if (minLimit !== undefined && maxLimit !== undefined) {
	                this.chartConfig.chart.yAxisMinValue = minLimit;
	                this.chartConfig.chart.yAxisMaxValue = maxLimit;
	            }
	            chart = this.mc.chart({
	                dataSource: filteredData,
	                type: this.chartType,
	                width: '100%',
	                height: '100%',
	                dimension: [this.dimensions[this.dimensions.length - 1]],
	                measure: [colFilter],
	                seriesType: 'SS',
	                aggregateMode: this.aggregation,
	                categories: categories,
	                config: this.chartConfig
	            });
	            limits = chart.getLimit();
	            return [{
	                'max': limits.max,
	                'min': limits.min
	            }, chart];
	        }
	    }
	
	    dragListener (placeHolder) {
	        // Getting only labels
	        let origConfig = this.storeParams.config,
	            dimensions = origConfig.dimensions || [],
	            measures = origConfig.measures || [],
	            measuresLength = measures.length,
	            dimensionsLength = 0,
	            dimensionsHolder,
	            measuresHolder,
	            self = this;
	        // let end
	        placeHolder = placeHolder[1];
	        // Omitting last dimension
	        dimensions = dimensions.slice(0, dimensions.length - 1);
	        dimensionsLength = dimensions.length;
	        // Setting up dimension holder
	        dimensionsHolder = placeHolder.slice(0, dimensionsLength);
	        // Setting up measures holder
	        // One shift for blank box
	        measuresHolder = placeHolder.slice(dimensionsLength + 1,
	            dimensionsLength + measuresLength + 1);
	        setupListener(dimensionsHolder, dimensions, dimensionsLength, this.dimensions);
	        setupListener(measuresHolder, measures, measuresLength, this.measures);
	        function setupListener (holder, arr, arrLen, globalArr) {
	            let limitLeft = 0,
	                limitRight = 0,
	                last = arrLen - 1,
	                ln = Math.log2;
	
	            if (holder[0]) {
	                limitLeft = parseInt(holder[0].graphics.style.left);
	                limitRight = parseInt(holder[last].graphics.style.left);
	            }
	
	            for (let i = 0; i < arrLen; ++i) {
	                let el = holder[i].graphics,
	                    item = holder[i],
	                    nLeft = 0,
	                    diff = 0;
	                item.cellValue = arr[i];
	                item.origLeft = parseInt(el.style.left);
	                item.redZone = item.origLeft + parseInt(el.style.width) / 2;
	                item.index = i;
	                item.adjust = 0;
	                item.origZ = el.style.zIndex;
	                self._setupDrag(item.graphics, function dragStart (dx, dy) {
	                    nLeft = item.origLeft + dx + item.adjust;
	                    if (nLeft < limitLeft) {
	                        diff = limitLeft - nLeft;
	                        nLeft = limitLeft - ln(diff);
	                    }
	                    if (nLeft > limitRight) {
	                        diff = nLeft - limitRight;
	                        nLeft = limitRight + ln(diff);
	                    }
	                    el.style.left = nLeft + 'px';
	                    el.style.zIndex = 1000;
	                    manageShifting(item.index, false, holder);
	                    manageShifting(item.index, true, holder);
	                }, function dragEnd () {
	                    let change = false,
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
	            }
	        }
	
	        function manageShifting (index, isRight, holder) {
	            let stack = [],
	                dragItem = holder[index],
	                nextPos = isRight ? index + 1 : index - 1,
	                nextItem = holder[nextPos];
	            // Saving data for later use
	            if (nextItem) {
	                stack.push(!isRight &&
	                    (parseInt(dragItem.graphics.style.left) < nextItem.redZone));
	                stack.push(stack.pop() ||
	                    (isRight && parseInt(dragItem.graphics.style.left) > nextItem.origLeft));
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
	
	    _setupDrag (el, handler, handler2) {
	        let x = 0,
	            y = 0;
	        function customHandler (e) {
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
	        function mouseUpHandler (e) {
	            el.style.opacity = 1;
	            el.classList.remove('dragging');
	            window.document.removeEventListener('mousemove', customHandler);
	            window.document.removeEventListener('mouseup', mouseUpHandler);
	            window.setTimeout(handler2, 10);
	        }
	    }
	
	    filterGen (key, val) {
	        return (data) => data[key] === val;
	    }
	}
	
	module.exports = CrosstabExt;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = [
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 12,
	        'Visitors': 6
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 1,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 3,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 11,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 6,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 11,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 14,
	        'Visitors': 13
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 10,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 6,
	        'Profit': 3,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 7,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 14,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 2,
	        'Visitors': 9
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 9
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 5,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 12,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 13,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 7
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 6,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 4,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 8,
	        'Profit': 0,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 9,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 9,
	        'Profit': 8,
	        'Visitors': 19
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 5,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 0,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 3,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 6,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 1,
	        'Profit': 9,
	        'Visitors': 16
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 5,
	        'Profit': 4,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 11,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 5,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 14,
	        'Visitors': 4
	    },
	    {
	        'Product': 'Rice',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 5,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 3,
	        'Profit': 7,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 2,
	        'Profit': 5,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 8,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 14,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 2,
	        'Profit': 0,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 3,
	        'Profit': 1,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 8,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 1,
	        'Profit': 12,
	        'Visitors': 11
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 2,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 10,
	        'Profit': 11,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 14,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 10,
	        'Visitors': 8
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 1,
	        'Profit': 12,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 9,
	        'Profit': 4,
	        'Visitors': 15
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 9,
	        'Visitors': 2
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bihar',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 0,
	        'Visitors': 12
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 6,
	        'Profit': 6,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 5,
	        'Visitors': 4
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 9,
	        'Profit': 3,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 10,
	        'Visitors': 0
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 7,
	        'Profit': 4,
	        'Visitors': 13
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 2,
	        'Profit': 13,
	        'Visitors': 10
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 5,
	        'Profit': 14,
	        'Visitors': 1
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2015',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 11,
	        'Visitors': 11
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Good',
	        'Sale': 4,
	        'Profit': 1,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Jun',
	        'Quality': 'Medium',
	        'Sale': 4,
	        'Profit': 8,
	        'Visitors': 19
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 6,
	        'Visitors': 2
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'July',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 0,
	        'Visitors': 5
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Good',
	        'Sale': 8,
	        'Profit': 9,
	        'Visitors': 17
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Aug',
	        'Quality': 'Medium',
	        'Sale': 6,
	        'Profit': 5,
	        'Visitors': 18
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Good',
	        'Sale': 10,
	        'Profit': 9,
	        'Visitors': 14
	    },
	    {
	        'Product': 'Wheat',
	        'State': 'Bengal',
	        'Year': '2016',
	        'Month': 'Sept',
	        'Quality': 'Medium',
	        'Sale': 7,
	        'Profit': 7,
	        'Visitors': 16
	    }
	];


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODY1MzUxNTg1Mjk4OWQzNGQ4ODAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBOzs7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQW9DLHdCQUF3QjtBQUM1RDtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC1lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4NjUzNTE1ODUyOTg5ZDM0ZDg4MCIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIGRpbWVuc2lvbnM6IFsnUHJvZHVjdCcsICdTdGF0ZScsICdNb250aCddLFxuICAgIG1lYXN1cmVzOiBbJ1NhbGUnLCAnUHJvZml0JywgJ1Zpc2l0b3JzJ10sXG4gICAgY2hhcnRUeXBlOiAnY29sdW1uMmQnLFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXkuJyxcbiAgICBjcm9zc3RhYkNvbnRhaW5lcjogJ2Nyb3NzdGFiLWRpdicsXG4gICAgY2VsbFdpZHRoOiAxNTAsXG4gICAgY2VsbEhlaWdodDogMTEzLFxuICAgIHNob3dGaWx0ZXI6IHRydWUsXG4gICAgZHJhZ2dhYmxlSGVhZGVyczogdHJ1ZSxcbiAgICAvLyBhZ2dyZWdhdGlvbjogJ3N1bScsXG4gICAgY2hhcnRDb25maWc6IHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICdzaG93Qm9yZGVyJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdyb2xsT3ZlckJhbmRDb2xvcic6ICcjYmFkYWYwJyxcbiAgICAgICAgICAgICdjb2x1bW5Ib3ZlckNvbG9yJzogJyMxYjgzY2MnLFxuICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogJzEwJyxcbiAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6ICcxMCcsXG4gICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogJzUnLFxuICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiAnNScsXG4gICAgICAgICAgICAnemVyb1BsYW5lVGhpY2tuZXNzJzogJzAnLFxuICAgICAgICAgICAgJ3plcm9QbGFuZUFscGhhJzogJzEwMCcsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcbiAgICAgICAgICAgICd0cmFuc3Bvc2VBbmltYXRpb24nOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlSEdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwbG90Q29sb3JJblRvb2x0aXAnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyNCNUI5QkEnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNGRkZGRkYnLFxuICAgICAgICAgICAgJ2NhbnZhc0JvcmRlclRoaWNrbmVzcyc6ICcwJyxcbiAgICAgICAgICAgICdkcmF3VHJlbmRSZWdpb24nOiAnMSdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgIHdpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xuICAgIHdpbmRvdy5jcm9zc3RhYi5yZW5kZXJDcm9zc3RhYigpO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgY3Jvc3N0YWIuXG4gKi9cbmNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ID0ge1xuICAgICAgICAgICAgJ21vZGVsVXBkYXRlZCc6ICdtb2RlbHVwZGF0ZWQnLFxuICAgICAgICAgICAgJ21vZGVsRGVsZXRlZCc6ICdtb2RlbGRlbGV0ZWQnLFxuICAgICAgICAgICAgJ21ldGFJbmZvVXBkYXRlJzogJ21ldGFpbmZvdXBkYXRlZCcsXG4gICAgICAgICAgICAncHJvY2Vzc29yVXBkYXRlZCc6ICdwcm9jZXNzb3J1cGRhdGVkJyxcbiAgICAgICAgICAgICdwcm9jZXNzb3JEZWxldGVkJzogJ3Byb2Nlc3NvcmRlbGV0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgTXVsdGlDaGFydGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICAgICAgdGhpcy50MSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmVQYXJhbXMgPSB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLnNob3dGaWx0ZXIgPSBjb25maWcuc2hvd0ZpbHRlciB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVIZWFkZXJzID0gY29uZmlnLmRyYWdnYWJsZUhlYWRlcnMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuY2hhcnRDb25maWcgPSBjb25maWcuY2hhcnRDb25maWc7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IGNvbmZpZy5kaW1lbnNpb25zO1xuICAgICAgICB0aGlzLm1lYXN1cmVzID0gY29uZmlnLm1lYXN1cmVzO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGggfHwgMjEwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjb25maWcuY2VsbEhlaWdodCB8fCAxMTM7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbiB8fCAnc3VtJztcbiAgICAgICAgdGhpcy5heGVzID0gW107XG4gICAgICAgIHRoaXMubm9EYXRhTWVzc2FnZSA9IGNvbmZpZy5ub0RhdGFNZXNzYWdlO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLnNob3dGaWx0ZXIpIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBnbG9iYWwgZGF0YSBmcm9tIHRoZSBkYXRhIHN0b3JlIGZvciBpbnRlcm5hbCB1c2UuXG4gICAgICovXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5kaW1lbnNpb25zW2N1cnJlbnRJbmRleF0udG9Mb3dlckNhc2UoKSArXG4gICAgICAgICAgICAgICAgJyAnICsgZmllbGRWYWx1ZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgaHRtbFJlZi5jbGFzc0xpc3QuYWRkKHRoaXMuZGltZW5zaW9uc1tjdXJyZW50SW5kZXggLSAxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlcixcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gJ2JhcjJkJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ktYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Qm90dG9tTWFyZ2luJzogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVQYWRkaW5nJzogMC41XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd5LWF4aXMtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMubWMuY2hhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5jb2x1bW5LZXlBcnJbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFydDogdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLmNvbHVtbktleUFycltqXSlbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjaGFydC1jZWxsJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xuICAgICAgICAgICAgICAgICAgICBtYXggPSAocGFyc2VJbnQobWlubWF4T2JqLm1heCkgPiBtYXgpID8gbWlubWF4T2JqLm1heCA6IG1heDtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gKHBhcnNlSW50KG1pbm1heE9iai5taW4pIDwgbWluKSA/IG1pbm1heE9iai5taW4gOiBtaW47XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5tYXggPSBtYXg7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0Q2VsbE9iai5taW4gPSBtaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgbWVhc3VyZU9yZGVyKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsID0gdGhpcy5tZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGh0bWxSZWYsXG4gICAgICAgICAgICBoZWFkZXJEaXYsXG4gICAgICAgICAgICBkcmFnRGl2LFxuICAgICAgICAgICAgaGFuZGxlU3BhbjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IG1lYXN1cmVPcmRlcltpXTtcbiAgICAgICAgICAgICAgICAvLyBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdO1xuICAgICAgICAgICAgaGVhZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBoZWFkZXJEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgICAgIGRyYWdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRyYWdEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZWFzdXJlLWRyYWctaGFuZGxlJyk7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLmhlaWdodCA9ICc1cHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nVG9wID0gJzNweCc7XG4gICAgICAgICAgICBkcmFnRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAnMXB4JztcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCAyNTsgaisrKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLm1hcmdpbkxlZnQgPSAnMXB4JztcbiAgICAgICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLmZvbnRTaXplID0gJzNweCc7XG4gICAgICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEnO1xuICAgICAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUudmVydGljYWxBbGlnbiA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIGRyYWdEaXYuYXBwZW5kQ2hpbGQoaGFuZGxlU3Bhbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gJzVweCc7XG4gICAgICAgICAgICAvLyBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLm1lYXN1cmVzLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG5cbiAgICAgICAgICAgIGNsYXNzU3RyICs9ICdjb2x1bW4tbWVhc3VyZXMgJyArIHRoaXMubWVhc3VyZXNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcblxuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGRyYWdEaXYpO1xuICAgICAgICAgICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29sRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaGVhZGVyRGl2Lm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaCh0aGlzLm1lYXN1cmVzW2ldKTtcbiAgICAgICAgICAgIHRhYmxlWzBdLnB1c2goY29sRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlUm93RGltSGVhZGluZyAodGFibGUsIGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBodG1sUmVmLFxuICAgICAgICAgICAgY2xhc3NTdHIgPSAnJyxcbiAgICAgICAgICAgIGhlYWRlckRpdixcbiAgICAgICAgICAgIGRyYWdEaXYsXG4gICAgICAgICAgICBoYW5kbGVTcGFuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhlYWRlckRpdi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICAgICAgZHJhZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2RpbWVuc2lvbi1kcmFnLWhhbmRsZScpO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5oZWlnaHQgPSAnNXB4JztcbiAgICAgICAgICAgIGRyYWdEaXYuc3R5bGUucGFkZGluZ1RvcCA9ICczcHgnO1xuICAgICAgICAgICAgZHJhZ0Rpdi5zdHlsZS5wYWRkaW5nQm90dG9tID0gJzFweCc7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgMjU7IGorKykge1xuICAgICAgICAgICAgICAgIGhhbmRsZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5tYXJnaW5MZWZ0ID0gJzFweCc7XG4gICAgICAgICAgICAgICAgaGFuZGxlU3Bhbi5zdHlsZS5mb250U2l6ZSA9ICczcHgnO1xuICAgICAgICAgICAgICAgIGhhbmRsZVNwYW4uc3R5bGUubGluZUhlaWdodCA9ICcxJztcbiAgICAgICAgICAgICAgICBoYW5kbGVTcGFuLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAndG9wJztcbiAgICAgICAgICAgICAgICBkcmFnRGl2LmFwcGVuZENoaWxkKGhhbmRsZVNwYW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmRpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuZGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAnNXB4JztcbiAgICAgICAgICAgIGNsYXNzU3RyID0gJ2Nvcm5lci1jZWxsICcgKyB0aGlzLmRpbWVuc2lvbnNbaV0udG9Mb3dlckNhc2UoKSArICcgbm8tc2VsZWN0JztcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBjbGFzc1N0ciArPSAnIGRyYWdnYWJsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoZHJhZ0Rpdik7XG4gICAgICAgICAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBoZWFkZXJEaXYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbERpbUhlYWRpbmcgKHRhYmxlLCBpbmRleCkge1xuICAgICAgICB2YXIgaSA9IGluZGV4LFxuICAgICAgICAgICAgaHRtbFJlZjtcbiAgICAgICAgZm9yICg7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F4aXMtaGVhZGVyLWNlbGwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2FwdGlvbiAodGFibGUsIG1heExlbmd0aCkge1xuICAgICAgICAvLyBsZXQgYWRhcHRlckNmZyA9IHtcbiAgICAgICAgLy8gICAgICAgICBjb25maWc6IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAvLyBhZGFwdGVyID0gdGhpcy5tYy5kYXRhQWRhcHRlcihhZGFwdGVyQ2ZnKTtcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdjYXB0aW9uLWNoYXJ0JyxcbiAgICAgICAgICAgIGNoYXJ0OiB0aGlzLm1jLmNoYXJ0KHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6ICcwJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5tZWFzdXJlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxuICAgICAgICAgICAgeEF4aXNSb3cgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xuICAgICAgICAgICAgLy8gdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDb2xEaW1IZWFkaW5nKHRhYmxlLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIHRoaXMubWVhc3VyZXMpO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeHRyYSBjZWxsIGZvciB5IGF4aXMuIEVzc2VudGlhbGx5IFkgYXhpcyBmb290ZXIuXG4gICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXhpcy1mb290ZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWF4TGVuZ3RoIC0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3gtYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzSG9yaXpvbnRhbCc6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3gtYXhpcy1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFJpZ2h0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZVBhZGRpbmcnOiAwLjVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMubWVhc3VyZXMubGVuZ3RoXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnNwbGljZShkaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gZGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGRpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbaSArIDFdID0gZGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBkaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zW2kgLSAxXSA9IGRpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSB0aGlzLm1lYXN1cmVzO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZWFzdXJlcy5zcGxpY2UobWVhc3VyZXMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lYXN1cmVzLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gbWVhc3VyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBtZWFzdXJlc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXNbaSArIDFdID0gbWVhc3VyZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZWFzdXJlc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IG1lYXN1cmVzW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tpIC0gMV0gPSBtZWFzdXJlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lYXN1cmVzW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuZGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm1lYXN1cmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMubWVhc3VyZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBpaSA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBqaiA9IDAsXG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCB0MiA9IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICB5QXhpcztcbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93TGFzdENoYXJ0ID0gdGhpcy5jcm9zc3RhYltpXVt0aGlzLmNyb3NzdGFiW2ldLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHJvd0xhc3RDaGFydC5tYXggfHwgcm93TGFzdENoYXJ0Lm1pbikge1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNYXggPCByb3dMYXN0Q2hhcnQubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1heCA9IHJvd0xhc3RDaGFydC5tYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxNaW4gPiByb3dMYXN0Q2hhcnQubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IHJvd0xhc3RDaGFydC5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV0sXG4gICAgICAgICAgICAgICAgcm93QXhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykge1xuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gY3Jvc3N0YWJFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoIXlBeGlzICYmIGNyb3NzdGFiRWxlbWVudC5jaGFydCAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQuY29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICB5QXhpcyA9IGNyb3NzdGFiRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNyb3NzdGFiRWxlbWVudCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoeUF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYXhpcy1mb290ZXItY2VsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGFydCA9IHlBeGlzLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2UgPSBjaGFydC5nZXRDaGFydEluc3RhbmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRJbnN0YW5jZS5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCA9IGxpbWl0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5MaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQpWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnRPYmo7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGhpcy5jcm9zc3RhYik7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5ldmVudExpc3QubW9kZWxVcGRhdGVkLCAoZSwgZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3Jvc3N0YWIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJpbicsIChldnQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocm93W2pdLmNoYXJ0LmNvbmYudHlwZSA9PT0gJ2NhcHRpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1tqXS5jaGFydC5jb25mLnR5cGUgPT09ICdheGlzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkgPSB0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlWYWwgPSBkYXRhLmRhdGFbY2F0ZWdvcnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsQWRhcHRlci5oaWdobGlnaHQoY2F0ZWdvcnlWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWMuYWRkRXZlbnRMaXN0ZW5lcignaG92ZXJvdXQnLCAoZXZ0LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmNyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93W2pdLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShyb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnY2FwdGlvbicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbal0uY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGxBZGFwdGVyID0gcm93W2pdLmNoYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxBZGFwdGVyLmhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZENyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgaSwgaWksXG4gICAgICAgICAgICBqLCBqaixcbiAgICAgICAgICAgIG9sZENoYXJ0cyA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsTWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgZ2xvYmFsTWluID0gSW5maW5pdHksXG4gICAgICAgICAgICBheGlzTGltaXRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSAhPT0gJ2NhcHRpb24nICYmIGNoYXJ0Q29uZi50eXBlICE9PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZENoYXJ0cy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLnJvd0hhc2ggJiYgY2VsbC5jb2xIYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRDaGFydCA9IHRoaXMuZ2V0T2xkQ2hhcnQob2xkQ2hhcnRzLCBjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRDaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0T2JqID0gdGhpcy5nZXRDaGFydE9iaihjZWxsLnJvd0hhc2gsIGNlbGwuY29sSGFzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaGFydCA9IGNoYXJ0T2JqWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRzID0gY2hhcnRPYmpbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jaGFydCA9IG9sZENoYXJ0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobGltaXRzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWF4ID0gbGltaXRzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwubWluID0gbGltaXRzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gZmlsdGVyZWRDcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gZmlsdGVyZWRDcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5tYXggfHwgY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE1heCA8IGNlbGwubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxNYXggPSBjZWxsLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsTWluID4gY2VsbC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE1pbiA9IGNlbGwubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBmaWx0ZXJlZENyb3NzdGFiLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByb3cgPSBmaWx0ZXJlZENyb3NzdGFiW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsID0gcm93W2pdO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNoYXJ0ICYmIGNlbGwuY2hhcnQuY29uZi50eXBlID09PSAnYXhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0F4aXMgPSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93QXhpcy5jaGFydC5jb25mLmNvbmZpZy5jaGFydC5heGlzVHlwZSA9PT0gJ3knKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXhpc0NoYXJ0ID0gcm93QXhpcy5jaGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBheGlzQ2hhcnQuY29uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5jb25maWcuY2hhcnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogZ2xvYmFsTWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydEJvdHRvbU1hcmdpbic6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydFRvcE1hcmdpbic6IDEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09PSAnYmFyMmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZy5jaGFydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBnbG9iYWxNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBnbG9iYWxNYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnRMZWZ0TWFyZ2luJzogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0UmlnaHRNYXJnaW4nOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNIb3Jpem9udGFsJzogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzQ2hhcnQgPSB0aGlzLm1jLmNoYXJ0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dBeGlzLmNoYXJ0ID0gYXhpc0NoYXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcm9zc3RhYiA9IGZpbHRlcmVkQ3Jvc3N0YWI7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCgpO1xuICAgICAgICBheGlzTGltaXRzID0gdGhpcy5nZXRZQXhpc0xpbWl0cygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuY3Jvc3N0YWIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRoaXMuY3Jvc3N0YWJbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBjcm9zc3RhYkVsZW1lbnQgPSByb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKCFjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSAmJlxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcgJiZcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2F4aXMtZm9vdGVyLWNlbGwnICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2NhcHRpb24nICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jaGFydC5nZXRDb25mKCkudHlwZSAhPT0gJ2F4aXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNMaW1pdHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzTGltaXRzWzFdKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0LnVwZGF0ZShjaGFydE9iai5nZXRDb25mKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFlBeGlzTGltaXRzICgpIHtcbiAgICAgICAgbGV0IGksIGlpLFxuICAgICAgICAgICAgaiwgamo7XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gdGhpcy5jcm9zc3RhYi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5jcm9zc3RhYltpXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gcm93Lmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDb25mID0gY2VsbC5jaGFydC5nZXRDb25mKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFydENvbmYudHlwZSA9PT0gJ2F4aXMnICYmIGNoYXJ0Q29uZi5jb25maWcuY2hhcnQuYXhpc1R5cGUgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjZWxsLmNoYXJ0LmdldENoYXJ0SW5zdGFuY2UoKS5nZXRMaW1pdHMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRPbGRDaGFydCAob2xkQ2hhcnRzLCByb3dIYXNoLCBjb2xIYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBvbGRDaGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChvbGRDaGFydHNbaV0ucm93SGFzaCA9PT0gcm93SGFzaCAmJiBvbGRDaGFydHNbaV0uY29sSGFzaCA9PT0gY29sSGFzaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGRDaGFydHNbaV0uY2hhcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCB0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMudDE7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QuZHJhdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZSh0aGlzLmNyb3NzdGFiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVIZWFkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcih0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAocm93RmlsdGVyLCBjb2xGaWx0ZXIsIG1pbkxpbWl0LCBtYXhMaW1pdCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgLy8gZmlsdGVyZWRKU09OID0gW10sXG4gICAgICAgICAgICAvLyBtYXggPSAtSW5maW5pdHksXG4gICAgICAgICAgICAvLyBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxuICAgICAgICAgICAgLy8gYWRhcHRlciA9IHt9LFxuICAgICAgICAgICAgbGltaXRzID0ge30sXG4gICAgICAgICAgICBjaGFydCA9IHt9LFxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbdGhpcy5kaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXRDaGlsZE1vZGVsKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIC8vIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWx0ZXJlZEpTT04ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgLy8gICAgIGlmIChmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXSA+IG1heCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bY29sRmlsdGVyXTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdIDwgbWluKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVtjb2xGaWx0ZXJdO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGlmIChtaW5MaW1pdCAhPT0gdW5kZWZpbmVkICYmIG1heExpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnLmNoYXJ0LnlBeGlzTWF4VmFsdWUgPSBtYXhMaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoYXJ0ID0gdGhpcy5tYy5jaGFydCh7XG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogZmlsdGVyZWREYXRhLFxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbdGhpcy5kaW1lbnNpb25zW3RoaXMuZGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZTogW2NvbEZpbHRlcl0sXG4gICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxpbWl0cyA9IGNoYXJ0LmdldExpbWl0KCk7XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbGltaXRzLm1heCxcbiAgICAgICAgICAgICAgICAnbWluJzogbGltaXRzLm1pblxuICAgICAgICAgICAgfSwgY2hhcnRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhZ0xpc3RlbmVyIChwbGFjZUhvbGRlcikge1xuICAgICAgICAvLyBHZXR0aW5nIG9ubHkgbGFiZWxzXG4gICAgICAgIGxldCBvcmlnQ29uZmlnID0gdGhpcy5zdG9yZVBhcmFtcy5jb25maWcsXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gb3JpZ0NvbmZpZy5kaW1lbnNpb25zIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXMgPSBvcmlnQ29uZmlnLm1lYXN1cmVzIHx8IFtdLFxuICAgICAgICAgICAgbWVhc3VyZXNMZW5ndGggPSBtZWFzdXJlcy5sZW5ndGgsXG4gICAgICAgICAgICBkaW1lbnNpb25zTGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNIb2xkZXIsXG4gICAgICAgICAgICBtZWFzdXJlc0hvbGRlcixcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBsZXQgZW5kXG4gICAgICAgIHBsYWNlSG9sZGVyID0gcGxhY2VIb2xkZXJbMV07XG4gICAgICAgIC8vIE9taXR0aW5nIGxhc3QgZGltZW5zaW9uXG4gICAgICAgIGRpbWVuc2lvbnMgPSBkaW1lbnNpb25zLnNsaWNlKDAsIGRpbWVuc2lvbnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGRpbWVuc2lvbnNMZW5ndGggPSBkaW1lbnNpb25zLmxlbmd0aDtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBkaW1lbnNpb24gaG9sZGVyXG4gICAgICAgIGRpbWVuc2lvbnNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZSgwLCBkaW1lbnNpb25zTGVuZ3RoKTtcbiAgICAgICAgLy8gU2V0dGluZyB1cCBtZWFzdXJlcyBob2xkZXJcbiAgICAgICAgLy8gT25lIHNoaWZ0IGZvciBibGFuayBib3hcbiAgICAgICAgbWVhc3VyZXNIb2xkZXIgPSBwbGFjZUhvbGRlci5zbGljZShkaW1lbnNpb25zTGVuZ3RoICsgMSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNMZW5ndGggKyBtZWFzdXJlc0xlbmd0aCArIDEpO1xuICAgICAgICBzZXR1cExpc3RlbmVyKGRpbWVuc2lvbnNIb2xkZXIsIGRpbWVuc2lvbnMsIGRpbWVuc2lvbnNMZW5ndGgsIHRoaXMuZGltZW5zaW9ucyk7XG4gICAgICAgIHNldHVwTGlzdGVuZXIobWVhc3VyZXNIb2xkZXIsIG1lYXN1cmVzLCBtZWFzdXJlc0xlbmd0aCwgdGhpcy5tZWFzdXJlcyk7XG4gICAgICAgIGZ1bmN0aW9uIHNldHVwTGlzdGVuZXIgKGhvbGRlciwgYXJyLCBhcnJMZW4sIGdsb2JhbEFycikge1xuICAgICAgICAgICAgbGV0IGxpbWl0TGVmdCA9IDAsXG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IDAsXG4gICAgICAgICAgICAgICAgbGFzdCA9IGFyckxlbiAtIDEsXG4gICAgICAgICAgICAgICAgbG4gPSBNYXRoLmxvZzI7XG5cbiAgICAgICAgICAgIGlmIChob2xkZXJbMF0pIHtcbiAgICAgICAgICAgICAgICBsaW1pdExlZnQgPSBwYXJzZUludChob2xkZXJbMF0uZ3JhcGhpY3Muc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgbGltaXRSaWdodCA9IHBhcnNlSW50KGhvbGRlcltsYXN0XS5ncmFwaGljcy5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJMZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IGhvbGRlcltpXS5ncmFwaGljcyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGhvbGRlcltpXSxcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSAwLFxuICAgICAgICAgICAgICAgICAgICBkaWZmID0gMDtcbiAgICAgICAgICAgICAgICBpdGVtLmNlbGxWYWx1ZSA9IGFycltpXTtcbiAgICAgICAgICAgICAgICBpdGVtLm9yaWdMZWZ0ID0gcGFyc2VJbnQoZWwuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZWRab25lID0gaXRlbS5vcmlnTGVmdCArIHBhcnNlSW50KGVsLnN0eWxlLndpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgaXRlbS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbS5hZGp1c3QgPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW0ub3JpZ1ogPSBlbC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0dXBEcmFnKGl0ZW0uZ3JhcGhpY3MsIGZ1bmN0aW9uIGRyYWdTdGFydCAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgICAgIG5MZWZ0ID0gaXRlbS5vcmlnTGVmdCArIGR4ICsgaXRlbS5hZGp1c3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuTGVmdCA8IGxpbWl0TGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZiA9IGxpbWl0TGVmdCAtIG5MZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdExlZnQgLSBsbihkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobkxlZnQgPiBsaW1pdFJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmID0gbkxlZnQgLSBsaW1pdFJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbkxlZnQgPSBsaW1pdFJpZ2h0ICsgbG4oZGlmZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubGVmdCA9IG5MZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuekluZGV4ID0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgbWFuYWdlU2hpZnRpbmcoaXRlbS5pbmRleCwgZmFsc2UsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIG1hbmFnZVNoaWZ0aW5nKGl0ZW0uaW5kZXgsIHRydWUsIGhvbGRlcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gZHJhZ0VuZCAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkanVzdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IGl0ZW0ub3JpZ1o7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmxlZnQgPSBpdGVtLm9yaWdMZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBhcnJMZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbEFycltqXSAhPT0gaG9sZGVyW2pdLmNlbGxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEFycltqXSA9IGhvbGRlcltqXS5jZWxsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nbG9iYWxEYXRhID0gc2VsZi5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1hbmFnZVNoaWZ0aW5nIChpbmRleCwgaXNSaWdodCwgaG9sZGVyKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBbXSxcbiAgICAgICAgICAgICAgICBkcmFnSXRlbSA9IGhvbGRlcltpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IGlzUmlnaHQgPyBpbmRleCArIDEgOiBpbmRleCAtIDEsXG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0gPSBob2xkZXJbbmV4dFBvc107XG4gICAgICAgICAgICAvLyBTYXZpbmcgZGF0YSBmb3IgbGF0ZXIgdXNlXG4gICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKCFpc1JpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChkcmFnSXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0KSA8IG5leHRJdGVtLnJlZFpvbmUpKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrLnBvcCgpIHx8XG4gICAgICAgICAgICAgICAgICAgIChpc1JpZ2h0ICYmIHBhcnNlSW50KGRyYWdJdGVtLmdyYXBoaWNzLnN0eWxlLmxlZnQpID4gbmV4dEl0ZW0ub3JpZ0xlZnQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2sucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5yZWRab25lKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0SXRlbS5vcmlnTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV4dEl0ZW0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdJdGVtLmFkanVzdCArPSBwYXJzZUludChuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnSXRlbS5hZGp1c3QgLT0gcGFyc2VJbnQobmV4dEl0ZW0uZ3JhcGhpY3Muc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLm9yaWdMZWZ0ID0gZHJhZ0l0ZW0ub3JpZ0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnJlZFpvbmUgPSBkcmFnSXRlbS5yZWRab25lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5pbmRleCA9IGRyYWdJdGVtLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5ncmFwaGljcy5zdHlsZS5sZWZ0ID0gbmV4dEl0ZW0ub3JpZ0xlZnQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGhvbGRlcltuZXh0UG9zXSk7XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltuZXh0UG9zXSA9IGhvbGRlcltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGhvbGRlcltpbmRleF0gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXR0aW5nIG5ldyB2YWx1ZXMgZm9yIGRyYWdpdGVtXG4gICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgZHJhZ0l0ZW0uaW5kZXggPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBkcmFnSXRlbS5vcmlnTGVmdCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIGRyYWdJdGVtLnJlZFpvbmUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZXR1cERyYWcgKGVsLCBoYW5kbGVyLCBoYW5kbGVyMikge1xuICAgICAgICBsZXQgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tSGFuZGxlciAoZSkge1xuICAgICAgICAgICAgaGFuZGxlcihlLmNsaWVudFggLSB4LCBlLmNsaWVudFkgLSB5KTtcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFk7XG4gICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gbW91c2VVcEhhbmRsZXIgKGUpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjdXN0b21IYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoaGFuZGxlcjIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDEzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxMCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAxLFxuICAgICAgICAnUHJvZml0JzogMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogMSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDgsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogMTIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAwLFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogOCxcbiAgICAgICAgJ1Byb2ZpdCc6IDMsXG4gICAgICAgICdWaXNpdG9ycyc6IDE1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiA5LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDUsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAzLFxuICAgICAgICAnUHJvZml0JzogNyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiAyLFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDgsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDcsXG4gICAgICAgICdQcm9maXQnOiAxNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMixcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDMsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDUsXG4gICAgICAgICdQcm9maXQnOiA4LFxuICAgICAgICAnVmlzaXRvcnMnOiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogMSxcbiAgICAgICAgJ1Byb2ZpdCc6IDEyLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDIsXG4gICAgICAgICdWaXNpdG9ycyc6IDE3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdW4nLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDEwLFxuICAgICAgICAnUHJvZml0JzogMTEsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogMTQsXG4gICAgICAgICdWaXNpdG9ycyc6IDE4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0F1ZycsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDEsXG4gICAgICAgICdQcm9maXQnOiAxMixcbiAgICAgICAgJ1Zpc2l0b3JzJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmloYXInLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNCxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDEyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNixcbiAgICAgICAgJ1Byb2ZpdCc6IDYsXG4gICAgICAgICdWaXNpdG9ycyc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogNSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bHknLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA5LFxuICAgICAgICAnUHJvZml0JzogMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA2LFxuICAgICAgICAnUHJvZml0JzogMTAsXG4gICAgICAgICdWaXNpdG9ycyc6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA3LFxuICAgICAgICAnUHJvZml0JzogNCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDIsXG4gICAgICAgICdQcm9maXQnOiAxMyxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNScsXG4gICAgICAgICdNb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogNSxcbiAgICAgICAgJ1Byb2ZpdCc6IDE0LFxuICAgICAgICAnVmlzaXRvcnMnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTUnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDExLFxuICAgICAgICAnVmlzaXRvcnMnOiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ0p1bicsXG4gICAgICAgICdRdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnU2FsZSc6IDQsXG4gICAgICAgICdQcm9maXQnOiAxLFxuICAgICAgICAnVmlzaXRvcnMnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ1F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ1NhbGUnOiA0LFxuICAgICAgICAnUHJvZml0JzogOCxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ1F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdTYWxlJzogMTAsXG4gICAgICAgICdQcm9maXQnOiA2LFxuICAgICAgICAnVmlzaXRvcnMnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnSnVseScsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDAsXG4gICAgICAgICdWaXNpdG9ycyc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiA4LFxuICAgICAgICAnUHJvZml0JzogOSxcbiAgICAgICAgJ1Zpc2l0b3JzJzogMTdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ1Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnU3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ1llYXInOiAnMjAxNicsXG4gICAgICAgICdNb250aCc6ICdBdWcnLFxuICAgICAgICAnUXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnU2FsZSc6IDYsXG4gICAgICAgICdQcm9maXQnOiA1LFxuICAgICAgICAnVmlzaXRvcnMnOiAxOFxuICAgIH0sXG4gICAge1xuICAgICAgICAnUHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdTdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAnWWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ01vbnRoJzogJ1NlcHQnLFxuICAgICAgICAnUXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ1NhbGUnOiAxMCxcbiAgICAgICAgJ1Byb2ZpdCc6IDksXG4gICAgICAgICdWaXNpdG9ycyc6IDE0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdQcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ1N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICdZZWFyJzogJzIwMTYnLFxuICAgICAgICAnTW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdRdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdTYWxlJzogNyxcbiAgICAgICAgJ1Byb2ZpdCc6IDcsXG4gICAgICAgICdWaXNpdG9ycyc6IDE2XG4gICAgfVxuXTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xhcmdlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9