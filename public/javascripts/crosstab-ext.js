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

	const CrosstabExt = __webpack_require__(1);
	
	var crosstab = new CrosstabExt();
	crosstab.createCrosstab();


/***/ },
/* 1 */
/***/ function(module, exports) {

	class CrosstabExt {
	    constructor () {
	        this.data = [
	            {
	                'product': 'Tea',
	                'state': 'New York',
	                'year': '2013',
	                'month': 'Jan',
	                'sale': 1550
	            }, {
	                'product': 'Tea',
	                'state': 'New York',
	                'year': '2013',
	                'month': 'Feb',
	                'sale': 2550
	            }, {
	                'product': 'Tea',
	                'state': 'New York',
	                'year': '2014',
	                'month': 'Jan',
	                'sale': 3550
	            }, {
	                'product': 'Tea',
	                'state': 'New York',
	                'year': '2014',
	                'month': 'Feb',
	                'sale': 4550
	            }, {
	                'product': 'Tea',
	                'state': 'Washington',
	                'year': '2013',
	                'month': 'Jan',
	                'sale': 5550
	            }, {
	                'product': 'Tea',
	                'state': 'Washington',
	                'year': '2013',
	                'month': 'Feb',
	                'sale': 6550
	            }, {
	                'product': 'Tea',
	                'state': 'Washington',
	                'year': '2014',
	                'month': 'Jan',
	                'sale': 7550
	            }, {
	                'product': 'Tea',
	                'state': 'Washington',
	                'year': '2014',
	                'month': 'Feb',
	                'sale': 8550
	            }, {
	                'product': 'Coffee',
	                'state': 'New York',
	                'year': '2013',
	                'month': 'Jan',
	                'sale': 9550
	            }, {
	                'product': 'Coffee',
	                'state': 'New York',
	                'year': '2013',
	                'month': 'Feb',
	                'sale': 10550
	            }, {
	                'product': 'Coffee',
	                'state': 'New York',
	                'year': '2014',
	                'month': 'Jan',
	                'sale': 11550
	            }, {
	                'product': 'Coffee',
	                'state': 'New York',
	                'year': '2014',
	                'month': 'Feb',
	                'sale': 12550
	            }, {
	                'product': 'Coffee',
	                'state': 'Washington',
	                'year': '2013',
	                'month': 'Jan',
	                'sale': 13550
	            }, {
	                'product': 'Coffee',
	                'state': 'Washington',
	                'year': '2013',
	                'month': 'Feb',
	                'sale': 14550
	            }, {
	                'product': 'Coffee',
	                'state': 'Washington',
	                'year': '2014',
	                'month': 'Jan',
	                'sale': 15550
	            }, {
	                'product': 'Coffee',
	                'state': 'Washington',
	                'year': '2014',
	                'month': 'Feb',
	                'sale': 16550
	            }
	        ];
	        this.mc = new MultiCharting();
	        this.dataStore = this.mc.createDataStore();
	        this.dataStore.setData({ dataSource: this.data });
	        this.rowDimensions = ['product', 'state'];
	        this.colDimensions = ['year', 'month'];
	        this.dimensions = this.mergeDimensions();
	        this.measure = 'sale';
	        this.measureOnRow = false;
	        this.globalData = this.buildGlobalData();
	        this.columnKeyArr = [];
	        this.cellWidth = 320;
	        this.cellHeight = 130;
	        this.crosstabContainer = 'crosstab-div';
	    }
	
	    buildGlobalData () {
	        let fields = this.dataStore.getKeys(),
	            globalData = {};
	        for (let i = 0, ii = fields.length; i < ii; i++) {
	            globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
	        }
	        return globalData;
	    }
	
	    createRow (table, data, rowOrder, currentIndex, filteredDataStore) {
	        var rowspan = 0,
	            fieldComponent = rowOrder[currentIndex],
	            fieldValues = data[fieldComponent],
	            i, l = fieldValues.length,
	            element,
	            hasFurtherDepth = currentIndex < (rowOrder.length - 1),
	            filteredDataHashKey,
	            colLength = this.columnKeyArr.length;
	
	        for (i = 0; i < l; i += 1) {
	            element = {
	                width: this.cellWidth,
	                height: this.cellHeight,
	                rowspan: 1,
	                cplSpan: 1,
	                html: fieldValues[i]
	            };
	
	            filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
	
	            if (i) {
	                table.push([element]);
	            } else {
	                table[table.length - 1].push(element);
	            }
	            if (hasFurtherDepth) {
	                element.rowspan = this.createRow(table, data, rowOrder, currentIndex + 1, filteredDataHashKey);
	            } else {
	                for (let j = 0; j < colLength; j += 1) {
	                    table[table.length - 1].push({
	                        width: this.cellWidth,
	                        height: this.cellHeight,
	                        rowspan: 1,
	                        cplSpan: 1,
	                        html: 'rowFilter- ' + filteredDataHashKey + '<br/>colFilter- ' + this.columnKeyArr[j],
	                        chart: this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])
	                    });
	                }
	            }
	            rowspan += element.rowspan;
	        }
	        return rowspan;
	    }
	
	    createCol (table, data, colOrder, currentIndex, filteredDataStore) {
	        var colspan = 0,
	            fieldComponent = colOrder[currentIndex],
	            fieldValues = data[fieldComponent],
	            i, l = fieldValues.length,
	            element,
	            hasFurtherDepth = currentIndex < (colOrder.length - 1),
	            filteredDataHashKey;
	
	        if (table.length <= currentIndex) {
	            table.push([]);
	        }
	        for (i = 0; i < l; i += 1) {
	            element = {
	                width: this.cellWidth,
	                height: this.cellHeight,
	                rowspan: 1,
	                colspan: 1,
	                html: fieldValues[i]
	            };
	
	            filteredDataHashKey = filteredDataStore + fieldValues[i] + '|';
	
	            table[currentIndex].push(element);
	
	            if (hasFurtherDepth) {
	                element.colspan = this.createCol(table, data, colOrder, currentIndex + 1, filteredDataHashKey);
	            } else {
	                this.columnKeyArr.push(filteredDataHashKey);
	            }
	            colspan += element.colspan;
	        }
	        return colspan;
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
	            table = [[{
	                width: this.cellWidth,
	                height: this.cellHeight,
	                rowspan: colOrder.length,
	                colspan: rowOrder.length
	            }]];
	        console.log(colOrder);
	        this.createCol(table, obj, colOrder, 0, '');
	        table.push([]);
	        this.createRow(table, obj, rowOrder, 0, '');
	        this.createMultiChart(table);
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
	
	    filter (a) {
	        return (a.product === 'Tea' && a.state === 'New York' && a.year === '2013');
	    };
	
	    createMultiChart (matrix) {
	        this.mc.createMatrix(this.crosstabContainer, matrix).draw();
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
	        for (let key in hash) {
	            if (hash.hasOwnProperty(key)) {
	                let keys = key.split('|'),
	                    keyPermutations = this.permuteArr(keys).split('*!%^');
	                if (filterStr.indexOf[keyPermutations] !== -1) {
	                    return keyPermutations[0];
	                } else {
	                    return false;
	                }
	            }
	        }
	    }
	
	    getChartObj (rowFilter, columnFilter) {
	        let filters = [],
	            filterStr = '',
	            rowFilters = rowFilter.split('|'),
	            colFilters = columnFilter.split('|'),
	            hash = this.getFilterHashMap(),
	            dataProcessors = [],
	            dataProcessor = {},
	            matchedHashes = [],
	            filteredData = {};
	
	        rowFilters.push.apply(rowFilters, colFilters);
	        filters = rowFilters.filter((a) => {
	            return (a !== '');
	        });
	        filterStr = filters.join('|');
	        matchedHashes = hash[this.matchHash(filterStr, hash)];
	        for (let i = 0, ii = matchedHashes.length; i < ii; i++) {
	            dataProcessor = this.mc.createDataProcessor();
	            dataProcessor.filter(matchedHashes[i]);
	            dataProcessors.push(dataProcessor);
	        }
	        filteredData = this.dataStore.getData(dataProcessors);
	        filteredData = filteredData[filteredData.length - 1];
	
	        return {
	            type: 'column2d',
	            width: '100%',
	            height: '100%',
	            jsonData: filteredData.getJSON(),
	            configuration: {
	                data: {
	                    dimension: ['month'],
	                    measure: ['sale'],
	                    seriesType: 'SS',
	                    config: {
	                        chart: {
	                            'yAxisName': 'Revenues (In INR)',
	                            'numberPrefix': '₹',
	                            'paletteColors': '#0075c2',
	                            'bgColor': '#ffffff',
	                            'valueFontColor': '#ffffff',
	                            'usePlotGradientColor': '0',
	                            'showYAxisValues': '0',
	                            'placevaluesInside': '1',
	                            'showXAxisLine': '1',
	                            'divLineIsDashed': '1',
	                            'showXaxisValues': '1',
	                            'rotateValues': '1'
	                        }
	                    }
	                }
	            }
	        };
	    }
	
	    filterGen (key, val) {
	        return (data) => data[key] === val;
	    }
	}
	
	module.exports = CrosstabExt;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmQyNDYyMWZhYjA0MDZjMmNiMjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmQyNDYyMWZhYjA0MDZjMmNiMjIiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKTtcclxuXHJcbnZhciBjcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dCgpO1xyXG5jcm9zc3RhYi5jcmVhdGVDcm9zc3RhYigpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDI1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAzNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNjU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNzU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogODU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDk1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxMDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDExNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTI1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDEzNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxNDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTU1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDE2NTUwXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMucm93RGltZW5zaW9ucyA9IFsncHJvZHVjdCcsICdzdGF0ZSddO1xuICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnMgPSBbJ3llYXInLCAnbW9udGgnXTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5tZXJnZURpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5tZWFzdXJlID0gJ3NhbGUnO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IDMyMDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gMTMwO1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gJ2Nyb3NzdGFiLWRpdic7XG4gICAgfVxuXG4gICAgYnVpbGRHbG9iYWxEYXRhICgpIHtcbiAgICAgICAgbGV0IGZpZWxkcyA9IHRoaXMuZGF0YVN0b3JlLmdldEtleXMoKSxcbiAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgIH1cblxuICAgIGNyZWF0ZVJvdyAodGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciByb3dzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gcm93T3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChyb3dPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBjb2xMZW5ndGggPSB0aGlzLmNvbHVtbktleUFyci5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgZWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjcGxTcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGZpZWxkVmFsdWVzW2ldXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtlbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNwbFNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sOiAncm93RmlsdGVyLSAnICsgZmlsdGVyZWREYXRhSGFzaEtleSArICc8YnIvPmNvbEZpbHRlci0gJyArIHRoaXMuY29sdW1uS2V5QXJyW2pdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gZWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXk7XG5cbiAgICAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBmaWVsZFZhbHVlc1tpXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW1t7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IGNvbE9yZGVyLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiByb3dPcmRlci5sZW5ndGhcbiAgICAgICAgICAgIH1dXTtcbiAgICAgICAgY29uc29sZS5sb2coY29sT3JkZXIpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xuICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNdWx0aUNoYXJ0KHRhYmxlKTtcbiAgICB9XG5cbiAgICBtZXJnZURpbWVuc2lvbnMgKCkge1xuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucm93RGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLnJvd0RpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMuY29sRGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlsdGVycyAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5kaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIHRoaXMuZGltZW5zaW9uc1tpXSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIHRoaXMuZGltZW5zaW9uc1tpXSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkVmFsdWVzID0gdGhpcy5nbG9iYWxEYXRhW3RoaXMuZGltZW5zaW9uc1tpXV07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IG1hdGNoZWRWYWx1ZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJHZW4odGhpcy5kaW1lbnNpb25zW2ldLCBtYXRjaGVkVmFsdWVzW2pdLnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyVmFsOiBtYXRjaGVkVmFsdWVzW2pdXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9XG5cbiAgICBjcmVhdGVEYXRhQ29tYm9zICgpIHtcbiAgICAgICAgbGV0IHIgPSBbXSxcbiAgICAgICAgICAgIGdsb2JhbEFycmF5ID0gdGhpcy5tYWtlR2xvYmFsQXJyYXkoKSxcbiAgICAgICAgICAgIG1heCA9IGdsb2JhbEFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZSAoYXJyLCBpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIGZpbHRlciAoYSkge1xuICAgICAgICByZXR1cm4gKGEucHJvZHVjdCA9PT0gJ1RlYScgJiYgYS5zdGF0ZSA9PT0gJ05ldyBZb3JrJyAmJiBhLnllYXIgPT09ICcyMDEzJyk7XG4gICAgfTtcblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpLmRyYXcoKTtcbiAgICB9XG5cbiAgICBwZXJtdXRlQXJyIChhcnIpIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcGVybXV0ZSAoYXJyLCBtZW0pIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50O1xuICAgICAgICAgICAgbWVtID0gbWVtIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhcnIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBhcnIuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChtZW0uY29uY2F0KGN1cnJlbnQpLmpvaW4oJ3wnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlcm11dGUoYXJyLnNsaWNlKCksIG1lbS5jb25jYXQoY3VycmVudCkpO1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgY3VycmVudFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVybXV0ZVN0cnMgPSBwZXJtdXRlKGFycik7XG4gICAgICAgIHJldHVybiBwZXJtdXRlU3Rycy5qb2luKCcqISVeJyk7XG4gICAgfVxuXG4gICAgbWF0Y2hIYXNoIChmaWx0ZXJTdHIsIGhhc2gpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgICAgICAgICBrZXlQZXJtdXRhdGlvbnMgPSB0aGlzLnBlcm11dGVBcnIoa2V5cykuc3BsaXQoJyohJV4nKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyU3RyLmluZGV4T2Zba2V5UGVybXV0YXRpb25zXSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleVBlcm11dGF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycywgY29sRmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IGhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCBoYXNoKV07XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICB9XG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFbZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY29sdW1uMmQnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IFsnbW9udGgnXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogWydzYWxlJ10sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAneUF4aXNOYW1lJzogJ1JldmVudWVzIChJbiBJTlIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzAwNzVjMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZXZhbHVlc0luc2lkZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2TGluZUlzRGFzaGVkJzogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9