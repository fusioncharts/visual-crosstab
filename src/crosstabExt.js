class CrosstabExt {
    constructor (data, config) {
        let self = this;
        this.data = data;
        this.mc = new MultiCharting();
        this.dataStore = this.mc.createDataStore();
        this.dataStore.setData({ dataSource: this.data });
        this.t1 = performance.now();
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
        this.count = 0;
        this.aggregation = config.aggregation;
        this.axes = [];
        this.noDataMessage = config.noDataMessage;
        if (typeof FCDataFilterExt === 'function') {
            let filterConfig = {};
            this.dataFilterExt = new FCDataFilterExt(this.dataStore, filterConfig, 'control-box', function (data) {
                self.dataStore = data;
                self.globalData = self.buildGlobalData();
                self.renderCrosstab();
            });
        }
    }

    buildGlobalData () {
        if (this.dataStore.getKeys()) {
            let fields = this.dataStore.getKeys(),
                globalData = {};
            for (let i = 0, ii = fields.length; i < ii; i++) {
                globalData[fields[i]] = this.dataStore.getUniqueValues(fields[i]);
            }
            return globalData;
        } else {
            return false;
        }
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
            htmlRef,
            min = Infinity,
            max = -Infinity,
            minmaxObj = {};

        for (i = 0; i < l; i += 1) {
            let classStr = '';
            htmlRef = document.createElement('p');
            htmlRef.innerHTML = fieldValues[i];
            htmlRef.style.textAlign = 'center';
            htmlRef.style.marginTop = ((this.cellHeight - 10) / 2) + 'px';
            classStr += 'row-dimensions' +
                ' ' + this.rowDimensions[currentIndex] +
                ' ' + fieldValues[i].toLowerCase();
            // if (currentIndex > 0) {
            //     htmlRef.classList.add(this.rowDimensions[currentIndex - 1].toLowerCase());
            // }
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
                html: htmlRef.outerHTML,
                className: classStr
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
                        rowHash: filteredDataHashKey,
                        colHash: this.columnKeyArr[j]
                    };
                    table[table.length - 1].push(chartCellObj);
                    minmaxObj = this.getChartObj(filteredDataHashKey, this.columnKeyArr[j])[0];
                    max = (parseInt(minmaxObj.max) > max) ? minmaxObj.max : max;
                    min = (parseInt(minmaxObj.min) < min) ? minmaxObj.min : min;
                }
                let adapterCfg = {
                        config: {
                            config: {
                                chart: {
                                    'dataMin': min,
                                    'dataMax': max,
                                    'isAxisOpposite': true,
                                    'borderthickness': 0
                                }
                            }
                        }
                    },
                    adapter = this.mc.dataadapter(adapterCfg);
                // table[table.length - 1].push({
                //     chart: {
                //         'type': 'axis',
                //         'axisType': 'y',
                //         'width': '100%',
                //         'height': '100%',
                //         'dataFormat': 'json',
                //         'configuration': {
                //             'data': {
                //                 'config': {
                //                     'chart': {
                //                         'dataMin': min,
                //                         'dataMax': max,
                //                         'isAxisOpposite': true,
                //                         'borderthickness': 0
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // });
                table[table.length - 1].push({
                    rowspan: 1,
                    colspan: 1,
                    chart: {
                        'type': 'axis',
                        'axisType': 'y',
                        'width': '100%',
                        'height': '100%',
                        'dataFormat': 'json',
                        'configuration': adapter
                    }
                });
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
            let classStr = '';
            htmlRef = document.createElement('p');
            htmlRef.innerHTML = fieldValues[i];
            htmlRef.style.textAlign = 'center';
            document.body.appendChild(htmlRef);
            classStr += 'column-dimensions' +
                ' ' + this.colDimensions[currentIndex] +
                ' ' + fieldValues[i].toLowerCase();
            this.cornerHeight = htmlRef.offsetHeight;
            document.body.removeChild(htmlRef);
            colElement = {
                width: this.cellWidth,
                height: this.cornerHeight,
                rowspan: 1,
                colspan: 1,
                html: htmlRef.outerHTML,
                className: classStr
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

    createRowDimHeading (table, colOrderLength) {
        var cornerCellArr = [],
            i = 0,
            htmlRef;

        for (i = 0; i < this.rowDimensions.length; i++) {
            htmlRef = document.createElement('p');
            htmlRef.innerHTML = this.rowDimensions[i][0].toUpperCase() + this.rowDimensions[i].substr(1);
            htmlRef.style.textAlign = 'center';
            htmlRef.style.marginTop = ((30 * this.colDimensions.length - 15) / 2) + 'px';
            cornerCellArr.push({
                width: this.rowDimensions[i] * 10,
                height: 30 * this.colDimensions.length,
                rowspan: colOrderLength,
                colspan: 1,
                html: htmlRef.outerHTML,
                className: 'corner-cell'
            });
        }
        return cornerCellArr;
    }

    createColDimHeading (table, index) {
        var i = index,
            htmlRef;
        for (; i < table.length; i++) {
            htmlRef = document.createElement('p');
            htmlRef.innerHTML = this.colDimensions[i][0].toUpperCase() + this.colDimensions[i].substr(1);
            htmlRef.style.textAlign = 'center';
            table[i].push({
                width: this.colDimensions[i].length * 10,
                height: 30,
                rowspan: 1,
                colspan: 1,
                html: htmlRef.outerHTML,
                className: 'corner-cell'
            });
        }
        return table;
    }

    createCaption (table, maxLength) {
        let adapterCfg = {
                config: {
                    config: {
                        chart: {
                            'caption': 'Sale of Cereal',
                            'subcaption': 'Across States, Across Years',
                            'borderthickness': '0'
                        }
                    }
                }
            },
            adapter = this.mc.dataadapter(adapterCfg);
        // table.unshift([{
        //     height: 50,
        //     rowspan: 1,
        //     colspan: maxLength,
        //     chart: {
        //         'type': 'caption',
        //         'width': '100%',
        //         'height': '100%',
        //         'dataFormat': 'json',
        //         'configuration': {
        //             'data': {
        //                 'config': {
        //                     'chart': {
        //                         'caption': 'Sale of Cereal',
        //                         'subcaption': 'Across States, Across Years',
        //                         'borderthickness': '0'
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }]);
        table.unshift([{
            height: 50,
            rowspan: 1,
            colspan: maxLength,
            chart: {
                'type': 'caption',
                'width': '100%',
                'height': '100%',
                'dataFormat': 'json',
                'configuration': adapter
            }
        }]);
        return table;
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
            table = [],
            xAxisRow = [],
            i = 0,
            maxLength = 0;
        if (obj) {
            table.push(this.createRowDimHeading(table, colOrder.length));
            this.createCol(table, obj, colOrder, 0, '');
            table = this.createColDimHeading(table, 0);
            table.push([]);
            this.createRow(table, obj, rowOrder, 0, '');
            for (i = 0; i < table.length; i++) {
                maxLength = (maxLength < table[i].length) ? table[i].length : maxLength;
            }
            for (i = 0; i < this.rowDimensions.length; i++) {
                xAxisRow.push({
                    rowspan: 1,
                    colspan: 1,
                    height: 30,
                    className: 'blank-cell'
                });
            }

            for (i = 0; i < maxLength - 1 - this.rowDimensions.length; i++) {
                let categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]],
                    adapterCfg = {
                        config: {
                            config: {
                                chart: {
                                    'borderthickness': 0,
                                    'canvasPadding': 15
                                },
                                categories: categories
                            }
                        }
                    },
                    adapter = this.mc.dataadapter(adapterCfg);
                // xAxisRow.push({
                //     width: '100%',
                //     height: 20,
                //     rowspan: 1,
                //     colspan: 1,
                //     chart: {
                //         'type': 'axis',
                //         'width': '100%',
                //         'height': '100%',
                //         'dataFormat': 'json',
                //         'axisType': 'x',
                //         'configuration': {
                //             'data': {
                //                 'config': {
                //                     'chart': {
                //                         'borderthickness': 0,
                //                         'canvasPadding': 15
                //                     },
                //                     'categories': categories
                //                 }
                //             }
                //         }
                //     }
                // });
                xAxisRow.push({
                    width: '100%',
                    height: 20,
                    rowspan: 1,
                    colspan: 1,
                    chart: {
                        'type': 'axis',
                        'width': '100%',
                        'height': '100%',
                        'dataFormat': 'json',
                        'axisType': 'x',
                        'configuration': adapter
                    }
                });
            }

            table.push(xAxisRow);
            table = this.createCaption(table, maxLength);
            this.columnKeyArr = [];
        } else {
            table.push([{
                html: '<p style="text-align: center">' + this.noDataMessage + '</p>',
                height: 50,
                colspan: this.rowDimensions.length * this.colDimensions.length
            }]);
        }
        return table;
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

    renderCrosstab () {
        let crosstab = this.createCrosstab(),
            matrix = this.createMultiChart(crosstab),
            t2 = performance.now();
        for (let i = 0, ii = matrix.length; i < ii; i++) {
            let row = matrix[i];
            for (let j = 0, jj = row.length; j < jj; j++) {
                let cell = row[j],
                    crosstabElement = crosstab[i][j],
                    rowAxis = row[row.length - 1];
                if (!(crosstabElement.hasOwnProperty('chart') || crosstabElement.hasOwnProperty('html')) &&
                    crosstabElement.className !== 'blank-cell') {
                    let limits = rowAxis.chart.chartObj.getLimits(),
                        minLimit = limits[0],
                        maxLimit = limits[1],
                        chart = this.getChartObj(crosstabElement.rowHash, crosstabElement.colHash)[1];
                    chart.configuration.FCjson.chart.yAxisMinValue = minLimit;
                    chart.configuration.FCjson.chart.yAxisMaxValue = maxLimit;
                    cell.config.chart = chart;
                    crosstabElement.chart = chart;
                    window.ctPerf += (performance.now() - t2);
                    cell.update(cell.config);
                }
                t2 = performance.now();
            }
        }

        this.mc.addEventListener('hoverin', (evt, data) => {
            if (data.data) {
                console.log('Event:', evt);
                console.log('Data:', data);
                for (let i = 0, ii = matrix.length; i < ii; i++) {
                    let row = crosstab[i];
                    for (var j = 0; j < row.length; j++) {
                        if (row[j].chart) {
                            if (!(row[j].chart.type === 'caption' || row[j].chart.type === 'axis')) {
                                let cellAdapter = row[j].chart.configuration,
                                    category = this.dimensions[this.dimensions.length - 1],
                                    categoryVal = data.data[category];
                                console.log(cellAdapter, category, categoryVal);
                                // cellAdapter.highlight();
                            }
                        }
                    }
                }
            }
        });
    }

    createMultiChart (matrix) {
        if (this.multichartObject === undefined) {
            this.multichartObject = this.mc.createMatrix(this.crosstabContainer, matrix);
            window.ctPerf = performance.now() - this.t1;
            this.multichartObject.draw();
        } else {
            this.multichartObject.update(matrix);
        }
        return this.multichartObject.placeHolder;
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
            filteredJSON = [],
            max = -Infinity,
            min = Infinity,
            filteredData = {},
            adapterCfg = {},
            adapter = {},
            categories = this.globalData[this.colDimensions[this.colDimensions.length - 1]];

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
            filteredJSON = filteredData.getJSON();
            for (let i = 0, ii = filteredJSON.length; i < ii; i++) {
                if (filteredJSON[i][this.measure] > max) {
                    max = filteredJSON[i][this.measure];
                }
                if (filteredJSON[i][this.measure] < min) {
                    min = filteredJSON[i][this.measure];
                }
            }
            adapterCfg = {
                config: {
                    dimension: this.measureOnRow
                        ? [this.rowDimensions[this.rowDimensions.length - 1]]
                        : [this.colDimensions[this.colDimensions.length - 1]],
                    measure: [this.measure],
                    seriesType: 'SS',
                    aggregateMode: this.aggregation,
                    categories: categories,
                    config: this.chartConfig
                },
                datastore: filteredData
            };
            adapter = this.mc.dataadapter(adapterCfg);
            // return [{
            //     'max': max,
            //     'min': min
            // }, {
            //     type: this.chartType,
            //     width: '100%',
            //     height: '100%',
            //     jsonData: filteredJSON,
            //     configuration: {
            //         data: {
            //             dimension: this.measureOnRow
            //                 ? [this.rowDimensions[this.rowDimensions.length - 1]]
            //                 : [this.colDimensions[this.colDimensions.length - 1]],
            //             measure: [this.measure],
            //             seriesType: 'SS',
            //             aggregateMode: this.aggregation,
            //             categories: categories,
            //             config: this.chartConfig
            //         }
            //     }
            // }];
            return [{
                'max': max,
                'min': min
            }, {
                type: this.chartType,
                width: '100%',
                height: '100%',
                jsonData: filteredJSON,
                configuration: adapter
            }];
        }
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }
}

module.exports = CrosstabExt;
