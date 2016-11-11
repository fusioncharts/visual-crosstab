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
	
	window.crosstab = new CrosstabExt();
	window.crosstab.createCrosstab();


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
	        matchedHashes = hash[filterStr];
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
	        // if (this.multichartOb === undefined) {
	        //     console.log(matrix);
	        //     this.multichartOb = this.mc.createMatrix('crosstab-div', matrix);
	        //     this.multichartOb.draw();
	        //     this.rowReorder(0, 1);
	        //     this.multichartOb.update(matrix);
	        //     console.log('=-=-=-=-=-=-= UPDATED');
	        //     console.log(matrix);
	        // } else {
	        //     // console.log('update');
	        //     this.multichartOb.update(matrix);
	        // }
	    }
	
	    filterGen (key, val) {
	        return (data) => data[key] === val;
	    }
	}
	
	module.exports = CrosstabExt;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2ExMmMwZTIzNGU3OGVjODE3YjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtB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O0FBQ0E7QUFDQTtBQUNBLGFBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJjcm9zc3RhYi1leHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzYTEyYzBlMjM0ZTc4ZWM4MTdiOCIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpO1xuXG53aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoKTtcbndpbmRvdy5jcm9zc3RhYi5jcmVhdGVDcm9zc3RhYigpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDE1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAyNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnVGVhJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTQnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdKYW4nLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMzU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ1RlYScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDQ1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDU1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDEzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDY1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDc1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdUZWEnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDg1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiA5NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnTmV3IFlvcmsnLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTA1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdOZXcgWW9yaycsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxMTU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ05ldyBZb3JrJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnRmViJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDEyNTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxMycsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0phbicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxMzU1MFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICdwcm9kdWN0JzogJ0NvZmZlZScsXG4gICAgICAgICAgICAgICAgJ3N0YXRlJzogJ1dhc2hpbmd0b24nLFxuICAgICAgICAgICAgICAgICd5ZWFyJzogJzIwMTMnLFxuICAgICAgICAgICAgICAgICdtb250aCc6ICdGZWInLFxuICAgICAgICAgICAgICAgICdzYWxlJzogMTQ1NTBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAncHJvZHVjdCc6ICdDb2ZmZWUnLFxuICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdXYXNoaW5ndG9uJyxcbiAgICAgICAgICAgICAgICAneWVhcic6ICcyMDE0JyxcbiAgICAgICAgICAgICAgICAnbW9udGgnOiAnSmFuJyxcbiAgICAgICAgICAgICAgICAnc2FsZSc6IDE1NTUwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ3Byb2R1Y3QnOiAnQ29mZmVlJyxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiAnV2FzaGluZ3RvbicsXG4gICAgICAgICAgICAgICAgJ3llYXInOiAnMjAxNCcsXG4gICAgICAgICAgICAgICAgJ21vbnRoJzogJ0ZlYicsXG4gICAgICAgICAgICAgICAgJ3NhbGUnOiAxNjU1MFxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLm1jID0gbmV3IE11bHRpQ2hhcnRpbmcoKTtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSB0aGlzLm1jLmNyZWF0ZURhdGFTdG9yZSgpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZS5zZXREYXRhKHsgZGF0YVNvdXJjZTogdGhpcy5kYXRhIH0pO1xuICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnMgPSBbJ3Byb2R1Y3QnLCAnc3RhdGUnXTtcbiAgICAgICAgdGhpcy5jb2xEaW1lbnNpb25zID0gWyd5ZWFyJywgJ21vbnRoJ107XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IHRoaXMubWVyZ2VEaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMubWVhc3VyZSA9ICdzYWxlJztcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhID0gdGhpcy5idWlsZEdsb2JhbERhdGEoKTtcbiAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxsV2lkdGggPSAzMjA7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IDEzMDtcbiAgICAgICAgdGhpcy5jcm9zc3RhYkNvbnRhaW5lciA9ICdjcm9zc3RhYi1kaXYnO1xuICAgIH1cblxuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY3BsU3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBmaWVsZFZhbHVlc1tpXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbZWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcGxTcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbDogJ3Jvd0ZpbHRlci0gJyArIGZpbHRlcmVkRGF0YUhhc2hLZXkgKyAnPGJyLz5jb2xGaWx0ZXItICcgKyB0aGlzLmNvbHVtbktleUFycltqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IGVsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5O1xuXG4gICAgICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBlbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogZmllbGRWYWx1ZXNbaV1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICB0YWJsZVtjdXJyZW50SW5kZXhdLnB1c2goZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNvbHNwYW4gPSB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbktleUFyci5wdXNoKGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sc3BhbiArPSBlbGVtZW50LmNvbHNwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHNwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlQ3Jvc3N0YWIgKCkge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnMsIC8vIHBvc3NpYmxlIGNvbmZsaWN0XG4gICAgICAgICAgICBjb2xPcmRlciA9IFsneWVhciddLFxuICAgICAgICAgICAgdGFibGUgPSBbW3tcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogY29sT3JkZXIubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHJvd09yZGVyLmxlbmd0aFxuICAgICAgICAgICAgfV1dO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbCh0YWJsZSwgb2JqLCBjb2xPcmRlciwgMCwgJycpO1xuICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgdGhpcy5jcmVhdGVSb3codGFibGUsIG9iaiwgcm93T3JkZXIsIDAsICcnKTtcbiAgICAgICAgY29uc29sZS5sb2codGFibGUpO1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGFibGUpO1xuICAgIH1cblxuICAgIHJvd1Jlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpO1xuICAgICAgICBpZiAodGhpcy5yb3dEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSArIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSAtIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGFDb21ib3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUNvbWJvID0gZGF0YUNvbWJvc1tpXSxcbiAgICAgICAgICAgICAgICBrZXkgPSAnJyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gZGF0YUNvbWJvLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbmd0aCA9IGZpbHRlcnMubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlclZhbCA9IGZpbHRlcnNba10uZmlsdGVyVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUNvbWJvW2pdID09PSBmaWx0ZXJWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9IGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ICs9ICd8JyArIGRhdGFDb21ib1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goZmlsdGVyc1trXS5maWx0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2hNYXA7XG4gICAgfVxuXG4gICAgZmlsdGVyIChhKSB7XG4gICAgICAgIHJldHVybiAoYS5wcm9kdWN0ID09PSAnVGVhJyAmJiBhLnN0YXRlID09PSAnTmV3IFlvcmsnICYmIGEueWVhciA9PT0gJzIwMTMnKTtcbiAgICB9O1xuXG4gICAgY3JlYXRlTXVsdGlDaGFydCAobWF0cml4KSB7XG4gICAgICAgIHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCkuZHJhdygpO1xuICAgIH1cblxuICAgIGdldENoYXJ0T2JqIChyb3dGaWx0ZXIsIGNvbHVtbkZpbHRlcikge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyU3RyID0gJycsXG4gICAgICAgICAgICByb3dGaWx0ZXJzID0gcm93RmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBjb2xGaWx0ZXJzID0gY29sdW1uRmlsdGVyLnNwbGl0KCd8JyksXG4gICAgICAgICAgICBoYXNoID0gdGhpcy5nZXRGaWx0ZXJIYXNoTWFwKCksXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycyA9IFtdLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHt9LFxuICAgICAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IFtdLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0ge307XG5cbiAgICAgICAgcm93RmlsdGVycy5wdXNoLmFwcGx5KHJvd0ZpbHRlcnMsIGNvbEZpbHRlcnMpO1xuICAgICAgICBmaWx0ZXJzID0gcm93RmlsdGVycy5maWx0ZXIoKGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYSAhPT0gJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyU3RyID0gZmlsdGVycy5qb2luKCd8Jyk7XG4gICAgICAgIG1hdGNoZWRIYXNoZXMgPSBoYXNoW2ZpbHRlclN0cl07XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICB9XG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFbZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnY29sdW1uMmQnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IFsnbW9udGgnXSxcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogWydzYWxlJ10sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAneUF4aXNOYW1lJzogJ1JldmVudWVzIChJbiBJTlIpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzAwNzVjMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnQ29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1lBeGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwbGFjZXZhbHVlc0luc2lkZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2TGluZUlzRGFzaGVkJzogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WGF4aXNWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBpZiAodGhpcy5tdWx0aWNoYXJ0T2IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2cobWF0cml4KTtcbiAgICAgICAgLy8gICAgIHRoaXMubXVsdGljaGFydE9iID0gdGhpcy5tYy5jcmVhdGVNYXRyaXgoJ2Nyb3NzdGFiLWRpdicsIG1hdHJpeCk7XG4gICAgICAgIC8vICAgICB0aGlzLm11bHRpY2hhcnRPYi5kcmF3KCk7XG4gICAgICAgIC8vICAgICB0aGlzLnJvd1Jlb3JkZXIoMCwgMSk7XG4gICAgICAgIC8vICAgICB0aGlzLm11bHRpY2hhcnRPYi51cGRhdGUobWF0cml4KTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCc9LT0tPS09LT0tPS09IFVQREFURUQnKTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKG1hdHJpeCk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgICAgIC8vICAgICB0aGlzLm11bHRpY2hhcnRPYi51cGRhdGUobWF0cml4KTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9