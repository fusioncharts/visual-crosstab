import map from 'ramda/src/map';
import join from 'ramda/src/join';
import reduce from 'ramda/src/reduce';
import values from 'ramda/src/values';
import append from 'ramda/src/append';
import * as Immutable from 'immutable';

class CrosstabExt {
    constructor (data, config) {
        this.data = Immutable.List(data);
        this.eventList = Immutable.Map({
            'modelUpdated': 'modelupdated',
            'modelDeleted': 'modeldeleted',
            'metaInfoUpdate': 'metainfoupdated',
            'processorUpdated': 'processorupdated',
            'processorDeleted': 'processordeleted'
        });
        // Potentially unnecessary member.
        // TODO: Refactor code dependent on variable.
        // TODO: Remove variable.
        this.storeParams = {
            data: data,
            config: config
        };
        // Array of column names (measures) used when building the crosstab array.
        this._columnKeyArr = Immutable.List([]);
        // Saving provided configuration into instance.
        this.measures = Immutable.List(config.measures);
        this.dimensions = Immutable.List(config.dimensions);
        this.chartConfig = Immutable.Map(config.chartConfig);
        this.measureUnits = Immutable.List(config.measureUnits);
        this.dataIsSortable = config.dataIsSortable;
        this.crosstabContainer = config.crosstabContainer;
        this.chartType = config.chartType;
        this.cellWidth = config.cellWidth || 210;
        this.cellHeight = config.cellHeight || 113;
        this.filterDiv = config.filterDiv || false;
        this.aggregation = config.aggregation || 'sum';
        this.draggableHeaders = config.draggableHeaders || false;
        this.noDataMessage = config.noDataMessage || 'No data to display.';
        this.unitFunction = config.unitFunction || function (unit) { return '(' + unit + ')'; };
        if (typeof MultiCharting === 'function') {
            this.mc = new MultiCharting();
            // Creating an empty data store
            this.dataStore = this.mc.createDataStore();
            // Adding data to the data store
            this.dataStore.setData({ dataSource: this.data.toJS() });
            this.dataStore.updateMetaData('Sale', {
                type: 'measure',
                scaleType: 'nominal',
                dataType: 'number',
                discrete: 'true',
                precision: 2,
                aggregationMode: 'sum',
                unit: 'INR'
            });
        } else {
            throw new Error('MultiChartng module not found.');
        }
        if (this.filterDiv) {
            if (typeof FCDataFilterExt === 'function') {
                let filterConfig = {};
                this.dataFilterExt = new FCDataFilterExt(this.dataStore,
                    filterConfig,
                    this.filterDiv);
            } else {
                throw new Error('DataFilter module not found.');
            }
        }
        this.chartsAreSorted = Immutable.Map({
            bool: false,
            order: '',
            measure: ''
        });
        this.createGlobals();
    }

    createGlobals () {
        // Building a data structure for internal use.
        this.globalData = Immutable.Map(this.buildGlobalData());
        // Default categories for charts (i.e. no sorting applied)
        this.categories = this.globalData.get(this.dimensions.last());
        // Building a hash map of applicable filters and the corresponding filter functions
        this.hash = this.getFilterHashMap();
    }

    /**
     * Build an array of arrays data structure from the data store for internal use.
     * @return {Array} An array of arrays generated from the dataStore's array of objects
     */
    buildGlobalData () {
        let ct = this,
            dataStore = ct.dataStore,
            fields = dataStore.getKeys();
        if (fields) {
            return reduce(buildFields, {}, fields);
        } else {
            throw new Error('Could not generate keys from data store');
        }
        function buildFields (obj, field) {
            obj[field] = Immutable.List(ct.dataStore.getUniqueValues(field));
            return obj;
        }
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }

    createFilters () {
        let ct = this,
            filters = {},
            dimensions = ct.dimensions.pop(),
            dimObj;

        dimObj = ct.globalData.filter((v, k) => dimensions.includes(k));
        dimObj.map((v, dim) => {
            v.map((val) => {
                filters[val] = ct.filterGen(dim, val);
            });
        });
        return Immutable.Map(filters);
    }

    makeGlobalArray () {
        let ct = this,
            tempObj = {};

        ct.globalData.map((v, k) => {
            if (ct.dimensions.includes(k) && k !== ct.dimensions.last()) {
                tempObj[k] = ct.globalData.get(k);
            }
        });

        return values(map(n => n, tempObj));
    }

    createDataCombos () {
        let ct = this,
            r = [],
            globalArray = Immutable.List(ct.makeGlobalArray()),
            max = globalArray.size - 1;

        function recurse (arr, i) {
            globalArray.get(i).map((v, j) => {
                var a = append(globalArray.get(i).get(j), arr);
                i === max ? r.push(a) : recurse(a, i + 1);
            });
        }
        recurse([], 0);
        return Immutable.List(r);
    }

    getFilterHashMap () {
        let ct = this,
            hashMap = {},
            filters = ct.createFilters(),
            dataCombos = ct.createDataCombos();

        dataCombos.forEach((data) => {
            let hash = join('|', data);
            hashMap[hash] = reduce(buildFilterArr, [], data);
            function buildFilterArr (a, b) {
                return append(filters.get(b), a);
            }
        });

        return hashMap;
    }

    logData (data) {
        console.log(data);
    }
}

module.exports = CrosstabExt;
