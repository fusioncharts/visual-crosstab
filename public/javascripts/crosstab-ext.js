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
	crosstab.separateDimensions();


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
	    }
	
	    buildGlobalData () {
	        let fields = this.dataStore.getKey(),
	            globalData = {};
	        for (let i = 0, ii = fields.length; i < ii; i++) {
	            globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
	        }
	        return globalData;
	    }
	
	    separateDimensions () {
	        let matrix = [],
	            rowDimMatrix = [],
	            colDimMatrix = [];
	
	        this.rowObj = {};
	        this.colObj = {};
	
	        for (var keys in this.globalData) {
	            if (this.globalData.hasOwnProperty(keys)) {
	                if (this.dimensions.indexOf(keys) !== -1) {
	                    if (this.measureOnRow) {
	                        if (keys !== this.dimensions[this.rowDimensions.length - 1]) {
	                            if (this.rowDimensions.indexOf(keys) !== -1) {
	                                this.rowObj[keys] = this.globalData[keys];
	                            } else if (this.colDimensions.indexOf(keys) !== -1) {
	                                this.colObj[keys] = this.globalData[keys];
	                            }
	                        }
	                    } else {
	                        if (keys !== this.colDimensions[this.colDimensions.length - 1]) {
	                            if (this.rowDimensions.indexOf(keys) !== -1) {
	                                this.rowObj[keys] = this.globalData[keys];
	                            } else if (this.colDimensions.indexOf(keys) !== -1) {
	                                this.colObj[keys] = this.globalData[keys];
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        matrix.push(this.createCornerMatrix(this.rowObj, this.colObj));
	        rowDimMatrix = this.createRowMatrix(this.rowObj);
	        colDimMatrix = this.createColumnMatrix(this.colObj);
	        console.log(colDimMatrix);
	        for (let i = 0, ii = rowDimMatrix.length; i < ii; i++) {
	            matrix.push(rowDimMatrix[i]);
	        };
	        this.createMultiChart(matrix);
	    }
	
	    createCornerMatrix (rowObj, colObj) {
	        let matrix = [],
	            rowLen = Object.keys(rowObj).length,
	            colLen = Object.keys(colObj).length;
	
	        matrix.push({html: '', rowspan: colLen, colspan: rowLen});
	        return matrix;
	    }
	
	    createColumnMatrix (object) {
	        return object;
	        // let keys = Object.keys(object);
	    };
	
	    createRowMatrix (object) {
	        let keysAr = Object.keys(object),
	            array2d = [],
	            i = 0,
	            key = '',
	            matrix = [[]],
	            storeIndex = 0,
	            depthAr = [1];
	
	        for (key in object) {
	            array2d.push(object[key]);
	        }
	
	        i = keysAr.length;
	        while (--i) {
	            depthAr.unshift(array2d[i].length * depthAr[0]);
	        }
	
	        function recurse (index) {
	            var i = 0,
	                arr = array2d[index],
	                ii = arr && arr.length;
	
	            if (!arr) {
	                return;
	            }
	            for (; i < ii; ++i) {
	                if (i) {
	                    matrix.push([]);
	                    storeIndex++;
	                }
	                matrix[storeIndex].push({
	                    html: arr[i],
	                    rowspan: depthAr[index]
	                });
	                recurse(index + 1);
	            }
	        }
	        recurse(0);
	        return matrix;
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
	            var a = arr.slice(0);
	            for (let j = 0, l = globalArray[i].length; j < l; j++) {
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
	        let chartArr = [],
	            hash = this.getFilterHashMap();
	
	        for (var key in hash) {
	            if (hash.hasOwnProperty(key)) {
	                let dataProcessors = [],
	                    filters = hash[key],
	                    chartObj = {},
	                    filteredData = {};
	
	                for (let i = 0; i < filters.length; i++) {
	                    let dataProcessor = this.mc.createDataProcessor();
	                    dataProcessor.filter(filters[i]);
	                    dataProcessors.push(dataProcessor);
	                }
	                filteredData = this.dataStore.getData(dataProcessors);
	                filteredData = filteredData[filteredData.length - 1];
	
	                chartObj = {
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
	                chartArr.push({
	                    width: 161,
	                    height: 200,
	                    id: 'div-' + Object.keys(hash).indexOf(key),
	                    chart: chartObj
	                });
	            }
	        }
	        this.mc.createMatrix('crosstab-div', matrix).draw();
	    }
	
	    filterGen (key, val) {
	        return (data) => data[key] === val;
	    }
	}
	
	module.exports = CrosstabExt;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGNiZmMzNWRhMGM5ZWNhNTQzNWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBZ0Msd0JBQXdCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWlELFFBQVE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCLDJDQUEyQztBQUNoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFrQixRQUFRO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBbUQsT0FBTztBQUMxRDtBQUNBO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUE4QyxPQUFPO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQSxvREFBbUQsU0FBUztBQUM1RCx5REFBd0QsWUFBWTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWlDO0FBQ2pDOztBQUVBLGdDQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBjYmZjMzVkYTBjOWVjYTU0MzVlIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0Jyk7XG5cbnZhciBjcm9zc3RhYiA9IG5ldyBDcm9zc3RhYkV4dCgpO1xuY3Jvc3N0YWIuc2VwYXJhdGVEaW1lbnNpb25zKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBDcm9zc3RhYkV4dCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDI1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAzNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNjU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogNzU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogODU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDk1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxMDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDExNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTI1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDEzNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxNDU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTU1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDE2NTUwXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMucm93RGltZW5zaW9ucyA9IFsncHJvZHVjdCcsICdzdGF0ZSddO1xuICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnMgPSBbJ3llYXInLCAnbW9udGgnXTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5tZXJnZURpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5tZWFzdXJlID0gJ3NhbGUnO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgIH1cblxuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXkoKSxcbiAgICAgICAgICAgIGdsb2JhbERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gZmllbGRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGdsb2JhbERhdGFbZmllbGRzW2ldXSA9IHRoaXMuZGF0YVN0b3JlLmdldFVuaXF1ZVZhbHVlcyhmaWVsZHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxEYXRhO1xuICAgIH1cblxuICAgIHNlcGFyYXRlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBtYXRyaXggPSBbXSxcbiAgICAgICAgICAgIHJvd0RpbU1hdHJpeCA9IFtdLFxuICAgICAgICAgICAgY29sRGltTWF0cml4ID0gW107XG5cbiAgICAgICAgdGhpcy5yb3dPYmogPSB7fTtcbiAgICAgICAgdGhpcy5jb2xPYmogPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXlzIGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXlzKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZihrZXlzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5cyAhPT0gdGhpcy5kaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvd0RpbWVuc2lvbnMuaW5kZXhPZihrZXlzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dPYmpba2V5c10gPSB0aGlzLmdsb2JhbERhdGFba2V5c107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbERpbWVuc2lvbnMuaW5kZXhPZihrZXlzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xPYmpba2V5c10gPSB0aGlzLmdsb2JhbERhdGFba2V5c107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleXMgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yb3dEaW1lbnNpb25zLmluZGV4T2Yoa2V5cykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm93T2JqW2tleXNdID0gdGhpcy5nbG9iYWxEYXRhW2tleXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2xEaW1lbnNpb25zLmluZGV4T2Yoa2V5cykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sT2JqW2tleXNdID0gdGhpcy5nbG9iYWxEYXRhW2tleXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXRyaXgucHVzaCh0aGlzLmNyZWF0ZUNvcm5lck1hdHJpeCh0aGlzLnJvd09iaiwgdGhpcy5jb2xPYmopKTtcbiAgICAgICAgcm93RGltTWF0cml4ID0gdGhpcy5jcmVhdGVSb3dNYXRyaXgodGhpcy5yb3dPYmopO1xuICAgICAgICBjb2xEaW1NYXRyaXggPSB0aGlzLmNyZWF0ZUNvbHVtbk1hdHJpeCh0aGlzLmNvbE9iaik7XG4gICAgICAgIGNvbnNvbGUubG9nKGNvbERpbU1hdHJpeCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHJvd0RpbU1hdHJpeC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBtYXRyaXgucHVzaChyb3dEaW1NYXRyaXhbaV0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQobWF0cml4KTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb3JuZXJNYXRyaXggKHJvd09iaiwgY29sT2JqKSB7XG4gICAgICAgIGxldCBtYXRyaXggPSBbXSxcbiAgICAgICAgICAgIHJvd0xlbiA9IE9iamVjdC5rZXlzKHJvd09iaikubGVuZ3RoLFxuICAgICAgICAgICAgY29sTGVuID0gT2JqZWN0LmtleXMoY29sT2JqKS5sZW5ndGg7XG5cbiAgICAgICAgbWF0cml4LnB1c2goe2h0bWw6ICcnLCByb3dzcGFuOiBjb2xMZW4sIGNvbHNwYW46IHJvd0xlbn0pO1xuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbHVtbk1hdHJpeCAob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIC8vIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICB9O1xuXG4gICAgY3JlYXRlUm93TWF0cml4IChvYmplY3QpIHtcbiAgICAgICAgbGV0IGtleXNBciA9IE9iamVjdC5rZXlzKG9iamVjdCksXG4gICAgICAgICAgICBhcnJheTJkID0gW10sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgbWF0cml4ID0gW1tdXSxcbiAgICAgICAgICAgIHN0b3JlSW5kZXggPSAwLFxuICAgICAgICAgICAgZGVwdGhBciA9IFsxXTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGFycmF5MmQucHVzaChvYmplY3Rba2V5XSk7XG4gICAgICAgIH1cblxuICAgICAgICBpID0ga2V5c0FyLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKC0taSkge1xuICAgICAgICAgICAgZGVwdGhBci51bnNoaWZ0KGFycmF5MmRbaV0ubGVuZ3RoICogZGVwdGhBclswXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgICAgIGFyciA9IGFycmF5MmRbaW5kZXhdLFxuICAgICAgICAgICAgICAgIGlpID0gYXJyICYmIGFyci5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmICghYXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LnB1c2goW10pO1xuICAgICAgICAgICAgICAgICAgICBzdG9yZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hdHJpeFtzdG9yZUluZGV4XS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbDogYXJyW2ldLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiBkZXB0aEFyW2luZGV4XVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlY3Vyc2UoaW5kZXggKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKDApO1xuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIHZhciBhID0gYXJyLnNsaWNlKDApO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlY3Vyc2UoW10sIDApO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBtYWtlR2xvYmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgdGVtcE9iaiA9IHt9LFxuICAgICAgICAgICAgdGVtcEFyciA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBmaWx0ZXIgKGEpIHtcbiAgICAgICAgcmV0dXJuIChhLnByb2R1Y3QgPT09ICdUZWEnICYmIGEuc3RhdGUgPT09ICdOZXcgWW9yaycgJiYgYS55ZWFyID09PSAnMjAxMycpO1xuICAgIH07XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgbGV0IGNoYXJ0QXJyID0gW10sXG4gICAgICAgICAgICBoYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCk7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGhhc2gpIHtcbiAgICAgICAgICAgIGlmIChoYXNoLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycyA9IGhhc2hba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnRPYmogPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIoZmlsdGVyc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVtmaWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbHVtbjJkJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGpzb25EYXRhOiBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbJ21vbnRoJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogWydzYWxlJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd5QXhpc05hbWUnOiAnUmV2ZW51ZXMgKEluIElOUiknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzAwNzVjMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmdDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGxhY2V2YWx1ZXNJbnNpZGUnOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXZMaW5lSXNEYXNoZWQnOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjaGFydEFyci5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE2MSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnZGl2LScgKyBPYmplY3Qua2V5cyhoYXNoKS5pbmRleE9mKGtleSksXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0OiBjaGFydE9ialxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubWMuY3JlYXRlTWF0cml4KCdjcm9zc3RhYi1kaXYnLCBtYXRyaXgpLmRyYXcoKTtcbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==