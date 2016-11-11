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
