import last from 'ramda/src/last';
import prop from 'ramda/src/prop';
import reduce from 'ramda/src/reduce';

import FilterManager from './filterManager';

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
        let ct = this,
            filterManager = {};
        // Building a data structure for internal use.
        ct.globalData = ct.buildGlobalData();
        // Default categories for charts (i.e. no sorting applied)
        ct.categories = prop(last(ct.dimensions), ct.globalData);
        filterManager = new FilterManager(ct.dimensions, ct.globalData);
        // Building a hash map of applicable filters and the corresponding filter functions
        ct.hash = filterManager.getFilterHashMap();
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
}

module.exports = CrosstabExt;
