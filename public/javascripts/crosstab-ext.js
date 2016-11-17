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
	                table[table.length - 1].push({
	                    chart: {
	                        'type': 'axis',
	                        'axisType': 'y',
	                        'width': '100%',
	                        'height': '100%',
	                        'dataFormat': 'json',
	                        'configuration': {
	                            'data': {
	                                'config': {
	                                    'chart': {
	                                        'dataMin': min,
	                                        'dataMax': max,
	                                        'isAxisOpposite': true,
	                                        'borderthickness': 0
	                                    }
	                                }
	                            }
	                        }
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
	        table.unshift([{
	            height: 50,
	            rowspan: 1,
	            colspan: maxLength,
	            chart: {
	                'type': 'caption',
	                'width': '100%',
	                'height': '100%',
	                'dataFormat': 'json',
	                'configuration': {
	                    'data': {
	                        'config': {
	                            'chart': {
	                                'caption': 'Sale of Cereal',
	                                'subcaption': 'Across States, Across Years',
	                                'borderthickness': '0'
	                            }
	                        }
	                    }
	                }
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
	                let categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]];
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
	                        'configuration': {
	                            'data': {
	                                'config': {
	                                    'chart': {
	                                        'borderthickness': 0,
	                                        'canvasPadding': 15
	                                    },
	                                    'categories': categories
	                                }
	                            }
	                        }
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
	            categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]];
	        this.filteredData = {};
	
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
	            this.filteredData = this.dataStore.getData(dataProcessors);
	            this.filteredData = this.filteredData[this.filteredData.length - 1];
	            filteredJSON = this.filteredData.getJSON();
	            for (let i = 0, ii = filteredJSON.length; i < ii; i++) {
	                if (filteredJSON[i][this.measure] > max) {
	                    max = filteredJSON[i][this.measure];
	                }
	                if (filteredJSON[i][this.measure] < min) {
	                    min = filteredJSON[i][this.measure];
	                }
	            }
	            return [{
	                'max': max,
	                'min': min
	            }, {
	                type: this.chartType,
	                width: '100%',
	                height: '100%',
	                jsonData: filteredJSON,
	                configuration: {
	                    data: {
	                        dimension: this.measureOnRow
	                            ? [this.rowDimensions[this.rowDimensions.length - 1]]
	                            : [this.colDimensions[this.colDimensions.length - 1]],
	                        measure: [this.measure],
	                        seriesType: 'SS',
	                        aggregateMode: this.aggregation,
	                        categories: categories,
	                        config: this.chartConfig
	                    }
	                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTc0Yjg1MTVjNjA1M2I3YmEzMGUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyx3QkFBd0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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Q0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE3NGI4NTE1YzYwNTNiN2JhMzBlIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXHJcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcclxuXHJcbnZhciBjb25maWcgPSB7XHJcbiAgICByb3dEaW1lbnNpb25zOiBbJ3Byb2R1Y3QnLCAnc3RhdGUnXSxcclxuICAgIGNvbERpbWVuc2lvbnM6IFsneWVhcicsICdxdWFsaXR5JywgJ21vbnRoJ10sXHJcbiAgICBjaGFydFR5cGU6ICdjb2x1bW4yZCcsXHJcbiAgICBub0RhdGFNZXNzYWdlOiAnTm8gZGF0YSB0byBiZSBkaXNwbGF5ZWQuJyxcclxuICAgIG1lYXN1cmU6ICdzYWxlJyxcclxuICAgIG1lYXN1cmVPblJvdzogZmFsc2UsXHJcbiAgICBjZWxsV2lkdGg6IDEyMCxcclxuICAgIGNlbGxIZWlnaHQ6IDEwMCxcclxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcclxuICAgIGFnZ3JlZ2F0aW9uOiAnc3VtJyxcclxuICAgIGNoYXJ0Q29uZmlnOiB7XHJcbiAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgJ3Nob3dCb3JkZXInOiAnMCcsXHJcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxyXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxyXG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXHJcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXHJcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcclxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcclxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcclxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcclxuICAgICAgICAgICAgJ2FuaW1hdGlvbic6ICcxJyxcclxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXHJcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnLFxyXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcclxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnI0I1QjlCQScsXHJcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcclxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAneEF4aXNMaW5lQ29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJDb2xvcic6ICcjMDAwMDAwJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbndpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xyXG53aW5kb3cuY3Jvc3N0YWIucmVuZGVyQ3Jvc3N0YWIoKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgQ3Jvc3N0YWJFeHQge1xyXG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xyXG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcclxuICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xyXG4gICAgICAgIHRoaXMudDEgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNvbmZpZy5jaGFydFR5cGU7XHJcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcclxuICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnMgPSBjb25maWcucm93RGltZW5zaW9ucztcclxuICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnMgPSBjb25maWcuY29sRGltZW5zaW9ucztcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xyXG4gICAgICAgIHRoaXMubWVhc3VyZSA9IGNvbmZpZy5tZWFzdXJlO1xyXG4gICAgICAgIHRoaXMubWVhc3VyZU9uUm93ID0gY29uZmlnLm1lYXN1cmVPblJvdztcclxuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XHJcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSBjb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5oYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGlvbiA9IGNvbmZpZy5hZ2dyZWdhdGlvbjtcclxuICAgICAgICB0aGlzLmF4ZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm5vRGF0YU1lc3NhZ2UgPSBjb25maWcubm9EYXRhTWVzc2FnZTtcclxuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgZmlsdGVyQ29uZmlnID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlckV4dCA9IG5ldyBGQ0RhdGFGaWx0ZXJFeHQodGhpcy5kYXRhU3RvcmUsIGZpbHRlckNvbmZpZywgJ2NvbnRyb2wtYm94JywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZGF0YVN0b3JlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZ2xvYmFsRGF0YSA9IHNlbGYuYnVpbGRHbG9iYWxEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlbmRlckNyb3NzdGFiKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCkpIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcclxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcclxuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXHJcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcclxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcclxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcclxuICAgICAgICAgICAgcm93RWxlbWVudCxcclxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxyXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGgsXHJcbiAgICAgICAgICAgIGh0bWxSZWYsXHJcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIG1pbm1heE9iaiA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGFzc1N0ciA9ICcnO1xyXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xyXG4gICAgICAgICAgICBjbGFzc1N0ciArPSAncm93LWRpbWVuc2lvbnMnICtcclxuICAgICAgICAgICAgICAgICcgJyArIHRoaXMucm93RGltZW5zaW9uc1tjdXJyZW50SW5kZXhdICtcclxuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIC8vIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBodG1sUmVmLmNsYXNzTGlzdC5hZGQodGhpcy5yb3dEaW1lbnNpb25zW2N1cnJlbnRJbmRleCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XHJcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcclxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGkpIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xIYXNoOiB0aGlzLmNvbHVtbktleUFycltqXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbm1heE9iaiA9IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IChwYXJzZUludChtaW5tYXhPYmoubWF4KSA+IG1heCkgPyBtaW5tYXhPYmoubWF4IDogbWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YU1pbic6IG1pbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhTWF4JzogbWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzQXhpc09wcG9zaXRlJzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcclxuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXHJcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcclxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcclxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcclxuICAgICAgICAgICAgY29sRWxlbWVudCxcclxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKGNvbE9yZGVyLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxyXG4gICAgICAgICAgICBodG1sUmVmO1xyXG5cclxuICAgICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBsZXQgY2xhc3NTdHIgPSAnJztcclxuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcclxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcclxuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXHJcbiAgICAgICAgICAgICAgICAnICcgKyB0aGlzLmNvbERpbWVuc2lvbnNbY3VycmVudEluZGV4XSArXHJcbiAgICAgICAgICAgICAgICAnICcgKyBmaWVsZFZhbHVlc1tpXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xyXG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvcm5lckhlaWdodCxcclxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcclxuXHJcbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVSb3dEaW1IZWFkaW5nICh0YWJsZSwgY29sT3JkZXJMZW5ndGgpIHtcclxuICAgICAgICB2YXIgY29ybmVyQ2VsbEFyciA9IFtdLFxyXG4gICAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgICAgaHRtbFJlZjtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMucm93RGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5yb3dEaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKDMwICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDE1KSAvIDIpICsgJ3B4JztcclxuICAgICAgICAgICAgY29ybmVyQ2VsbEFyci5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJvd0RpbWVuc2lvbnNbaV0gKiAxMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAgKiB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgcm93c3BhbjogY29sT3JkZXJMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3JuZXJDZWxsQXJyO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbERpbUhlYWRpbmcgKHRhYmxlLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBpID0gaW5kZXgsXHJcbiAgICAgICAgICAgIGh0bWxSZWY7XHJcbiAgICAgICAgZm9yICg7IGkgPCB0YWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IHRoaXMuY29sRGltZW5zaW9uc1tpXVswXS50b1VwcGVyQ2FzZSgpICsgdGhpcy5jb2xEaW1lbnNpb25zW2ldLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb2xEaW1lbnNpb25zW2ldLmxlbmd0aCAqIDEwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXHJcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUwsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XHJcbiAgICAgICAgdGFibGUudW5zaGlmdChbe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICBjb2xzcGFuOiBtYXhMZW5ndGgsXHJcbiAgICAgICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcclxuICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXB0aW9uJzogJ1NhbGUgb2YgQ2VyZWFsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAnMCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1dKTtcclxuICAgICAgICByZXR1cm4gdGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgICAgICAgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxyXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMucm93RGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjb2xPcmRlciA9IHRoaXMuY29sRGltZW5zaW9ucy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0YWJsZSA9IFtdLFxyXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxyXG4gICAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2godGhpcy5jcmVhdGVSb3dEaW1IZWFkaW5nKHRhYmxlLCBjb2xPcmRlci5sZW5ndGgpKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcclxuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNvbERpbUhlYWRpbmcodGFibGUsIDApO1xyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSAobWF4TGVuZ3RoIDwgdGFibGVbaV0ubGVuZ3RoKSA/IHRhYmxlW2ldLmxlbmd0aCA6IG1heExlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB4QXhpc1Jvdy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibGFuay1jZWxsJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSAxIC0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXTtcclxuICAgICAgICAgICAgICAgIHhBeGlzUm93LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcclxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFGb3JtYXQnOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiBjYXRlZ29yaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhYmxlLnB1c2goeEF4aXNSb3cpO1xyXG4gICAgICAgICAgICB0YWJsZSA9IHRoaXMuY3JlYXRlQ2FwdGlvbih0YWJsZSwgbWF4TGVuZ3RoKTtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWJsZS5wdXNoKFt7XHJcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgdGhpcy5ub0RhdGFNZXNzYWdlICsgJzwvcD4nLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGggKiB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoXHJcbiAgICAgICAgICAgIH1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xyXG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcclxuICAgICAgICAgICAgaSxcclxuICAgICAgICAgICAgcm93RGltZW5zaW9ucyA9IHRoaXMucm93RGltZW5zaW9ucztcclxuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcm93RGltZW5zaW9ucy5zcGxpY2Uocm93RGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJvd0RpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSByb3dEaW1lbnNpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcclxuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgYnVmZmVyID0gcm93RGltZW5zaW9uc1tzdWJqZWN0XTtcclxuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbaSArIDFdID0gcm93RGltZW5zaW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlciA9IHJvd0RpbWVuc2lvbnNbc3ViamVjdF07XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByb3dEaW1lbnNpb25zW2kgLSAxXSA9IHJvd0RpbWVuc2lvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcm93RGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29sRGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxyXG4gICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zID0gdGhpcy5jb2xEaW1lbnNpb25zO1xyXG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY29sRGltZW5zaW9ucy5zcGxpY2UoY29sRGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbERpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBjb2xEaW1lbnNpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcclxuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgYnVmZmVyID0gY29sRGltZW5zaW9uc1tzdWJqZWN0XTtcclxuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbaSArIDFdID0gY29sRGltZW5zaW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlciA9IGNvbERpbWVuc2lvbnNbc3ViamVjdF07XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xEaW1lbnNpb25zW2kgLSAxXSA9IGNvbERpbWVuc2lvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29sRGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcclxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5yb3dEaW1lbnNpb25zW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmNvbERpbWVuc2lvbnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcclxuICAgICAgICBsZXQgZmlsdGVycyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIHRoaXMuZGltZW5zaW9uc1tpXSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xyXG4gICAgICAgIGxldCByID0gW10sXHJcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcclxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcclxuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xyXG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXHJcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XHJcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcclxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxyXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXHJcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQ3Jvc3N0YWIgKCkge1xyXG4gICAgICAgIGxldCBjcm9zc3RhYiA9IHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKSxcclxuICAgICAgICAgICAgbWF0cml4ID0gdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KGNyb3NzdGFiKSxcclxuICAgICAgICAgICAgdDIgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gbWF0cml4W2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSByb3cubGVuZ3RoOyBqIDwgamo7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXHJcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50ID0gY3Jvc3N0YWJbaV1bal0sXHJcbiAgICAgICAgICAgICAgICAgICAgcm93QXhpcyA9IHJvd1tyb3cubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2JsYW5rLWNlbGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbWl0cyA9IHJvd0F4aXMuY2hhcnQuY2hhcnRPYmouZ2V0TGltaXRzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhMaW1pdCA9IGxpbWl0c1sxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQgPSB0aGlzLmdldENoYXJ0T2JqKGNyb3NzdGFiRWxlbWVudC5yb3dIYXNoLCBjcm9zc3RhYkVsZW1lbnQuY29sSGFzaClbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5kYXRhLmNvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5kYXRhLmNvbmZpZy5jaGFydC55QXhpc01heFZhbHVlID0gbWF4TGltaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3N0YWJFbGVtZW50LmNoYXJ0ID0gY2hhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmN0UGVyZiArPSAocGVyZm9ybWFuY2Uubm93KCkgLSB0Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY3Jvc3N0YWJFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHQyID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlTXVsdGlDaGFydCAobWF0cml4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jdFBlcmYgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMudDE7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC5kcmF3KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZShtYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHBlcm11dGVBcnIgKGFycikge1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gW107XHJcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xyXG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xyXG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoYXJ0T2JqIChyb3dGaWx0ZXIsIGNvbHVtbkZpbHRlcikge1xyXG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXHJcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxyXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXHJcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcclxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcclxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxyXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXHJcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IFtdLFxyXG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dO1xyXG4gICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0ge307XHJcblxyXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzLCBjb2xGaWx0ZXJzKTtcclxuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XHJcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xyXG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gdGhpcy5maWx0ZXJlZERhdGFbdGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGZpbHRlcmVkSlNPTiA9IHRoaXMuZmlsdGVyZWREYXRhLmdldEpTT04oKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmlsdGVyZWRKU09OLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXSA+IG1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSlNPTltpXVt0aGlzLm1lYXN1cmVdIDwgbWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluID0gZmlsdGVyZWRKU09OW2ldW3RoaXMubWVhc3VyZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgICAgICAnbWF4JzogbWF4LFxyXG4gICAgICAgICAgICAgICAgJ21pbic6IG1pblxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgICAgIGpzb25EYXRhOiBmaWx0ZXJlZEpTT04sXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IHRoaXMubWVhc3VyZU9uUm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFt0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFt0aGlzLm1lYXN1cmVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVNb2RlOiB0aGlzLmFnZ3JlZ2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMuY2hhcnRDb25maWdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDEwXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogOVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMTBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAyXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDEwXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAxMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAxMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9XHJcbl07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xhcmdlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9