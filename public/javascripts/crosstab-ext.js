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
	    chartType: 'bar2d',
	    measure: 'sale',
	    measureOnRow: false,
	    cellWidth: 320,
	    cellHeight: 130,
	    crosstabContainer: 'crosstab-div',
	    chartConfig: {
	        chart: {
	            'numberPrefix': '₹',
	            'paletteColors': '#9f9f9f',
	            'bgColor': '#ffffff',
	            'valueFontColor': '#ffffff',
	            'usePlotGradientColor': '0',
	            'showYAxisValues': '0',
	            'showValues': '0',
	            'showXAxisLine': '1',
	            'showXaxisValues': '0',
	            'rotateValues': '1',
	            'alternateVGridAlpha': '0',
	            'alternateHGridAlpha': '0',
	            'divLineAlpha': '0',
	            'xAxisLineColor': '#ffffff',
	            'plotBorderAlpha': '0',
	            'canvasBorderColor': '#000000',
	            'canvasBorderAlpha': '100'
	        }
	    }
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
	            rowElement,
	            hasFurtherDepth = currentIndex < (rowOrder.length - 1),
	            filteredDataHashKey,
	            colLength = this.columnKeyArr.length,
	            htmlRef;
	
	        for (i = 0; i < l; i += 1) {
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = fieldValues[i];
	            htmlRef.style.textAlign = 'center';
	            htmlRef.style.marginTop = ((this.cellHeight - 10) / 2) + 'px';
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
	                html: htmlRef.outerHTML
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
	                        chart: this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])
	                    };
	                    table[table.length - 1].push(chartCellObj);
	                }
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
	            htmlRef = document.createElement('p');
	            htmlRef.innerHTML = fieldValues[i];
	            htmlRef.style.textAlign = 'center';
	            document.body.appendChild(htmlRef);
	            this.cornerHeight = htmlRef.offsetHeight;
	            document.body.removeChild(htmlRef);
	            colElement = {
	                width: this.cellWidth,
	                height: this.cornerHeight,
	                rowspan: 1,
	                colspan: 1,
	                html: htmlRef.outerHTML
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
	            cornerCellObj = {
	                width: 1,
	                height: 30 * this.colDimensions.length,
	                rowspan: colOrder.length,
	                colspan: rowOrder.length
	            },
	            table = [[cornerCellObj]];
	        this.createCol(table, obj, colOrder, 0, '');
	        table.push([]);
	        this.createRow(table, obj, rowOrder, 0, '');
	        this.createMultiChart(table);
	        this.columnKeyArr = [];
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
	                    console.log(this.dimensions[i], matchedValues[j]);
	                    filters.push({
	                        filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
	                        filterVal: matchedValues[j]
	                    });
	                }
	            } else if (!this.measureOnRow && this.dimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
	                let matchedValues = this.globalData[this.dimensions[i]];
	                for (let j = 0, len = matchedValues.length; j < len; j++) {
	                    console.log(this.dimensions[i], matchedValues[j]);
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
	            dataProcessors = [],
	            dataProcessor = {},
	            matchedHashes = [],
	            filteredData = {};
	
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
	            return {
	                type: this.chartType,
	                width: '100%',
	                height: '100%',
	                jsonData: filteredData.getJSON(),
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
	        'sale': 10
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTMxZjgyYmY4ZDU4NjYyMmVkMDkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLHdCQUF3QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixnQ0FBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0Esa0NBQWlDLGFBQWE7QUFDOUM7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0Esa0NBQWlDLGFBQWE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBbUQsT0FBTztBQUMxRDtBQUNBO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxjQUFhO0FBQ2I7QUFDQSw0REFBMkQsU0FBUztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQThDLE9BQU87QUFDckQ7QUFDQTtBQUNBOztBQUVBLG9EQUFtRCxTQUFTO0FBQzVELHlEQUF3RCxZQUFZO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHVEQUFzRCxRQUFRO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcm9zc3RhYi1leHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1MzFmODJiZjhkNTg2NjIyZWQwOSIsImNvbnN0IENyb3NzdGFiRXh0ID0gcmVxdWlyZSgnLi9jcm9zc3RhYkV4dCcpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2xhcmdlRGF0YScpO1xuXG52YXIgY29uZmlnID0ge1xuICAgIHJvd0RpbWVuc2lvbnM6IFsncHJvZHVjdCcsICdzdGF0ZSddLFxuICAgIGNvbERpbWVuc2lvbnM6IFsneWVhcicsICdtb250aCddLFxuICAgIGNoYXJ0VHlwZTogJ2JhcjJkJyxcbiAgICBtZWFzdXJlOiAnc2FsZScsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDMyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMzAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjOWY5ZjlmJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2FsdGVybmF0ZUhHcmlkQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnZGl2TGluZUFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ3hBeGlzTGluZUNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3Bsb3RCb3JkZXJBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJDb2xvcic6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgICdjYW52YXNCb3JkZXJBbHBoYSc6ICcxMDAnXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG53aW5kb3cuY3Jvc3N0YWIgPSBuZXcgQ3Jvc3N0YWJFeHQoZGF0YSwgY29uZmlnKTtcbndpbmRvdy5jcm9zc3RhYi5jcmVhdGVDcm9zc3RhYigpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgQ3Jvc3N0YWJFeHQge1xuICAgIGNvbnN0cnVjdG9yIChkYXRhLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5tYyA9IG5ldyBNdWx0aUNoYXJ0aW5nKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gdGhpcy5tYy5jcmVhdGVEYXRhU3RvcmUoKTtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2V0RGF0YSh7IGRhdGFTb3VyY2U6IHRoaXMuZGF0YSB9KTtcbiAgICAgICAgdGhpcy5jaGFydFR5cGUgPSBjb25maWcuY2hhcnRUeXBlO1xuICAgICAgICB0aGlzLmNoYXJ0Q29uZmlnID0gY29uZmlnLmNoYXJ0Q29uZmlnO1xuICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnMgPSBjb25maWcucm93RGltZW5zaW9ucztcbiAgICAgICAgdGhpcy5jb2xEaW1lbnNpb25zID0gY29uZmlnLmNvbERpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IHRoaXMubWVyZ2VEaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMubWVhc3VyZSA9IGNvbmZpZy5tZWFzdXJlO1xuICAgICAgICB0aGlzLm1lYXN1cmVPblJvdyA9IGNvbmZpZy5tZWFzdXJlT25Sb3c7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YSA9IHRoaXMuYnVpbGRHbG9iYWxEYXRhKCk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgICAgIHRoaXMuY2VsbFdpZHRoID0gY29uZmlnLmNlbGxXaWR0aDtcbiAgICAgICAgdGhpcy5jZWxsSGVpZ2h0ID0gY29uZmlnLmNlbGxIZWlnaHQ7XG4gICAgICAgIHRoaXMuY3Jvc3N0YWJDb250YWluZXIgPSBjb25maWcuY3Jvc3N0YWJDb250YWluZXI7XG4gICAgICAgIHRoaXMuaGFzaCA9IHRoaXMuZ2V0RmlsdGVySGFzaE1hcCgpO1xuICAgIH1cblxuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHJvd0VsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY29ybmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbFJlZi5vdXRlckhUTUxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5wdXNoKFtyb3dFbGVtZW50XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2gocm93RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5yb3dzcGFuID0gdGhpcy5jcmVhdGVSb3codGFibGUsIGRhdGEsIHJvd09yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xMZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhcnRDZWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0OiB0aGlzLmdldENoYXJ0T2JqKGZpbHRlcmVkRGF0YUhhc2hLZXksIHRoaXMuY29sdW1uS2V5QXJyW2pdKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKGNoYXJ0Q2VsbE9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c3BhbiArPSByb3dFbGVtZW50LnJvd3NwYW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3NwYW47XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sICh0YWJsZSwgZGF0YSwgY29sT3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIGNvbHNwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSBjb2xPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICBjb2xFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKGNvbE9yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgaWYgKHRhYmxlLmxlbmd0aCA8PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGh0bWxSZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBodG1sUmVmLmlubmVySFRNTCA9IGZpZWxkVmFsdWVzW2ldO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICB0aGlzLmNvcm5lckhlaWdodCA9IGh0bWxSZWYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY2VsbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb3JuZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5ID0gZmlsdGVyZWREYXRhU3RvcmUgKyBmaWVsZFZhbHVlc1tpXSArICd8JztcblxuICAgICAgICAgICAgdGFibGVbY3VycmVudEluZGV4XS5wdXNoKGNvbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoaGFzRnVydGhlckRlcHRoKSB7XG4gICAgICAgICAgICAgICAgY29sRWxlbWVudC5jb2xzcGFuID0gdGhpcy5jcmVhdGVDb2wodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXggKyAxLCBmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5LZXlBcnIucHVzaChmaWx0ZXJlZERhdGFIYXNoS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbHNwYW4gKz0gY29sRWxlbWVudC5jb2xzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZUNyb3NzdGFiICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgb2JqID0gdGhpcy5nbG9iYWxEYXRhLFxuICAgICAgICAgICAgcm93T3JkZXIgPSB0aGlzLnJvd0RpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29sT3JkZXIgPSB0aGlzLmNvbERpbWVuc2lvbnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm1lYXN1cmVPblJvdykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBhcnJbYXJyLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29ybmVyQ2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwICogdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBjb2xPcmRlci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY29sc3Bhbjogcm93T3JkZXIubGVuZ3RoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFibGUgPSBbW2Nvcm5lckNlbGxPYmpdXTtcbiAgICAgICAgdGhpcy5jcmVhdGVDb2wodGFibGUsIG9iaiwgY29sT3JkZXIsIDAsICcnKTtcbiAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIHRoaXMuY3JlYXRlUm93KHRhYmxlLCBvYmosIHJvd09yZGVyLCAwLCAnJyk7XG4gICAgICAgIHRoaXMuY3JlYXRlTXVsdGlDaGFydCh0YWJsZSk7XG4gICAgICAgIHRoaXMuY29sdW1uS2V5QXJyID0gW107XG4gICAgfVxuXG4gICAgcm93RGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICByb3dEaW1lbnNpb25zID0gdGhpcy5yb3dEaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnMuc3BsaWNlKHJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvd0RpbWVuc2lvbnMuaW5kZXhPZihNYXRoLm1heChzdWJqZWN0LCB0YXJnZXQpKSA+PSByb3dEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gcm93RGltZW5zaW9uc1tzdWJqZWN0XTtcbiAgICAgICAgICAgIGZvciAoaSA9IHN1YmplY3QgLSAxOyBpID49IHRhcmdldDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgcm93RGltZW5zaW9uc1tpICsgMV0gPSByb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93RGltZW5zaW9uc1t0YXJnZXRdID0gYnVmZmVyO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IHJvd0RpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0ICsgMTsgaSA8PSB0YXJnZXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbaSAtIDFdID0gcm93RGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd0RpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZUNyb3NzdGFiKCk7XG4gICAgfVxuXG4gICAgY29sRGltUmVvcmRlciAoc3ViamVjdCwgdGFyZ2V0KSB7XG4gICAgICAgIHZhciBidWZmZXIgPSAnJyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zID0gdGhpcy5jb2xEaW1lbnNpb25zO1xuICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zLnNwbGljZShjb2xEaW1lbnNpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gY29sRGltZW5zaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAnd3JvbmcgaW5kZXgnO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmplY3QgPiB0YXJnZXQpIHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGNvbERpbWVuc2lvbnNbc3ViamVjdF07XG4gICAgICAgICAgICBmb3IgKGkgPSBzdWJqZWN0IC0gMTsgaSA+PSB0YXJnZXQ7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbaSArIDFdID0gY29sRGltZW5zaW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbERpbWVuc2lvbnNbdGFyZ2V0XSA9IGJ1ZmZlcjtcbiAgICAgICAgfSBlbHNlIGlmIChzdWJqZWN0IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICBidWZmZXIgPSBjb2xEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb2xEaW1lbnNpb25zW2kgLSAxXSA9IGNvbERpbWVuc2lvbnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycywgY29sRmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXREYXRhKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVtmaWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IHRoaXMubWVhc3VyZU9uUm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBbdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFt0aGlzLm1lYXN1cmVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH1cbl07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==