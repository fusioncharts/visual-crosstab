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
	window.ctExt = new CrosstabExt();


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
	        window.a = this;
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
	
	            filteredDataHashKey = filteredDataStore + ' => ' + fieldComponent + '=' + fieldValues[i];
	
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
	                        html: 'rowFilter- ' + filteredDataHashKey + '<br/>colFilter- ' + this.columnKeyArr[j]
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
	
	            filteredDataHashKey = filteredDataStore + ' => ' + fieldComponent + '=' + fieldValues[i];
	
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
	        var obj = this.globalData,
	            rowOrder = this.rowDimensions, // possible conflict
	            colOrder = ['year'],
	            table = [[{
	                width: this.cellWidth,
	                height: this.cellHeight,
	                rowspan: colOrder.length,
	                colspan: rowOrder.length
	            }]];
	        this.createCol(table, obj, colOrder, 0, '');
	        table.push([]);
	        this.createRow(table, obj, rowOrder, 0, '');
	        console.log(table);
	        this.createMultiChart(table);
	        // drawTable(table);
	    }
	
	    rowReorder (subject, target) {
	        var buffer = '',
	            i;
	        if (this.rowDimensions.indexOf(Math.max(subject, target)) >= this.rowDimensions.length) {
	            return 'wrong index';
	        } else if (subject > target) {
	            buffer = this.rowDimensions[subject];
	            for (i = subject - 1; i >= target; i--) {
	                this.rowDimensions[i + 1] = this.rowDimensions[i];
	            }
	            this.rowDimensions[target] = buffer;
	        } else if (subject < target) {
	            buffer = this.rowDimensions[subject];
	            for (i = subject + 1; i <= target; i++) {
	                this.rowDimensions[i - 1] = this.rowDimensions[i];
	            }
	            this.rowDimensions[target] = buffer;
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
	        if (this.multichartOb === undefined) {
	            console.log(matrix);
	            this.multichartOb = this.mc.createMatrix('crosstab-div', matrix);
	            this.multichartOb.draw();
	            this.rowReorder(0, 1);
	            this.multichartOb.update(matrix);
	            console.log('=-=-=-=-=-=-= UPDATED');
	            console.log(matrix);
	        } else {
	            // console.log('update');
	            this.multichartOb.update(matrix);
	        }
	    }
	
	    filterGen (key, val) {
	        return (data) => data[key] === val;
	    }
	}
	
	module.exports = CrosstabExt;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWQwZTdiYjkwM2YyNTQwNzAyMjUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtB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O0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJjcm9zc3RhYi1leHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxZDBlN2JiOTAzZjI1NDA3MDIyNSIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpO1xuXG52YXIgY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoKTtcbmNyb3NzdGFiLmNyZWF0ZUNyb3NzdGFiKCk7XG53aW5kb3cuY3RFeHQgPSBuZXcgQ3Jvc3N0YWJFeHQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMjU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDM1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA0NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA1NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA2NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA3NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA4NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogOTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDEwNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTE1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxMjU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTM1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDE0NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxNTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTY1NTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gWydwcm9kdWN0JywgJ3N0YXRlJ107XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IFsneWVhcicsICdtb250aCddO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSAnc2FsZSc7XG4gICAgICAgIHRoaXMubWVhc3VyZU9uUm93ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gMzIwO1xuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSAxMzA7XG4gICAgICAgIHdpbmRvdy5hID0gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpLFxuICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gdGhpcy5kYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNwbFNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogZmllbGRWYWx1ZXNbaV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArICcgPT4gJyArIGZpZWxkQ29tcG9uZW50ICsgJz0nICsgZmllbGRWYWx1ZXNbaV07XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbZWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcGxTcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogJ3Jvd0ZpbHRlci0gJyArIGZpbHRlcmVkRGF0YUhhc2hLZXkgKyAnPGJyLz5jb2xGaWx0ZXItICcgKyB0aGlzLmNvbHVtbktleUFycltqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IGVsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5O1xuXG4gICAgICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogZmllbGRWYWx1ZXNbaV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArICcgPT4gJyArIGZpZWxkQ29tcG9uZW50ICsgJz0nICsgZmllbGRWYWx1ZXNbaV07XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdsb2JhbERhdGEsXG4gICAgICAgICAgICByb3dPcmRlciA9IHRoaXMucm93RGltZW5zaW9ucywgLy8gcG9zc2libGUgY29uZmxpY3RcbiAgICAgICAgICAgIGNvbE9yZGVyID0gWyd5ZWFyJ10sXG4gICAgICAgICAgICB0YWJsZSA9IFtbe1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBjb2xPcmRlci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY29sc3Bhbjogcm93T3JkZXIubGVuZ3RoXG4gICAgICAgICAgICB9XV07XG4gICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YWJsZSk7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0YWJsZSk7XG4gICAgICAgIC8vIGRyYXdUYWJsZSh0YWJsZSk7XG4gICAgfVxuXG4gICAgcm93UmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGlmICh0aGlzLnJvd0RpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm93RGltZW5zaW9uc1tpICsgMV0gPSB0aGlzLnJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm93RGltZW5zaW9uc1tpIC0gMV0gPSB0aGlzLnJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5yb3dEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmNvbERpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGdsb2JhbEFycmF5W2ldLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgIGEucHVzaChnbG9iYWxBcnJheVtpXVtqXSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IG1heCkge1xuICAgICAgICAgICAgICAgICAgICByLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShhLCBpICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdsb2JhbERhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbERhdGEuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkgIT09IHRoaXMubWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wQXJyID0gT2JqZWN0LmtleXModGVtcE9iaikubWFwKGtleSA9PiB0ZW1wT2JqW2tleV0pO1xuICAgICAgICByZXR1cm4gdGVtcEFycjtcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJIYXNoTWFwICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSB0aGlzLmNyZWF0ZUZpbHRlcnMoKSxcbiAgICAgICAgICAgIGRhdGFDb21ib3MgPSB0aGlzLmNyZWF0ZURhdGFDb21ib3MoKSxcbiAgICAgICAgICAgIGhhc2hNYXAgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIGZpbHRlciAoYSkge1xuICAgICAgICByZXR1cm4gKGEucHJvZHVjdCA9PT0gJ1RlYScgJiYgYS5zdGF0ZSA9PT0gJ05ldyBZb3JrJyAmJiBhLnllYXIgPT09ICcyMDEzJyk7XG4gICAgfTtcblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBsZXQgY2hhcnRBcnIgPSBbXSxcbiAgICAgICAgICAgIGhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzID0gaGFzaFtrZXldLFxuICAgICAgICAgICAgICAgICAgICBjaGFydE9iaiA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihmaWx0ZXJzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29sdW1uMmQnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IFsnbW9udGgnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbJ3NhbGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3lBeGlzTmFtZSc6ICdSZXZlbnVlcyAoSW4gSU5SKScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjMDA3NWMyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZXZhbHVlc0luc2lkZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdkxpbmVJc0Rhc2hlZCc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncm90YXRlVmFsdWVzJzogJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNoYXJ0QXJyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTYxLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdkaXYtJyArIE9iamVjdC5rZXlzKGhhc2gpLmluZGV4T2Yoa2V5KSxcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IGNoYXJ0T2JqXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdHJpeCk7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYiA9IHRoaXMubWMuY3JlYXRlTWF0cml4KCdjcm9zc3RhYi1kaXYnLCBtYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2IuZHJhdygpO1xuICAgICAgICAgICAgdGhpcy5yb3dSZW9yZGVyKDAsIDEpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2IudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPS09LT0tPS09LT0tPSBVUERBVEVEJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtYXRyaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZScpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2IudXBkYXRlKG1hdHJpeCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==