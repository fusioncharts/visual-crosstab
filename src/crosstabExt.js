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
