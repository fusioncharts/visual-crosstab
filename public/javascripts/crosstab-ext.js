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
	    rowDimensions: ['product', 'state'],
	    colDimensions: ['year', 'quality', 'month'],
	    chartType: 'column2d',
	    noDataMessage: 'No data to be displayed.',
	    measure: 'sale',
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
	            'bgColor': '#ffffff',
	            'showXAxisLine': '1',
	            'plotBorderAlpha': '0',
	            'showXaxisValues': '0',
	            'showYAxisValues': '0',
	            'animation': '1',
	            'alternateHGridAlpha': '0',
	            'canvasBorderAlpha': '100',
	            'alternateVGridAlpha': '0',
	            'paletteColors': '#B5B9BA',
	            'usePlotGradientColor': '0',
	            'valueFontColor': '#ffffff',
	            'xAxisLineColor': '#ffffff',
	            'canvasBorderColor': '#000000'
	        }
	    }
	};
	
	window.crosstab = new CrosstabExt(data, config);
	window.crosstab.renderCrosstab();


/***/ },
/* 1 */
/***/ function(module, exports) {

	class CrosstabExt {
	    constructor (data, config) {
	        let self = this;
	        this.data = data;
	        this.mc = new MultiCharting();
	        this.dataStore = this.mc.createDataStore();
	        this.dataStore.setData({ dataSource: this.data });
	        this.t1 = performance.now();
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
	            let filterConfig = {};
	            this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box', function (data) {
	                self.dataStore = data;
	                self.globalData = self.buildGlobalData();
	                self.renderCrosstab();
	            });
	        }
	    }
	
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
	                ' ' + this.rowDimensions[currentIndex] +
	                ' ' + fieldValues[i].toLowerCase();
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
	                for (let j = 0; j < colLength; j += 1) {
	                    let chartCellObj = {
	                        width: this.cellWidth,
	                        height: this.cellHeight,
	                        rowspan: 1,
	                        colspan: 1,
	                        rowHash: filteredDataHashKey,
	                        colHash: this.columnKeyArr[j]
	                    };
	                    table[table.length - 1].push(chartCellObj);
	                    minmaxObj = this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])[0];
	                    max = (parseInt(minmaxObj.max) > max) ? minmaxObj.max : max;
	                    min = (parseInt(minmaxObj.min) < min) ? minmaxObj.min : min;
	                }
	                let adapterCfg = {
	                        config: {
	                            config: {
	                                chart: {
	                                    'dataMin': min,
	                                    'dataMax': max,
	                                    'isAxisOpposite': true,
	                                    'borderthickness': 0
	                                }
	                            }
	                        },
	                        datastore: this.dataStore
	                    },
	                    adapter = this.mc.dataadapter(adapterCfg);
	                // table[table.length - 1].push({
	                //     chart: {
	                //         'type': 'axis',
	                //         'axisType': 'y',
	                //         'width': '100%',
	                //         'height': '100%',
	                //         'dataFormat': 'json',
	                //         'configuration': {
	                //             'data': {
	                //                 'config': {
	                //                     'chart': {
	                //                         'dataMin': min,
	                //                         'dataMax': max,
	                //                         'isAxisOpposite': true,
	                //                         'borderthickness': 0
	                //                     }
	                //                 }
	                //             }
	                //         }
	                //     }
	                // });
	                table[table.length - 1].push({
	                    rowspan: 1,
	                    colspan: 1,
	                    chart: {
	                        'type': 'axis',
	                        'axisType': 'y',
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
	
	    createCol (table, data, colOrder, currentIndex, filteredDataStore) {
	        var colspan = 0,
	            fieldComponent = colOrder[currentIndex],
	            fieldValues = data[fieldComponent],
	            i, l = fieldValues.length,
	            colElement,
	            hasFurtherDepth = currentIndex < (colOrder.length - 1),
	            filteredDataHashKey,
	            htmlRef;
	
	        if (table.length <= currentIndex) {
	            table.push([]);
	        }
	        for (i = 0; i < l; i += 1) {
	            let classStr = '';
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = fieldValues[i];
	            htmlRef.style.textAlign = 'center';
	            document.body.appendChild(htmlRef);
	            classStr += 'column-dimensions' +
	                ' ' + this.colDimensions[currentIndex] +
	                ' ' + fieldValues[i].toLowerCase();
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
	
	    createRowDimHeading (table, colOrderLength) {
	        var cornerCellArr = [],
	            i = 0,
	            htmlRef;
	
	        for (i = 0; i < this.rowDimensions.length; i++) {
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = this.rowDimensions[i][0].toUpperCase() + this.rowDimensions[i].substr(1);
	            htmlRef.style.textAlign = 'center';
	            htmlRef.style.marginTop = ((30 * this.colDimensions.length - 15) / 2) + 'px';
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
	
	    createColDimHeading (table, index) {
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
	
	    createCaption (table, maxLength) {
	        let adapterCfg = {
	                config: {
	                    config: {
	                        chart: {
	                            'caption': 'Sale of Cereal',
	                            'subcaption': 'Across States, Across Years',
	                            'borderthickness': '0'
	                        }
	                    }
	                },
	                datastore: this.dataStore
	            },
	            adapter = this.mc.dataadapter(adapterCfg);
	        // table.unshift([{
	        //     height: 50,
	        //     rowspan: 1,
	        //     colspan: maxLength,
	        //     chart: {
	        //         'type': 'caption',
	        //         'width': '100%',
	        //         'height': '100%',
	        //         'dataFormat': 'json',
	        //         'configuration': {
	        //             'data': {
	        //                 'config': {
	        //                     'chart': {
	        //                         'caption': 'Sale of Cereal',
	        //                         'subcaption': 'Across States, Across Years',
	        //                         'borderthickness': '0'
	        //                     }
	        //                 }
	        //             }
	        //         }
	        //     }
	        // }]);
	        table.unshift([{
	            height: 50,
	            rowspan: 1,
	            colspan: maxLength,
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
	
	    createCrosstab () {
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
	                maxLength = (maxLength < table[i].length) ? table[i].length : maxLength;
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
	                let categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]],
	                    adapterCfg = {
	                        config: {
	                            config: {
	                                chart: {
	                                    'borderthickness': 0,
	                                    'canvasPadding': 15
	                                },
	                                categories: categories
	                            }
	                        },
	                        datastore: this.dataStore
	                    },
	                    adapter = this.mc.dataadapter(adapterCfg);
	                // xAxisRow.push({
	                //     width: '100%',
	                //     height: 20,
	                //     rowspan: 1,
	                //     colspan: 1,
	                //     chart: {
	                //         'type': 'axis',
	                //         'width': '100%',
	                //         'height': '100%',
	                //         'dataFormat': 'json',
	                //         'axisType': 'x',
	                //         'configuration': {
	                //             'data': {
	                //                 'config': {
	                //                     'chart': {
	                //                         'borderthickness': 0,
	                //                         'canvasPadding': 15
	                //                     },
	                //                     'categories': categories
	                //                 }
	                //             }
	                //         }
	                //     }
	                // });
	                xAxisRow.push({
	                    width: '100%',
	                    height: 20,
	                    rowspan: 1,
	                    colspan: 1,
	                    chart: {
	                        'type': 'axis',
	                        'width': '100%',
	                        'height': '100%',
	                        'dataFormat': 'json',
	                        'axisType': 'x',
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
	
	    rowDimReorder (subject, target) {
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
	
	    colDimReorder (subject, target) {
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
	
	    mergeDimensions () {
	        let dimensions = [];
	        for (let i = 0, l = this.rowDimensions.length; i < l; i++) {
	            dimensions.push(this.rowDimensions[i]);
	        }
	        for (let i = 0, l = this.colDimensions.length; i < l; i++) {
	            dimensions.push(this.colDimensions[i]);
	        }
	        return dimensions;
	    }
	
	    createFilters () {
	        let filters = [];
	        for (let i = 0, l = this.dimensions.length; i < l; i++) {
	            if (this.measureOnRow && this.dimensions[i] !== this.rowDimensions[this.rowDimensions.length - 1]) {
	                let matchedValues = this.globalData[this.dimensions[i]];
	                for (let j = 0, len = matchedValues.length; j < len; j++) {
	                    filters.push({
	                        filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
	                        filterVal: matchedValues[j]
	                    });
	                }
	            } else if (!this.measureOnRow && this.dimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
	                let matchedValues = this.globalData[this.dimensions[i]];
	                for (let j = 0, len = matchedValues.length; j < len; j++) {
	                    filters.push({
	                        filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
	                        filterVal: matchedValues[j]
	                    });
	                }
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
	                if (this.measureOnRow && key !== this.rowDimensions[this.rowDimensions.length - 1]) {
	                    tempObj[key] = this.globalData[key];
	                } else if (!this.measureOnRow && key !== this.colDimensions[this.colDimensions.length - 1]) {
	                    tempObj[key] = this.globalData[key];
	                }
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
	        let crosstab = this.createCrosstab(),
	            matrix = this.createMultiChart(crosstab),
	            t2 = performance.now();
	        for (let i = 0, ii = matrix.length; i < ii; i++) {
	            let row = matrix[i];
	            for (let j = 0, jj = row.length; j < jj; j++) {
	                let cell = row[j],
	                    crosstabElement = crosstab[i][j],
	                    rowAxis = row[row.length - 1];
	                if (!(crosstabElement.hasOwnProperty('chart') || crosstabElement.hasOwnProperty('html')) &&
	                    crosstabElement.className !== 'blank-cell') {
	                    let limits = rowAxis.chart.chartObj.getLimits(),
	                        minLimit = limits[0],
	                        maxLimit = limits[1],
	                        chart = this.getChartObj(crosstabElement.rowHash, crosstabElement.colHash)[1];
	                    chart.configuration.data.config.chart.yAxisMinValue = minLimit;
	                    chart.configuration.data.config.chart.yAxisMaxValue = maxLimit;
	                    crosstabElement.chart = chart;
	                    window.ctPerf += (performance.now() - t2);
	                    cell.update(crosstabElement);
	                }
	                t2 = performance.now();
	            }
	        }
	    }
	
	    createMultiChart (matrix) {
	        if (this.multichartObject === undefined) {
	            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, matrix);
	            window.ctPerf = performance.now() - this.t1;
	            this.multichartObject.draw();
	        } else {
	            this.multichartObject.update(matrix);
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
	
	    getChartObj (rowFilter, columnFilter) {
	        let filters = [],
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
	            filteredData = this.dataStore.getData(dataProcessors);
	            filteredData = filteredData[filteredData.length - 1];
	            filteredJSON = filteredData.getJSON();
	            for (let i = 0, ii = filteredJSON.length; i < ii; i++) {
	                if (filteredJSON[i][this.measure] > max) {
	                    max = filteredJSON[i][this.measure];
	                }
	                if (filteredJSON[i][this.measure] < min) {
	                    min = filteredJSON[i][this.measure];
	                }
	            }
	            adapterCfg = {
	                config: {
	                    dimension: this.measureOnRow
	                        ? [this.rowDimensions[this.rowDimensions.length - 1]]
	                        : [this.colDimensions[this.colDimensions.length - 1]],
	                    measure: [this.measure],
	                    seriesType: 'SS',
	                    aggregateMode: this.aggregation,
	                    categories: categories,
	                    config: this.chartConfig
	                },
	                datastore: filteredData
	            };
	            adapter = this.mc.dataadapter(adapterCfg);
	            // return [{
	            //     'max': max,
	            //     'min': min
	            // }, {
	            //     type: this.chartType,
	            //     width: '100%',
	            //     height: '100%',
	            //     jsonData: filteredJSON,
	            //     configuration: {
	            //         data: {
	            //             dimension: this.measureOnRow
	            //                 ? [this.rowDimensions[this.rowDimensions.length - 1]]
	            //                 : [this.colDimensions[this.colDimensions.length - 1]],
	            //             measure: [this.measure],
	            //             seriesType: 'SS',
	            //             aggregateMode: this.aggregation,
	            //             categories: categories,
	            //             config: this.chartConfig
	            //         }
	            //     }
	            // }];
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
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 1
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 1
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 3
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 3
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 10
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 9
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 1
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 10
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'Rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 3
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 2
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 10
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 1
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 10
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 1
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 9
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 2
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 4
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 10
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 10
	    },
	    {
	        'product': 'Wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 7
	    }
	];


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDhiOTk3ZGQ1YWM2NDAwYzFhYzMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyx3QkFBd0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6dEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ4Yjk5N2RkNWFjNjQwMGMxYWMzIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXHJcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcclxuXHJcbnZhciBjb25maWcgPSB7XHJcbiAgICByb3dEaW1lbnNpb25zOiBbJ3Byb2R1Y3QnLCAnc3RhdGUnXSxcclxuICAgIGNvbERpbWVuc2lvbnM6IFsneWVhcicsICdxdWFsaXR5JywgJ21vbnRoJ10sXHJcbiAgICBjaGFydFR5cGU6ICdjb2x1bW4yZCcsXHJcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBiZSBkaXNwbGF5ZWQuJyxcclxuICAgIG1lYXN1cmU6ICdzYWxlJyxcclxuICAgIG1lYXN1cmVPblJvdzogZmFsc2UsXHJcbiAgICBjZWxsV2lkdGg6IDEyMCxcclxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcclxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcclxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcclxuICAgIGNoYXJ0Q29uZmlnOiB7XHJcbiAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXHJcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxyXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxyXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXHJcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXHJcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcclxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcclxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcclxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcclxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcclxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXHJcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnLFxyXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcclxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnI0I1QjlCQScsXHJcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcclxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAneEF4aXNMaW5lQ29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJDb2xvcic6ICcjMDAwMDAwJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbndpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xyXG53aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgQ3Jvc3N0YWJFeHQge1xyXG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xyXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcclxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xyXG4gICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XHJcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcclxuICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnMgPSBjb25maWcucm93RGltZW5zaW9ucztcclxuICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnMgPSBjb25maWcuY29sRGltZW5zaW9ucztcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xyXG4gICAgICAgIHRoaXMubWVhc3VyZSA9IGNvbmZpZy5tZWFzdXJlO1xyXG4gICAgICAgIHRoaXMubWVhc3VyZU9uUm93ID0gY29uZmlnLm1lYXN1cmVPblJvdztcclxuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XHJcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbjtcclxuICAgICAgICB0aGlzLmF4ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcclxuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94JywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGF0YVN0b3JlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcclxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcclxuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXHJcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcclxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcclxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcclxuICAgICAgICAgICAgcm93RWxlbWVudCxcclxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxyXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGgsXHJcbiAgICAgICAgICAgIGh0bWxSZWYsXHJcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xyXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xyXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcclxuICAgICAgICAgICAgICAgICcgJyArIHRoaXMucm93RGltZW5zaW9uc1tjdXJyZW50SW5kZXhdICtcclxuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5yb3dEaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XHJcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcclxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkpIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGFkYXB0ZXJDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogbWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaXNBeGlzT3Bwb3NpdGUnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXN0b3JlOiB0aGlzLmRhdGFTdG9yZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XHJcbiAgICAgICAgICAgICAgICAvLyB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAndHlwZSc6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnY29uZmlndXJhdGlvbic6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICdjb25maWcnOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWluJzogbWluLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBtYXgsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAnaXNBeGlzT3Bwb3NpdGUnOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDBcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXhpc1R5cGUnOiAneScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93c3BhbjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xyXG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcclxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBjb2xPcmRlcltjdXJyZW50SW5kZXhdLFxyXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxyXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxyXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXHJcbiAgICAgICAgICAgIGh0bWxSZWY7XHJcblxyXG4gICAgICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xyXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xyXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnY29sdW1uLWRpbWVuc2lvbnMnICtcclxuICAgICAgICAgICAgICAgICcgJyArIHRoaXMuY29sRGltZW5zaW9uc1tjdXJyZW50SW5kZXhdICtcclxuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XHJcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcclxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xyXG5cclxuICAgICAgICAgICAgdGFibGVbY3VycmVudEluZGV4XS5wdXNoKGNvbEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVJvd0RpbUhlYWRpbmcgKHRhYmxlLCBjb2xPcmRlckxlbmd0aCkge1xyXG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXHJcbiAgICAgICAgICAgIGkgPSAwLFxyXG4gICAgICAgICAgICBodG1sUmVmO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnJvd0RpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgoMzAgKiB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMTUpIC8gMikgKyAncHgnO1xyXG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucm93RGltZW5zaW9uc1tpXSAqIDEwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBjb2xPcmRlckxlbmd0aCxcclxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XHJcbiAgICAgICAgdmFyIGkgPSBpbmRleCxcclxuICAgICAgICAgICAgaHRtbFJlZjtcclxuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5jb2xEaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLmNvbERpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICB0YWJsZVtpXS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvbERpbWVuc2lvbnNbaV0ubGVuZ3RoICogMTAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcclxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNhcHRpb24gKHRhYmxlLCBtYXhMZW5ndGgpIHtcclxuICAgICAgICBsZXQgYWRhcHRlckNmZyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhc3RvcmU6IHRoaXMuZGF0YVN0b3JlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xyXG4gICAgICAgIC8vIHRhYmxlLnVuc2hpZnQoW3tcclxuICAgICAgICAvLyAgICAgaGVpZ2h0OiA1MCxcclxuICAgICAgICAvLyAgICAgcm93c3BhbjogMSxcclxuICAgICAgICAvLyAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxyXG4gICAgICAgIC8vICAgICBjaGFydDoge1xyXG4gICAgICAgIC8vICAgICAgICAgJ3R5cGUnOiAnY2FwdGlvbicsXHJcbiAgICAgICAgLy8gICAgICAgICAnd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgLy8gICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxyXG4gICAgICAgIC8vICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXHJcbiAgICAgICAgLy8gICAgICAgICAnY29uZmlndXJhdGlvbic6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAnY2FwdGlvbic6ICdTYWxlIG9mIENlcmVhbCcsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YmNhcHRpb24nOiAnQWNyb3NzIFN0YXRlcywgQWNyb3NzIFllYXJzJyxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XSk7XHJcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXHJcbiAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcclxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzogYWRhcHRlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfV0pO1xyXG4gICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICAgICBvYmogPSB0aGlzLmdsb2JhbERhdGEsXHJcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGFyclthcnIubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHRhYmxlID0gW10sXHJcbiAgICAgICAgICAgIHhBeGlzUm93ID0gW10sXHJcbiAgICAgICAgICAgIGkgPSAwLFxyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xyXG4gICAgICAgIGlmIChvYmopIHtcclxuICAgICAgICAgICAgdGFibGUucHVzaCh0aGlzLmNyZWF0ZVJvd0RpbUhlYWRpbmcodGFibGUsIGNvbE9yZGVyLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xyXG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ29sRGltSGVhZGluZyh0YWJsZSwgMCk7XHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IChtYXhMZW5ndGggPCB0YWJsZVtpXS5sZW5ndGgpID8gdGFibGVbaV0ubGVuZ3RoIDogbWF4TGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1heExlbmd0aCAtIDEgLSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXN0b3JlOiB0aGlzLmRhdGFTdG9yZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYWRhcHRlciA9IHRoaXMubWMuZGF0YWFkYXB0ZXIoYWRhcHRlckNmZyk7XHJcbiAgICAgICAgICAgICAgICAvLyB4QXhpc1Jvdy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGhlaWdodDogMjAsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcm93c3BhbjogMSxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnYXhpc1R5cGUnOiAneCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICdjb25maWd1cmF0aW9uJzoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJ2NvbmZpZyc6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlcnRoaWNrbmVzcyc6IDAsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAnY2FudmFzUGFkZGluZyc6IDE1XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICdjYXRlZ29yaWVzJzogY2F0ZWdvcmllc1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IGFkYXB0ZXJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFibGUucHVzaCh4QXhpc1Jvdyk7XHJcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcclxuICAgICAgICAgICAgICAgIGh0bWw6ICc8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyB0aGlzLm5vRGF0YU1lc3NhZ2UgKyAnPC9wPicsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgY29sc3BhbjogdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGhcclxuICAgICAgICAgICAgfV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcm93RGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxyXG4gICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zID0gdGhpcy5yb3dEaW1lbnNpb25zO1xyXG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zLnNwbGljZShyb3dEaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm93RGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IHJvd0RpbWVuc2lvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xyXG4gICAgICAgICAgICBidWZmZXIgPSByb3dEaW1lbnNpb25zW3N1YmplY3RdO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgcm93RGltZW5zaW9uc1tpICsgMV0gPSByb3dEaW1lbnNpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcclxuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgYnVmZmVyID0gcm93RGltZW5zaW9uc1tzdWJqZWN0XTtcclxuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbaSAtIDFdID0gcm93RGltZW5zaW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb2xEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcclxuICAgICAgICB2YXIgYnVmZmVyID0gJycsXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnMgPSB0aGlzLmNvbERpbWVuc2lvbnM7XHJcbiAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zLnNwbGljZShjb2xEaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29sRGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IGNvbERpbWVuc2lvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xyXG4gICAgICAgICAgICBidWZmZXIgPSBjb2xEaW1lbnNpb25zW3N1YmplY3RdO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgY29sRGltZW5zaW9uc1tpICsgMV0gPSBjb2xEaW1lbnNpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcclxuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgYnVmZmVyID0gY29sRGltZW5zaW9uc1tzdWJqZWN0XTtcclxuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbaSAtIDFdID0gY29sRGltZW5zaW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcclxuICAgIH1cclxuXHJcbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xyXG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLnJvd0RpbWVuc2lvbnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuY29sRGltZW5zaW9uc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XHJcbiAgICAgICAgbGV0IHIgPSBbXSxcclxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxyXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XHJcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcclxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcclxuICAgICAgICByZXR1cm4gdGVtcEFycjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcclxuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxyXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXHJcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcclxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJDcm9zc3RhYiAoKSB7XHJcbiAgICAgICAgbGV0IGNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxyXG4gICAgICAgICAgICBtYXRyaXggPSB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQoY3Jvc3N0YWIpLFxyXG4gICAgICAgICAgICB0MiA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSBtYXRyaXhbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHJvd1tqXSxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQgPSBjcm9zc3RhYltpXVtqXSxcclxuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gcm93W3Jvdy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmICghKGNyb3NzdGFiRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSgnY2hhcnQnKSB8fCBjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2h0bWwnKSkgJiZcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2xhc3NOYW1lICE9PSAnYmxhbmstY2VsbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluTGltaXQgPSBsaW1pdHNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heExpbWl0ID0gbGltaXRzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLmRhdGEuY29uZmlnLmNoYXJ0LnlBeGlzTWluVmFsdWUgPSBtaW5MaW1pdDtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydC5jb25maWd1cmF0aW9uLmRhdGEuY29uZmlnLmNoYXJ0LnlBeGlzTWF4VmFsdWUgPSBtYXhMaW1pdDtcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY3RQZXJmICs9IChwZXJmb3JtYW5jZS5ub3coKSAtIHQyKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnVwZGF0ZShjcm9zc3RhYkVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcclxuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID0gdGhpcy5tYy5jcmVhdGVNYXRyaXgodGhpcy5jcm9zc3RhYkNvbnRhaW5lciwgbWF0cml4KTtcclxuICAgICAgICAgICAgd2luZG93LmN0UGVyZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50MTtcclxuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QudXBkYXRlKG1hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpY2hhcnRPYmplY3QucGxhY2VIb2xkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcclxuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudDtcclxuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XHJcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XHJcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXHJcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5UGVybXV0YXRpb25zLmluZGV4T2YoZmlsdGVyU3RyKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XHJcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcclxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXHJcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcclxuICAgICAgICAgICAgY29sRmlsdGVycyA9IGNvbHVtbkZpbHRlci5zcGxpdCgnfCcpLFxyXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxyXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXHJcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcclxuICAgICAgICAgICAgZmlsdGVyZWRKU09OID0gW10sXHJcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgbWluID0gSW5maW5pdHksXHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9LFxyXG4gICAgICAgICAgICBhZGFwdGVyQ2ZnID0ge30sXHJcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB7fSxcclxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcclxuXHJcbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMsIGNvbEZpbHRlcnMpO1xyXG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcclxuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XHJcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XHJcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcclxuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVtmaWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IGZpbHRlcmVkRGF0YS5nZXRKU09OKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpbHRlcmVkSlNPTi5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW3RoaXMubWVhc3VyZV0gPiBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXggPSBmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXSA8IG1pbikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFkYXB0ZXJDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IHRoaXMubWVhc3VyZU9uUm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW3RoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFt0aGlzLm1lYXN1cmVdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXHJcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRlTW9kZTogdGhpcy5hZ2dyZWdhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGFzdG9yZTogZmlsdGVyZWREYXRhXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGFkYXB0ZXIgPSB0aGlzLm1jLmRhdGFhZGFwdGVyKGFkYXB0ZXJDZmcpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gW3tcclxuICAgICAgICAgICAgLy8gICAgICdtYXgnOiBtYXgsXHJcbiAgICAgICAgICAgIC8vICAgICAnbWluJzogbWluXHJcbiAgICAgICAgICAgIC8vIH0sIHtcclxuICAgICAgICAgICAgLy8gICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxyXG4gICAgICAgICAgICAvLyAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgLy8gICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAgICAgICAvLyAgICAganNvbkRhdGE6IGZpbHRlcmVkSlNPTixcclxuICAgICAgICAgICAgLy8gICAgIGNvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpbWVuc2lvbjogdGhpcy5tZWFzdXJlT25Sb3dcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgID8gW3RoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV1dXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgbWVhc3VyZTogW3RoaXMubWVhc3VyZV0sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFnZ3JlZ2F0ZU1vZGU6IHRoaXMuYWdncmVnYXRpb24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNhdGVnb3JpZXM6IGNhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfV07XHJcbiAgICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICAgICAgJ21heCc6IG1heCxcclxuICAgICAgICAgICAgICAgICdtaW4nOiBtaW5cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICBqc29uRGF0YTogZmlsdGVyZWRKU09OLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjogYWRhcHRlclxyXG4gICAgICAgICAgICB9XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xyXG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gW1xyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAyXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAyXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDEwXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAyXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMTBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMTBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMTBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfVxyXG5dO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==