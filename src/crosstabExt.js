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

    createMatrix () {
        let matrix = [];
        let rowDims = [];
        let colDims = [];

        for (let i = 0, ii = this.rowDimensions.length; i < ii; i++) {
            if (this.measureOnRow) {
                if (i !== this.rowDimensions.length - 1) {
                    rowDims.push(this.rowDimensions[i]);
                }
            } else {
                rowDims.push(this.rowDimensions[i]);
            }
        }

        for (let i = 0, ii = this.colDimensions.length; i < ii; i++) {
            if (this.measureOnRow) {
                colDims.push(this.colDimensions[i]);
            } else {
                if (i !== this.colDimensions.length - 1) {
                    colDims.push(this.colDimensions[i]);
                }
            }
        }

        for (let i = 0; i < rowDims.length; i++) {
            matrix.push([]);
        }

        for (let i = 0; i < colDims.length; i++) {
            matrix[0].push({
                html: '',
                rowspan: colDims.length,
                colspan: rowDims.length
            });
        }

        function recurseRows (idx) {
            return idx;
        };

        for (let i = 0, ii = rowDims.length; i < ii; i++) {
            console.log(recurseRows(rowDims[i]));
        }
        matrix = [
            [{html: '', rowspan: 1, colspan: 2}, {html: '2013', rowspan: 1, colspan: 1}, {html: '2014', rowspan: 1, colspan: 1}],
            [{html: 'Tea', rowspan: 2, colspan: 1}, {html: 'New York', rowspan: 1, colspan: 1}, {html: '1'}, {html: '2'}],
            [{html: 'Washington', rowspan: 1, colspan: 1}, {html: '3'}, {html: '4'}],
            [{html: 'Coffee', rowspan: 2, colspan: 1}, {html: 'New York', rowspan: 1, colspan: 1}, {html: '5'}, {html: '6'}],
            [{html: 'Washington', rowspan: 1, colspan: 1}, {html: '7'}, {html: '8'}]
        ];
        console.log(JSON.stringify(matrix, null, 2));
        console.log(JSON.stringify(this.globalData, null, 2));
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

    filter (a) {
        return (a.product === 'Tea' && a.state === 'New York' && a.year === '2013');
    };

    createMultiChart (matrix) {
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
        this.mc.createMatrix('crosstab-div', matrix).draw();
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }
}

module.exports = CrosstabExt;
