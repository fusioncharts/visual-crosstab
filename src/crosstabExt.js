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
        this.dataStore.addData({ dataSource: this.data });
        this.rowDimensions = ['product', 'state'];
        this.colDimensions = ['year', 'month'];
        this.measure = 'sale';
        this.measureOnRow = false;
        this.globalData = {
            'product': ['Tea', 'Coffee'],
            'state': ['New York', 'Washington'],
            'year': [2013, 2014],
            'month': ['Jan', 'Feb'],
            'sale': [1550, 2550, 3550, 4550, 5550, 6550, 7550, 8550, 9550, 10550, 11550, 12550, 13550, 14550,
                     15550, 16550]
        };
    }

    mergeDimensions () {
        this.dimensions = [];
        for (let i = 0, l = this.rowDimensions.length; i < l; i++) {
            this.dimensions.push(this.rowDimensions[i]);
        }
        for (let i = 0, l = this.colDimensions.length; i < l; i++) {
            this.dimensions.push(this.colDimensions[i]);
        }
    }

    createFilters () {
        let filters = [];
        let globalKeys = Object.keys(this.globalData);
        for (let i = 0, l = this.dimensions.length; i < l; i++) {
            if (this.measureOnRow && this.dimensions[i] !== this.rowDimensions[this.rowDimensions.length -1]) {
                let matchedValues = this.globalData[this.dimensions[i]];
                for (let j = 0, len = matchedValues.length; j < len; j++) {
                    filters.push({
                        filter: this.filterGen(this.dimensions[i], matchedValues[j].toString()),
                        filterVal: matchedValues[j]
                    });
                }
            } else if (!this.measureOnRow && this.dimensions[i] !== this.colDimensions[this.colDimensions.length -1]) {
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

    createDataCombos() {
        var r = [],
            globalArray = this.makeGlobalArray(),
            max = globalArray.length -1;

        function recurse(arr, i) {
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
        let filters = this.createFilters();
        let dataCombos = this.createDataCombos();
        let hashMap = {};
        for (let i = 0, l = dataCombos.length; i < l; i++) {
            let dataCombo = dataCombos[i],
                key = '',
                value = [];
            for (let j = 0, len = dataCombo.length; j < len; j++) {
                for (let k = 0, length = filters.length; k < length; k++) {
                    let filterVal = filters[k].filterVal;
                    if (dataCombo[j] == filterVal) {
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

    createFilterFunctions () {

    }

    createMatrix() {
        var matrix = [];
        var cols = [];
        var rows = [];
        for (var i = 0; i < this.colDimensions.length; i++) {
            if (this.measureOnRow) {
                cols.push(this.globalData[this.colDimensions[i]]);
            } else {
                if (this.colDimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
                    cols.push(this.globalData[this.colDimensions[i]]);
                }
            }
        }
        for (var i = 0; i < this.rowDimensions.length; i++) {
            if (this.measureOnRow) {
                if (this.colDimensions[i] !== this.colDimensions[this.colDimensions.length - 1]) {
                    rows.push(this.globalData[this.rowDimensions[i]]);
                }
            } else {
                rows.push(this.globalData[this.rowDimensions[i]]);
            }
        }
        var str = '';
        for (var i = 0; i < rows.length; i++) {
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
        let hash = this.getFilterHashMap();

        let coffeeDataProcessor = this.mc.createDataProcessor();
        let stateDataProcessor = this.mc.createDataProcessor();
        let yearDataProcessor = this.mc.createDataProcessor();

        let filter1 = hash['Coffee|New York|2013'][0];
        let filter2 = hash['Coffee|New York|2013'][1];
        let filter3 = hash['Coffee|New York|2013'][2];

        let coffeeData = coffeeDataProcessor.filter(filter1);
        let stateData = stateDataProcessor.filter(filter2);
        let yearData = yearDataProcessor.filter(filter3);

        let filteredData = this.dataStore.getData(coffeeDataProcessor)
            .getData(stateDataProcessor)
            .getData(yearDataProcessor);

        let teaChart = this.mc.createChart({
            type         : 'column2d',
            renderAt     : 'div-1-1',
            width        : 300,
            height       : 150,
            jsonData     : filteredData.getJSON(),
            configuration: {
                data: {
                    dimension : ['month'],
                    measure   : ['sale'],
                    seriesType: 'SS',
                    config    : {
                        chart: {
                            'yAxisName'           : 'Revenues (In INR)',
                            'numberPrefix'        : '₹',
                            'paletteColors'       : '#0075c2',
                            'bgColor'             : '#ffffff',
                            'valueFontColor'      : '#ffffff',
                            'usePlotGradientColor': '0',
                            'showYAxisValues'     : '0',
                            'placevaluesInside'   : '1',
                            'showXAxisLine'       : '1',
                            'divLineIsDashed'     : '1',
                            'showXaxisValues'     : '1',
                            'rotateValues'        : '1'
                        }
                    }
                }
            }
        });
    }

    filterGen(key, val) {
        return (data) => data[key] === val;
    }

    draw (id) {
        var elem = document.getElementById(id);
        var div = document.createElement('div');
        div.setAttribute('id', 'div-1-1');
        elem.appendChild(div);
    }
}

module.exports = CrosstabExt;
