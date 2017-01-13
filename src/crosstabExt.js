import map from 'ramda/src/map';
import nth from 'ramda/src/nth';
import init from 'ramda/src/init';
import join from 'ramda/src/join';
import last from 'ramda/src/last';
import prop from 'ramda/src/prop';
import append from 'ramda/src/append';
import length from 'ramda/src/length';
import pickBy from 'ramda/src/pickBy';
import reduce from 'ramda/src/reduce';
import values from 'ramda/src/values';
import forEach from 'ramda/src/forEach';
import addIndex from 'ramda/src/addIndex';
import contains from 'ramda/src/contains';
import forEachObjIndexed from 'ramda/src/forEachObjIndexed';

class CrosstabExt {
    constructor (data, config) {
        this.data = data;
        this.eventList = {
            'modelUpdated': 'modelupdated',
            'modelDeleted': 'modeldeleted',
            'metaInfoUpdate': 'metainfoupdated',
            'processorUpdated': 'processorupdated',
            'processorDeleted': 'processordeleted'
        };
        // Potentially unnecessary member.
        // TODO: Refactor code dependent on variable.
        // TODO: Remove variable.
        this.storeParams = {
            data: data,
            config: config
        };
        // Array of column names (measures) used when building the crosstab array.
        this._columnKeyArr = [];
        // Saving provided configuration into instance.
        this.measures = config.measures;
        this.dimensions = config.dimensions;
        this.chartConfig = config.chartConfig;
        this.measureUnits = config.measureUnits;
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
            this.dataStore.setData({ dataSource: this.data });
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
        this.chartsAreSorted = {
            bool: false,
            order: '',
            measure: ''
        };
        this.createGlobals();
    }

    createGlobals () {
        let ct = this;
        // Building a data structure for internal use.
        ct.globalData = ct.buildGlobalData();
        // Default categories for charts (i.e. no sorting applied)
        ct.categories = prop(last(ct.dimensions), ct.globalData);
        // Building a hash map of applicable filters and the corresponding filter functions
        ct.hash = ct.getFilterHashMap();
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
            obj[field] = ct.dataStore.getUniqueValues(field);
            return obj;
        }
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }

    createFilters () {
        let ct = this,
            filters = {},
            dimensions = init(ct.dimensions),
            dimObj,
            dimensionsIncludesKey = (v, k) => contains(k, dimensions);

        dimObj = pickBy(dimensionsIncludesKey, ct.globalData);
        forEachObjIndexed((v, dim) => {
            forEach((val) => {
                filters[val] = ct.filterGen(dim, val);
            }, v);
        }, dimObj);
        return filters;
    }

    makeGlobalArray () {
        let ct = this,
            tempObj = {};

        forEachObjIndexed((v, k) => {
            if (contains(k, ct.dimensions) && k !== last(ct.dimensions)) {
                tempObj[k] = prop(k, ct.globalData);
            }
        }, ct.globalData);

        return values(map(n => n, tempObj));
    }

    createDataCombos () {
        let ct = this,
            r = [],
            globalArray = ct.makeGlobalArray(),
            max = length(globalArray) - 1,
            forEachIndexed = addIndex(forEach);

        function recurse (arr, i) {
            forEachIndexed((v, j) => {
                var a = append(nth(j, nth(i, globalArray)), arr);
                i === max ? r.push(a) : recurse(a, i + 1);
            }, nth(i, globalArray));
        }
        recurse([], 0);
        return r;
    }

    getFilterHashMap () {
        let ct = this,
            hashMap = {},
            filters = ct.createFilters(),
            dataCombos = ct.createDataCombos();

        forEach((data) => {
            let hash = join('|', data);
            hashMap[hash] = reduce(buildFilterArr, [], data);
            function buildFilterArr (a, b) {
                return append(prop(b, filters), a);
            }
        }, dataCombos);

        return hashMap;
    }
}

module.exports = CrosstabExt;
