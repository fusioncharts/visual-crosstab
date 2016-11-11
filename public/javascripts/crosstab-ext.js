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
	            'paletteColors': '#b5b9ba',
	            'bgColor': '#ffffff',
	            'valueFontColor': '#ffffff',
	            'usePlotGradientColor': '0',
	            'showYAxisValues': '0',
	            'showValues': '0',
	            'showXAxisLine': '1',
	            'showXaxisValues': '0',
	            'rotateValues': '1',
	            'alternateVGridAlpha': '0',
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
	            console.log(this.cornerWidth);
	            document.body.removeChild(htmlRef);
	            htmlRef.style.visibility = 'visible';
	            rowElement = {
	                width: this.cornerWidth,
	                height: 35,
	                rowspan: 1,
	                cplSpan: 1,
	                html: htmlRef.outerHTML
	            };
	            console.log(fieldValues[i]);
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
	                        cplSpan: 1,
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
	            console.log(htmlRef);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjhiYzI3NTU0Zjk4YWE3ZmY5NTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jcm9zc3RhYkV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFyZ2VEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyx3QkFBd0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixnQ0FBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLGtDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXNELE9BQU87QUFDN0Q7QUFDQTtBQUNBLHVEQUFzRCxPQUFPO0FBQzdEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBbUQsT0FBTztBQUMxRDtBQUNBO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsNERBQTJELFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBc0QsT0FBTztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQ0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0E7O0FBRUEsb0RBQW1ELFNBQVM7QUFDNUQseURBQXdELFlBQVk7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx1REFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN4WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3Jvc3N0YWItZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjhiYzI3NTU0Zjk4YWE3ZmY5NTgiLCJjb25zdCBDcm9zc3RhYkV4dCA9IHJlcXVpcmUoJy4vY3Jvc3N0YWJFeHQnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9sYXJnZURhdGEnKTtcblxudmFyIGNvbmZpZyA9IHtcbiAgICByb3dEaW1lbnNpb25zOiBbJ3Byb2R1Y3QnLCAnc3RhdGUnXSxcbiAgICBjb2xEaW1lbnNpb25zOiBbJ3llYXInLCAncXVhbGl0eScsICdtb250aCddLFxuICAgIGNoYXJ0VHlwZTogJ2JhcjJkJyxcbiAgICBtZWFzdXJlOiAnc2FsZScsXG4gICAgbWVhc3VyZU9uUm93OiBmYWxzZSxcbiAgICBjZWxsV2lkdGg6IDMyMCxcbiAgICBjZWxsSGVpZ2h0OiAxMzAsXG4gICAgY3Jvc3N0YWJDb250YWluZXI6ICdjcm9zc3RhYi1kaXYnLFxuICAgIGNoYXJ0Q29uZmlnOiB7XG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAnbnVtYmVyUHJlZml4JzogJ+KCuScsXG4gICAgICAgICAgICAncGFsZXR0ZUNvbG9ycyc6ICcjYjViOWJhJyxcbiAgICAgICAgICAgICdiZ0NvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3ZhbHVlRm9udENvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgJ3VzZVBsb3RHcmFkaWVudENvbG9yJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dZQXhpc1ZhbHVlcyc6ICcwJyxcbiAgICAgICAgICAgICdzaG93VmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3Nob3dYQXhpc0xpbmUnOiAnMScsXG4gICAgICAgICAgICAnc2hvd1hheGlzVmFsdWVzJzogJzAnLFxuICAgICAgICAgICAgJ3JvdGF0ZVZhbHVlcyc6ICcxJyxcbiAgICAgICAgICAgICdhbHRlcm5hdGVWR3JpZEFscGhhJzogJzAnLFxuICAgICAgICAgICAgJ2RpdkxpbmVBbHBoYSc6ICcwJyxcbiAgICAgICAgICAgICd4QXhpc0xpbmVDb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICdwbG90Qm9yZGVyQWxwaGEnOiAnMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQ29sb3InOiAnIzAwMDAwMCcsXG4gICAgICAgICAgICAnY2FudmFzQm9yZGVyQWxwaGEnOiAnMTAwJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxud2luZG93LmNyb3NzdGFiID0gbmV3IENyb3NzdGFiRXh0KGRhdGEsIGNvbmZpZyk7XG53aW5kb3cuY3Jvc3N0YWIuY3JlYXRlQ3Jvc3N0YWIoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIENyb3NzdGFiRXh0IHtcbiAgICBjb25zdHJ1Y3RvciAoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubWMgPSBuZXcgTXVsdGlDaGFydGluZygpO1xuICAgICAgICB0aGlzLmRhdGFTdG9yZSA9IHRoaXMubWMuY3JlYXRlRGF0YVN0b3JlKCk7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNldERhdGEoeyBkYXRhU291cmNlOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gY29uZmlnLmNoYXJ0VHlwZTtcbiAgICAgICAgdGhpcy5jaGFydENvbmZpZyA9IGNvbmZpZy5jaGFydENvbmZpZztcbiAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zID0gY29uZmlnLnJvd0RpbWVuc2lvbnM7XG4gICAgICAgIHRoaXMuY29sRGltZW5zaW9ucyA9IGNvbmZpZy5jb2xEaW1lbnNpb25zO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLm1lcmdlRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLm1lYXN1cmUgPSBjb25maWcubWVhc3VyZTtcbiAgICAgICAgdGhpcy5tZWFzdXJlT25Sb3cgPSBjb25maWcubWVhc3VyZU9uUm93O1xuICAgICAgICB0aGlzLmdsb2JhbERhdGEgPSB0aGlzLmJ1aWxkR2xvYmFsRGF0YSgpO1xuICAgICAgICB0aGlzLmNvbHVtbktleUFyciA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNvbmZpZy5jZWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY2VsbEhlaWdodCA9IGNvbmZpZy5jZWxsSGVpZ2h0O1xuICAgICAgICB0aGlzLmNyb3NzdGFiQ29udGFpbmVyID0gY29uZmlnLmNyb3NzdGFiQ29udGFpbmVyO1xuICAgIH1cblxuICAgIGJ1aWxkR2xvYmFsRGF0YSAoKSB7XG4gICAgICAgIGxldCBmaWVsZHMgPSB0aGlzLmRhdGFTdG9yZS5nZXRLZXlzKCksXG4gICAgICAgICAgICBnbG9iYWxEYXRhID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGZpZWxkcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBnbG9iYWxEYXRhW2ZpZWxkc1tpXV0gPSB0aGlzLmRhdGFTdG9yZS5nZXRVbmlxdWVWYWx1ZXMoZmllbGRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsRGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVSb3cgKHRhYmxlLCBkYXRhLCByb3dPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgcm93c3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IHJvd09yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIHJvd0VsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAocm93T3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgY29sTGVuZ3RoID0gdGhpcy5jb2x1bW5LZXlBcnIubGVuZ3RoLFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sUmVmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaHRtbFJlZi5pbm5lckhUTUwgPSBmaWVsZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGh0bWxSZWYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLm1hcmdpblRvcCA9ICgodGhpcy5jZWxsSGVpZ2h0IC0gMTApIC8gMikgKyAncHgnO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJXaWR0aCA9IGZpZWxkVmFsdWVzW2ldLmxlbmd0aCAqIDEwO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3JuZXJXaWR0aCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgaHRtbFJlZi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgcm93RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jb3JuZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY3BsU3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpZWxkVmFsdWVzW2ldKTtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YUhhc2hLZXkgPSBmaWx0ZXJlZERhdGFTdG9yZSArIGZpZWxkVmFsdWVzW2ldICsgJ3wnO1xuXG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIHRhYmxlLnB1c2goW3Jvd0VsZW1lbnRdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNGdXJ0aGVyRGVwdGgpIHtcbiAgICAgICAgICAgICAgICByb3dFbGVtZW50LnJvd3NwYW4gPSB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgZGF0YSwgcm93T3JkZXIsIGN1cnJlbnRJbmRleCArIDEsIGZpbHRlcmVkRGF0YUhhc2hLZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbExlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGFydENlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5jZWxsV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcGxTcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQ6IHRoaXMuZ2V0Q2hhcnRPYmooZmlsdGVyZWREYXRhSGFzaEtleSwgdGhpcy5jb2x1bW5LZXlBcnJbal0pXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW3RhYmxlLmxlbmd0aCAtIDFdLnB1c2goY2hhcnRDZWxsT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dzcGFuICs9IHJvd0VsZW1lbnQucm93c3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93c3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2wgKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4LCBmaWx0ZXJlZERhdGFTdG9yZSkge1xuICAgICAgICB2YXIgY29sc3BhbiA9IDAsXG4gICAgICAgICAgICBmaWVsZENvbXBvbmVudCA9IGNvbE9yZGVyW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICBmaWVsZFZhbHVlcyA9IGRhdGFbZmllbGRDb21wb25lbnRdLFxuICAgICAgICAgICAgaSwgbCA9IGZpZWxkVmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGNvbEVsZW1lbnQsXG4gICAgICAgICAgICBoYXNGdXJ0aGVyRGVwdGggPSBjdXJyZW50SW5kZXggPCAoY29sT3JkZXIubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFIYXNoS2V5LFxuICAgICAgICAgICAgaHRtbFJlZjtcblxuICAgICAgICBpZiAodGFibGUubGVuZ3RoIDw9IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgaHRtbFJlZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGh0bWxSZWYuaW5uZXJIVE1MID0gZmllbGRWYWx1ZXNbaV07XG4gICAgICAgICAgICBodG1sUmVmLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sUmVmKTtcbiAgICAgICAgICAgIHRoaXMuY29ybmVySGVpZ2h0ID0gaHRtbFJlZi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGh0bWxSZWYpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coaHRtbFJlZik7XG4gICAgICAgICAgICBjb2xFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmNlbGxXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29ybmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IDEsXG4gICAgICAgICAgICAgICAgY29sc3BhbjogMSxcbiAgICAgICAgICAgICAgICBodG1sOiBodG1sUmVmLm91dGVySFRNTFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsdGVyZWREYXRhSGFzaEtleSA9IGZpbHRlcmVkRGF0YVN0b3JlICsgZmllbGRWYWx1ZXNbaV0gKyAnfCc7XG5cbiAgICAgICAgICAgIHRhYmxlW2N1cnJlbnRJbmRleF0ucHVzaChjb2xFbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGhhc0Z1cnRoZXJEZXB0aCkge1xuICAgICAgICAgICAgICAgIGNvbEVsZW1lbnQuY29sc3BhbiA9IHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBkYXRhLCBjb2xPcmRlciwgY3VycmVudEluZGV4ICsgMSwgZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uS2V5QXJyLnB1c2goZmlsdGVyZWREYXRhSGFzaEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xzcGFuICs9IGNvbEVsZW1lbnQuY29sc3BhbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sc3BhbjtcbiAgICB9XG5cbiAgICBjcmVhdGVDcm9zc3RhYiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9iaiA9IHRoaXMuZ2xvYmFsRGF0YSxcbiAgICAgICAgICAgIHJvd09yZGVyID0gdGhpcy5yb3dEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvbE9yZGVyID0gdGhpcy5jb2xEaW1lbnNpb25zLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5tZWFzdXJlT25Sb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gYXJyW2Fyci5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNvcm5lckNlbGxPYmogPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCAqIHRoaXMuY29sRGltZW5zaW9ucy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcm93c3BhbjogY29sT3JkZXIubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGNvbHNwYW46IHJvd09yZGVyLmxlbmd0aFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYmxlID0gW1tjb3JuZXJDZWxsT2JqXV07XG4gICAgICAgIHRoaXMuY3JlYXRlQ29sKHRhYmxlLCBvYmosIGNvbE9yZGVyLCAwLCAnJyk7XG4gICAgICAgIHRhYmxlLnB1c2goW10pO1xuICAgICAgICB0aGlzLmNyZWF0ZVJvdyh0YWJsZSwgb2JqLCByb3dPcmRlciwgMCwgJycpO1xuICAgICAgICB0aGlzLmNyZWF0ZU11bHRpQ2hhcnQodGFibGUpO1xuICAgIH1cblxuICAgIHJvd1Jlb3JkZXIgKHN1YmplY3QsIHRhcmdldCkge1xuICAgICAgICB2YXIgYnVmZmVyID0gJycsXG4gICAgICAgICAgICBpO1xuICAgICAgICBpZiAodGhpcy5yb3dEaW1lbnNpb25zLmluZGV4T2YoTWF0aC5tYXgoc3ViamVjdCwgdGFyZ2V0KSkgPj0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuICd3cm9uZyBpbmRleCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA+IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCAtIDE7IGkgPj0gdGFyZ2V0OyBpLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSArIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViamVjdCA8IHRhcmdldCkge1xuICAgICAgICAgICAgYnVmZmVyID0gdGhpcy5yb3dEaW1lbnNpb25zW3N1YmplY3RdO1xuICAgICAgICAgICAgZm9yIChpID0gc3ViamVjdCArIDE7IGkgPD0gdGFyZ2V0OyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0RpbWVuc2lvbnNbaSAtIDFdID0gdGhpcy5yb3dEaW1lbnNpb25zW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yb3dEaW1lbnNpb25zW3RhcmdldF0gPSBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVDcm9zc3RhYigpO1xuICAgIH1cblxuICAgIG1lcmdlRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHRoaXMucm93RGltZW5zaW9uc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godGhpcy5jb2xEaW1lbnNpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBjcmVhdGVGaWx0ZXJzICgpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmRpbWVuc2lvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5tZWFzdXJlT25Sb3cgJiYgdGhpcy5kaW1lbnNpb25zW2ldICE9PSB0aGlzLmNvbERpbWVuc2lvbnNbdGhpcy5jb2xEaW1lbnNpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoZWRWYWx1ZXMgPSB0aGlzLmdsb2JhbERhdGFbdGhpcy5kaW1lbnNpb25zW2ldXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gbWF0Y2hlZFZhbHVlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlckdlbih0aGlzLmRpbWVuc2lvbnNbaV0sIG1hdGNoZWRWYWx1ZXNbal0udG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJWYWw6IG1hdGNoZWRWYWx1ZXNbal1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGFDb21ib3MgKCkge1xuICAgICAgICBsZXQgciA9IFtdLFxuICAgICAgICAgICAgZ2xvYmFsQXJyYXkgPSB0aGlzLm1ha2VHbG9iYWxBcnJheSgpLFxuICAgICAgICAgICAgbWF4ID0gZ2xvYmFsQXJyYXkubGVuZ3RoIC0gMTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlIChhcnIsIGkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZ2xvYmFsQXJyYXlbaV0ubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBhcnIuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGdsb2JhbEFycmF5W2ldW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGEsIGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVjdXJzZShbXSwgMCk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIG1ha2VHbG9iYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCB0ZW1wT2JqID0ge30sXG4gICAgICAgICAgICB0ZW1wQXJyID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ2xvYmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gdGhpcy5tZWFzdXJlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWVhc3VyZU9uUm93ICYmIGtleSAhPT0gdGhpcy5yb3dEaW1lbnNpb25zW3RoaXMucm93RGltZW5zaW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wT2JqW2tleV0gPSB0aGlzLmdsb2JhbERhdGFba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm1lYXN1cmVPblJvdyAmJiBrZXkgIT09IHRoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcE9ialtrZXldID0gdGhpcy5nbG9iYWxEYXRhW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBBcnIgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKS5tYXAoa2V5ID0+IHRlbXBPYmpba2V5XSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cblxuICAgIGdldEZpbHRlckhhc2hNYXAgKCkge1xuICAgICAgICBsZXQgZmlsdGVycyA9IHRoaXMuY3JlYXRlRmlsdGVycygpLFxuICAgICAgICAgICAgZGF0YUNvbWJvcyA9IHRoaXMuY3JlYXRlRGF0YUNvbWJvcygpLFxuICAgICAgICAgICAgaGFzaE1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUNvbWJvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkYXRhQ29tYm8gPSBkYXRhQ29tYm9zW2ldLFxuICAgICAgICAgICAgICAgIGtleSA9ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBkYXRhQ29tYm8ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuZ3RoID0gZmlsdGVycy5sZW5ndGg7IGsgPCBsZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsID0gZmlsdGVyc1trXS5maWx0ZXJWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhQ29tYm9bal0gPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgKz0gJ3wnICsgZGF0YUNvbWJvW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChmaWx0ZXJzW2tdLmZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaE1hcDtcbiAgICB9XG5cbiAgICBjcmVhdGVNdWx0aUNoYXJ0IChtYXRyaXgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGljaGFydE9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpY2hhcnRPYmplY3QgPSB0aGlzLm1jLmNyZWF0ZU1hdHJpeCh0aGlzLmNyb3NzdGFiQ29udGFpbmVyLCBtYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5tdWx0aWNoYXJ0T2JqZWN0LmRyYXcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGljaGFydE9iamVjdC51cGRhdGUobWF0cml4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBlcm11dGVBcnIgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBwZXJtdXRlIChhcnIsIG1lbSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ7XG4gICAgICAgICAgICBtZW0gPSBtZW0gfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFyci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1lbS5jb25jYXQoY3VycmVudCkuam9pbignfCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVybXV0ZShhcnIuc2xpY2UoKSwgbWVtLmNvbmNhdChjdXJyZW50KSk7XG4gICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBjdXJyZW50WzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZXJtdXRlU3RycyA9IHBlcm11dGUoYXJyKTtcbiAgICAgICAgcmV0dXJuIHBlcm11dGVTdHJzLmpvaW4oJyohJV4nKTtcbiAgICB9XG5cbiAgICBtYXRjaEhhc2ggKGZpbHRlclN0ciwgaGFzaCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGFzaCkge1xuICAgICAgICAgICAgaWYgKGhhc2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0ga2V5LnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgICAgICAgIGtleVBlcm11dGF0aW9ucyA9IHRoaXMucGVybXV0ZUFycihrZXlzKS5zcGxpdCgnKiElXicpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQZXJtdXRhdGlvbnMuaW5kZXhPZihmaWx0ZXJTdHIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UGVybXV0YXRpb25zWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRPYmogKHJvd0ZpbHRlciwgY29sdW1uRmlsdGVyKSB7XG4gICAgICAgIGxldCBmaWx0ZXJzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHJvd0ZpbHRlcnMgPSByb3dGaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGNvbEZpbHRlcnMgPSBjb2x1bW5GaWx0ZXIuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgIGhhc2ggPSB0aGlzLmdldEZpbHRlckhhc2hNYXAoKSxcbiAgICAgICAgICAgIGRhdGFQcm9jZXNzb3JzID0gW10sXG4gICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0ge30sXG4gICAgICAgICAgICBtYXRjaGVkSGFzaGVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEgPSB7fTtcblxuICAgICAgICByb3dGaWx0ZXJzLnB1c2guYXBwbHkocm93RmlsdGVycywgY29sRmlsdGVycyk7XG4gICAgICAgIGZpbHRlcnMgPSByb3dGaWx0ZXJzLmZpbHRlcigoYSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChhICE9PSAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaWx0ZXJTdHIgPSBmaWx0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgbWF0Y2hlZEhhc2hlcyA9IGhhc2hbdGhpcy5tYXRjaEhhc2goZmlsdGVyU3RyLCBoYXNoKV07XG4gICAgICAgIGlmIChtYXRjaGVkSGFzaGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBtYXRjaGVkSGFzaGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXRhUHJvY2Vzc29yID0gdGhpcy5tYy5jcmVhdGVEYXRhUHJvY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3Nvci5maWx0ZXIobWF0Y2hlZEhhc2hlc1tpXSk7XG4gICAgICAgICAgICAgICAgZGF0YVByb2Nlc3NvcnMucHVzaChkYXRhUHJvY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVN0b3JlLmdldERhdGEoZGF0YVByb2Nlc3NvcnMpO1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhW2ZpbHRlcmVkRGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBqc29uRGF0YTogZmlsdGVyZWREYXRhLmdldEpTT04oKSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbjogdGhpcy5tZWFzdXJlT25Sb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFt0aGlzLnJvd0RpbWVuc2lvbnNbdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCAtIDFdXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogW3RoaXMuY29sRGltZW5zaW9uc1t0aGlzLmNvbERpbWVuc2lvbnMubGVuZ3RoIC0gMV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZTogW3RoaXMubWVhc3VyZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNUeXBlOiAnU1MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyR2VuIChrZXksIHZhbCkge1xuICAgICAgICByZXR1cm4gKGRhdGEpID0+IGRhdGFba2V5XSA9PT0gdmFsO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDcm9zc3RhYkV4dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Nyb3NzdGFiRXh0LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogOVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA4XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnUmljZScsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnQXVnJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1JpY2UnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdSaWNlJyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogM1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCaWhhcicsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnU2VwdCcsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdWx5JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmloYXInLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JpaGFyJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bicsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNFxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0p1bHknLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA5XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTUnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogNlxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNScsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogNVxuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE1JyxcbiAgICAgICAgJ21vbnRoJzogJ1NlcHQnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdKdW4nLFxuICAgICAgICAncXVhbGl0eSc6ICdHb29kJyxcbiAgICAgICAgJ3NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVuJyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdwcm9kdWN0JzogJ1doZWF0JyxcbiAgICAgICAgJ3N0YXRlJzogJ0JlbmdhbCcsXG4gICAgICAgICd5ZWFyJzogJzIwMTYnLFxuICAgICAgICAnbW9udGgnOiAnSnVseScsXG4gICAgICAgICdxdWFsaXR5JzogJ01lZGl1bScsXG4gICAgICAgICdzYWxlJzogN1xuICAgIH0sXG4gICAge1xuICAgICAgICAncHJvZHVjdCc6ICdXaGVhdCcsXG4gICAgICAgICdzdGF0ZSc6ICdCZW5nYWwnLFxuICAgICAgICAneWVhcic6ICcyMDE2JyxcbiAgICAgICAgJ21vbnRoJzogJ0F1ZycsXG4gICAgICAgICdxdWFsaXR5JzogJ0dvb2QnLFxuICAgICAgICAnc2FsZSc6IDhcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdBdWcnLFxuICAgICAgICAncXVhbGl0eSc6ICdNZWRpdW0nLFxuICAgICAgICAnc2FsZSc6IDZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnR29vZCcsXG4gICAgICAgICdzYWxlJzogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ3Byb2R1Y3QnOiAnV2hlYXQnLFxuICAgICAgICAnc3RhdGUnOiAnQmVuZ2FsJyxcbiAgICAgICAgJ3llYXInOiAnMjAxNicsXG4gICAgICAgICdtb250aCc6ICdTZXB0JyxcbiAgICAgICAgJ3F1YWxpdHknOiAnTWVkaXVtJyxcbiAgICAgICAgJ3NhbGUnOiA3XG4gICAgfVxuXTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xhcmdlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9