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
	    measure: 'sale',
	    measureOnRow: false,
	    cellWidth: 120,
	    cellHeight: 100,
	    crosstabContainer: 'crosstab-div',
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
	        this.axes = [];
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
	                html: '<p style="text-align: center">No data to display.</p>',
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
	            matrix = this.createMultiChart(crosstab);
	        console.log(crosstab);
	        console.log(matrix);
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
	                    cell.update(crosstabElement);
	                }
	            }
	        }
	    }
	
	    createMultiChart (matrix) {
	        if (this.multichartObject === undefined) {
	            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, matrix);
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
	            min = Infinity;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTQ5NTg0YWJiOTI0ZGJkMmVkMGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyx3QkFBd0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsZ0NBQStCLGVBQWU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsK0JBQStCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWMsa0JBQWtCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQSx3QkFBdUIsK0JBQStCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUEsd0JBQXVCLCtDQUErQztBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxrQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxrQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW1ELE9BQU87QUFDMUQ7QUFDQTtBQUNBLDREQUEyRCxTQUFTO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLGNBQWE7QUFDYjtBQUNBLDREQUEyRCxTQUFTO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQThDLE9BQU87QUFDckQ7QUFDQTtBQUNBOztBQUVBLG9EQUFtRCxTQUFTO0FBQzVELHlEQUF3RCxZQUFZO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBMkMsUUFBUTtBQUNuRDtBQUNBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx1REFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFxRCxRQUFRO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ptQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTQ5NTg0YWJiOTI0ZGJkMmVkMGMiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICByb3dEaW1lbnNpb25zOiBbJ3Byb2R1Y3QnLCAnc3RhdGUnXSxcbiAgICBjb2xEaW1lbnNpb25zOiBbJ3llYXInLCAncXVhbGl0eScsICdtb250aCddLFxuICAgIGNoYXJ0VHlwZTogJ2NvbHVtbjJkJyxcbiAgICBtZWFzdXJlOiAnc2FsZScsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDEyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMDAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnc2hvd0JvcmRlcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdudW1iZXJQcmVmaXgnOiAn4oK5JyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMTAwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnI0I1QjlCQScsXG4gICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAndmFsdWVGb250Q29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAneEF4aXNMaW5lQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQ29sb3InOiAnIzAwMDAwMCdcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbndpbmRvdy5jcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dChkYXRhLCBjb25maWcpO1xud2luZG93LmNyb3NzdGFiLnJlbmRlckNyb3NzdGFiKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKGRhdGEsIGNvbmZpZykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gY29uZmlnLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IGNvbmZpZy5jb2xEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSBjb25maWcubWVhc3VyZTtcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYXhlcyA9IFtdO1xuICAgICAgICBpZiAodHlwZW9mIEZDRGF0YUZpbHRlckV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kYXRhRmlsdGVyRXh0ID0gbmV3IEZDRGF0YUZpbHRlckV4dCh0aGlzLmRhdGFTdG9yZSwgZmlsdGVyQ29uZmlnLCAnY29udHJvbC1ib3gnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZGF0YVN0b3JlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBzZWxmLmdsb2JhbERhdGEgPSBzZWxmLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyQ3Jvc3N0YWIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSkge1xuICAgICAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZixcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5LFxuICAgICAgICAgICAgbWlubWF4T2JqID0ge307XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ3Jvdy1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5yb3dEaW1lbnNpb25zW2N1cnJlbnRJbmRleF0gK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBpZiAoY3VycmVudEluZGV4ID4gMCkge1xuICAgICAgICAgICAgLy8gICAgIGh0bWxSZWYuY2xhc3NMaXN0LmFkZCh0aGlzLnJvd0RpbWVuc2lvbnNbY3VycmVudEluZGV4IC0gMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lcldpZHRoID0gZmllbGRWYWx1ZXNbaV0ubGVuZ3RoICogMTA7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dIYXNoOiBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sSGFzaDogdGhpcy5jb2x1bW5LZXlBcnJbal1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgICAgICBtaW5tYXhPYmogPSB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gKHBhcnNlSW50KG1pbm1heE9iai5tYXgpID4gbWF4KSA/IG1pbm1heE9iai5tYXggOiBtYXg7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IChwYXJzZUludChtaW5tYXhPYmoubWluKSA8IG1pbikgPyBtaW5tYXhPYmoubWluIDogbWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2F4aXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2F4aXNUeXBlJzogJ3knLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhRm9ybWF0JzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hhcnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNaW4nOiBtaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGFNYXgnOiBtYXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzQXhpc09wcG9zaXRlJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzU3RyID0gJyc7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY2xhc3NTdHIgKz0gJ2NvbHVtbi1kaW1lbnNpb25zJyArXG4gICAgICAgICAgICAgICAgJyAnICsgdGhpcy5jb2xEaW1lbnNpb25zW2N1cnJlbnRJbmRleF0gK1xuICAgICAgICAgICAgICAgICcgJyArIGZpZWxkVmFsdWVzW2ldLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NTdHJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goY29sRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICBjb2xFbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sc3BhbiArPSBjb2xFbGVtZW50LmNvbHNwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlUm93RGltSGVhZGluZyAodGFibGUsIGNvbE9yZGVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBjb3JuZXJDZWxsQXJyID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnJvd0RpbWVuc2lvbnNbaV0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUubWFyZ2luVG9wID0gKCgzMCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxNSkgLyAyKSArICdweCc7XG4gICAgICAgICAgICBjb3JuZXJDZWxsQXJyLnB1c2goe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJvd0RpbWVuc2lvbnNbaV0gKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBjb2xPcmRlckxlbmd0aCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Nvcm5lci1jZWxsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcm5lckNlbGxBcnI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sRGltSGVhZGluZyAodGFibGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXgsXG4gICAgICAgICAgICBodG1sUmVmO1xuICAgICAgICBmb3IgKDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSB0aGlzLmNvbERpbWVuc2lvbnNbaV1bMF0udG9VcHBlckNhc2UoKSArIHRoaXMuY29sRGltZW5zaW9uc1tpXS5zdWJzdHIoMSk7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgdGFibGVbaV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29sRGltZW5zaW9uc1tpXS5sZW5ndGggKiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb3JuZXItY2VsbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0aW9uICh0YWJsZSwgbWF4TGVuZ3RoKSB7XG4gICAgICAgIHRhYmxlLnVuc2hpZnQoW3tcbiAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgY29sc3BhbjogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdjYXB0aW9uJyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGFydCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhcHRpb24nOiAnU2FsZSBvZiBDZXJlYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3ViY2FwdGlvbic6ICdBY3Jvc3MgU3RhdGVzLCBBY3Jvc3MgWWVhcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9yZGVydGhpY2tuZXNzJzogJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW10sXG4gICAgICAgICAgICB4QXhpc1JvdyA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBtYXhMZW5ndGggPSAwO1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKHRoaXMuY3JlYXRlUm93RGltSGVhZGluZyh0YWJsZSwgY29sT3JkZXIubGVuZ3RoKSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUNvbERpbUhlYWRpbmcodGFibGUsIDApO1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gKG1heExlbmd0aCA8IHRhYmxlW2ldLmxlbmd0aCkgPyB0YWJsZVtpXS5sZW5ndGggOiBtYXhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JsYW5rLWNlbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXhMZW5ndGggLSAxIC0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICAgICAgeEF4aXNSb3cucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YUZvcm1hdCc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdheGlzVHlwZSc6ICd4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NoYXJ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXJ0aGlja25lc3MnOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW52YXNQYWRkaW5nJzogMTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcyc6IGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5wdXNoKHhBeGlzUm93KTtcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVDYXB0aW9uKHRhYmxlLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3tcbiAgICAgICAgICAgICAgICBodG1sOiAnPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5ObyBkYXRhIHRvIGRpc3BsYXkuPC9wPicsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aFxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgICByb3dEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnMgPSB0aGlzLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcm93RGltZW5zaW9ucy5zcGxpY2Uocm93RGltZW5zaW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm93RGltZW5zaW9ucy5pbmRleE9mKE1hdGgubWF4KHN1YmplY3QsIHRhcmdldCkpID49IHJvd0RpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSByb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICByb3dEaW1lbnNpb25zW2kgKyAxXSA9IHJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gcm93RGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgKyAxOyBpIDw9IHRhcmdldDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93RGltZW5zaW9uc1tpIC0gMV0gPSByb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93RGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlQ3Jvc3N0YWIoKTtcbiAgICB9XG5cbiAgICBjb2xEaW1SZW9yZGVyIChzdWJqZWN0LCB0YXJnZXQpIHtcbiAgICAgICAgdmFyIGJ1ZmZlciA9ICcnLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnMgPSB0aGlzLmNvbERpbWVuc2lvbnM7XG4gICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnMuc3BsaWNlKGNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbERpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSBjb2xEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gY29sRGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgY29sRGltZW5zaW9uc1tpICsgMV0gPSBjb2xEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sRGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGNvbERpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbaSAtIDFdID0gY29sRGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5yb3dEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmNvbERpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIHJlbmRlckNyb3NzdGFiICgpIHtcbiAgICAgICAgbGV0IGNyb3NzdGFiID0gdGhpcy5jcmVhdGVDcm9zc3RhYigpLFxuICAgICAgICAgICAgbWF0cml4ID0gdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KGNyb3NzdGFiKTtcbiAgICAgICAgY29uc29sZS5sb2coY3Jvc3N0YWIpO1xuICAgICAgICBjb25zb2xlLmxvZyhtYXRyaXgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRyaXgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJvdyA9IG1hdHJpeFtpXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IHJvdy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSByb3dbal0sXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudCA9IGNyb3NzdGFiW2ldW2pdLFxuICAgICAgICAgICAgICAgICAgICByb3dBeGlzID0gcm93W3Jvdy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoIShjcm9zc3RhYkVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2NoYXJ0JykgfHwgY3Jvc3N0YWJFbGVtZW50Lmhhc093blByb3BlcnR5KCdodG1sJykpICYmXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzdGFiRWxlbWVudC5jbGFzc05hbWUgIT09ICdibGFuay1jZWxsJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGltaXRzID0gcm93QXhpcy5jaGFydC5jaGFydE9iai5nZXRMaW1pdHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkxpbWl0ID0gbGltaXRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGltaXQgPSBsaW1pdHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydCA9IHRoaXMuZ2V0Q2hhcnRPYmooY3Jvc3N0YWJFbGVtZW50LnJvd0hhc2gsIGNyb3NzdGFiRWxlbWVudC5jb2xIYXNoKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuY29uZmlndXJhdGlvbi5kYXRhLmNvbmZpZy5jaGFydC55QXhpc01pblZhbHVlID0gbWluTGltaXQ7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNvbmZpZ3VyYXRpb24uZGF0YS5jb25maWcuY2hhcnQueUF4aXNNYXhWYWx1ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgICAgICAgICBjcm9zc3RhYkVsZW1lbnQuY2hhcnQgPSBjaGFydDtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC51cGRhdGUoY3Jvc3N0YWJFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnBsYWNlSG9sZGVyO1xuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZEpTT04gPSBbXSxcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eSxcbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5O1xuICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHt9O1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzLCBjb2xGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gdGhpcy5oYXNoW3RoaXMubWF0Y2hIYXNoKGZpbHRlclN0ciwgdGhpcy5oYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZmlsdGVyZWREYXRhW3RoaXMuZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgZmlsdGVyZWRKU09OID0gdGhpcy5maWx0ZXJlZERhdGEuZ2V0SlNPTigpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmlsdGVyZWRKU09OLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRKU09OW2ldW3RoaXMubWVhc3VyZV0gPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gZmlsdGVyZWRKU09OW2ldW3RoaXMubWVhc3VyZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXSA8IG1pbikge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBmaWx0ZXJlZEpTT05baV1bdGhpcy5tZWFzdXJlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICAnbWF4JzogbWF4LFxuICAgICAgICAgICAgICAgICdtaW4nOiBtaW5cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGpzb25EYXRhOiBmaWx0ZXJlZEpTT04sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IHRoaXMubWVhc3VyZU9uUm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBbdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFt0aGlzLm1lYXN1cmVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH1cbl07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==