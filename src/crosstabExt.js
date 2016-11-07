class CrosstabExt {
    constructor () {
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
            let matchedValues = this.globalData[this.dimensions[i]];
            for (let j = 0, len = matchedValues.length; j < len; j++) {
                filters.push(this.dimensions[i] + " === " + matchedValues[j]);
            }
        }
        return filters;
    }

    caller(arg) {
        var r = [],
            max = arg.length -1;

        function recurse(arr, i) {
            for (var j = 0, l = arg[i].length; j < l; j++) {
                var a = arr.slice(0);
                a.push(arg[i][j]);
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
            if (this.globalData.hasOwnProperty(key) && key !== 'sale') {
                if (this.measureOnRow) {
                    tempObj[key] = this.globalData[key];
                } else {
                    tempObj[key] = this.globalData[key];
                }
            }
        }
        tempArr = Object.keys(tempObj).map(key => tempObj[key])
        return tempArr;
    }
}

module.exports = CrosstabExt;
