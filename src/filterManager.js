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

class FilterManager {
    constructor (dimensions, globalData) {
        this.dimensions = dimensions;
        this.globalData = globalData;
    }

    filterGen (key, val) {
        return (data) => data[key] === val;
    }

    createFilters () {
        let fm = this,
            filters = {},
            dimensions = init(fm.dimensions),
            dimObj,
            dimensionsIncludesKey = (v, k) => contains(k, dimensions);

        dimObj = pickBy(dimensionsIncludesKey, fm.globalData);
        forEachObjIndexed((v, dim) => {
            forEach((val) => {
                filters[val] = fm.filterGen(dim, val);
            }, v);
        }, dimObj);
        return filters;
    }

    makeGlobalArray () {
        let fm = this,
            tempObj = {};

        forEachObjIndexed((v, k) => {
            if (contains(k, fm.dimensions) && k !== last(fm.dimensions)) {
                tempObj[k] = prop(k, fm.globalData);
            }
        }, fm.globalData);

        return values(map(n => n, tempObj));
    }

    createDataCombos () {
        let fm = this,
            r = [],
            globalArray = fm.makeGlobalArray(),
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
        let fm = this,
            hashMap = {},
            filters = fm.createFilters(),
            dataCombos = fm.createDataCombos();

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

export default FilterManager;
