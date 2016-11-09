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
        let fields = this.dataStore.getKey();
        let globalData = {};
        for (let i = 0, ii = fields.length; i < ii; i++) {
            globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
        }
        return globalData;
    }

    createArray () {
        let numRows = 1;
        let numCols = 1;
        let rowDims = this.rowDimensions;
        let colDims = this.colDimensions;
        for (let i = 0, ii = rowDims.length; i < ii; i++) {
            numRows = numRows * this.globalData[rowDims[i]].length;
        }
        for (let i = 0, ii = colDims.length - 1; i < ii; i++) {
            numCols = numCols * this.globalData[colDims[i]].length;
        }
        if (this.measureOnRow) {
            numRows += colDims.length;
            numCols += rowDims.length - 1;
        } else {
            numRows += colDims.length - 1;
            numCols += rowDims.length;
        }
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
        let r = [];
        let globalArray = this.makeGlobalArray();
        let max = globalArray.length - 1;

        function recurse (arr, i) {
            for (var j = 0, l = globalArray[i].length; j < l; j++) {
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
        let tempObj = {};
        let tempArr = [];
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
        let filters = this.createFilters();
        let dataCombos = this.createDataCombos();
        let hashMap = {};
        for (let i = 0, l = dataCombos.length; i < l; i++) {
            let dataCombo = dataCombos[i];
            let key = '';
            let value = [];
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

    createMatrix () {
        var cols = [];
        var rows = [];
        for (let i = 0; i < this.colDimensions.length; i++) {
            if (this.measureOnRow) {
                cols.push(this.globalData[this.colDimensions[i]]);
            } else {
                if (this.colDimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
                    cols.push(this.globalData[this.colDimensions[i]]);
                }
            }
        }
        for (let i = 0; i < this.rowDimensions.length; i++) {
            if (this.measureOnRow) {
                if (this.colDimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
                    rows.push(this.globalData[this.rowDimensions[i]]);
                }
            } else {
                rows.push(this.globalData[this.rowDimensions[i]]);
            }
        }
        var str = '';
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            for (var j = 0; j < row.length; j++) {
                str += row[j];
            }
            str += '\n';
        }
        console.log(str);
    }

    filter (a) {
        return (a.product === 'Tea' && a.state === 'New York' && a.year === '2013');
    };

    createMultiChart () {
        let chartArr = [];
        let hash = this.getFilterHashMap();
        // this.drawSpans('crosstab-div', Object.keys(hash).length);
        // console.log(hash);

        for (var key in hash) {
            if (hash.hasOwnProperty(key)) {
                let dataProcessors = [];
                let filters = hash[key];
                for (var i = 0; i < filters.length; i++) {
                    let dataProcessor = this.mc.createDataProcessor();
                    dataProcessor.filter(filters[i]);
                    dataProcessors.push(dataProcessor);
                }
                let filteredData = this.dataStore.getData(dataProcessors);
                filteredData = filteredData[filteredData.length - 1];

                let chartObj = {
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
        this.mc.createMatrix('crosstab-div', [chartArr]).draw();
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }
}

module.exports = CrosstabExt;
