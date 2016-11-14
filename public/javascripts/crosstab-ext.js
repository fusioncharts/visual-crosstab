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
	
	    colDimReorder (subject, target) {
	        var buffer = '',
	            i;
	        if (this.colDimensions.indexOf(Math.max(subject, target)) >= this.colDimensions.length) {
	            return 'wrong index';
	        } else if (subject > target) {
	            buffer = this.colDimensions[subject];
	            for (i = subject - 1; i >= target; i--) {
	                this.colDimensions[i + 1] = this.colDimensions[i];
	            }
	            this.colDimensions[target] = buffer;
	        } else if (subject < target) {
	            buffer = this.colDimensions[subject];
	            for (i = subject + 1; i <= target; i++) {
	                this.colDimensions[i - 1] = this.colDimensions[i];
	            }
	            this.colDimensions[target] = buffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTNkNWVjZWIyYTMwZThjNDM3ODIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLHdCQUF3QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixnQ0FBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0Esa0NBQWlDLGFBQWE7QUFDOUM7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0Esa0NBQWlDLGFBQWE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFtRCxPQUFPO0FBQzFEO0FBQ0E7QUFDQSw0REFBMkQsU0FBUztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLGNBQWE7QUFDYjtBQUNBLDREQUEyRCxTQUFTO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQ0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQW1ELFNBQVM7QUFDNUQseURBQXdELFlBQVk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsdURBQXNELFFBQVE7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDN1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyb3NzdGFiLWV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDkzZDVlY2ViMmEzMGU4YzQzNzgyIiwiY29uc3QgQ3Jvc3N0YWJFeHQgPSByZXF1aXJlKCcuL2Nyb3NzdGFiRXh0JyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vbGFyZ2VEYXRhJyk7XG5cbnZhciBjb25maWcgPSB7XG4gICAgcm93RGltZW5zaW9uczogWydwcm9kdWN0JywgJ3N0YXRlJ10sXG4gICAgY29sRGltZW5zaW9uczogWyd5ZWFyJywgJ3F1YWxpdHknLCAnbW9udGgnXSxcbiAgICBjaGFydFR5cGU6ICdiYXIyZCcsXG4gICAgbWVhc3VyZTogJ3NhbGUnLFxuICAgIG1lYXN1cmVPblJvdzogZmFsc2UsXG4gICAgY2VsbFdpZHRoOiAzMjAsXG4gICAgY2VsbEhlaWdodDogMTMwLFxuICAgIGNyb3NzdGFiQ29udGFpbmVyOiAnY3Jvc3N0YWItZGl2JyxcbiAgICBjaGFydENvbmZpZzoge1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgJ251bWJlclByZWZpeCc6ICfigrknLFxuICAgICAgICAgICAgJ3BhbGV0dGVDb2xvcnMnOiAnIzlmOWY5ZicsXG4gICAgICAgICAgICAnYmdDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICd2YWx1ZUZvbnRDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICd1c2VQbG90R3JhZGllbnRDb2xvcic6ICcwJyxcbiAgICAgICAgICAgICdzaG93WUF4aXNWYWx1ZXMnOiAnMCcsXG4gICAgICAgICAgICAnc2hvd1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93WEF4aXNMaW5lJzogJzEnLFxuICAgICAgICAgICAgJ3Nob3dYYXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdyb3RhdGVWYWx1ZXMnOiAnMScsXG4gICAgICAgICAgICAnYWx0ZXJuYXRlVkdyaWRBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVIR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICd4QXhpc0xpbmVDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQ29sb3InOiAnIzAwMDAwMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMTAwJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxud2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG53aW5kb3cuY3Jvc3N0YWIuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gY29uZmlnLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IGNvbmZpZy5jb2xEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSBjb25maWcubWVhc3VyZTtcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgICAgICB0aGlzLmhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKTtcbiAgICB9XG5cbiAgICBidWlsZEdsb2JhbERhdGEgKCkge1xuICAgICAgICBsZXQgZmllbGRzID0gdGhpcy5kYXRhU3RvcmUuZ2V0S2V5cygpLFxuICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBmaWVsZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZ2xvYmFsRGF0YVtmaWVsZHNbaV1dID0gdGhpcy5kYXRhU3RvcmUuZ2V0VW5pcXVlVmFsdWVzKGZpZWxkc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdsb2JhbERhdGE7XG4gICAgfVxuXG4gICAgY3JlYXRlUm93ICh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCwgZmlsdGVyZWREYXRhU3RvcmUpIHtcbiAgICAgICAgdmFyIHJvd3NwYW4gPSAwLFxuICAgICAgICAgICAgZmllbGRDb21wb25lbnQgPSByb3dPcmRlcltjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgZmllbGRWYWx1ZXMgPSBkYXRhW2ZpZWxkQ29tcG9uZW50XSxcbiAgICAgICAgICAgIGksIGwgPSBmaWVsZFZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICByb3dFbGVtZW50LFxuICAgICAgICAgICAgaGFzRnVydGhlckRlcHRoID0gY3VycmVudEluZGV4IDwgKHJvd09yZGVyLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSxcbiAgICAgICAgICAgIGNvbExlbmd0aCA9IHRoaXMuY29sdW1uS2V5QXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGh0bWxSZWY7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS5tYXJnaW5Ub3AgPSAoKHRoaXMuY2VsbEhlaWdodCAtIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVyV2lkdGggPSBmaWVsZFZhbHVlc1tpXS5sZW5ndGggKiAxMDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNvcm5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICBjb2xzcGFuOiAxLFxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxSZWYub3V0ZXJIVE1MXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgdGFibGUucHVzaChbcm93RWxlbWVudF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQucm93c3BhbiA9IHRoaXMuY3JlYXRlUm93KHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sTGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0Q2VsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydDogdGhpcy5nZXRDaGFydE9iaihmaWx0ZXJlZERhdGFIYXNoS2V5LCB0aGlzLmNvbHVtbktleUFycltqXSlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChjaGFydENlbGxPYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd3NwYW4gKz0gcm93RWxlbWVudC5yb3dzcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzcGFuO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbCAodGFibGUsIGRhdGEsIGNvbE9yZGVyLCBjdXJyZW50SW5kZXgsIGZpbHRlcmVkRGF0YVN0b3JlKSB7XG4gICAgICAgIHZhciBjb2xzcGFuID0gMCxcbiAgICAgICAgICAgIGZpZWxkQ29tcG9uZW50ID0gY29sT3JkZXJbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAgIGZpZWxkVmFsdWVzID0gZGF0YVtmaWVsZENvbXBvbmVudF0sXG4gICAgICAgICAgICBpLCBsID0gZmllbGRWYWx1ZXMubGVuZ3RoLFxuICAgICAgICAgICAgY29sRWxlbWVudCxcbiAgICAgICAgICAgIGhhc0Z1cnRoZXJEZXB0aCA9IGN1cnJlbnRJbmRleCA8IChjb2xPcmRlci5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXksXG4gICAgICAgICAgICBodG1sUmVmO1xuXG4gICAgICAgIGlmICh0YWJsZS5sZW5ndGggPD0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0YWJsZS5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJIZWlnaHQgPSBodG1sUmVmLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvcm5lckNlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogY29sT3JkZXIubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHJvd09yZGVyLmxlbmd0aFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYmxlID0gW1tjb3JuZXJDZWxsT2JqXV07XG4gICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGFibGUpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgIH1cblxuICAgIHJvd0RpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpO1xuICAgICAgICBpZiAodGhpcy5yb3dEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSArIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSAtIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIGNvbERpbVJlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpO1xuICAgICAgICBpZiAodGhpcy5jb2xEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5jb2xEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnNbaSArIDFdID0gdGhpcy5jb2xEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5jb2xEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbERpbWVuc2lvbnNbaSAtIDFdID0gdGhpcy5jb2xEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2xEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycywgY29sRmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IHRoaXMuaGFzaFt0aGlzLm1hdGNoSGFzaChmaWx0ZXJTdHIsIHRoaXMuaGFzaCldO1xuICAgICAgICBpZiAobWF0Y2hlZEhhc2hlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gbWF0Y2hlZEhhc2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvciA9IHRoaXMubWMuY3JlYXRlRGF0YVByb2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3IuZmlsdGVyKG1hdGNoZWRIYXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzLnB1c2goZGF0YVByb2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFTdG9yZS5nZXREYXRhKGRhdGFQcm9jZXNzb3JzKTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVtmaWx0ZXJlZERhdGEubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuY2hhcnRUeXBlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAganNvbkRhdGE6IGZpbHRlcmVkRGF0YS5nZXRKU09OKCksXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb246IHRoaXMubWVhc3VyZU9uUm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBbdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFt0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lYXN1cmU6IFt0aGlzLm1lYXN1cmVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzVHlwZTogJ1NTJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jaGFydENvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckdlbiAoa2V5LCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiBkYXRhW2tleV0gPT09IHZhbDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3Jvc3N0YWJFeHQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcm9zc3RhYkV4dC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH1cbl07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sYXJnZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==