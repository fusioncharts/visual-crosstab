/**
 * MultiCharting Extension for FusionCharts
 * This module contains the basic routines required by subsequent modules to
 * extend/scale or add functionality to the MultiCharting object.
 *
 */

 /* global window: true */

(function (env, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = env.document ?
            factory(env) : function(win) {
                if (!win.document) {
                    throw new Error('Window with document not present');
                }
                return factory(win, true);
            };
    } else {
        env.MultiCharting = factory(env, true);
    }
})(typeof window !== 'undefined' ? window : this, function (_window, windowExists) {
    // In case MultiCharting already exists.
    if (_window.MultiCharting) {
        return;
    }

    var MultiCharting = function () {
    };

    MultiCharting.prototype.win = _window;

    if (windowExists) {
        _window.MultiCharting = MultiCharting;
    }
    return MultiCharting;
});


(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var merge = function (obj1, obj2, skipUndef, tgtArr, srcArr) {
            var item,
                srcVal,
                tgtVal,
                str,
                cRef,
                objectToStrFn = Object.prototype.toString,
                arrayToStr = '[object Array]',
                objectToStr = '[object Object]',
                checkCyclicRef = function(obj, parentArr) {
                    var i = parentArr.length,
                        bIndex = -1;

                    while (i--) {
                        if (obj === parentArr[i]) {
                            bIndex = i;
                            return bIndex;
                        }
                    }

                    return bIndex;
                },
                OBJECTSTRING = 'object';

            //check whether obj2 is an array
            //if array then iterate through it's index
            //**** MOOTOOLS precution

            if (!srcArr) {
                tgtArr = [obj1];
                srcArr = [obj2];
            }
            else {
                tgtArr.push(obj1);
                srcArr.push(obj2);
            }

            if (obj2 instanceof Array) {
                for (item = 0; item < obj2.length; item += 1) {
                    try {
                        srcVal = obj1[item];
                        tgtVal = obj2[item];
                    }
                    catch (e) {
                        continue;
                    }

                    if (typeof tgtVal !== OBJECTSTRING) {
                        if (!(skipUndef && tgtVal === undefined)) {
                            obj1[item] = tgtVal;
                        }
                    }
                    else {
                        if (srcVal === null || typeof srcVal !== OBJECTSTRING) {
                            srcVal = obj1[item] = tgtVal instanceof Array ? [] : {};
                        }
                        cRef = checkCyclicRef(tgtVal, srcArr);
                        if (cRef !== -1) {
                            srcVal = obj1[item] = tgtArr[cRef];
                        }
                        else {
                            merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                        }
                    }
                }
            }
            else {
                for (item in obj2) {
                    try {
                        srcVal = obj1[item];
                        tgtVal = obj2[item];
                    }
                    catch (e) {
                        continue;
                    }

                    if (tgtVal !== null && typeof tgtVal === OBJECTSTRING) {
                        // Fix for issue BUG: FWXT-602
                        // IE < 9 Object.prototype.toString.call(null) gives
                        // '[object Object]' instead of '[object Null]'
                        // that's why null value becomes Object in IE < 9
                        str = objectToStrFn.call(tgtVal);
                        if (str === objectToStr) {
                            if (srcVal === null || typeof srcVal !== OBJECTSTRING) {
                                srcVal = obj1[item] = {};
                            }
                            cRef = checkCyclicRef(tgtVal, srcArr);
                            if (cRef !== -1) {
                                srcVal = obj1[item] = tgtArr[cRef];
                            }
                            else {
                                merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                            }
                        }
                        else if (str === arrayToStr) {
                            if (srcVal === null || !(srcVal instanceof Array)) {
                                srcVal = obj1[item] = [];
                            }
                            cRef = checkCyclicRef(tgtVal, srcArr);
                            if (cRef !== -1) {
                                srcVal = obj1[item] = tgtArr[cRef];
                            }
                            else {
                                merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                            }
                        }
                        else {
                            obj1[item] = tgtVal;
                        }
                    }
                    else {
                        obj1[item] = tgtVal;
                    }
                }
            }
            return obj1;
        },
        extend2 = function (obj1, obj2, skipUndef) {
            var OBJECTSTRING = 'object';
            //if none of the arguments are object then return back
            if (typeof obj1 !== OBJECTSTRING && typeof obj2 !== OBJECTSTRING) {
                return null;
            }

            if (typeof obj2 !== OBJECTSTRING || obj2 === null) {
                return obj1;
            }

            if (typeof obj1 !== OBJECTSTRING) {
                obj1 = obj2 instanceof Array ? [] : {};
            }
            merge(obj1, obj2, skipUndef);
            return obj1;
        },
        lib = {
            extend2: extend2,
            merge: merge
        };

    MultiCharting.prototype.lib = (MultiCharting.prototype.lib || lib);

});
(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var Ajax = function () {
            var ajax = this,
                argument = arguments[0];

            ajax.onSuccess = argument.success;
            ajax.onError = argument.error;
            ajax.open = false;
            return ajax.get(argument.url);
        },

        ajaxProto = Ajax.prototype,

        FUNCTION = 'function',
        MSXMLHTTP = 'Microsoft.XMLHTTP',
        MSXMLHTTP2 = 'Msxml2.XMLHTTP',
        GET = 'GET',
        XHREQERROR = 'XmlHttprequest Error',
        win = MultiCharting.prototype.win, // keep a local reference of window scope

        // Probe IE version
        version = parseFloat(win.navigator.appVersion.split('MSIE')[1]),
        ielt8 = (version >= 5.5 && version <= 7) ? true : false,
        firefox = /mozilla/i.test(win.navigator.userAgent),
        //
        // Calculate flags.
        // Check whether the page is on file protocol.
        fileProtocol = win.location.protocol === 'file:',
        AXObject = win.ActiveXObject,

        // Check if native xhr is present
        XHRNative = (!AXObject || !fileProtocol) && win.XMLHttpRequest,

        // Prepare function to retrieve compatible xmlhttprequest.
        newXmlHttpRequest = function () {
            var xmlhttp;

            // if xmlhttprequest is present as native, use it.
            if (XHRNative) {
                newXmlHttpRequest = function () {
                    return new XHRNative();
                };
                return newXmlHttpRequest();
            }

            // Use activeX for IE
            try {
                xmlhttp = new AXObject(MSXMLHTTP2);
                newXmlHttpRequest = function () {
                    return new AXObject(MSXMLHTTP2);
                };
            }
            catch (e) {
                try {
                    xmlhttp = new AXObject(MSXMLHTTP);
                    newXmlHttpRequest = function () {
                        return new AXObject(MSXMLHTTP);
                    };
                }
                catch (e) {
                    xmlhttp = false;
                }
            }
            return xmlhttp;
        },

        headers = {
            /**
             * Prevents cacheing of AJAX requests.
             * @type {string}
             */
            'If-Modified-Since': 'Sat, 29 Oct 1994 19:43:31 GMT',
            /**
             * Lets the server know that this is an AJAX request.
             * @type {string}
             */
            'X-Requested-With': 'XMLHttpRequest',
            /**
             * Lets server know which web application is sending requests.
             * @type {string}
             */
            'X-Requested-By': 'FusionCharts',
            /**
             * Mentions content-types that are acceptable for the response. Some servers require this for Ajax
             * communication.
             * @type {string}
             */
            'Accept': 'text/plain, */*',
            /**
             * The MIME type of the body of the request along with its charset.
             * @type {string}
             */
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

    MultiCharting.prototype.ajax = function () {
        return new Ajax(arguments[0]);
    };

    ajaxProto.get = function (url) {
        var wrapper = this,
            xmlhttp = wrapper.xmlhttp,
            errorCallback = wrapper.onError,
            successCallback = wrapper.onSuccess,
            xRequestedBy = 'X-Requested-By',
            hasOwn = Object.prototype.hasOwnProperty,
            i;

        // X-Requested-By is removed from header during cross domain ajax call
        if (url.search(/^(http:\/\/|https:\/\/)/) !== -1 &&
                win.location.hostname !== /(http:\/\/|https:\/\/)([^\/\:]*)/.exec(url)[2]) {
            // If the url does not contain http or https, then its a same domain call. No need to use regex to get
            // domain. If it contains then checks domain.
            delete headers[xRequestedBy];
        }
        else {
            !hasOwn.call(headers, xRequestedBy) && (headers[xRequestedBy] = 'FusionCharts');
        }

        if (!xmlhttp || ielt8 || firefox) {
            xmlhttp = newXmlHttpRequest();
            wrapper.xmlhttp = xmlhttp;
        }

        xmlhttp.onreadystatechange = function () {
            
            if (xmlhttp.readyState === 4) {
                if ((!xmlhttp.status && fileProtocol) || (xmlhttp.status >= 200 &&
                        xmlhttp.status < 300) || xmlhttp.status === 304 ||
                        xmlhttp.status === 1223 || xmlhttp.status === 0) {
                    successCallback &&
                        successCallback(xmlhttp.responseText, wrapper, url);
                }
                else if (errorCallback) {
                    errorCallback(new Error(XHREQERROR), wrapper, url);
                }
                wrapper.open = false;
            }
        };

        try {
            xmlhttp.open(GET, url, true);

            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType('text/plain');
            }

            for (i in headers) {
                xmlhttp.setRequestHeader(i, headers[i]);
            }

            xmlhttp.send();
            wrapper.open = true;
        }
        catch (error) {
            if (errorCallback) {
                errorCallback(error, wrapper, url);
            }
        }

        return xmlhttp;
    };

    ajaxProto.abort = function () {
        var instance = this,
            xmlhttp = instance.xmlhttp;

        instance.open = false;
        return xmlhttp && typeof xmlhttp.abort === FUNCTION && xmlhttp.readyState &&
                xmlhttp.readyState !== 0 && xmlhttp.abort();
    };

    ajaxProto.dispose = function () {
        var instance = this;
        instance.open && instance.abort();

        delete instance.onError;
        delete instance.onSuccess;
        delete instance.xmlhttp;
        delete instance.open;

        return (instance = null);
    };
});

(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    /* jshint ignore:start */
    // Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.


    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray (strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
                ){
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        // Return the parsed data.
        return( arrData );
    }
    /* jshint ignore:end */

    MultiCharting.prototype.convertToArray = function (data, delimiter, structure, callback) {
        if (typeof data === 'object') {
            delimiter = data.delimiter;
            structure = data.structure;
            callback = data.callback;
            data = data.string;
        }

        if (typeof data !== 'string') {
            throw new Error('CSV string not provided');
        }
        var splitedData = data.split(/\r\n|\r|\n/),
            //total number of rows
            len = splitedData.length,
            //first row is header and spliting it into arrays
            header = CSVToArray(splitedData[0], delimiter), // jshint ignore:line
            i = 1,
            j = 0,
            k = 0,
            klen = 0,
            cell = [],
            min = Math.min,
            finalOb,
            updateManager = function () {
                var lim = 0,
                    jlen = 0,
                    obj = {};
                    lim = i + 3000;
                
                if (lim > len) {
                    lim = len;
                }
                
                for (; i < lim; ++i) {

                    //create cell array that cointain csv data
                    cell = CSVToArray(splitedData[i], delimiter); // jshint ignore:line
                    cell = cell && cell[0];
                    //take min of header length and total columns
                    jlen = min(header.length, cell.length);

                    if(structure === 1){
                        finalOb.push(cell);
                    }
                    else if (structure === 2){
                        for (j = 0; j < jlen; ++j) {                    
                            //creating the final object
                            obj[header[j]] = cell[j];
                        }
                        finalOb.push(obj);
                        obj = {};
                    }
                    else{
                        for (j = 0; j < jlen; ++j) {                    
                            //creating the final object
                            finalOb[header[j]].push(cell[j]);
                        }   
                    }
                }

                if (i < len - 1) {
                    //call update manager
                    // setTimeout(updateManager, 0);
                    updateManager();
                } else {
                    callback && callback(finalOb);
                }
            };

        structure = structure || 1;
        header = header && header[0];

        //if the value is empty
        if (splitedData[splitedData.length - 1] === '') {
            splitedData.splice((splitedData.length - 1), 1);
            len--;
        }
        if (structure === 1){
            finalOb = [];
            finalOb.push(header);
        } else if(structure === 2) {
            finalOb = [];
        }else if(structure === 3){
            finalOb = {};
            for (k = 0, klen = header.length; k < klen; ++k) {
                finalOb[header[k]] = [];
            }   
        }

        updateManager();

    };

});


(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var lib = MultiCharting.prototype.lib,
        dataStorage = lib.dataStorage = {},
        // For storing the child of a parent
        linkStore = {},
        //For storing the parent of a child
        parentStore = lib.parentStore = {},
        idCount = 0,
        win = MultiCharting.prototype.win,
        // Constructor class for DataStore.
        DataStore = function () {
            var manager = this;
            manager.uniqueValues = {};
            manager.setData(arguments);
        },
        dataStoreProto = DataStore.prototype,

        // Function to execute the dataProcessor over the data
        executeProcessor = function (type, filterFn, JSONData) {
            switch (type) {
                case  'sort' : return Array.prototype.sort.call(JSONData, filterFn);
                case  'filter' : return Array.prototype.filter.call(JSONData, filterFn);
                case 'map' : return Array.prototype.map.call(JSONData, filterFn);
                default : return filterFn(JSONData);
            }
        },

        //Function to update all the linked child data
        updataData = function (id) {
            var i,
                linkData = linkStore[id],
                parentData = dataStorage[id],
                filterStore = lib.filterStore,
                len,
                linkIds,
                filters,
                linkId,
                filter,
                filterFn,
                type,
                // Store all the dataObjs that are updated.
                tempDataUpdated = lib.tempDataUpdated = {};

            linkIds = linkData.link;
            filters = linkData.filter;
            len = linkIds.length;

            for (i = 0; i < len; i++) {
                linkId = linkIds[i];

                tempDataUpdated[linkId] = true;
                filter = filters[i];
                filterFn = filter.getFilter();
                type = filter.type;

                if (typeof filterFn === 'function') {
                    if (filterStore[filter.id]) {
                        dataStorage[linkId] = executeProcessor(type, filterFn, parentData);
                    }
                    else {
                        dataStorage[linkId] = parentData;
                        filter.splice(i, 1);
                        i -= 1;
                    }
                }
                
                if (linkStore[linkId]) {
                    updataData(linkId);
                }
            }
        };

    MultiCharting.prototype.createDataStore = function () {
        return new DataStore(arguments);
    };

    // Function to add data in the data store
    dataStoreProto.setData = function (dataSpecs, callback) {
        var dataStore = this,
            oldId = dataStore.id,
            id = dataSpecs.id,
            dataType = dataSpecs.dataType,
            dataSource = dataSpecs.dataSource,
            oldJSONData = dataStorage[oldId] || [],
            callbackHelperFn = function (JSONData) {
                dataStorage[id] = oldJSONData.concat(JSONData || []);
                if (linkStore[id]) {
                    updataData(id);
                }
                if (typeof callback === 'function') {
                    callback(JSONData);
                }
            };

        id = oldId || id || 'dataStorage' + idCount ++;
        dataStore.id = id;
        delete dataStore.keys;
        dataStore.uniqueValues = {};

        if (dataType === 'csv') {
            MultiCharting.prototype.convertToArray({
                string : dataSpecs.dataSource,
                delimiter : dataSpecs.delimiter,
                structure : dataSpecs.structure,
                callback : function (data) {
                    callbackHelperFn(data);
                }
            });
        }
        else {
            callbackHelperFn(dataSource);
        }

        // win.dispatchEvent(new win.CustomEvent('dataAdded', {'detail' : {
        //  'id': id,
        //  'data' : JSONData
        // }}));
    };

    // Function to get the jsondata of the data object
    dataStoreProto.getJSON = function () {
        return dataStorage[this.id];
    };

    // Function to get child data object after applying filter on the parent data.
    // @params {filters} - This can be a filter function or an array of filter functions.
    dataStoreProto.getData = function (filters) {
        var data = this,
            id = data.id,
            filterLink = lib.filterLink;
        // If no parameter is present then return the unfiltered data.
        if (!filters) {
            return dataStorage[id];
        }
        // If parameter is an array of filter then return the filtered data after applying the filter over the data.
        else {
            let result = [],
                i,
                newData,
                linkData,
                newId,
                filter,
                filterFn,
                datalinks,
                filterID,
                type,
                newDataObj,
                isFilterArray = filters instanceof Array,
                len = isFilterArray ? filters.length : 1;

            for (i = 0; i < len; i++) {
                filter = filters[i] || filters;
                filterFn = filter.getFilter();
                type = filter.type;

                if (typeof filterFn === 'function') {
                    newData = executeProcessor(type, filterFn, dataStorage[id]);

                    newDataObj = new DataStore(newData);
                    newId = newDataObj.id;
                    parentStore[newId] = data;

                    dataStorage[newId] = newData;
                    result.push(newDataObj);

                    //Pushing the id and filter of child class under the parent classes id.
                    linkData = linkStore[id] || (linkStore[id] = {
                        link : [],
                        filter : []
                    });
                    linkData.link.push(newId);
                    linkData.filter.push(filter);

                    // Storing the data on which the filter is applied under the filter id.
                    filterID = filter.getID();
                    datalinks = filterLink[filterID] || (filterLink[filterID] = []);
                    datalinks.push(newDataObj);

                    // setting the current id as the newID so that the next filter is applied on the child data;
                    id = newId;
                    data = newDataObj;
                }
            }
            return (isFilterArray ? result : result[0]);
        }
    };

    // Function to delete the current data from the dataStorage and also all its childs recursively
    dataStoreProto.deleteData = function (optionalId) {
        var dataStore = this,
            id = optionalId || dataStore.id,
            linkData = linkStore[id],
            flag;

        if (linkData) {
            let i,
                link = linkData.link,
                len = link.length;
            for (i = 0; i < len; i ++) {
                dataStore.deleteData(link[i]);
            }
            delete linkStore[id];
        }

        flag = delete dataStorage[id];
        win.dispatchEvent(new win.CustomEvent('dataDeleted', {'detail' : {
            'id': id,
        }}));
        return flag;
    };

    // Function to get the id of the current data
    dataStoreProto.getID = function () {
        return this.id;
    };

    // Function to modify data
    dataStoreProto.modifyData = function () {
        var dataStore = this;

        dataStorage[dataStore.id] = [];
        dataStore.setData(arguments);
        win.dispatchEvent(new win.CustomEvent('dataModified', {'detail' : {
            'id': dataStore.id
        }}));
    };

    // Function to add data to the dataStorage asynchronously via ajax
    dataStoreProto.setDataUrl = function () {
        var dataStore = this,
            argument = arguments[0],
            dataSource = argument.dataSource,
            dataType = argument.dataType,
            callback = argument.callback,
            callbackArgs = argument.callbackArgs,
            data;

        MultiCharting.prototype.ajax({
            url : dataSource,
            success : function(string) {
                data = dataType === 'json' ? JSON.parse(string) : string;
                dataStore.setData({
                    dataSource : data,
                    dataType : dataType,
                }, callback);
            },

            error : function(){
                if (typeof callback === 'function') {
                    callback(callbackArgs);
                }
            }
        });
    };

    // Funtion to get all the keys of the JSON data
    dataStoreProto.getKeys = function () {
        var dataStore = this,
            data = dataStorage[dataStore.id],
            internalData = data[0],
            keys = dataStore.keys;

        if (keys) {
            return keys;
        }
        if (internalData instanceof Array) {
            return (dataStore.keys = internalData);
        }
        else if (internalData instanceof Object) {
            return (dataStore.keys = Object.keys(internalData));
        }
    };

    // Funtion to get all the unique values corresponding to a key
    dataStoreProto.getUniqueValues = function (key) {
        var dataStore = this,
            data = dataStorage[dataStore.id],
            internalData = data[0],
            isArray = internalData instanceof Array,
            uniqueValues = dataStore.uniqueValues[key],
            tempUniqueValues = {},
            len = data.length,
            i;

        if (uniqueValues) {
            return uniqueValues;
        }

        if (isArray) {
            i = 1;
            key = dataStore.getKeys().findIndex(function (element) {
                return element.toUpperCase() === key.toUpperCase();
            });
        }
        else {
            i = 0;
        }

        for (i = isArray ? 1 : 0; i < len; i++) {
            internalData = isArray ? data[i][key] : data[i][key];
            !tempUniqueValues[internalData] && (tempUniqueValues[internalData] = true);
        }

        return (dataStore.uniqueValues[key] = Object.keys(tempUniqueValues));
    };
});

(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var lib = MultiCharting.prototype.lib,
        filterStore = lib.filterStore = {},
        filterLink = lib.filterLink = {},
        filterIdCount = 0,
        dataStorage = lib.dataStorage,
        parentStore = lib.parentStore,
        win = MultiCharting.prototype.win,
        // Constructor class for DataProcessor.
        DataProcessor = function () {
            var manager = this;
            manager.addRule(arguments);
        },
        
        dataProcessorProto = DataProcessor.prototype,

        // Function to update data on change of filter.
        updataFilterProcessor = function (id, copyParentToChild) {
            var i,
                data = filterLink[id],
                JSONData,
                datum,
                dataId,
                len = data.length;

            for (i = 0; i < len; i ++) {
                datum = data[i];
                dataId = datum.id;
                if (!lib.tempDataUpdated[dataId]) {
                    if (parentStore[dataId] && dataStorage[dataId]) {
                        JSONData = parentStore[dataId].getData();
                        datum.modifyData(copyParentToChild ? JSONData : filterStore[id](JSONData));
                    }
                    else {
                        delete parentStore[dataId];
                    }
                }
            }
            lib.tempDataUpdated = {};
        };

    MultiCharting.prototype.createDataProcessor = function () {
        return new DataProcessor(arguments);
    };

    // Function to add filter in the filter store
    dataProcessorProto.addRule = function () {
        var filter = this,
            oldId = filter.id,
            argument = arguments[0],
            filterFn = argument.rule || argument,
            id = argument.type,
            type = argument.type;

        id = oldId || id || 'filterStore' + filterIdCount ++;
        filterStore[id] = filterFn;

        filter.id = id;
        filter.type = type;

        // Update the data on which the filter is applied and also on the child data.
        if (filterLink[id]) {
            updataFilterProcessor(id);
        }

        win.dispatchEvent(new win.CustomEvent('filterAdded', {'detail' : {
            'id': id,
            'filter' : filterFn
        }}));
    };

    // Funtion to get the filter method.
    dataProcessorProto.getFilter = function () {
        return filterStore[this.id];
    };

    // Function to get the ID of the filter.
    dataProcessorProto.getID = function () {
        return this.id;
    };


    dataProcessorProto.deleteFilter = function () {
        var filter = this,
            id = filter.id;

        filterLink[id] && updataFilterProcessor(id, true);

        delete filterStore[id];
        delete filterLink[id];
    };

    dataProcessorProto.filter = function () {
        this.addRule(
            {   rule : arguments[0],
                type : 'filter'
            }
        );
    };

    dataProcessorProto.sort = function () {
        this.addRule(
            {   rule : arguments[0],
                type : 'sort'
            }
        );
    };

    dataProcessorProto.map = function () {
        this.addRule(
            {   rule : arguments[0],
                type : 'map'
            }
        );
    };
});

(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var extend2 = MultiCharting.prototype.lib.extend2;
    //function to convert data, it returns fc supported JSON
    function convertData() {
        var argument = arguments[0] || {},
            jsonData = argument.jsonData,
            configuration = argument.config,
            callbackFN = argument.callbackFN,
            jsonCreator = function(jsonData, configuration) {
                var conf = configuration,
                    seriesType = conf && conf.seriesType,
                    series = {
                        'ms' : function(jsonData, configuration) {
                            var json = {},
                                indexMatch,
                                lenDimension,
                                lenMeasure,
                                lenData,
                                i,
                                j;
                            json.categories = [
                                {
                                    'category': [                        
                                    ]
                                }
                            ];
                            json.dataset = [];
                            for (i = 0, lenDimension =  configuration.dimension.length; i < lenDimension; i++) {
                                indexMatch = jsonData[0].indexOf(configuration.dimension[i]);
                                if (indexMatch != -1) {
                                    for (j = 1, lenData = jsonData.length; j < lenData; j++) {
                                        json.categories[0].category.push({
                                            'label' : jsonData[j][indexMatch]
                                        });
                                    }
                                }
                            }
                            json.dataset = [];
                            for (i = 0, lenMeasure = configuration.measure.length; i < lenMeasure; i++) {
                                indexMatch = jsonData[0].indexOf(configuration.measure[i]);
                                if (indexMatch != -1) {
                                    json.dataset[i] = {
                                        'seriesname' : configuration.measure[i],
                                        'data': []
                                    };
                                    for(j = 1, lenData = jsonData.length; j < lenData; j++) {
                                        json.dataset[i].data.push({
                                            'value' : jsonData[j][indexMatch]
                                        });
                                    }
                                }
                            }
                            return json;
                        },
                        'ss' : function(jsonData, configuration) {
                            var json = {},
                                indexMatchLabel,
                                indexMatchValue, 
                                lenData,
                                j,
                                label,
                                value;
                            json.data = [];
                            indexMatchLabel = jsonData[0].indexOf(configuration.dimension[0]);
                            indexMatchValue = jsonData[0].indexOf(configuration.measure[0]);
                            for (j = 1, lenData = jsonData.length; j < lenData; j++) {                  
                                label = jsonData[j][indexMatchLabel];                           
                                value = jsonData[j][indexMatchValue]; 
                                json.data.push({
                                    'label' : label || '',
                                    'value' : value || ''
                                });
                            }                   
                            return json;
                        },
                        'ts' : function(jsonData, configuration) {
                            var json = {},
                                indexMatch,
                                lenDimension,
                                lenMeasure,
                                lenData,
                                i,
                                j;
                            json.datasets = [];
                            json.datasets[0] = {};
                            json.datasets[0].category = {};
                            json.datasets[0].category.data = [];
                            for (i = 0, lenDimension =  configuration.dimension.length; i < lenDimension; i++) {
                                indexMatch = jsonData[0].indexOf(configuration.dimension[i]);
                                if (indexMatch != -1) {
                                    for (j = 1, lenData = jsonData.length; j < lenData; j++) {
                                        json.datasets[0].category.data.push(jsonData[j][indexMatch]);
                                    }
                                }
                            }
                            json.datasets[0].dataset = [];
                            json.datasets[0].dataset[0] = {};
                            json.datasets[0].dataset[0].series = [];
                            for (i = 0, lenMeasure = configuration.measure.length; i < lenMeasure; i++) {
                                indexMatch = jsonData[0].indexOf(configuration.measure[i]);
                                if (indexMatch != -1) {
                                    json.datasets[0].dataset[0].series[i] = {  
                                        'name' : configuration.measure[i],                              
                                        'data': []
                                    };
                                    for(j = 1, lenData = jsonData.length; j < lenData; j++) {
                                        json.datasets[0].dataset[0].series[i].data.push(jsonData[j][indexMatch]);
                                    }
                                }
                            }
                            return json;
                        }
                    };
                seriesType = seriesType && seriesType.toLowerCase();
                seriesType = (series[seriesType] && seriesType) || 'ms';
                return series[seriesType](jsonData, conf);
            },
            generalDataFormat = function(jsonData, configuration) {
                var isArray = Array.isArray(jsonData[0]),
                    generalDataArray = [],
                    i,
                    j,
                    len,
                    lenGeneralDataArray,
                    value;
                if (!isArray){
                    generalDataArray[0] = [];
                    generalDataArray[0].push(configuration.dimension);
                    generalDataArray[0] = generalDataArray[0][0].concat(configuration.measure);
                    for (i = 0, len = jsonData.length; i < len; i++) {
                        generalDataArray[i+1] = [];
                        for (j = 0, lenGeneralDataArray = generalDataArray[0].length; j < lenGeneralDataArray; j++) {
                            value = jsonData[i][generalDataArray[0][j]];                    
                            generalDataArray[i+1][j] = value || '';             
                        }
                    }
                } else {
                    return jsonData;
                }
                return generalDataArray;
            },
            dataArray,
            json,
            predefinedJson = configuration && configuration.config;

        if (jsonData && configuration) {
            dataArray = generalDataFormat(jsonData, configuration);
            json = jsonCreator(dataArray, configuration);
            json = (predefinedJson && extend2(json,predefinedJson)) || json;    
            return (callbackFN && callbackFN(json)) || json;    
        }
    }

    MultiCharting.prototype.dataadapter = function () {
        return convertData(arguments[0]);
    };
});

(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== 'undefined') {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    var Chart = function () {
            var chart = this;           
            chart.render(arguments[0]);
        },
        chartProto = Chart.prototype,
        extend2 = MultiCharting.prototype.lib.extend2,
        dataadapter = MultiCharting.prototype.dataadapter;

    chartProto.render = function () {
        var chart = this,
            argument =arguments[0] || {};
        chart.getJSON(argument);        

        //render FC 
        chart.chartObj = new FusionCharts(chart.chartConfig);
        chart.chartObj.render();
    };

    chartProto.getJSON = function () {
        var chart = this,
            argument =arguments[0] || {},
            configuration,
            callbackFN,
            jsonData,
            chartConfig = {},
            dataSource = {},
            configData = {};
        //parse argument into chartConfig 
        extend2(chartConfig,argument);
        
        //data configuration 
        configuration = chartConfig.configuration || {};
        configData.jsonData = chartConfig.jsonData;
        configData.callbackFN = configuration.callback;
        configData.config = configuration.data;

        //store fc supported json to render charts
        dataSource = dataadapter(configData);
        
        //delete data configuration parts for FC json converter
        delete chartConfig.jsonData;
        delete chartConfig.configuration;
        
        //set data source into chart configuration
        chartConfig.dataSource = dataSource;
        chart.chartConfig = chartConfig;        
    };

    chartProto.update = function () {
        var chart = this,
            argument =arguments[0] || {};

        chart.getJSON(argument);
        chart.chartObj.chartType(chart.chartConfig.type);
        chart.chartObj.setJSONData(chart.chartConfig.dataSource);

        //To Do :  remove setTimeout()
        setTimeout(function () {
            chart.chartObj.render();
        },10);
    };

    MultiCharting.prototype.createChart = function () {
        return new Chart(arguments[0]);
    };
});


(function (factory) {
    if (typeof module === 'object' && typeof module.exports !== "undefined") {
        module.exports = factory;
    } else {
        factory(MultiCharting);
    }
})(function (MultiCharting) {

    MultiCharting.prototype.createMatrix = function () {
        return new Matrix(arguments[0],arguments[1]);
    };

    var createChart = MultiCharting.prototype.createChart,
        Matrix = function (selector, configuration) {
            var matrix = this;
            matrix.selector = selector;
            //matrix container
            matrix.matrixContainer = document.getElementById(selector);
            matrix.configuration = configuration;
            matrix.defaultH = 100;
            matrix.defaultW = 100;
            //set style, attr on matrix container 
            matrix.setAttrContainer();
        },
        chartId = 0;

    protoMatrix = Matrix.prototype;

    //function to set style, attr on matrix container
    protoMatrix.setAttrContainer = function() {
        var matrix = this,
            container = matrix && matrix.matrixContainer;
        container.style.display = 'block';
        container.style.position = 'relative';        
    };

    //function to set height, width on matrix container
    protoMatrix.setContainerResolution = function (heightArr, widthArr) {
        var matrix = this,
            container = matrix && matrix.matrixContainer,
            height = 0,
            width = 0,
            i,
            j,
            len;
        for(i = 0, len = heightArr.length; i < len; i++) {
            height += heightArr[i];
        }

        for(i = 0, len = widthArr.length; i < len; i++) {
            width += widthArr[i];
        }

        container.style.height = height + 'px';
        container.style.width = width + 'px';
    };

    //function to draw matrix
    protoMatrix.draw = function(){
        var matrix = this,
            configuration = matrix && matrix.configuration || {},
            config = configuration.config,
            className = '',
            //store virtual matrix for user given configuration
            configManager = configuration && matrix && matrix.drawManager(configuration),
            len = configManager && configManager.length,
            placeHolder = [],
            parentContainer = matrix && matrix.matrixContainer,
            lenC;
        
        for(i = 0; i < len; i++) {
            placeHolder[i] = [];
            for(j = 0, lenC = configManager[i].length; j < lenC; j++){
                //store cell object in logical matrix structure
                placeHolder[i][j] = new Cell(configManager[i][j],parentContainer);
            }
        }
        matrix.placeHolder = [];
        matrix.placeHolder = placeHolder;
    };

    //function to manage matrix draw
    protoMatrix.drawManager = function (configuration) {
        var matrix = this,
            i,
            j,
            lenRow = configuration.length,
            //store mapping matrix based on the user configuration
            mapArr = matrix.matrixManager(configuration),
            processedConfig = matrix.setPlcHldr(mapArr, configuration),
            heightArr = matrix.getRowHeight(mapArr),
            widthArr = matrix.getColWidth(mapArr),
            drawManagerObjArr = [],
            lenRow,
            lenCell,
            matrixPosX = matrix.getPos(widthArr),
            matrixPosY = matrix.getPos(heightArr),
            rowspan,
            colspan,
            id,
            top,
            left,
            height,
            width,
            chart,
            html;
        //function to set height, width on matrix container
        matrix.setContainerResolution(heightArr, widthArr);
        //calculate cell position and heiht and 
        for (i = 0; i < lenRow; i++) {  
            drawManagerObjArr[i] = [];          
            for (j = 0, lenCell = configuration[i].length; j < lenCell; j++) {
                rowspan = parseInt(configuration[i][j] && configuration[i][j].rowspan || 1);
                colspan = parseInt(configuration[i][j] && configuration[i][j].colspan || 1);                
                chart = configuration[i][j] && configuration[i][j].chart;
                html = configuration[i][j] && configuration[i][j].html;
                row = parseInt(configuration[i][j].row);
                col = parseInt(configuration[i][j].col);
                left = matrixPosX[col];
                top = matrixPosY[row];
                width = matrixPosX[col + colspan] - left;
                height = matrixPosY[row + rowspan] - top;
                id = (configuration[i][j] && configuration[i][j].id) || matrix.idCreator(row,col);                
                drawManagerObjArr[i].push({
                    top     : top,
                    left    : left,
                    height  : height,
                    width   : width,
                    id      : id,
                    rowspan : rowspan,
                    colspan : colspan,
                    html    : html,
                    chart   : chart
                });
            }
        }
       
        return drawManagerObjArr;
    };

    protoMatrix.idCreator = function(row, col){
        chartId++;
        return 'id'+ chartId;
    };

    protoMatrix.getPos =  function(src){
        var arr = [],
            i = 0,
            len = src && src.length;

        for(; i <= len; i++){
            arr.push(i ? (src[i-1]+arr[i-1]) : 0);
        }

        return arr;
    };

    protoMatrix.setPlcHldr = function(mapArr, configuration){
        var matrix = this,
            row,
            col,
            i,
            j,
            lenR,
            lenC;

        for(i = 0, lenR = mapArr.length; i < lenR; i++){ 
            for(j = 0, lenC = mapArr[i].length; j < lenC; j++){
                row = mapArr[i][j].id.split('-')[0];
                col = mapArr[i][j].id.split('-')[1];

                configuration[row][col].row = configuration[row][col].row === undefined ? i : configuration[row][col].row;
                configuration[row][col].col = configuration[row][col].col === undefined ? j : configuration[row][col].col;
            }
        }
        return configuration;
    };

    protoMatrix.getRowHeight = function(mapArr) {
        var i,
            j,
            lenRow = mapArr && mapArr.length,
            lenCol,
            height = [],
            currHeight,
            maxHeight;
            
        for (i = 0; i < lenRow; i++) {
            for(j = 0, maxHeight = 0, lenCol = mapArr[i].length; j < lenCol; j++) {
                if(mapArr[i][j]) {
                    currHeight = mapArr[i][j].height;
                    maxHeight = maxHeight < currHeight ? currHeight : maxHeight;
                }
            }
            height[i] = maxHeight;
        }

        return height;
    };

    protoMatrix.getColWidth = function(mapArr) {
        var i = 0,
            j = 0,
            lenRow = mapArr && mapArr.length,
            lenCol,
            width = [],
            currWidth,
            maxWidth;
        for (i = 0, lenCol = mapArr[j].length; i < lenCol; i++){
            for(j = 0, maxWidth = 0; j < lenRow; j++) {
                if (mapArr[j][i]) {
                    currWidth = mapArr[j][i].width;        
                    maxWidth = maxWidth < currWidth ? currWidth : maxWidth;
                }
            }
            width[i] = maxWidth;
        }

        return width;
    };

    protoMatrix.matrixManager = function (configuration) {
        var matrix = this,
            mapArr = [],
            i,
            j,
            k,
            l,
            lenRow = configuration.length,
            lenCell,
            rowSpan,
            colSpan,
            width,
            height,
            defaultH = matrix.defaultH,
            defaultW = matrix.defaultW,
            offset;
            
        for (i = 0; i < lenRow; i++) {            
            for (j = 0, lenCell = configuration[i].length; j < lenCell; j++) {
            
                rowSpan = (configuration[i][j] && configuration[i][j].rowspan) || 1;
                colSpan = (configuration[i][j] && configuration[i][j].colspan) || 1;   
                
                width = (configuration[i][j] && configuration[i][j].width);
                width = (width && (width / colSpan)) || defaultW;  
                
                height = (configuration[i][j] && configuration[i][j].height);
                height = (height && (height / rowSpan)) || defaultH;                      
                for (k = 0, offset = 0; k < rowSpan; k++) {
                    for (l = 0; l < colSpan; l++) {
                        
                        mapArr[i + k] = mapArr[i + k] ? mapArr[i + k] : [];                        
                        offset = j + l;
                        
                        while(mapArr[i + k][offset]) {
                            offset++;
                        }
                        
                        mapArr[i + k][offset] = { 
                            id : (i + '-' + j),
                            width : width,
                            height : height
                        };
                    }
                }
            }
        }

        return mapArr;
    };

    protoMatrix.update = function (configuration) {
        var matrix = this,
            configManager = configuration && matrix && matrix.drawManager(configuration),
            len = configManager && configManager.length,
            lenC,
            lenPlcHldr,
            i,
            j,
            k,
            placeHolder = matrix && matrix.placeHolder,
            parentContainer  = matrix && matrix.matrixContainer,
            disposalBox = [],
            recycledCell;

        lenPlcHldr = placeHolder.length;
        for (k = len; k < lenPlcHldr; k++) {
            disposalBox = disposalBox.concat(placeHolder.pop());          
            
        }

        for(i = 0; i < len; i++) {    
            if(!placeHolder[i]) {
                placeHolder[i] = [];
            }
            for(j = 0, lenC = configManager[i].length; j < lenC; j++){
                if(placeHolder[i][j]) {
                    placeHolder[i][j].update(configManager[i][j]);         
                } else {
                    recycledCell = disposalBox.pop();

                    if(recycledCell) {
                        placeHolder[i][j] = recycledCell.update(configManager[i][j]);
                        
                    } else {
                        placeHolder[i][j] = new Cell(configManager[i][j],parentContainer);
                    }
                }
            }

            lenPlcHldr = placeHolder[i].length;
            lenC = configManager[i].length;

            for (k = lenC; k < lenPlcHldr; k++) {
                disposalBox = disposalBox.concat(placeHolder[i].pop());    
            }

        }

        for(i = 0, len = disposalBox.length; i < len; i++) {
            parentContainer.removeChild(disposalBox[i].graphics);
            delete disposalBox[i];
        }      
    };

    protoMatrix.dispose = function () {
        var node  = matrix && matrix.matrixContainer;
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    var Cell = function () {
            var cell = this;
            cell.container = arguments[1];
            cell.config = arguments[0];
            cell.draw();
            cell.config.chart && cell.renderChart();
        },
        protoCell = Cell.prototype;

    protoCell.draw = function (){
        var cell = this;
        cell.graphics = document.createElement('div');
        cell.graphics.id = cell.config.id || '';        
        cell.graphics.style.height = cell.config.height + 'px';
        cell.graphics.style.width = cell.config.width + 'px';
        cell.graphics.style.top = cell.config.top + 'px';
        cell.graphics.style.left = cell.config.left + 'px';
        cell.graphics.style.position = 'absolute';
        cell.graphics.innerHTML = cell.config.html || '';
        cell.container.appendChild(cell.graphics);
    };

    protoCell.renderChart = function () {
        var cell = this; 

        cell.config.chart.renderAt = cell.config.id;
        cell.config.chart.width = '100%';
        cell.config.chart.height = '100%';
      
        if(cell.chart) {
            cell.chart.update(cell.config.chart);
        } else {
            cell.chart = createChart(cell.config.chart);            
        }
        return cell.chart;
    };

    protoCell.update = function (newConfig) {
        var cell = this,
            id = cell.config.id;
        if(newConfig){
            cell.config = newConfig;
            cell.config.id = id;
            cell.graphics.id = cell.config.id || '';        
            cell.graphics.style.height = cell.config.height + 'px';
            cell.graphics.style.width = cell.config.width + 'px';
            cell.graphics.style.top = cell.config.top + 'px';
            cell.graphics.style.left = cell.config.left + 'px';
            cell.graphics.style.position = 'absolute';
            cell.graphics.innerHTML = cell.config.html || '';            
            if(cell.config.chart) {
                cell.chart = cell.renderChart();             
            } else {
                delete cell.chart;
            }          
        }        
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZ1c2lvbmNoYXJ0cy5tdWx0aWNoYXJ0aW5nLmpzIiwibXVsdGljaGFydGluZy5saWIuanMiLCJtdWx0aWNoYXJ0aW5nLmFqYXguanMiLCJtdWx0aWNoYXJ0aW5nLmNzdi5qcyIsIm11bHRpY2hhcnRpbmcuZGF0YXN0b3JlLmpzIiwibXVsdGljaGFydGluZy5kYXRhcHJvY2Vzc29yLmpzIiwibXVsdGljaGFydGluZy5kYXRhYWRhcHRlci5qcyIsIm11bHRpY2hhcnRpbmcuY3JlYXRlY2hhcnQuanMiLCJtdWx0aWNoYXJ0aW5nLm1hdHJpeC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDelRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImZ1c2lvbmNoYXJ0cy5tdWx0aWNoYXJ0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNdWx0aUNoYXJ0aW5nIEV4dGVuc2lvbiBmb3IgRnVzaW9uQ2hhcnRzXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyB0aGUgYmFzaWMgcm91dGluZXMgcmVxdWlyZWQgYnkgc3Vic2VxdWVudCBtb2R1bGVzIHRvXG4gKiBleHRlbmQvc2NhbGUgb3IgYWRkIGZ1bmN0aW9uYWxpdHkgdG8gdGhlIE11bHRpQ2hhcnRpbmcgb2JqZWN0LlxuICpcbiAqL1xuXG4gLyogZ2xvYmFsIHdpbmRvdzogdHJ1ZSAqL1xuXG4oZnVuY3Rpb24gKGVudiwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGVudi5kb2N1bWVudCA/XG4gICAgICAgICAgICBmYWN0b3J5KGVudikgOiBmdW5jdGlvbih3aW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXdpbi5kb2N1bWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpbmRvdyB3aXRoIGRvY3VtZW50IG5vdCBwcmVzZW50Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWN0b3J5KHdpbiwgdHJ1ZSk7XG4gICAgICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVudi5NdWx0aUNoYXJ0aW5nID0gZmFjdG9yeShlbnYsIHRydWUpO1xuICAgIH1cbn0pKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcywgZnVuY3Rpb24gKF93aW5kb3csIHdpbmRvd0V4aXN0cykge1xuICAgIC8vIEluIGNhc2UgTXVsdGlDaGFydGluZyBhbHJlYWR5IGV4aXN0cy5cbiAgICBpZiAoX3dpbmRvdy5NdWx0aUNoYXJ0aW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgTXVsdGlDaGFydGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuXG4gICAgTXVsdGlDaGFydGluZy5wcm90b3R5cGUud2luID0gX3dpbmRvdztcblxuICAgIGlmICh3aW5kb3dFeGlzdHMpIHtcbiAgICAgICAgX3dpbmRvdy5NdWx0aUNoYXJ0aW5nID0gTXVsdGlDaGFydGluZztcbiAgICB9XG4gICAgcmV0dXJuIE11bHRpQ2hhcnRpbmc7XG59KTtcbiIsIlxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoTXVsdGlDaGFydGluZyk7XG4gICAgfVxufSkoZnVuY3Rpb24gKE11bHRpQ2hhcnRpbmcpIHtcblxuXHR2YXIgbWVyZ2UgPSBmdW5jdGlvbiAob2JqMSwgb2JqMiwgc2tpcFVuZGVmLCB0Z3RBcnIsIHNyY0Fycikge1xuICAgICAgICAgICAgdmFyIGl0ZW0sXG4gICAgICAgICAgICAgICAgc3JjVmFsLFxuICAgICAgICAgICAgICAgIHRndFZhbCxcbiAgICAgICAgICAgICAgICBzdHIsXG4gICAgICAgICAgICAgICAgY1JlZixcbiAgICAgICAgICAgICAgICBvYmplY3RUb1N0ckZuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBhcnJheVRvU3RyID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICAgICAgICAgICAgICBvYmplY3RUb1N0ciA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgICAgICAgICAgICAgIGNoZWNrQ3ljbGljUmVmID0gZnVuY3Rpb24ob2JqLCBwYXJlbnRBcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBwYXJlbnRBcnIubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYkluZGV4ID0gLTE7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iaiA9PT0gcGFyZW50QXJyW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYkluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYkluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJJbmRleDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIE9CSkVDVFNUUklORyA9ICdvYmplY3QnO1xuXG4gICAgICAgICAgICAvL2NoZWNrIHdoZXRoZXIgb2JqMiBpcyBhbiBhcnJheVxuICAgICAgICAgICAgLy9pZiBhcnJheSB0aGVuIGl0ZXJhdGUgdGhyb3VnaCBpdCdzIGluZGV4XG4gICAgICAgICAgICAvLyoqKiogTU9PVE9PTFMgcHJlY3V0aW9uXG5cbiAgICAgICAgICAgIGlmICghc3JjQXJyKSB7XG4gICAgICAgICAgICAgICAgdGd0QXJyID0gW29iajFdO1xuICAgICAgICAgICAgICAgIHNyY0FyciA9IFtvYmoyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRndEFyci5wdXNoKG9iajEpO1xuICAgICAgICAgICAgICAgIHNyY0Fyci5wdXNoKG9iajIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob2JqMiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgZm9yIChpdGVtID0gMDsgaXRlbSA8IG9iajIubGVuZ3RoOyBpdGVtICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyY1ZhbCA9IG9iajFbaXRlbV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0Z3RWYWwgPSBvYmoyW2l0ZW1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGd0VmFsICE9PSBPQkpFQ1RTVFJJTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHNraXBVbmRlZiAmJiB0Z3RWYWwgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoxW2l0ZW1dID0gdGd0VmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNyY1ZhbCA9PT0gbnVsbCB8fCB0eXBlb2Ygc3JjVmFsICE9PSBPQkpFQ1RTVFJJTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNWYWwgPSBvYmoxW2l0ZW1dID0gdGd0VmFsIGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY1JlZiA9IGNoZWNrQ3ljbGljUmVmKHRndFZhbCwgc3JjQXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjUmVmICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1ZhbCA9IG9iajFbaXRlbV0gPSB0Z3RBcnJbY1JlZl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZShzcmNWYWwsIHRndFZhbCwgc2tpcFVuZGVmLCB0Z3RBcnIsIHNyY0Fycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGl0ZW0gaW4gb2JqMikge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjVmFsID0gb2JqMVtpdGVtXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRndFZhbCA9IG9iajJbaXRlbV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRndFZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdGd0VmFsID09PSBPQkpFQ1RTVFJJTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCBmb3IgaXNzdWUgQlVHOiBGV1hULTYwMlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUUgPCA5IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChudWxsKSBnaXZlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ1tvYmplY3QgT2JqZWN0XScgaW5zdGVhZCBvZiAnW29iamVjdCBOdWxsXSdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoYXQncyB3aHkgbnVsbCB2YWx1ZSBiZWNvbWVzIE9iamVjdCBpbiBJRSA8IDlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IG9iamVjdFRvU3RyRm4uY2FsbCh0Z3RWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ciA9PT0gb2JqZWN0VG9TdHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3JjVmFsID09PSBudWxsIHx8IHR5cGVvZiBzcmNWYWwgIT09IE9CSkVDVFNUUklORykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNWYWwgPSBvYmoxW2l0ZW1dID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNSZWYgPSBjaGVja0N5Y2xpY1JlZih0Z3RWYWwsIHNyY0Fycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNSZWYgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1ZhbCA9IG9iajFbaXRlbV0gPSB0Z3RBcnJbY1JlZl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZShzcmNWYWwsIHRndFZhbCwgc2tpcFVuZGVmLCB0Z3RBcnIsIHNyY0Fycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RyID09PSBhcnJheVRvU3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNyY1ZhbCA9PT0gbnVsbCB8fCAhKHNyY1ZhbCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNWYWwgPSBvYmoxW2l0ZW1dID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNSZWYgPSBjaGVja0N5Y2xpY1JlZih0Z3RWYWwsIHNyY0Fycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNSZWYgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1ZhbCA9IG9iajFbaXRlbV0gPSB0Z3RBcnJbY1JlZl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZShzcmNWYWwsIHRndFZhbCwgc2tpcFVuZGVmLCB0Z3RBcnIsIHNyY0Fycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqMVtpdGVtXSA9IHRndFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iajFbaXRlbV0gPSB0Z3RWYWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqMTtcbiAgICAgICAgfSxcbiAgICAgICAgZXh0ZW5kMiA9IGZ1bmN0aW9uIChvYmoxLCBvYmoyLCBza2lwVW5kZWYpIHtcbiAgICAgICAgICAgIHZhciBPQkpFQ1RTVFJJTkcgPSAnb2JqZWN0JztcbiAgICAgICAgICAgIC8vaWYgbm9uZSBvZiB0aGUgYXJndW1lbnRzIGFyZSBvYmplY3QgdGhlbiByZXR1cm4gYmFja1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmoxICE9PSBPQkpFQ1RTVFJJTkcgJiYgdHlwZW9mIG9iajIgIT09IE9CSkVDVFNUUklORykge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iajIgIT09IE9CSkVDVFNUUklORyB8fCBvYmoyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqMSAhPT0gT0JKRUNUU1RSSU5HKSB7XG4gICAgICAgICAgICAgICAgb2JqMSA9IG9iajIgaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXJnZShvYmoxLCBvYmoyLCBza2lwVW5kZWYpO1xuICAgICAgICAgICAgcmV0dXJuIG9iajE7XG4gICAgICAgIH0sXG4gICAgICAgIGxpYiA9IHtcbiAgICAgICAgICAgIGV4dGVuZDI6IGV4dGVuZDIsXG4gICAgICAgICAgICBtZXJnZTogbWVyZ2VcbiAgICAgICAgfTtcblxuXHRNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5saWIgPSAoTXVsdGlDaGFydGluZy5wcm90b3R5cGUubGliIHx8IGxpYik7XG5cbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KE11bHRpQ2hhcnRpbmcpO1xuICAgIH1cbn0pKGZ1bmN0aW9uIChNdWx0aUNoYXJ0aW5nKSB7XG5cblx0dmFyIEFqYXggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYWpheCA9IHRoaXMsXG5cdFx0XHRcdGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdO1xuXG5cdFx0ICAgIGFqYXgub25TdWNjZXNzID0gYXJndW1lbnQuc3VjY2Vzcztcblx0XHQgICAgYWpheC5vbkVycm9yID0gYXJndW1lbnQuZXJyb3I7XG5cdFx0ICAgIGFqYXgub3BlbiA9IGZhbHNlO1xuXHRcdCAgICByZXR1cm4gYWpheC5nZXQoYXJndW1lbnQudXJsKTtcblx0XHR9LFxuXG4gICAgICAgIGFqYXhQcm90byA9IEFqYXgucHJvdG90eXBlLFxuXG4gICAgICAgIEZVTkNUSU9OID0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgTVNYTUxIVFRQID0gJ01pY3Jvc29mdC5YTUxIVFRQJyxcbiAgICAgICAgTVNYTUxIVFRQMiA9ICdNc3htbDIuWE1MSFRUUCcsXG4gICAgICAgIEdFVCA9ICdHRVQnLFxuICAgICAgICBYSFJFUUVSUk9SID0gJ1htbEh0dHByZXF1ZXN0IEVycm9yJyxcbiAgICAgICAgd2luID0gTXVsdGlDaGFydGluZy5wcm90b3R5cGUud2luLCAvLyBrZWVwIGEgbG9jYWwgcmVmZXJlbmNlIG9mIHdpbmRvdyBzY29wZVxuXG4gICAgICAgIC8vIFByb2JlIElFIHZlcnNpb25cbiAgICAgICAgdmVyc2lvbiA9IHBhcnNlRmxvYXQod2luLm5hdmlnYXRvci5hcHBWZXJzaW9uLnNwbGl0KCdNU0lFJylbMV0pLFxuICAgICAgICBpZWx0OCA9ICh2ZXJzaW9uID49IDUuNSAmJiB2ZXJzaW9uIDw9IDcpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBmaXJlZm94ID0gL21vemlsbGEvaS50ZXN0KHdpbi5uYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgLy9cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGZsYWdzLlxuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBwYWdlIGlzIG9uIGZpbGUgcHJvdG9jb2wuXG4gICAgICAgIGZpbGVQcm90b2NvbCA9IHdpbi5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2ZpbGU6JyxcbiAgICAgICAgQVhPYmplY3QgPSB3aW4uQWN0aXZlWE9iamVjdCxcblxuICAgICAgICAvLyBDaGVjayBpZiBuYXRpdmUgeGhyIGlzIHByZXNlbnRcbiAgICAgICAgWEhSTmF0aXZlID0gKCFBWE9iamVjdCB8fCAhZmlsZVByb3RvY29sKSAmJiB3aW4uWE1MSHR0cFJlcXVlc3QsXG5cbiAgICAgICAgLy8gUHJlcGFyZSBmdW5jdGlvbiB0byByZXRyaWV2ZSBjb21wYXRpYmxlIHhtbGh0dHByZXF1ZXN0LlxuICAgICAgICBuZXdYbWxIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB4bWxodHRwO1xuXG4gICAgICAgICAgICAvLyBpZiB4bWxodHRwcmVxdWVzdCBpcyBwcmVzZW50IGFzIG5hdGl2ZSwgdXNlIGl0LlxuICAgICAgICAgICAgaWYgKFhIUk5hdGl2ZSkge1xuICAgICAgICAgICAgICAgIG5ld1htbEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFhIUk5hdGl2ZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1htbEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVzZSBhY3RpdmVYIGZvciBJRVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB4bWxodHRwID0gbmV3IEFYT2JqZWN0KE1TWE1MSFRUUDIpO1xuICAgICAgICAgICAgICAgIG5ld1htbEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFYT2JqZWN0KE1TWE1MSFRUUDIpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHhtbGh0dHAgPSBuZXcgQVhPYmplY3QoTVNYTUxIVFRQKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3WG1sSHR0cFJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFYT2JqZWN0KE1TWE1MSFRUUCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHhtbGh0dHAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geG1saHR0cDtcbiAgICAgICAgfSxcblxuICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBQcmV2ZW50cyBjYWNoZWluZyBvZiBBSkFYIHJlcXVlc3RzLlxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJ0lmLU1vZGlmaWVkLVNpbmNlJzogJ1NhdCwgMjkgT2N0IDE5OTQgMTk6NDM6MzEgR01UJyxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGV0cyB0aGUgc2VydmVyIGtub3cgdGhhdCB0aGlzIGlzIGFuIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdYLVJlcXVlc3RlZC1XaXRoJzogJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGV0cyBzZXJ2ZXIga25vdyB3aGljaCB3ZWIgYXBwbGljYXRpb24gaXMgc2VuZGluZyByZXF1ZXN0cy5cbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdYLVJlcXVlc3RlZC1CeSc6ICdGdXNpb25DaGFydHMnLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNZW50aW9ucyBjb250ZW50LXR5cGVzIHRoYXQgYXJlIGFjY2VwdGFibGUgZm9yIHRoZSByZXNwb25zZS4gU29tZSBzZXJ2ZXJzIHJlcXVpcmUgdGhpcyBmb3IgQWpheFxuICAgICAgICAgICAgICogY29tbXVuaWNhdGlvbi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdBY2NlcHQnOiAndGV4dC9wbGFpbiwgKi8qJyxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIE1JTUUgdHlwZSBvZiB0aGUgYm9keSBvZiB0aGUgcmVxdWVzdCBhbG9uZyB3aXRoIGl0cyBjaGFyc2V0LlxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG4gICAgICAgIH07XG5cbiAgICBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5hamF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEFqYXgoYXJndW1lbnRzWzBdKTtcbiAgICB9O1xuXG4gICAgYWpheFByb3RvLmdldCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB0aGlzLFxuICAgICAgICAgICAgeG1saHR0cCA9IHdyYXBwZXIueG1saHR0cCxcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2sgPSB3cmFwcGVyLm9uRXJyb3IsXG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSB3cmFwcGVyLm9uU3VjY2VzcyxcbiAgICAgICAgICAgIHhSZXF1ZXN0ZWRCeSA9ICdYLVJlcXVlc3RlZC1CeScsXG4gICAgICAgICAgICBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICAgICAgaTtcblxuICAgICAgICAvLyBYLVJlcXVlc3RlZC1CeSBpcyByZW1vdmVkIGZyb20gaGVhZGVyIGR1cmluZyBjcm9zcyBkb21haW4gYWpheCBjYWxsXG4gICAgICAgIGlmICh1cmwuc2VhcmNoKC9eKGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcLykvKSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICB3aW4ubG9jYXRpb24uaG9zdG5hbWUgIT09IC8oaHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvKShbXlxcL1xcOl0qKS8uZXhlYyh1cmwpWzJdKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgdXJsIGRvZXMgbm90IGNvbnRhaW4gaHR0cCBvciBodHRwcywgdGhlbiBpdHMgYSBzYW1lIGRvbWFpbiBjYWxsLiBObyBuZWVkIHRvIHVzZSByZWdleCB0byBnZXRcbiAgICAgICAgICAgIC8vIGRvbWFpbi4gSWYgaXQgY29udGFpbnMgdGhlbiBjaGVja3MgZG9tYWluLlxuICAgICAgICAgICAgZGVsZXRlIGhlYWRlcnNbeFJlcXVlc3RlZEJ5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICFoYXNPd24uY2FsbChoZWFkZXJzLCB4UmVxdWVzdGVkQnkpICYmIChoZWFkZXJzW3hSZXF1ZXN0ZWRCeV0gPSAnRnVzaW9uQ2hhcnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXhtbGh0dHAgfHwgaWVsdDggfHwgZmlyZWZveCkge1xuICAgICAgICAgICAgeG1saHR0cCA9IG5ld1htbEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB3cmFwcGVyLnhtbGh0dHAgPSB4bWxodHRwO1xuICAgICAgICB9XG5cbiAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAoKCF4bWxodHRwLnN0YXR1cyAmJiBmaWxlUHJvdG9jb2wpIHx8ICh4bWxodHRwLnN0YXR1cyA+PSAyMDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtbGh0dHAuc3RhdHVzIDwgMzAwKSB8fCB4bWxodHRwLnN0YXR1cyA9PT0gMzA0IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB4bWxodHRwLnN0YXR1cyA9PT0gMTIyMyB8fCB4bWxodHRwLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjayh4bWxodHRwLnJlc3BvbnNlVGV4dCwgd3JhcHBlciwgdXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyb3JDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKG5ldyBFcnJvcihYSFJFUUVSUk9SKSwgd3JhcHBlciwgdXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd3JhcHBlci5vcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHhtbGh0dHAub3BlbihHRVQsIHVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICh4bWxodHRwLm92ZXJyaWRlTWltZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB4bWxodHRwLm92ZXJyaWRlTWltZVR5cGUoJ3RleHQvcGxhaW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpIGluIGhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuICAgICAgICAgICAgd3JhcHBlci5vcGVuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvckNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhlcnJvciwgd3JhcHBlciwgdXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB4bWxodHRwO1xuICAgIH07XG5cbiAgICBhamF4UHJvdG8uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMsXG4gICAgICAgICAgICB4bWxodHRwID0gaW5zdGFuY2UueG1saHR0cDtcblxuICAgICAgICBpbnN0YW5jZS5vcGVuID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB4bWxodHRwICYmIHR5cGVvZiB4bWxodHRwLmFib3J0ID09PSBGVU5DVElPTiAmJiB4bWxodHRwLnJlYWR5U3RhdGUgJiZcbiAgICAgICAgICAgICAgICB4bWxodHRwLnJlYWR5U3RhdGUgIT09IDAgJiYgeG1saHR0cC5hYm9ydCgpO1xuICAgIH07XG5cbiAgICBhamF4UHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcztcbiAgICAgICAgaW5zdGFuY2Uub3BlbiAmJiBpbnN0YW5jZS5hYm9ydCgpO1xuXG4gICAgICAgIGRlbGV0ZSBpbnN0YW5jZS5vbkVycm9yO1xuICAgICAgICBkZWxldGUgaW5zdGFuY2Uub25TdWNjZXNzO1xuICAgICAgICBkZWxldGUgaW5zdGFuY2UueG1saHR0cDtcbiAgICAgICAgZGVsZXRlIGluc3RhbmNlLm9wZW47XG5cbiAgICAgICAgcmV0dXJuIChpbnN0YW5jZSA9IG51bGwpO1xuICAgIH07XG59KTsiLCJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KE11bHRpQ2hhcnRpbmcpO1xuICAgIH1cbn0pKGZ1bmN0aW9uIChNdWx0aUNoYXJ0aW5nKSB7XG5cbiAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG4gICAgLy8gU291cmNlOiBodHRwOi8vd3d3LmJlbm5hZGVsLmNvbS9ibG9nLzE1MDQtQXNrLUJlbi1QYXJzaW5nLUNTVi1TdHJpbmdzLVdpdGgtSmF2YXNjcmlwdC1FeGVjLVJlZ3VsYXItRXhwcmVzc2lvbi1Db21tYW5kLmh0bVxuICAgIC8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuICAgIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cblxuICAgIC8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuICAgIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gICAgZnVuY3Rpb24gQ1NWVG9BcnJheSAoc3RyRGF0YSwgc3RyRGVsaW1pdGVyKSB7XG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVsaW1pdGVyIGlzIGRlZmluZWQuIElmIG5vdCxcbiAgICAgICAgLy8gdGhlbiBkZWZhdWx0IHRvIGNvbW1hLlxuICAgICAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8IFwiLFwiKTtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHBhcnNlIHRoZSBDU1YgdmFsdWVzLlxuICAgICAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgLy8gRGVsaW1pdGVycy5cbiAgICAgICAgICAgICAgICBcIihcXFxcXCIgKyBzdHJEZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICtcbiAgICAgICAgICAgICAgICAvLyBRdW90ZWQgZmllbGRzLlxuICAgICAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICtcbiAgICAgICAgICAgICAgICAvLyBTdGFuZGFyZCBmaWVsZHMuXG4gICAgICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgXCJnaVwiXG4gICAgICAgICAgICApO1xuICAgICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgZGF0YS4gR2l2ZSB0aGUgYXJyYXlcbiAgICAgICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICAgICAgdmFyIGFyckRhdGEgPSBbW11dO1xuICAgICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgICAgIC8vIG1hdGNoaW5nIGdyb3Vwcy5cbiAgICAgICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuICAgICAgICAvLyBLZWVwIGxvb3Bpbmcgb3ZlciB0aGUgcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXNcbiAgICAgICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgICAgIHdoaWxlIChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKCBzdHJEYXRhICkpe1xuICAgICAgICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgICAgICAgLy8gKGlzIG5vdCB0aGUgc3RhcnQgb2Ygc3RyaW5nKSBhbmQgaWYgaXQgbWF0Y2hlc1xuICAgICAgICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAgICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgIChzdHJNYXRjaGVkRGVsaW1pdGVyICE9IHN0ckRlbGltaXRlcilcbiAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGhhdmUgcmVhY2hlZCBhIG5ldyByb3cgb2YgZGF0YSxcbiAgICAgICAgICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICAgICAgICAgIGFyckRhdGEucHVzaCggW10gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAgICAgICAvLyBjYXB0dXJlZCAocXVvdGVkIG9yIHVucXVvdGVkKS5cbiAgICAgICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pe1xuICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcXVvdGVkIHZhbHVlLiBXaGVuIHdlIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKSxcbiAgICAgICAgICAgICAgICAgICAgXCJcXFwiXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICAgICAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgICAgICAgLy8gaXQgdG8gdGhlIGRhdGEgYXJyYXkuXG4gICAgICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm4gdGhlIHBhcnNlZCBkYXRhLlxuICAgICAgICByZXR1cm4oIGFyckRhdGEgKTtcbiAgICB9XG4gICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuICAgIE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLmNvbnZlcnRUb0FycmF5ID0gZnVuY3Rpb24gKGRhdGEsIGRlbGltaXRlciwgc3RydWN0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBkZWxpbWl0ZXIgPSBkYXRhLmRlbGltaXRlcjtcbiAgICAgICAgICAgIHN0cnVjdHVyZSA9IGRhdGEuc3RydWN0dXJlO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBkYXRhLmNhbGxiYWNrO1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDU1Ygc3RyaW5nIG5vdCBwcm92aWRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzcGxpdGVkRGF0YSA9IGRhdGEuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyksXG4gICAgICAgICAgICAvL3RvdGFsIG51bWJlciBvZiByb3dzXG4gICAgICAgICAgICBsZW4gPSBzcGxpdGVkRGF0YS5sZW5ndGgsXG4gICAgICAgICAgICAvL2ZpcnN0IHJvdyBpcyBoZWFkZXIgYW5kIHNwbGl0aW5nIGl0IGludG8gYXJyYXlzXG4gICAgICAgICAgICBoZWFkZXIgPSBDU1ZUb0FycmF5KHNwbGl0ZWREYXRhWzBdLCBkZWxpbWl0ZXIpLCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgICAgIGkgPSAxLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBrID0gMCxcbiAgICAgICAgICAgIGtsZW4gPSAwLFxuICAgICAgICAgICAgY2VsbCA9IFtdLFxuICAgICAgICAgICAgbWluID0gTWF0aC5taW4sXG4gICAgICAgICAgICBmaW5hbE9iLFxuICAgICAgICAgICAgdXBkYXRlTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGltID0gMCxcbiAgICAgICAgICAgICAgICAgICAgamxlbiA9IDAsXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBsaW0gPSBpICsgMzAwMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobGltID4gbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbSA9IGxlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsaW07ICsraSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY3JlYXRlIGNlbGwgYXJyYXkgdGhhdCBjb2ludGFpbiBjc3YgZGF0YVxuICAgICAgICAgICAgICAgICAgICBjZWxsID0gQ1NWVG9BcnJheShzcGxpdGVkRGF0YVtpXSwgZGVsaW1pdGVyKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgICAgICAgICAgICAgIGNlbGwgPSBjZWxsICYmIGNlbGxbMF07XG4gICAgICAgICAgICAgICAgICAgIC8vdGFrZSBtaW4gb2YgaGVhZGVyIGxlbmd0aCBhbmQgdG90YWwgY29sdW1uc1xuICAgICAgICAgICAgICAgICAgICBqbGVuID0gbWluKGhlYWRlci5sZW5ndGgsIGNlbGwubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihzdHJ1Y3R1cmUgPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxPYi5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0cnVjdHVyZSA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgamxlbjsgKytqKSB7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NyZWF0aW5nIHRoZSBmaW5hbCBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbaGVhZGVyW2pdXSA9IGNlbGxbal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbE9iLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgamxlbjsgKytqKSB7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NyZWF0aW5nIHRoZSBmaW5hbCBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbE9iW2hlYWRlcltqXV0ucHVzaChjZWxsW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL2NhbGwgdXBkYXRlIG1hbmFnZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dCh1cGRhdGVNYW5hZ2VyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTWFuYWdlcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGZpbmFsT2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgc3RydWN0dXJlID0gc3RydWN0dXJlIHx8IDE7XG4gICAgICAgIGhlYWRlciA9IGhlYWRlciAmJiBoZWFkZXJbMF07XG5cbiAgICAgICAgLy9pZiB0aGUgdmFsdWUgaXMgZW1wdHlcbiAgICAgICAgaWYgKHNwbGl0ZWREYXRhW3NwbGl0ZWREYXRhLmxlbmd0aCAtIDFdID09PSAnJykge1xuICAgICAgICAgICAgc3BsaXRlZERhdGEuc3BsaWNlKChzcGxpdGVkRGF0YS5sZW5ndGggLSAxKSwgMSk7XG4gICAgICAgICAgICBsZW4tLTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RydWN0dXJlID09PSAxKXtcbiAgICAgICAgICAgIGZpbmFsT2IgPSBbXTtcbiAgICAgICAgICAgIGZpbmFsT2IucHVzaChoZWFkZXIpO1xuICAgICAgICB9IGVsc2UgaWYoc3RydWN0dXJlID09PSAyKSB7XG4gICAgICAgICAgICBmaW5hbE9iID0gW107XG4gICAgICAgIH1lbHNlIGlmKHN0cnVjdHVyZSA9PT0gMyl7XG4gICAgICAgICAgICBmaW5hbE9iID0ge307XG4gICAgICAgICAgICBmb3IgKGsgPSAwLCBrbGVuID0gaGVhZGVyLmxlbmd0aDsgayA8IGtsZW47ICsraykge1xuICAgICAgICAgICAgICAgIGZpbmFsT2JbaGVhZGVyW2tdXSA9IFtdO1xuICAgICAgICAgICAgfSAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlTWFuYWdlcigpO1xuXG4gICAgfTtcblxufSk7XG4iLCJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KE11bHRpQ2hhcnRpbmcpO1xuICAgIH1cbn0pKGZ1bmN0aW9uIChNdWx0aUNoYXJ0aW5nKSB7XG5cblx0dmFyXHRsaWIgPSBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5saWIsXG5cdFx0ZGF0YVN0b3JhZ2UgPSBsaWIuZGF0YVN0b3JhZ2UgPSB7fSxcblx0XHQvLyBGb3Igc3RvcmluZyB0aGUgY2hpbGQgb2YgYSBwYXJlbnRcblx0XHRsaW5rU3RvcmUgPSB7fSxcblx0XHQvL0ZvciBzdG9yaW5nIHRoZSBwYXJlbnQgb2YgYSBjaGlsZFxuXHRcdHBhcmVudFN0b3JlID0gbGliLnBhcmVudFN0b3JlID0ge30sXG5cdFx0aWRDb3VudCA9IDAsXG5cdFx0d2luID0gTXVsdGlDaGFydGluZy5wcm90b3R5cGUud2luLFxuXHRcdC8vIENvbnN0cnVjdG9yIGNsYXNzIGZvciBEYXRhU3RvcmUuXG5cdFx0RGF0YVN0b3JlID0gZnVuY3Rpb24gKCkge1xuXHQgICAgXHR2YXIgbWFuYWdlciA9IHRoaXM7XG5cdCAgICBcdG1hbmFnZXIudW5pcXVlVmFsdWVzID0ge307XG5cdCAgICBcdG1hbmFnZXIuc2V0RGF0YShhcmd1bWVudHMpO1xuXHRcdH0sXG5cdFx0ZGF0YVN0b3JlUHJvdG8gPSBEYXRhU3RvcmUucHJvdG90eXBlLFxuXG5cdFx0Ly8gRnVuY3Rpb24gdG8gZXhlY3V0ZSB0aGUgZGF0YVByb2Nlc3NvciBvdmVyIHRoZSBkYXRhXG5cdFx0ZXhlY3V0ZVByb2Nlc3NvciA9IGZ1bmN0aW9uICh0eXBlLCBmaWx0ZXJGbiwgSlNPTkRhdGEpIHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICAnc29ydCcgOiByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNvcnQuY2FsbChKU09ORGF0YSwgZmlsdGVyRm4pO1xuXHRcdFx0XHRjYXNlICAnZmlsdGVyJyA6IHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoSlNPTkRhdGEsIGZpbHRlckZuKTtcblx0XHRcdFx0Y2FzZSAnbWFwJyA6IHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoSlNPTkRhdGEsIGZpbHRlckZuKTtcblx0XHRcdFx0ZGVmYXVsdCA6IHJldHVybiBmaWx0ZXJGbihKU09ORGF0YSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vRnVuY3Rpb24gdG8gdXBkYXRlIGFsbCB0aGUgbGlua2VkIGNoaWxkIGRhdGFcblx0XHR1cGRhdGFEYXRhID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHR2YXIgaSxcblx0XHRcdFx0bGlua0RhdGEgPSBsaW5rU3RvcmVbaWRdLFxuXHRcdFx0XHRwYXJlbnREYXRhID0gZGF0YVN0b3JhZ2VbaWRdLFxuXHRcdFx0XHRmaWx0ZXJTdG9yZSA9IGxpYi5maWx0ZXJTdG9yZSxcblx0XHRcdFx0bGVuLFxuXHRcdFx0XHRsaW5rSWRzLFxuXHRcdFx0XHRmaWx0ZXJzLFxuXHRcdFx0XHRsaW5rSWQsXG5cdFx0XHRcdGZpbHRlcixcblx0XHRcdFx0ZmlsdGVyRm4sXG5cdFx0XHRcdHR5cGUsXG5cdFx0XHRcdC8vIFN0b3JlIGFsbCB0aGUgZGF0YU9ianMgdGhhdCBhcmUgdXBkYXRlZC5cblx0XHRcdFx0dGVtcERhdGFVcGRhdGVkID0gbGliLnRlbXBEYXRhVXBkYXRlZCA9IHt9O1xuXG5cdFx0XHRsaW5rSWRzID0gbGlua0RhdGEubGluaztcblx0XHRcdGZpbHRlcnMgPSBsaW5rRGF0YS5maWx0ZXI7XG5cdFx0XHRsZW4gPSBsaW5rSWRzLmxlbmd0aDtcblxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGxpbmtJZCA9IGxpbmtJZHNbaV07XG5cblx0XHRcdFx0dGVtcERhdGFVcGRhdGVkW2xpbmtJZF0gPSB0cnVlO1xuXHRcdFx0XHRmaWx0ZXIgPSBmaWx0ZXJzW2ldO1xuXHRcdFx0XHRmaWx0ZXJGbiA9IGZpbHRlci5nZXRGaWx0ZXIoKTtcblx0XHRcdFx0dHlwZSA9IGZpbHRlci50eXBlO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgZmlsdGVyRm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRpZiAoZmlsdGVyU3RvcmVbZmlsdGVyLmlkXSkge1xuXHRcdFx0XHRcdFx0ZGF0YVN0b3JhZ2VbbGlua0lkXSA9IGV4ZWN1dGVQcm9jZXNzb3IodHlwZSwgZmlsdGVyRm4sIHBhcmVudERhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGRhdGFTdG9yYWdlW2xpbmtJZF0gPSBwYXJlbnREYXRhO1xuXHRcdFx0XHRcdFx0ZmlsdGVyLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdGkgLT0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmIChsaW5rU3RvcmVbbGlua0lkXSkge1xuXHRcdFx0XHRcdHVwZGF0YURhdGEobGlua0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0TXVsdGlDaGFydGluZy5wcm90b3R5cGUuY3JlYXRlRGF0YVN0b3JlID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgRGF0YVN0b3JlKGFyZ3VtZW50cyk7XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gYWRkIGRhdGEgaW4gdGhlIGRhdGEgc3RvcmVcblx0ZGF0YVN0b3JlUHJvdG8uc2V0RGF0YSA9IGZ1bmN0aW9uIChkYXRhU3BlY3MsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGRhdGFTdG9yZSA9IHRoaXMsXG5cdFx0XHRvbGRJZCA9IGRhdGFTdG9yZS5pZCxcblx0XHRcdGlkID0gZGF0YVNwZWNzLmlkLFxuXHRcdFx0ZGF0YVR5cGUgPSBkYXRhU3BlY3MuZGF0YVR5cGUsXG5cdFx0XHRkYXRhU291cmNlID0gZGF0YVNwZWNzLmRhdGFTb3VyY2UsXG5cdFx0XHRvbGRKU09ORGF0YSA9IGRhdGFTdG9yYWdlW29sZElkXSB8fCBbXSxcblx0XHRcdGNhbGxiYWNrSGVscGVyRm4gPSBmdW5jdGlvbiAoSlNPTkRhdGEpIHtcblx0XHRcdFx0ZGF0YVN0b3JhZ2VbaWRdID0gb2xkSlNPTkRhdGEuY29uY2F0KEpTT05EYXRhIHx8IFtdKTtcblx0XHRcdFx0aWYgKGxpbmtTdG9yZVtpZF0pIHtcblx0XHRcdFx0XHR1cGRhdGFEYXRhKGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soSlNPTkRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0aWQgPSBvbGRJZCB8fCBpZCB8fCAnZGF0YVN0b3JhZ2UnICsgaWRDb3VudCArKztcblx0XHRkYXRhU3RvcmUuaWQgPSBpZDtcblx0XHRkZWxldGUgZGF0YVN0b3JlLmtleXM7XG5cdFx0ZGF0YVN0b3JlLnVuaXF1ZVZhbHVlcyA9IHt9O1xuXG5cdFx0aWYgKGRhdGFUeXBlID09PSAnY3N2Jykge1xuXHRcdFx0TXVsdGlDaGFydGluZy5wcm90b3R5cGUuY29udmVydFRvQXJyYXkoe1xuXHRcdFx0XHRzdHJpbmcgOiBkYXRhU3BlY3MuZGF0YVNvdXJjZSxcblx0XHRcdFx0ZGVsaW1pdGVyIDogZGF0YVNwZWNzLmRlbGltaXRlcixcblx0XHRcdFx0c3RydWN0dXJlIDogZGF0YVNwZWNzLnN0cnVjdHVyZSxcblx0XHRcdFx0Y2FsbGJhY2sgOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrSGVscGVyRm4oZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNhbGxiYWNrSGVscGVyRm4oZGF0YVNvdXJjZSk7XG5cdFx0fVxuXG5cdFx0Ly8gd2luLmRpc3BhdGNoRXZlbnQobmV3IHdpbi5DdXN0b21FdmVudCgnZGF0YUFkZGVkJywgeydkZXRhaWwnIDoge1xuXHRcdC8vIFx0J2lkJzogaWQsXG5cdFx0Ly8gXHQnZGF0YScgOiBKU09ORGF0YVxuXHRcdC8vIH19KSk7XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gZ2V0IHRoZSBqc29uZGF0YSBvZiB0aGUgZGF0YSBvYmplY3Rcblx0ZGF0YVN0b3JlUHJvdG8uZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZGF0YVN0b3JhZ2VbdGhpcy5pZF07XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gZ2V0IGNoaWxkIGRhdGEgb2JqZWN0IGFmdGVyIGFwcGx5aW5nIGZpbHRlciBvbiB0aGUgcGFyZW50IGRhdGEuXG5cdC8vIEBwYXJhbXMge2ZpbHRlcnN9IC0gVGhpcyBjYW4gYmUgYSBmaWx0ZXIgZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2YgZmlsdGVyIGZ1bmN0aW9ucy5cblx0ZGF0YVN0b3JlUHJvdG8uZ2V0RGF0YSA9IGZ1bmN0aW9uIChmaWx0ZXJzKSB7XG5cdFx0dmFyIGRhdGEgPSB0aGlzLFxuXHRcdFx0aWQgPSBkYXRhLmlkLFxuXHRcdFx0ZmlsdGVyTGluayA9IGxpYi5maWx0ZXJMaW5rO1xuXHRcdC8vIElmIG5vIHBhcmFtZXRlciBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIHRoZSB1bmZpbHRlcmVkIGRhdGEuXG5cdFx0aWYgKCFmaWx0ZXJzKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVN0b3JhZ2VbaWRdO1xuXHRcdH1cblx0XHQvLyBJZiBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgZmlsdGVyIHRoZW4gcmV0dXJuIHRoZSBmaWx0ZXJlZCBkYXRhIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgb3ZlciB0aGUgZGF0YS5cblx0XHRlbHNlIHtcblx0XHRcdGxldCByZXN1bHQgPSBbXSxcblx0XHRcdFx0aSxcblx0XHRcdFx0bmV3RGF0YSxcblx0XHRcdFx0bGlua0RhdGEsXG5cdFx0XHRcdG5ld0lkLFxuXHRcdFx0XHRmaWx0ZXIsXG5cdFx0XHRcdGZpbHRlckZuLFxuXHRcdFx0XHRkYXRhbGlua3MsXG5cdFx0XHRcdGZpbHRlcklELFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRuZXdEYXRhT2JqLFxuXHRcdFx0XHRpc0ZpbHRlckFycmF5ID0gZmlsdGVycyBpbnN0YW5jZW9mIEFycmF5LFxuXHRcdFx0XHRsZW4gPSBpc0ZpbHRlckFycmF5ID8gZmlsdGVycy5sZW5ndGggOiAxO1xuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0ZmlsdGVyID0gZmlsdGVyc1tpXSB8fCBmaWx0ZXJzO1xuXHRcdFx0XHRmaWx0ZXJGbiA9IGZpbHRlci5nZXRGaWx0ZXIoKTtcblx0XHRcdFx0dHlwZSA9IGZpbHRlci50eXBlO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgZmlsdGVyRm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRuZXdEYXRhID0gZXhlY3V0ZVByb2Nlc3Nvcih0eXBlLCBmaWx0ZXJGbiwgZGF0YVN0b3JhZ2VbaWRdKTtcblxuXHRcdFx0XHRcdG5ld0RhdGFPYmogPSBuZXcgRGF0YVN0b3JlKG5ld0RhdGEpO1xuXHRcdFx0XHRcdG5ld0lkID0gbmV3RGF0YU9iai5pZDtcblx0XHRcdFx0XHRwYXJlbnRTdG9yZVtuZXdJZF0gPSBkYXRhO1xuXG5cdFx0XHRcdFx0ZGF0YVN0b3JhZ2VbbmV3SWRdID0gbmV3RGF0YTtcblx0XHRcdFx0XHRyZXN1bHQucHVzaChuZXdEYXRhT2JqKTtcblxuXHRcdFx0XHRcdC8vUHVzaGluZyB0aGUgaWQgYW5kIGZpbHRlciBvZiBjaGlsZCBjbGFzcyB1bmRlciB0aGUgcGFyZW50IGNsYXNzZXMgaWQuXG5cdFx0XHRcdFx0bGlua0RhdGEgPSBsaW5rU3RvcmVbaWRdIHx8IChsaW5rU3RvcmVbaWRdID0ge1xuXHRcdFx0XHRcdFx0bGluayA6IFtdLFxuXHRcdFx0XHRcdFx0ZmlsdGVyIDogW11cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRsaW5rRGF0YS5saW5rLnB1c2gobmV3SWQpO1xuXHRcdFx0XHRcdGxpbmtEYXRhLmZpbHRlci5wdXNoKGZpbHRlcik7XG5cblx0XHRcdFx0XHQvLyBTdG9yaW5nIHRoZSBkYXRhIG9uIHdoaWNoIHRoZSBmaWx0ZXIgaXMgYXBwbGllZCB1bmRlciB0aGUgZmlsdGVyIGlkLlxuXHRcdFx0XHRcdGZpbHRlcklEID0gZmlsdGVyLmdldElEKCk7XG5cdFx0XHRcdFx0ZGF0YWxpbmtzID0gZmlsdGVyTGlua1tmaWx0ZXJJRF0gfHwgKGZpbHRlckxpbmtbZmlsdGVySURdID0gW10pO1xuXHRcdFx0XHRcdGRhdGFsaW5rcy5wdXNoKG5ld0RhdGFPYmopO1xuXG5cdFx0XHRcdFx0Ly8gc2V0dGluZyB0aGUgY3VycmVudCBpZCBhcyB0aGUgbmV3SUQgc28gdGhhdCB0aGUgbmV4dCBmaWx0ZXIgaXMgYXBwbGllZCBvbiB0aGUgY2hpbGQgZGF0YTtcblx0XHRcdFx0XHRpZCA9IG5ld0lkO1xuXHRcdFx0XHRcdGRhdGEgPSBuZXdEYXRhT2JqO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKGlzRmlsdGVyQXJyYXkgPyByZXN1bHQgOiByZXN1bHRbMF0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBGdW5jdGlvbiB0byBkZWxldGUgdGhlIGN1cnJlbnQgZGF0YSBmcm9tIHRoZSBkYXRhU3RvcmFnZSBhbmQgYWxzbyBhbGwgaXRzIGNoaWxkcyByZWN1cnNpdmVseVxuXHRkYXRhU3RvcmVQcm90by5kZWxldGVEYXRhID0gZnVuY3Rpb24gKG9wdGlvbmFsSWQpIHtcblx0XHR2YXIgZGF0YVN0b3JlID0gdGhpcyxcblx0XHRcdGlkID0gb3B0aW9uYWxJZCB8fCBkYXRhU3RvcmUuaWQsXG5cdFx0XHRsaW5rRGF0YSA9IGxpbmtTdG9yZVtpZF0sXG5cdFx0XHRmbGFnO1xuXG5cdFx0aWYgKGxpbmtEYXRhKSB7XG5cdFx0XHRsZXQgaSxcblx0XHRcdFx0bGluayA9IGxpbmtEYXRhLmxpbmssXG5cdFx0XHRcdGxlbiA9IGxpbmsubGVuZ3RoO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArKykge1xuXHRcdFx0XHRkYXRhU3RvcmUuZGVsZXRlRGF0YShsaW5rW2ldKTtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBsaW5rU3RvcmVbaWRdO1xuXHRcdH1cblxuXHRcdGZsYWcgPSBkZWxldGUgZGF0YVN0b3JhZ2VbaWRdO1xuXHRcdHdpbi5kaXNwYXRjaEV2ZW50KG5ldyB3aW4uQ3VzdG9tRXZlbnQoJ2RhdGFEZWxldGVkJywgeydkZXRhaWwnIDoge1xuXHRcdFx0J2lkJzogaWQsXG5cdFx0fX0pKTtcblx0XHRyZXR1cm4gZmxhZztcblx0fTtcblxuXHQvLyBGdW5jdGlvbiB0byBnZXQgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGRhdGFcblx0ZGF0YVN0b3JlUHJvdG8uZ2V0SUQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaWQ7XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gbW9kaWZ5IGRhdGFcblx0ZGF0YVN0b3JlUHJvdG8ubW9kaWZ5RGF0YSA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGF0YVN0b3JlID0gdGhpcztcblxuXHRcdGRhdGFTdG9yYWdlW2RhdGFTdG9yZS5pZF0gPSBbXTtcblx0XHRkYXRhU3RvcmUuc2V0RGF0YShhcmd1bWVudHMpO1xuXHRcdHdpbi5kaXNwYXRjaEV2ZW50KG5ldyB3aW4uQ3VzdG9tRXZlbnQoJ2RhdGFNb2RpZmllZCcsIHsnZGV0YWlsJyA6IHtcblx0XHRcdCdpZCc6IGRhdGFTdG9yZS5pZFxuXHRcdH19KSk7XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gYWRkIGRhdGEgdG8gdGhlIGRhdGFTdG9yYWdlIGFzeW5jaHJvbm91c2x5IHZpYSBhamF4XG5cdGRhdGFTdG9yZVByb3RvLnNldERhdGFVcmwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRhdGFTdG9yZSA9IHRoaXMsXG5cdFx0XHRhcmd1bWVudCA9IGFyZ3VtZW50c1swXSxcblx0XHRcdGRhdGFTb3VyY2UgPSBhcmd1bWVudC5kYXRhU291cmNlLFxuXHRcdFx0ZGF0YVR5cGUgPSBhcmd1bWVudC5kYXRhVHlwZSxcblx0XHRcdGNhbGxiYWNrID0gYXJndW1lbnQuY2FsbGJhY2ssXG5cdFx0XHRjYWxsYmFja0FyZ3MgPSBhcmd1bWVudC5jYWxsYmFja0FyZ3MsXG5cdFx0XHRkYXRhO1xuXG5cdFx0TXVsdGlDaGFydGluZy5wcm90b3R5cGUuYWpheCh7XG5cdFx0XHR1cmwgOiBkYXRhU291cmNlLFxuXHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0XHRkYXRhID0gZGF0YVR5cGUgPT09ICdqc29uJyA/IEpTT04ucGFyc2Uoc3RyaW5nKSA6IHN0cmluZztcblx0XHRcdFx0ZGF0YVN0b3JlLnNldERhdGEoe1xuXHRcdFx0XHRcdGRhdGFTb3VyY2UgOiBkYXRhLFxuXHRcdFx0XHRcdGRhdGFUeXBlIDogZGF0YVR5cGUsXG5cdFx0XHRcdH0sIGNhbGxiYWNrKTtcblx0XHRcdH0sXG5cblx0XHRcdGVycm9yIDogZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGNhbGxiYWNrQXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvLyBGdW50aW9uIHRvIGdldCBhbGwgdGhlIGtleXMgb2YgdGhlIEpTT04gZGF0YVxuXHRkYXRhU3RvcmVQcm90by5nZXRLZXlzID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkYXRhU3RvcmUgPSB0aGlzLFxuXHRcdFx0ZGF0YSA9IGRhdGFTdG9yYWdlW2RhdGFTdG9yZS5pZF0sXG5cdFx0XHRpbnRlcm5hbERhdGEgPSBkYXRhWzBdLFxuXHRcdFx0a2V5cyA9IGRhdGFTdG9yZS5rZXlzO1xuXG5cdFx0aWYgKGtleXMpIHtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH1cblx0XHRpZiAoaW50ZXJuYWxEYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdHJldHVybiAoZGF0YVN0b3JlLmtleXMgPSBpbnRlcm5hbERhdGEpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChpbnRlcm5hbERhdGEgaW5zdGFuY2VvZiBPYmplY3QpIHtcblx0XHRcdHJldHVybiAoZGF0YVN0b3JlLmtleXMgPSBPYmplY3Qua2V5cyhpbnRlcm5hbERhdGEpKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRnVudGlvbiB0byBnZXQgYWxsIHRoZSB1bmlxdWUgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gYSBrZXlcblx0ZGF0YVN0b3JlUHJvdG8uZ2V0VW5pcXVlVmFsdWVzID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdHZhciBkYXRhU3RvcmUgPSB0aGlzLFxuXHRcdFx0ZGF0YSA9IGRhdGFTdG9yYWdlW2RhdGFTdG9yZS5pZF0sXG5cdFx0XHRpbnRlcm5hbERhdGEgPSBkYXRhWzBdLFxuXHRcdFx0aXNBcnJheSA9IGludGVybmFsRGF0YSBpbnN0YW5jZW9mIEFycmF5LFxuXHRcdFx0dW5pcXVlVmFsdWVzID0gZGF0YVN0b3JlLnVuaXF1ZVZhbHVlc1trZXldLFxuXHRcdFx0dGVtcFVuaXF1ZVZhbHVlcyA9IHt9LFxuXHRcdFx0bGVuID0gZGF0YS5sZW5ndGgsXG5cdFx0XHRpO1xuXG5cdFx0aWYgKHVuaXF1ZVZhbHVlcykge1xuXHRcdFx0cmV0dXJuIHVuaXF1ZVZhbHVlcztcblx0XHR9XG5cblx0XHRpZiAoaXNBcnJheSkge1xuXHRcdFx0aSA9IDE7XG5cdFx0XHRrZXkgPSBkYXRhU3RvcmUuZ2V0S2V5cygpLmZpbmRJbmRleChmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC50b1VwcGVyQ2FzZSgpID09PSBrZXkudG9VcHBlckNhc2UoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGkgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IGlzQXJyYXkgPyAxIDogMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpbnRlcm5hbERhdGEgPSBpc0FycmF5ID8gZGF0YVtpXVtrZXldIDogZGF0YVtpXVtrZXldO1xuXHRcdFx0IXRlbXBVbmlxdWVWYWx1ZXNbaW50ZXJuYWxEYXRhXSAmJiAodGVtcFVuaXF1ZVZhbHVlc1tpbnRlcm5hbERhdGFdID0gdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChkYXRhU3RvcmUudW5pcXVlVmFsdWVzW2tleV0gPSBPYmplY3Qua2V5cyh0ZW1wVW5pcXVlVmFsdWVzKSk7XG5cdH07XG59KTsiLCJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KE11bHRpQ2hhcnRpbmcpO1xuICAgIH1cbn0pKGZ1bmN0aW9uIChNdWx0aUNoYXJ0aW5nKSB7XG5cblx0dmFyIGxpYiA9IE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLmxpYixcblx0XHRmaWx0ZXJTdG9yZSA9IGxpYi5maWx0ZXJTdG9yZSA9IHt9LFxuXHRcdGZpbHRlckxpbmsgPSBsaWIuZmlsdGVyTGluayA9IHt9LFxuXHRcdGZpbHRlcklkQ291bnQgPSAwLFxuXHRcdGRhdGFTdG9yYWdlID0gbGliLmRhdGFTdG9yYWdlLFxuXHRcdHBhcmVudFN0b3JlID0gbGliLnBhcmVudFN0b3JlLFxuXHRcdHdpbiA9IE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLndpbixcblx0XHQvLyBDb25zdHJ1Y3RvciBjbGFzcyBmb3IgRGF0YVByb2Nlc3Nvci5cblx0XHREYXRhUHJvY2Vzc29yID0gZnVuY3Rpb24gKCkge1xuXHQgICAgXHR2YXIgbWFuYWdlciA9IHRoaXM7XG5cdCAgICBcdG1hbmFnZXIuYWRkUnVsZShhcmd1bWVudHMpO1xuXHRcdH0sXG5cdFx0XG5cdFx0ZGF0YVByb2Nlc3NvclByb3RvID0gRGF0YVByb2Nlc3Nvci5wcm90b3R5cGUsXG5cblx0XHQvLyBGdW5jdGlvbiB0byB1cGRhdGUgZGF0YSBvbiBjaGFuZ2Ugb2YgZmlsdGVyLlxuXHRcdHVwZGF0YUZpbHRlclByb2Nlc3NvciA9IGZ1bmN0aW9uIChpZCwgY29weVBhcmVudFRvQ2hpbGQpIHtcblx0XHRcdHZhciBpLFxuXHRcdFx0XHRkYXRhID0gZmlsdGVyTGlua1tpZF0sXG5cdFx0XHRcdEpTT05EYXRhLFxuXHRcdFx0XHRkYXR1bSxcblx0XHRcdFx0ZGF0YUlkLFxuXHRcdFx0XHRsZW4gPSBkYXRhLmxlbmd0aDtcblxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArKykge1xuXHRcdFx0XHRkYXR1bSA9IGRhdGFbaV07XG5cdFx0XHRcdGRhdGFJZCA9IGRhdHVtLmlkO1xuXHRcdFx0XHRpZiAoIWxpYi50ZW1wRGF0YVVwZGF0ZWRbZGF0YUlkXSkge1xuXHRcdFx0XHRcdGlmIChwYXJlbnRTdG9yZVtkYXRhSWRdICYmIGRhdGFTdG9yYWdlW2RhdGFJZF0pIHtcblx0XHRcdFx0XHRcdEpTT05EYXRhID0gcGFyZW50U3RvcmVbZGF0YUlkXS5nZXREYXRhKCk7XG5cdFx0XHRcdFx0XHRkYXR1bS5tb2RpZnlEYXRhKGNvcHlQYXJlbnRUb0NoaWxkID8gSlNPTkRhdGEgOiBmaWx0ZXJTdG9yZVtpZF0oSlNPTkRhdGEpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgcGFyZW50U3RvcmVbZGF0YUlkXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpYi50ZW1wRGF0YVVwZGF0ZWQgPSB7fTtcblx0XHR9O1xuXG5cdE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLmNyZWF0ZURhdGFQcm9jZXNzb3IgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRhUHJvY2Vzc29yKGFyZ3VtZW50cyk7XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gYWRkIGZpbHRlciBpbiB0aGUgZmlsdGVyIHN0b3JlXG5cdGRhdGFQcm9jZXNzb3JQcm90by5hZGRSdWxlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBmaWx0ZXIgPSB0aGlzLFxuXHRcdFx0b2xkSWQgPSBmaWx0ZXIuaWQsXG5cdFx0XHRhcmd1bWVudCA9IGFyZ3VtZW50c1swXSxcblx0XHRcdGZpbHRlckZuID0gYXJndW1lbnQucnVsZSB8fCBhcmd1bWVudCxcblx0XHRcdGlkID0gYXJndW1lbnQudHlwZSxcblx0XHRcdHR5cGUgPSBhcmd1bWVudC50eXBlO1xuXG5cdFx0aWQgPSBvbGRJZCB8fCBpZCB8fCAnZmlsdGVyU3RvcmUnICsgZmlsdGVySWRDb3VudCArKztcblx0XHRmaWx0ZXJTdG9yZVtpZF0gPSBmaWx0ZXJGbjtcblxuXHRcdGZpbHRlci5pZCA9IGlkO1xuXHRcdGZpbHRlci50eXBlID0gdHlwZTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgZGF0YSBvbiB3aGljaCB0aGUgZmlsdGVyIGlzIGFwcGxpZWQgYW5kIGFsc28gb24gdGhlIGNoaWxkIGRhdGEuXG5cdFx0aWYgKGZpbHRlckxpbmtbaWRdKSB7XG5cdFx0XHR1cGRhdGFGaWx0ZXJQcm9jZXNzb3IoaWQpO1xuXHRcdH1cblxuXHRcdHdpbi5kaXNwYXRjaEV2ZW50KG5ldyB3aW4uQ3VzdG9tRXZlbnQoJ2ZpbHRlckFkZGVkJywgeydkZXRhaWwnIDoge1xuXHRcdFx0J2lkJzogaWQsXG5cdFx0XHQnZmlsdGVyJyA6IGZpbHRlckZuXG5cdFx0fX0pKTtcblx0fTtcblxuXHQvLyBGdW50aW9uIHRvIGdldCB0aGUgZmlsdGVyIG1ldGhvZC5cblx0ZGF0YVByb2Nlc3NvclByb3RvLmdldEZpbHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZmlsdGVyU3RvcmVbdGhpcy5pZF07XG5cdH07XG5cblx0Ly8gRnVuY3Rpb24gdG8gZ2V0IHRoZSBJRCBvZiB0aGUgZmlsdGVyLlxuXHRkYXRhUHJvY2Vzc29yUHJvdG8uZ2V0SUQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaWQ7XG5cdH07XG5cblxuXHRkYXRhUHJvY2Vzc29yUHJvdG8uZGVsZXRlRmlsdGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBmaWx0ZXIgPSB0aGlzLFxuXHRcdFx0aWQgPSBmaWx0ZXIuaWQ7XG5cblx0XHRmaWx0ZXJMaW5rW2lkXSAmJiB1cGRhdGFGaWx0ZXJQcm9jZXNzb3IoaWQsIHRydWUpO1xuXG5cdFx0ZGVsZXRlIGZpbHRlclN0b3JlW2lkXTtcblx0XHRkZWxldGUgZmlsdGVyTGlua1tpZF07XG5cdH07XG5cblx0ZGF0YVByb2Nlc3NvclByb3RvLmZpbHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmFkZFJ1bGUoXG5cdFx0XHR7XHRydWxlIDogYXJndW1lbnRzWzBdLFxuXHRcdFx0XHR0eXBlIDogJ2ZpbHRlcidcblx0XHRcdH1cblx0XHQpO1xuXHR9O1xuXG5cdGRhdGFQcm9jZXNzb3JQcm90by5zb3J0ID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuYWRkUnVsZShcblx0XHRcdHtcdHJ1bGUgOiBhcmd1bWVudHNbMF0sXG5cdFx0XHRcdHR5cGUgOiAnc29ydCdcblx0XHRcdH1cblx0XHQpO1xuXHR9O1xuXG5cdGRhdGFQcm9jZXNzb3JQcm90by5tYXAgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5hZGRSdWxlKFxuXHRcdFx0e1x0cnVsZSA6IGFyZ3VtZW50c1swXSxcblx0XHRcdFx0dHlwZSA6ICdtYXAnXG5cdFx0XHR9XG5cdFx0KTtcblx0fTtcbn0pOyIsIlxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoTXVsdGlDaGFydGluZyk7XG4gICAgfVxufSkoZnVuY3Rpb24gKE11bHRpQ2hhcnRpbmcpIHtcblxuICAgIHZhciBleHRlbmQyID0gTXVsdGlDaGFydGluZy5wcm90b3R5cGUubGliLmV4dGVuZDI7XG4gICAgLy9mdW5jdGlvbiB0byBjb252ZXJ0IGRhdGEsIGl0IHJldHVybnMgZmMgc3VwcG9ydGVkIEpTT05cbiAgICBmdW5jdGlvbiBjb252ZXJ0RGF0YSgpIHtcbiAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgICAgICAganNvbkRhdGEgPSBhcmd1bWVudC5qc29uRGF0YSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24gPSBhcmd1bWVudC5jb25maWcsXG4gICAgICAgICAgICBjYWxsYmFja0ZOID0gYXJndW1lbnQuY2FsbGJhY2tGTixcbiAgICAgICAgICAgIGpzb25DcmVhdG9yID0gZnVuY3Rpb24oanNvbkRhdGEsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgY29uZiA9IGNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHNlcmllc1R5cGUgPSBjb25mICYmIGNvbmYuc2VyaWVzVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ21zJyA6IGZ1bmN0aW9uKGpzb25EYXRhLCBjb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhNYXRjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuRGltZW5zaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5NZWFzdXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5EYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY2F0ZWdvcmllcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3J5JzogWyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5EaW1lbnNpb24gPSAgY29uZmlndXJhdGlvbi5kaW1lbnNpb24ubGVuZ3RoOyBpIDwgbGVuRGltZW5zaW9uOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhNYXRjaCA9IGpzb25EYXRhWzBdLmluZGV4T2YoY29uZmlndXJhdGlvbi5kaW1lbnNpb25baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXhNYXRjaCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMSwgbGVuRGF0YSA9IGpzb25EYXRhLmxlbmd0aDsgaiA8IGxlbkRhdGE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uY2F0ZWdvcmllc1swXS5jYXRlZ29yeS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xhYmVsJyA6IGpzb25EYXRhW2pdW2luZGV4TWF0Y2hdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5kYXRhc2V0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuTWVhc3VyZSA9IGNvbmZpZ3VyYXRpb24ubWVhc3VyZS5sZW5ndGg7IGkgPCBsZW5NZWFzdXJlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhNYXRjaCA9IGpzb25EYXRhWzBdLmluZGV4T2YoY29uZmlndXJhdGlvbi5tZWFzdXJlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4TWF0Y2ggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldFtpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2VyaWVzbmFtZScgOiBjb25maWd1cmF0aW9uLm1lYXN1cmVbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihqID0gMSwgbGVuRGF0YSA9IGpzb25EYXRhLmxlbmd0aDsgaiA8IGxlbkRhdGE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldFtpXS5kYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnIDoganNvbkRhdGFbal1baW5kZXhNYXRjaF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3MnIDogZnVuY3Rpb24oanNvbkRhdGEsIGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleE1hdGNoTGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4TWF0Y2hWYWx1ZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbkRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGosXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleE1hdGNoTGFiZWwgPSBqc29uRGF0YVswXS5pbmRleE9mKGNvbmZpZ3VyYXRpb24uZGltZW5zaW9uWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleE1hdGNoVmFsdWUgPSBqc29uRGF0YVswXS5pbmRleE9mKGNvbmZpZ3VyYXRpb24ubWVhc3VyZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMSwgbGVuRGF0YSA9IGpzb25EYXRhLmxlbmd0aDsgaiA8IGxlbkRhdGE7IGorKykgeyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGpzb25EYXRhW2pdW2luZGV4TWF0Y2hMYWJlbF07ICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ganNvbkRhdGFbal1baW5kZXhNYXRjaFZhbHVlXTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsYWJlbCcgOiBsYWJlbCB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZScgOiB2YWx1ZSB8fCAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBqc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0cycgOiBmdW5jdGlvbihqc29uRGF0YSwgY29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0ge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4TWF0Y2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbkRpbWVuc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuTWVhc3VyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5kYXRhc2V0c1swXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldHNbMF0uY2F0ZWdvcnkgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXRzWzBdLmNhdGVnb3J5LmRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5EaW1lbnNpb24gPSAgY29uZmlndXJhdGlvbi5kaW1lbnNpb24ubGVuZ3RoOyBpIDwgbGVuRGltZW5zaW9uOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhNYXRjaCA9IGpzb25EYXRhWzBdLmluZGV4T2YoY29uZmlndXJhdGlvbi5kaW1lbnNpb25baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXhNYXRjaCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMSwgbGVuRGF0YSA9IGpzb25EYXRhLmxlbmd0aDsgaiA8IGxlbkRhdGE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldHNbMF0uY2F0ZWdvcnkuZGF0YS5wdXNoKGpzb25EYXRhW2pdW2luZGV4TWF0Y2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXRzWzBdLmRhdGFzZXQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXRzWzBdLmRhdGFzZXRbMF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uLmRhdGFzZXRzWzBdLmRhdGFzZXRbMF0uc2VyaWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuTWVhc3VyZSA9IGNvbmZpZ3VyYXRpb24ubWVhc3VyZS5sZW5ndGg7IGkgPCBsZW5NZWFzdXJlOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhNYXRjaCA9IGpzb25EYXRhWzBdLmluZGV4T2YoY29uZmlndXJhdGlvbi5tZWFzdXJlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4TWF0Y2ggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldHNbMF0uZGF0YXNldFswXS5zZXJpZXNbaV0gPSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbmFtZScgOiBjb25maWd1cmF0aW9uLm1lYXN1cmVbaV0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihqID0gMSwgbGVuRGF0YSA9IGpzb25EYXRhLmxlbmd0aDsgaiA8IGxlbkRhdGE7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb24uZGF0YXNldHNbMF0uZGF0YXNldFswXS5zZXJpZXNbaV0uZGF0YS5wdXNoKGpzb25EYXRhW2pdW2luZGV4TWF0Y2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZXJpZXNUeXBlID0gc2VyaWVzVHlwZSAmJiBzZXJpZXNUeXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgc2VyaWVzVHlwZSA9IChzZXJpZXNbc2VyaWVzVHlwZV0gJiYgc2VyaWVzVHlwZSkgfHwgJ21zJztcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VyaWVzW3Nlcmllc1R5cGVdKGpzb25EYXRhLCBjb25mKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZW5lcmFsRGF0YUZvcm1hdCA9IGZ1bmN0aW9uKGpzb25EYXRhLCBjb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGpzb25EYXRhWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhbERhdGFBcnJheSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBqLFxuICAgICAgICAgICAgICAgICAgICBsZW4sXG4gICAgICAgICAgICAgICAgICAgIGxlbkdlbmVyYWxEYXRhQXJyYXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICghaXNBcnJheSl7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYWxEYXRhQXJyYXlbMF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhbERhdGFBcnJheVswXS5wdXNoKGNvbmZpZ3VyYXRpb24uZGltZW5zaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhbERhdGFBcnJheVswXSA9IGdlbmVyYWxEYXRhQXJyYXlbMF1bMF0uY29uY2F0KGNvbmZpZ3VyYXRpb24ubWVhc3VyZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGpzb25EYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmFsRGF0YUFycmF5W2krMV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbkdlbmVyYWxEYXRhQXJyYXkgPSBnZW5lcmFsRGF0YUFycmF5WzBdLmxlbmd0aDsgaiA8IGxlbkdlbmVyYWxEYXRhQXJyYXk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ganNvbkRhdGFbaV1bZ2VuZXJhbERhdGFBcnJheVswXVtqXV07ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmFsRGF0YUFycmF5W2krMV1bal0gPSB2YWx1ZSB8fCAnJzsgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbkRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcmFsRGF0YUFycmF5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGFBcnJheSxcbiAgICAgICAgICAgIGpzb24sXG4gICAgICAgICAgICBwcmVkZWZpbmVkSnNvbiA9IGNvbmZpZ3VyYXRpb24gJiYgY29uZmlndXJhdGlvbi5jb25maWc7XG5cbiAgICAgICAgaWYgKGpzb25EYXRhICYmIGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIGRhdGFBcnJheSA9IGdlbmVyYWxEYXRhRm9ybWF0KGpzb25EYXRhLCBjb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIGpzb24gPSBqc29uQ3JlYXRvcihkYXRhQXJyYXksIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgICAgICAganNvbiA9IChwcmVkZWZpbmVkSnNvbiAmJiBleHRlbmQyKGpzb24scHJlZGVmaW5lZEpzb24pKSB8fCBqc29uOyAgICBcbiAgICAgICAgICAgIHJldHVybiAoY2FsbGJhY2tGTiAmJiBjYWxsYmFja0ZOKGpzb24pKSB8fCBqc29uOyAgICBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLmRhdGFhZGFwdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY29udmVydERhdGEoYXJndW1lbnRzWzBdKTtcbiAgICB9O1xufSk7IiwiXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShNdWx0aUNoYXJ0aW5nKTtcbiAgICB9XG59KShmdW5jdGlvbiAoTXVsdGlDaGFydGluZykge1xuXG4gICAgdmFyIENoYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNoYXJ0ID0gdGhpczsgICAgICAgICAgIFxuICAgICAgICAgICAgY2hhcnQucmVuZGVyKGFyZ3VtZW50c1swXSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYXJ0UHJvdG8gPSBDaGFydC5wcm90b3R5cGUsXG4gICAgICAgIGV4dGVuZDIgPSBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5saWIuZXh0ZW5kMixcbiAgICAgICAgZGF0YWFkYXB0ZXIgPSBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5kYXRhYWRhcHRlcjtcblxuICAgIGNoYXJ0UHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2hhcnQgPSB0aGlzLFxuICAgICAgICAgICAgYXJndW1lbnQgPWFyZ3VtZW50c1swXSB8fCB7fTtcbiAgICAgICAgY2hhcnQuZ2V0SlNPTihhcmd1bWVudCk7ICAgICAgICBcblxuICAgICAgICAvL3JlbmRlciBGQyBcbiAgICAgICAgY2hhcnQuY2hhcnRPYmogPSBuZXcgRnVzaW9uQ2hhcnRzKGNoYXJ0LmNoYXJ0Q29uZmlnKTtcbiAgICAgICAgY2hhcnQuY2hhcnRPYmoucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIGNoYXJ0UHJvdG8uZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoYXJ0ID0gdGhpcyxcbiAgICAgICAgICAgIGFyZ3VtZW50ID1hcmd1bWVudHNbMF0gfHwge30sXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgY2FsbGJhY2tGTixcbiAgICAgICAgICAgIGpzb25EYXRhLFxuICAgICAgICAgICAgY2hhcnRDb25maWcgPSB7fSxcbiAgICAgICAgICAgIGRhdGFTb3VyY2UgPSB7fSxcbiAgICAgICAgICAgIGNvbmZpZ0RhdGEgPSB7fTtcbiAgICAgICAgLy9wYXJzZSBhcmd1bWVudCBpbnRvIGNoYXJ0Q29uZmlnIFxuICAgICAgICBleHRlbmQyKGNoYXJ0Q29uZmlnLGFyZ3VtZW50KTtcbiAgICAgICAgXG4gICAgICAgIC8vZGF0YSBjb25maWd1cmF0aW9uIFxuICAgICAgICBjb25maWd1cmF0aW9uID0gY2hhcnRDb25maWcuY29uZmlndXJhdGlvbiB8fCB7fTtcbiAgICAgICAgY29uZmlnRGF0YS5qc29uRGF0YSA9IGNoYXJ0Q29uZmlnLmpzb25EYXRhO1xuICAgICAgICBjb25maWdEYXRhLmNhbGxiYWNrRk4gPSBjb25maWd1cmF0aW9uLmNhbGxiYWNrO1xuICAgICAgICBjb25maWdEYXRhLmNvbmZpZyA9IGNvbmZpZ3VyYXRpb24uZGF0YTtcblxuICAgICAgICAvL3N0b3JlIGZjIHN1cHBvcnRlZCBqc29uIHRvIHJlbmRlciBjaGFydHNcbiAgICAgICAgZGF0YVNvdXJjZSA9IGRhdGFhZGFwdGVyKGNvbmZpZ0RhdGEpO1xuICAgICAgICBcbiAgICAgICAgLy9kZWxldGUgZGF0YSBjb25maWd1cmF0aW9uIHBhcnRzIGZvciBGQyBqc29uIGNvbnZlcnRlclxuICAgICAgICBkZWxldGUgY2hhcnRDb25maWcuanNvbkRhdGE7XG4gICAgICAgIGRlbGV0ZSBjaGFydENvbmZpZy5jb25maWd1cmF0aW9uO1xuICAgICAgICBcbiAgICAgICAgLy9zZXQgZGF0YSBzb3VyY2UgaW50byBjaGFydCBjb25maWd1cmF0aW9uXG4gICAgICAgIGNoYXJ0Q29uZmlnLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xuICAgICAgICBjaGFydC5jaGFydENvbmZpZyA9IGNoYXJ0Q29uZmlnOyAgICAgICAgXG4gICAgfTtcblxuICAgIGNoYXJ0UHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2hhcnQgPSB0aGlzLFxuICAgICAgICAgICAgYXJndW1lbnQgPWFyZ3VtZW50c1swXSB8fCB7fTtcblxuICAgICAgICBjaGFydC5nZXRKU09OKGFyZ3VtZW50KTtcbiAgICAgICAgY2hhcnQuY2hhcnRPYmouY2hhcnRUeXBlKGNoYXJ0LmNoYXJ0Q29uZmlnLnR5cGUpO1xuICAgICAgICBjaGFydC5jaGFydE9iai5zZXRKU09ORGF0YShjaGFydC5jaGFydENvbmZpZy5kYXRhU291cmNlKTtcblxuICAgICAgICAvL1RvIERvIDogIHJlbW92ZSBzZXRUaW1lb3V0KClcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGFydC5jaGFydE9iai5yZW5kZXIoKTtcbiAgICAgICAgfSwxMCk7XG4gICAgfTtcblxuICAgIE11bHRpQ2hhcnRpbmcucHJvdG90eXBlLmNyZWF0ZUNoYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENoYXJ0KGFyZ3VtZW50c1swXSk7XG4gICAgfTtcbn0pOyIsIlxuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KE11bHRpQ2hhcnRpbmcpO1xuICAgIH1cbn0pKGZ1bmN0aW9uIChNdWx0aUNoYXJ0aW5nKSB7XG5cbiAgICBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5jcmVhdGVNYXRyaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KGFyZ3VtZW50c1swXSxhcmd1bWVudHNbMV0pO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlQ2hhcnQgPSBNdWx0aUNoYXJ0aW5nLnByb3RvdHlwZS5jcmVhdGVDaGFydCxcbiAgICAgICAgTWF0cml4ID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWF0cml4ID0gdGhpcztcbiAgICAgICAgICAgIG1hdHJpeC5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgLy9tYXRyaXggY29udGFpbmVyXG4gICAgICAgICAgICBtYXRyaXgubWF0cml4Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgbWF0cml4LmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgbWF0cml4LmRlZmF1bHRIID0gMTAwO1xuICAgICAgICAgICAgbWF0cml4LmRlZmF1bHRXID0gMTAwO1xuICAgICAgICAgICAgLy9zZXQgc3R5bGUsIGF0dHIgb24gbWF0cml4IGNvbnRhaW5lciBcbiAgICAgICAgICAgIG1hdHJpeC5zZXRBdHRyQ29udGFpbmVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYXJ0SWQgPSAwO1xuXG4gICAgcHJvdG9NYXRyaXggPSBNYXRyaXgucHJvdG90eXBlO1xuXG4gICAgLy9mdW5jdGlvbiB0byBzZXQgc3R5bGUsIGF0dHIgb24gbWF0cml4IGNvbnRhaW5lclxuICAgIHByb3RvTWF0cml4LnNldEF0dHJDb250YWluZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMsXG4gICAgICAgICAgICBjb250YWluZXIgPSBtYXRyaXggJiYgbWF0cml4Lm1hdHJpeENvbnRhaW5lcjtcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnOyAgICAgICAgXG4gICAgfTtcblxuICAgIC8vZnVuY3Rpb24gdG8gc2V0IGhlaWdodCwgd2lkdGggb24gbWF0cml4IGNvbnRhaW5lclxuICAgIHByb3RvTWF0cml4LnNldENvbnRhaW5lclJlc29sdXRpb24gPSBmdW5jdGlvbiAoaGVpZ2h0QXJyLCB3aWR0aEFycikge1xuICAgICAgICB2YXIgbWF0cml4ID0gdGhpcyxcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IG1hdHJpeCAmJiBtYXRyaXgubWF0cml4Q29udGFpbmVyLFxuICAgICAgICAgICAgaGVpZ2h0ID0gMCxcbiAgICAgICAgICAgIHdpZHRoID0gMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgbGVuO1xuICAgICAgICBmb3IoaSA9IDAsIGxlbiA9IGhlaWdodEFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IGhlaWdodEFycltpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gd2lkdGhBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHdpZHRoICs9IHdpZHRoQXJyW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLy9mdW5jdGlvbiB0byBkcmF3IG1hdHJpeFxuICAgIHByb3RvTWF0cml4LmRyYXcgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWF0cml4ID0gdGhpcyxcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24gPSBtYXRyaXggJiYgbWF0cml4LmNvbmZpZ3VyYXRpb24gfHwge30sXG4gICAgICAgICAgICBjb25maWcgPSBjb25maWd1cmF0aW9uLmNvbmZpZyxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgICAgICAgLy9zdG9yZSB2aXJ0dWFsIG1hdHJpeCBmb3IgdXNlciBnaXZlbiBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICBjb25maWdNYW5hZ2VyID0gY29uZmlndXJhdGlvbiAmJiBtYXRyaXggJiYgbWF0cml4LmRyYXdNYW5hZ2VyKGNvbmZpZ3VyYXRpb24pLFxuICAgICAgICAgICAgbGVuID0gY29uZmlnTWFuYWdlciAmJiBjb25maWdNYW5hZ2VyLmxlbmd0aCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyID0gW10sXG4gICAgICAgICAgICBwYXJlbnRDb250YWluZXIgPSBtYXRyaXggJiYgbWF0cml4Lm1hdHJpeENvbnRhaW5lcixcbiAgICAgICAgICAgIGxlbkM7XG4gICAgICAgIFxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgcGxhY2VIb2xkZXJbaV0gPSBbXTtcbiAgICAgICAgICAgIGZvcihqID0gMCwgbGVuQyA9IGNvbmZpZ01hbmFnZXJbaV0ubGVuZ3RoOyBqIDwgbGVuQzsgaisrKXtcbiAgICAgICAgICAgICAgICAvL3N0b3JlIGNlbGwgb2JqZWN0IGluIGxvZ2ljYWwgbWF0cml4IHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgIHBsYWNlSG9sZGVyW2ldW2pdID0gbmV3IENlbGwoY29uZmlnTWFuYWdlcltpXVtqXSxwYXJlbnRDb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hdHJpeC5wbGFjZUhvbGRlciA9IFtdO1xuICAgICAgICBtYXRyaXgucGxhY2VIb2xkZXIgPSBwbGFjZUhvbGRlcjtcbiAgICB9O1xuXG4gICAgLy9mdW5jdGlvbiB0byBtYW5hZ2UgbWF0cml4IGRyYXdcbiAgICBwcm90b01hdHJpeC5kcmF3TWFuYWdlciA9IGZ1bmN0aW9uIChjb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBsZW5Sb3cgPSBjb25maWd1cmF0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIC8vc3RvcmUgbWFwcGluZyBtYXRyaXggYmFzZWQgb24gdGhlIHVzZXIgY29uZmlndXJhdGlvblxuICAgICAgICAgICAgbWFwQXJyID0gbWF0cml4Lm1hdHJpeE1hbmFnZXIoY29uZmlndXJhdGlvbiksXG4gICAgICAgICAgICBwcm9jZXNzZWRDb25maWcgPSBtYXRyaXguc2V0UGxjSGxkcihtYXBBcnIsIGNvbmZpZ3VyYXRpb24pLFxuICAgICAgICAgICAgaGVpZ2h0QXJyID0gbWF0cml4LmdldFJvd0hlaWdodChtYXBBcnIpLFxuICAgICAgICAgICAgd2lkdGhBcnIgPSBtYXRyaXguZ2V0Q29sV2lkdGgobWFwQXJyKSxcbiAgICAgICAgICAgIGRyYXdNYW5hZ2VyT2JqQXJyID0gW10sXG4gICAgICAgICAgICBsZW5Sb3csXG4gICAgICAgICAgICBsZW5DZWxsLFxuICAgICAgICAgICAgbWF0cml4UG9zWCA9IG1hdHJpeC5nZXRQb3Mod2lkdGhBcnIpLFxuICAgICAgICAgICAgbWF0cml4UG9zWSA9IG1hdHJpeC5nZXRQb3MoaGVpZ2h0QXJyKSxcbiAgICAgICAgICAgIHJvd3NwYW4sXG4gICAgICAgICAgICBjb2xzcGFuLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICBsZWZ0LFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBjaGFydCxcbiAgICAgICAgICAgIGh0bWw7XG4gICAgICAgIC8vZnVuY3Rpb24gdG8gc2V0IGhlaWdodCwgd2lkdGggb24gbWF0cml4IGNvbnRhaW5lclxuICAgICAgICBtYXRyaXguc2V0Q29udGFpbmVyUmVzb2x1dGlvbihoZWlnaHRBcnIsIHdpZHRoQXJyKTtcbiAgICAgICAgLy9jYWxjdWxhdGUgY2VsbCBwb3NpdGlvbiBhbmQgaGVpaHQgYW5kIFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuUm93OyBpKyspIHsgIFxuICAgICAgICAgICAgZHJhd01hbmFnZXJPYmpBcnJbaV0gPSBbXTsgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKGogPSAwLCBsZW5DZWxsID0gY29uZmlndXJhdGlvbltpXS5sZW5ndGg7IGogPCBsZW5DZWxsOyBqKyspIHtcbiAgICAgICAgICAgICAgICByb3dzcGFuID0gcGFyc2VJbnQoY29uZmlndXJhdGlvbltpXVtqXSAmJiBjb25maWd1cmF0aW9uW2ldW2pdLnJvd3NwYW4gfHwgMSk7XG4gICAgICAgICAgICAgICAgY29sc3BhbiA9IHBhcnNlSW50KGNvbmZpZ3VyYXRpb25baV1bal0gJiYgY29uZmlndXJhdGlvbltpXVtqXS5jb2xzcGFuIHx8IDEpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjaGFydCA9IGNvbmZpZ3VyYXRpb25baV1bal0gJiYgY29uZmlndXJhdGlvbltpXVtqXS5jaGFydDtcbiAgICAgICAgICAgICAgICBodG1sID0gY29uZmlndXJhdGlvbltpXVtqXSAmJiBjb25maWd1cmF0aW9uW2ldW2pdLmh0bWw7XG4gICAgICAgICAgICAgICAgcm93ID0gcGFyc2VJbnQoY29uZmlndXJhdGlvbltpXVtqXS5yb3cpO1xuICAgICAgICAgICAgICAgIGNvbCA9IHBhcnNlSW50KGNvbmZpZ3VyYXRpb25baV1bal0uY29sKTtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbWF0cml4UG9zWFtjb2xdO1xuICAgICAgICAgICAgICAgIHRvcCA9IG1hdHJpeFBvc1lbcm93XTtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IG1hdHJpeFBvc1hbY29sICsgY29sc3Bhbl0gLSBsZWZ0O1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IG1hdHJpeFBvc1lbcm93ICsgcm93c3Bhbl0gLSB0b3A7XG4gICAgICAgICAgICAgICAgaWQgPSAoY29uZmlndXJhdGlvbltpXVtqXSAmJiBjb25maWd1cmF0aW9uW2ldW2pdLmlkKSB8fCBtYXRyaXguaWRDcmVhdG9yKHJvdyxjb2wpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkcmF3TWFuYWdlck9iakFycltpXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdG9wICAgICA6IHRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdCAgICA6IGxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCAgOiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICAgOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaWQgICAgICA6IGlkLFxuICAgICAgICAgICAgICAgICAgICByb3dzcGFuIDogcm93c3BhbixcbiAgICAgICAgICAgICAgICAgICAgY29sc3BhbiA6IGNvbHNwYW4sXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgICAgOiBodG1sLFxuICAgICAgICAgICAgICAgICAgICBjaGFydCAgIDogY2hhcnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgIFxuICAgICAgICByZXR1cm4gZHJhd01hbmFnZXJPYmpBcnI7XG4gICAgfTtcblxuICAgIHByb3RvTWF0cml4LmlkQ3JlYXRvciA9IGZ1bmN0aW9uKHJvdywgY29sKXtcbiAgICAgICAgY2hhcnRJZCsrO1xuICAgICAgICByZXR1cm4gJ2lkJysgY2hhcnRJZDtcbiAgICB9O1xuXG4gICAgcHJvdG9NYXRyaXguZ2V0UG9zID0gIGZ1bmN0aW9uKHNyYyl7XG4gICAgICAgIHZhciBhcnIgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gc3JjICYmIHNyYy5sZW5ndGg7XG5cbiAgICAgICAgZm9yKDsgaSA8PSBsZW47IGkrKyl7XG4gICAgICAgICAgICBhcnIucHVzaChpID8gKHNyY1tpLTFdK2FycltpLTFdKSA6IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9O1xuXG4gICAgcHJvdG9NYXRyaXguc2V0UGxjSGxkciA9IGZ1bmN0aW9uKG1hcEFyciwgY29uZmlndXJhdGlvbil7XG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLFxuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBsZW5SLFxuICAgICAgICAgICAgbGVuQztcblxuICAgICAgICBmb3IoaSA9IDAsIGxlblIgPSBtYXBBcnIubGVuZ3RoOyBpIDwgbGVuUjsgaSsrKXsgXG4gICAgICAgICAgICBmb3IoaiA9IDAsIGxlbkMgPSBtYXBBcnJbaV0ubGVuZ3RoOyBqIDwgbGVuQzsgaisrKXtcbiAgICAgICAgICAgICAgICByb3cgPSBtYXBBcnJbaV1bal0uaWQuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgICAgICAgICBjb2wgPSBtYXBBcnJbaV1bal0uaWQuc3BsaXQoJy0nKVsxXTtcblxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25bcm93XVtjb2xdLnJvdyA9IGNvbmZpZ3VyYXRpb25bcm93XVtjb2xdLnJvdyA9PT0gdW5kZWZpbmVkID8gaSA6IGNvbmZpZ3VyYXRpb25bcm93XVtjb2xdLnJvdztcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uW3Jvd11bY29sXS5jb2wgPSBjb25maWd1cmF0aW9uW3Jvd11bY29sXS5jb2wgPT09IHVuZGVmaW5lZCA/IGogOiBjb25maWd1cmF0aW9uW3Jvd11bY29sXS5jb2w7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG4gICAgfTtcblxuICAgIHByb3RvTWF0cml4LmdldFJvd0hlaWdodCA9IGZ1bmN0aW9uKG1hcEFycikge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBsZW5Sb3cgPSBtYXBBcnIgJiYgbWFwQXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGxlbkNvbCxcbiAgICAgICAgICAgIGhlaWdodCA9IFtdLFxuICAgICAgICAgICAgY3VyckhlaWdodCxcbiAgICAgICAgICAgIG1heEhlaWdodDtcbiAgICAgICAgICAgIFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuUm93OyBpKyspIHtcbiAgICAgICAgICAgIGZvcihqID0gMCwgbWF4SGVpZ2h0ID0gMCwgbGVuQ29sID0gbWFwQXJyW2ldLmxlbmd0aDsgaiA8IGxlbkNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYobWFwQXJyW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJIZWlnaHQgPSBtYXBBcnJbaV1bal0uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSBtYXhIZWlnaHQgPCBjdXJySGVpZ2h0ID8gY3VyckhlaWdodCA6IG1heEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoZWlnaHRbaV0gPSBtYXhIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH07XG5cbiAgICBwcm90b01hdHJpeC5nZXRDb2xXaWR0aCA9IGZ1bmN0aW9uKG1hcEFycikge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIGxlblJvdyA9IG1hcEFyciAmJiBtYXBBcnIubGVuZ3RoLFxuICAgICAgICAgICAgbGVuQ29sLFxuICAgICAgICAgICAgd2lkdGggPSBbXSxcbiAgICAgICAgICAgIGN1cnJXaWR0aCxcbiAgICAgICAgICAgIG1heFdpZHRoO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW5Db2wgPSBtYXBBcnJbal0ubGVuZ3RoOyBpIDwgbGVuQ29sOyBpKyspe1xuICAgICAgICAgICAgZm9yKGogPSAwLCBtYXhXaWR0aCA9IDA7IGogPCBsZW5Sb3c7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChtYXBBcnJbal1baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycldpZHRoID0gbWFwQXJyW2pdW2ldLndpZHRoOyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoID0gbWF4V2lkdGggPCBjdXJyV2lkdGggPyBjdXJyV2lkdGggOiBtYXhXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aWR0aFtpXSA9IG1heFdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH07XG5cbiAgICBwcm90b01hdHJpeC5tYXRyaXhNYW5hZ2VyID0gZnVuY3Rpb24gKGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgdmFyIG1hdHJpeCA9IHRoaXMsXG4gICAgICAgICAgICBtYXBBcnIgPSBbXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgayxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBsZW5Sb3cgPSBjb25maWd1cmF0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIGxlbkNlbGwsXG4gICAgICAgICAgICByb3dTcGFuLFxuICAgICAgICAgICAgY29sU3BhbixcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgZGVmYXVsdEggPSBtYXRyaXguZGVmYXVsdEgsXG4gICAgICAgICAgICBkZWZhdWx0VyA9IG1hdHJpeC5kZWZhdWx0VyxcbiAgICAgICAgICAgIG9mZnNldDtcbiAgICAgICAgICAgIFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuUm93OyBpKyspIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbkNlbGwgPSBjb25maWd1cmF0aW9uW2ldLmxlbmd0aDsgaiA8IGxlbkNlbGw7IGorKykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcm93U3BhbiA9IChjb25maWd1cmF0aW9uW2ldW2pdICYmIGNvbmZpZ3VyYXRpb25baV1bal0ucm93c3BhbikgfHwgMTtcbiAgICAgICAgICAgICAgICBjb2xTcGFuID0gKGNvbmZpZ3VyYXRpb25baV1bal0gJiYgY29uZmlndXJhdGlvbltpXVtqXS5jb2xzcGFuKSB8fCAxOyAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHdpZHRoID0gKGNvbmZpZ3VyYXRpb25baV1bal0gJiYgY29uZmlndXJhdGlvbltpXVtqXS53aWR0aCk7XG4gICAgICAgICAgICAgICAgd2lkdGggPSAod2lkdGggJiYgKHdpZHRoIC8gY29sU3BhbikpIHx8IGRlZmF1bHRXOyAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gKGNvbmZpZ3VyYXRpb25baV1bal0gJiYgY29uZmlndXJhdGlvbltpXVtqXS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IChoZWlnaHQgJiYgKGhlaWdodCAvIHJvd1NwYW4pKSB8fCBkZWZhdWx0SDsgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChrID0gMCwgb2Zmc2V0ID0gMDsgayA8IHJvd1NwYW47IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgY29sU3BhbjsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEFycltpICsga10gPSBtYXBBcnJbaSArIGtdID8gbWFwQXJyW2kgKyBrXSA6IFtdOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gaiArIGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKG1hcEFycltpICsga11bb2Zmc2V0XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBBcnJbaSArIGtdW29mZnNldF0gPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkIDogKGkgKyAnLScgKyBqKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA6IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXBBcnI7XG4gICAgfTtcblxuICAgIHByb3RvTWF0cml4LnVwZGF0ZSA9IGZ1bmN0aW9uIChjb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHZhciBtYXRyaXggPSB0aGlzLFxuICAgICAgICAgICAgY29uZmlnTWFuYWdlciA9IGNvbmZpZ3VyYXRpb24gJiYgbWF0cml4ICYmIG1hdHJpeC5kcmF3TWFuYWdlcihjb25maWd1cmF0aW9uKSxcbiAgICAgICAgICAgIGxlbiA9IGNvbmZpZ01hbmFnZXIgJiYgY29uZmlnTWFuYWdlci5sZW5ndGgsXG4gICAgICAgICAgICBsZW5DLFxuICAgICAgICAgICAgbGVuUGxjSGxkcixcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgayxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyID0gbWF0cml4ICYmIG1hdHJpeC5wbGFjZUhvbGRlcixcbiAgICAgICAgICAgIHBhcmVudENvbnRhaW5lciAgPSBtYXRyaXggJiYgbWF0cml4Lm1hdHJpeENvbnRhaW5lcixcbiAgICAgICAgICAgIGRpc3Bvc2FsQm94ID0gW10sXG4gICAgICAgICAgICByZWN5Y2xlZENlbGw7XG5cbiAgICAgICAgbGVuUGxjSGxkciA9IHBsYWNlSG9sZGVyLmxlbmd0aDtcbiAgICAgICAgZm9yIChrID0gbGVuOyBrIDwgbGVuUGxjSGxkcjsgaysrKSB7XG4gICAgICAgICAgICBkaXNwb3NhbEJveCA9IGRpc3Bvc2FsQm94LmNvbmNhdChwbGFjZUhvbGRlci5wb3AoKSk7ICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBsZW47IGkrKykgeyAgICBcbiAgICAgICAgICAgIGlmKCFwbGFjZUhvbGRlcltpXSkge1xuICAgICAgICAgICAgICAgIHBsYWNlSG9sZGVyW2ldID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoaiA9IDAsIGxlbkMgPSBjb25maWdNYW5hZ2VyW2ldLmxlbmd0aDsgaiA8IGxlbkM7IGorKyl7XG4gICAgICAgICAgICAgICAgaWYocGxhY2VIb2xkZXJbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VIb2xkZXJbaV1bal0udXBkYXRlKGNvbmZpZ01hbmFnZXJbaV1bal0pOyAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3ljbGVkQ2VsbCA9IGRpc3Bvc2FsQm94LnBvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlY3ljbGVkQ2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VIb2xkZXJbaV1bal0gPSByZWN5Y2xlZENlbGwudXBkYXRlKGNvbmZpZ01hbmFnZXJbaV1bal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZUhvbGRlcltpXVtqXSA9IG5ldyBDZWxsKGNvbmZpZ01hbmFnZXJbaV1bal0scGFyZW50Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGVuUGxjSGxkciA9IHBsYWNlSG9sZGVyW2ldLmxlbmd0aDtcbiAgICAgICAgICAgIGxlbkMgPSBjb25maWdNYW5hZ2VyW2ldLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yIChrID0gbGVuQzsgayA8IGxlblBsY0hsZHI7IGsrKykge1xuICAgICAgICAgICAgICAgIGRpc3Bvc2FsQm94ID0gZGlzcG9zYWxCb3guY29uY2F0KHBsYWNlSG9sZGVyW2ldLnBvcCgpKTsgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gZGlzcG9zYWxCb3gubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHBhcmVudENvbnRhaW5lci5yZW1vdmVDaGlsZChkaXNwb3NhbEJveFtpXS5ncmFwaGljcyk7XG4gICAgICAgICAgICBkZWxldGUgZGlzcG9zYWxCb3hbaV07XG4gICAgICAgIH0gICAgICBcbiAgICB9O1xuXG4gICAgcHJvdG9NYXRyaXguZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgID0gbWF0cml4ICYmIG1hdHJpeC5tYXRyaXhDb250YWluZXI7XG4gICAgICAgIHdoaWxlIChub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgQ2VsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjZWxsID0gdGhpcztcbiAgICAgICAgICAgIGNlbGwuY29udGFpbmVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgY2VsbC5jb25maWcgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBjZWxsLmRyYXcoKTtcbiAgICAgICAgICAgIGNlbGwuY29uZmlnLmNoYXJ0ICYmIGNlbGwucmVuZGVyQ2hhcnQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJvdG9DZWxsID0gQ2VsbC5wcm90b3R5cGU7XG5cbiAgICBwcm90b0NlbGwuZHJhdyA9IGZ1bmN0aW9uICgpe1xuICAgICAgICB2YXIgY2VsbCA9IHRoaXM7XG4gICAgICAgIGNlbGwuZ3JhcGhpY3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2VsbC5ncmFwaGljcy5pZCA9IGNlbGwuY29uZmlnLmlkIHx8ICcnOyAgICAgICAgXG4gICAgICAgIGNlbGwuZ3JhcGhpY3Muc3R5bGUuaGVpZ2h0ID0gY2VsbC5jb25maWcuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgY2VsbC5ncmFwaGljcy5zdHlsZS53aWR0aCA9IGNlbGwuY29uZmlnLndpZHRoICsgJ3B4JztcbiAgICAgICAgY2VsbC5ncmFwaGljcy5zdHlsZS50b3AgPSBjZWxsLmNvbmZpZy50b3AgKyAncHgnO1xuICAgICAgICBjZWxsLmdyYXBoaWNzLnN0eWxlLmxlZnQgPSBjZWxsLmNvbmZpZy5sZWZ0ICsgJ3B4JztcbiAgICAgICAgY2VsbC5ncmFwaGljcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGNlbGwuZ3JhcGhpY3MuaW5uZXJIVE1MID0gY2VsbC5jb25maWcuaHRtbCB8fCAnJztcbiAgICAgICAgY2VsbC5jb250YWluZXIuYXBwZW5kQ2hpbGQoY2VsbC5ncmFwaGljcyk7XG4gICAgfTtcblxuICAgIHByb3RvQ2VsbC5yZW5kZXJDaGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNlbGwgPSB0aGlzOyBcblxuICAgICAgICBjZWxsLmNvbmZpZy5jaGFydC5yZW5kZXJBdCA9IGNlbGwuY29uZmlnLmlkO1xuICAgICAgICBjZWxsLmNvbmZpZy5jaGFydC53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgY2VsbC5jb25maWcuY2hhcnQuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgXG4gICAgICAgIGlmKGNlbGwuY2hhcnQpIHtcbiAgICAgICAgICAgIGNlbGwuY2hhcnQudXBkYXRlKGNlbGwuY29uZmlnLmNoYXJ0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNlbGwuY2hhcnQgPSBjcmVhdGVDaGFydChjZWxsLmNvbmZpZy5jaGFydCk7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlbGwuY2hhcnQ7XG4gICAgfTtcblxuICAgIHByb3RvQ2VsbC51cGRhdGUgPSBmdW5jdGlvbiAobmV3Q29uZmlnKSB7XG4gICAgICAgIHZhciBjZWxsID0gdGhpcyxcbiAgICAgICAgICAgIGlkID0gY2VsbC5jb25maWcuaWQ7XG4gICAgICAgIGlmKG5ld0NvbmZpZyl7XG4gICAgICAgICAgICBjZWxsLmNvbmZpZyA9IG5ld0NvbmZpZztcbiAgICAgICAgICAgIGNlbGwuY29uZmlnLmlkID0gaWQ7XG4gICAgICAgICAgICBjZWxsLmdyYXBoaWNzLmlkID0gY2VsbC5jb25maWcuaWQgfHwgJyc7ICAgICAgICBcbiAgICAgICAgICAgIGNlbGwuZ3JhcGhpY3Muc3R5bGUuaGVpZ2h0ID0gY2VsbC5jb25maWcuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgIGNlbGwuZ3JhcGhpY3Muc3R5bGUud2lkdGggPSBjZWxsLmNvbmZpZy53aWR0aCArICdweCc7XG4gICAgICAgICAgICBjZWxsLmdyYXBoaWNzLnN0eWxlLnRvcCA9IGNlbGwuY29uZmlnLnRvcCArICdweCc7XG4gICAgICAgICAgICBjZWxsLmdyYXBoaWNzLnN0eWxlLmxlZnQgPSBjZWxsLmNvbmZpZy5sZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgIGNlbGwuZ3JhcGhpY3Muc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgY2VsbC5ncmFwaGljcy5pbm5lckhUTUwgPSBjZWxsLmNvbmZpZy5odG1sIHx8ICcnOyAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoY2VsbC5jb25maWcuY2hhcnQpIHtcbiAgICAgICAgICAgICAgICBjZWxsLmNoYXJ0ID0gY2VsbC5yZW5kZXJDaGFydCgpOyAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGNlbGwuY2hhcnQ7XG4gICAgICAgICAgICB9ICAgICAgICAgIFxuICAgICAgICB9ICAgICAgICBcbiAgICB9O1xufSk7Il19