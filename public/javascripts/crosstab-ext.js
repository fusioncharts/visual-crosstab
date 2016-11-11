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
	    colDimensions: ['year', 'month'],
	    chartType: 'line',
	    measure: 'sale',
	    measureOnRow: false,
	    cellWidth: 320,
	    cellHeight: 130,
	    crosstabContainer: 'crosstab-div'
	};
	
	window.crosstab = new CrosstabExt(data, config);
	window.crosstab.createCrosstab();


/***/ },
/* 1 */
/***/ function(module, exports) {

	class CrosstabExt {
	    constructor (data, config) {
	        this.data = data;
	        this.mc = new MultiCharting();
	        this.dataStore = this.mc.createDataStore();
	        this.dataStore.setData({ dataSource: this.data });
	        this.chartType = config.chartType;
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
	        this.createCol(table, obj, colOrder, 0, '');
	        table.push([]);
	        this.createRow(table, obj, rowOrder, 0, '');
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
	
	    createMultiChart (matrix) {
	        if (this.multichartObject === undefined) {
	            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, matrix);
	            this.multichartObject.draw();
	        } else {
	            this.multichartObject.update(matrix);
	        }
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
	        if (matchedHashes) {
	            for (let i = 0, ii = matchedHashes.length; i < ii; i++) {
	                dataProcessor = this.mc.createDataProcessor();
	                dataProcessor.filter(matchedHashes[i]);
	                dataProcessors.push(dataProcessor);
	            }
	            filteredData = this.dataStore.getData(dataProcessors);
	            filteredData = filteredData[filteredData.length - 1];
	            return {
	                type: this.chartType,
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
	                                'numberPrefix': '₹',
	                                'paletteColors': '#0075c2',
	                                'bgColor': '#ffffff',
	                                'valueFontColor': '#ffffff',
	                                'usePlotGradientColor': '0',
	                                'showYAxisValues': '0',
	                                'showValues': '0',
	                                'showXAxisLine': '1',
	                                'showXaxisValues': '0',
	                                'rotateValues': '1'
	                            }
	                        }
	                    }
	                }
	            };
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
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 1
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 0
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 9
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 1
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 0
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 8
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 0
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 4
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 4
	    },
	    {
	        'product': 'rice',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 2
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 1
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 1
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 2
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 4
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 0
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 4
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 9
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 0
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 8
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bihar',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 5
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 8
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 1
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 4
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2015',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Good',
	        'sale': 3
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Jun',
	        'quality': 'Medium',
	        'sale': 3
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'July',
	        'quality': 'Medium',
	        'sale': 6
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Good',
	        'sale': 7
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Aug',
	        'quality': 'Medium',
	        'sale': 5
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Good',
	        'sale': 9
	    },
	    {
	        'product': 'wheat',
	        'state': 'Bengal',
	        'year': '2016',
	        'month': 'Sept',
	        'quality': 'Medium',
	        'sale': 8
	    }
	];


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWE3NmQwNGM5NzFiZjM5NTJlODEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBZ0Msd0JBQXdCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBMkMsUUFBUTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixnQ0FBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBbUQsT0FBTztBQUMxRDtBQUNBO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQ0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQW1ELFNBQVM7QUFDNUQseURBQXdELFlBQVk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx1REFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDN1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVhNzZkMDRjOTcxYmYzOTUyZTgxIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vbGFyZ2VEYXRhJyk7XG5cbnZhciBjb25maWcgPSB7XG4gICAgcm93RGltZW5zaW9uczogWydwcm9kdWN0JywgJ3N0YXRlJ10sXG4gICAgY29sRGltZW5zaW9uczogWyd5ZWFyJywgJ21vbnRoJ10sXG4gICAgY2hhcnRUeXBlOiAnbGluZScsXG4gICAgbWVhc3VyZTogJ3NhbGUnLFxuICAgIG1lYXN1cmVPblJvdzogZmFsc2UsXG4gICAgY2VsbFdpZHRoOiAzMjAsXG4gICAgY2VsbEhlaWdodDogMTMwLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2J1xufTtcblxud2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG53aW5kb3cuY3Jvc3N0YWIuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gY29uZmlnLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IGNvbmZpZy5jb2xEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSBjb25maWcubWVhc3VyZTtcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgIH1cblxuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY3BsU3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBmaWVsZFZhbHVlc1tpXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbZWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcGxTcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gZWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXk7XG5cbiAgICAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBmaWVsZFZhbHVlc1tpXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRhYmxlID0gW1t7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IGNvbE9yZGVyLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiByb3dPcmRlci5sZW5ndGhcbiAgICAgICAgICAgIH1dXTtcbiAgICAgICAgdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0YWJsZSk7XG4gICAgfVxuXG4gICAgcm93UmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGlmICh0aGlzLnJvd0RpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dyb25nIGluZGV4JztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0ID4gdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm93RGltZW5zaW9uc1tpICsgMV0gPSB0aGlzLnJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm93RGltZW5zaW9uc1tpIC0gMV0gPSB0aGlzLnJvd0RpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgbWVyZ2VEaW1lbnNpb25zICgpIHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5yb3dEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh0aGlzLmNvbERpbWVuc2lvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIGNyZWF0ZUZpbHRlcnMgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuZGltZW5zaW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMucm93RGltZW5zaW9uc1t0aGlzLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiB0aGlzLmRpbWVuc2lvbnNbaV0gIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlcyA9IHRoaXMuZ2xvYmFsRGF0YVt0aGlzLmRpbWVuc2lvbnNbaV1dO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBtYXRjaGVkVmFsdWVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVyR2VuKHRoaXMuZGltZW5zaW9uc1tpXSwgbWF0Y2hlZFZhbHVlc1tqXS50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbDogbWF0Y2hlZFZhbHVlc1tqXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgfVxuXG4gICAgY3JlYXRlRGF0YUNvbWJvcyAoKSB7XG4gICAgICAgIGxldCByID0gW10sXG4gICAgICAgICAgICBnbG9iYWxBcnJheSA9IHRoaXMubWFrZUdsb2JhbEFycmF5KCksXG4gICAgICAgICAgICBtYXggPSBnbG9iYWxBcnJheS5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UgKGFyciwgaSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBnbG9iYWxBcnJheVtpXS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGFyci5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goZ2xvYmFsQXJyYXlbaV1bal0pO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoYSwgaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNlKFtdLCAwKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgbWFrZUdsb2JhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IHRlbXBPYmogPSB7fSxcbiAgICAgICAgICAgIHRlbXBBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5nbG9iYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nbG9iYWxEYXRhLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSB0aGlzLm1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYga2V5ICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBPYmpba2V5XSA9IHRoaXMuZ2xvYmFsRGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5jb2xEaW1lbnNpb25zW3RoaXMuY29sRGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcEFyciA9IE9iamVjdC5rZXlzKHRlbXBPYmopLm1hcChrZXkgPT4gdGVtcE9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVySGFzaE1hcCAoKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gdGhpcy5jcmVhdGVGaWx0ZXJzKCksXG4gICAgICAgICAgICBkYXRhQ29tYm9zID0gdGhpcy5jcmVhdGVEYXRhQ29tYm9zKCksXG4gICAgICAgICAgICBoYXNoTWFwID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhQ29tYm9zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21ibyA9IGRhdGFDb21ib3NbaV0sXG4gICAgICAgICAgICAgICAga2V5ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGRhdGFDb21iby5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW5ndGggPSBmaWx0ZXJzLmxlbmd0aDsgayA8IGxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWwgPSBmaWx0ZXJzW2tdLmZpbHRlclZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFDb21ib1tqXSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSArPSAnfCcgKyBkYXRhQ29tYm9bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGZpbHRlcnNba10uZmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwO1xuICAgIH1cblxuICAgIGNyZWF0ZU11bHRpQ2hhcnQgKG1hdHJpeCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aWNoYXJ0T2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdCA9IHRoaXMubWMuY3JlYXRlTWF0cml4KHRoaXMuY3Jvc3N0YWJDb250YWluZXIsIG1hdHJpeCk7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QuZHJhdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LnVwZGF0ZShtYXRyaXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGVybXV0ZUFyciAoYXJyKSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIHBlcm11dGUgKGFyciwgbWVtKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudDtcbiAgICAgICAgICAgIG1lbSA9IG1lbSB8fCBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYXJyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobWVtLmNvbmNhdChjdXJyZW50KS5qb2luKCd8JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwZXJtdXRlKGFyci5zbGljZSgpLCBtZW0uY29uY2F0KGN1cnJlbnQpKTtcbiAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIGN1cnJlbnRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlcm11dGVTdHJzID0gcGVybXV0ZShhcnIpO1xuICAgICAgICByZXR1cm4gcGVybXV0ZVN0cnMuam9pbignKiElXicpO1xuICAgIH1cblxuICAgIG1hdGNoSGFzaCAoZmlsdGVyU3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaGFzaC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBrZXkuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAga2V5UGVybXV0YXRpb25zID0gdGhpcy5wZXJtdXRlQXJyKGtleXMpLnNwbGl0KCcqISVeJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleVBlcm11dGF0aW9ucy5pbmRleE9mKGZpbHRlclN0cikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlQZXJtdXRhdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRDaGFydE9iaiAocm93RmlsdGVyLCBjb2x1bW5GaWx0ZXIpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlclN0ciA9ICcnLFxuICAgICAgICAgICAgcm93RmlsdGVycyA9IHJvd0ZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgY29sRmlsdGVycyA9IGNvbHVtbkZpbHRlci5zcGxpdCgnfCcpLFxuICAgICAgICAgICAgaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpLFxuICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB7fSxcbiAgICAgICAgICAgIG1hdGNoZWRIYXNoZXMgPSBbXSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHt9O1xuXG4gICAgICAgIHJvd0ZpbHRlcnMucHVzaC5hcHBseShyb3dGaWx0ZXJzLCBjb2xGaWx0ZXJzKTtcbiAgICAgICAgZmlsdGVycyA9IHJvd0ZpbHRlcnMuZmlsdGVyKChhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGEgIT09ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlclN0ciA9IGZpbHRlcnMuam9pbignfCcpO1xuICAgICAgICBtYXRjaGVkSGFzaGVzID0gaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIGhhc2gpXTtcbiAgICAgICAgaWYgKG1hdGNoZWRIYXNoZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG1hdGNoZWRIYXNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IgPSB0aGlzLm1jLmNyZWF0ZURhdGFQcm9jZXNzb3IoKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yLmZpbHRlcihtYXRjaGVkSGFzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29ycy5wdXNoKGRhdGFQcm9jZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhU3RvcmUuZ2V0RGF0YShkYXRhUHJvY2Vzc29ycyk7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFbZmlsdGVyZWREYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGpzb25EYXRhOiBmaWx0ZXJlZERhdGEuZ2V0SlNPTigpLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uOiBbJ21vbnRoJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlOiBbJ3NhbGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGU6ICdTUycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYWxldHRlQ29sb3JzJzogJyMwMDc1YzInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmdDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlUGxvdEdyYWRpZW50Q29sb3InOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2hvd1hBeGlzTGluZSc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJHZW4gKGtleSwgdmFsKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZGF0YVtrZXldID09PSB2YWw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENyb3NzdGFiRXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3Jvc3N0YWJFeHQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDhcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiAyXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICdyaWNlJyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3JpY2UnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDRcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAncmljZScsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogMVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVseScsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogNFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDBcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA5XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogMFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA2XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogOFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA1XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxyXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA0XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE1JyxcclxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDZcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcclxuICAgICAgICAnc2FsZSc6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcclxuICAgICAgICAnc2FsZSc6IDlcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ3Byb2R1Y3QnOiAnd2hlYXQnLFxyXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxyXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxyXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXHJcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXHJcbiAgICAgICAgJ3NhbGUnOiA3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICdwcm9kdWN0JzogJ3doZWF0JyxcclxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcclxuICAgICAgICAneWVhcic6ICcyMDE2JyxcclxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcclxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxyXG4gICAgICAgICdzYWxlJzogNVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxyXG4gICAgICAgICdzYWxlJzogOVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAncHJvZHVjdCc6ICd3aGVhdCcsXHJcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXHJcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXHJcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxyXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXHJcbiAgICAgICAgJ3NhbGUnOiA4XHJcbiAgICB9XHJcbl07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xhcmdlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9