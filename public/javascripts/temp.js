var obj = {
        'product': [
            'Tea',
            'Coffee'
        ],
        'variety': [
            'Cappuccino',
            'Espresso Lite',
            'Latte'
        ],
        'state': [
            'New York',
            'Washington'
        ],
        'year': [
            '2013',
            '2014'
        ],
        'month': [
            'Jan',
            'Feb'
        ]
    },
    rowOrder = ['product', 'state'],
    colOrder = ['year'],
    columnKeyArr = [],
    table = [[{
        rowspan: colOrder.length,
        colspan: rowOrder.length
    }]];

function createRow (table, data, fieldOrder, currentIndex, filteredDataStore) {
    var rowspan = 0,
        fieldComponent = rowOrder[currentIndex],
        fieldValues = data[fieldComponent],
        i, l = fieldValues.length,
        element,
        hasFurtherDepth = currentIndex < (rowOrder.length - 1),
        filteredDataHashKey,
        colLength = columnKeyArr.length;

    for (i = 0; i < l; i += 1) {
        element = {
            rowspan: 1,
            cplSpan: 1,
            text: fieldValues[i]
        };

        filteredDataHashKey = filteredDataStore + ' => ' + fieldComponent + '=' + fieldValues[i];

        if (i) {
            table.push([element]);
        } else {
            table[table.length - 1].push(element);
        }
        if (hasFurtherDepth) {
            element.rowspan = createRow(table, data, rowOrder, currentIndex + 1, filteredDataHashKey);
        } else {
            for (let j = 0; j < colLength; j += 1) {
                table[table.length - 1].push({
                    rowspan: 1,
                    cplSpan: 1,
                    text: 'rowFilter- ' + filteredDataHashKey + '<br/>colFilter- ' + columnKeyArr[j]
                });
            }
        }
        rowspan += element.rowspan;
    }
    return rowspan;
}

function createCol (table, data, fieldOrder, currentIndex, filteredDataStore) {
    var colspan = 0,
        fieldComponent = fieldOrder[currentIndex],
        fieldValues = data[fieldComponent],
        i, l = fieldValues.length,
        element,
        hasFurtherDepth = currentIndex < (fieldOrder.length - 1),
        filteredDataHashKey;

    if (table.length <= currentIndex) {
        table.push([]);
    }
    for (i = 0; i < l; i += 1) {
        element = {
            rowspan: 1,
            colspan: 1,
            text: fieldValues[i]
        };

        filteredDataHashKey = filteredDataStore + ' => ' + fieldComponent + '=' + fieldValues[i];

        table[currentIndex].push(element);

        if (hasFurtherDepth) {
            element.colspan = createCol(table, data, fieldOrder, currentIndex + 1, filteredDataHashKey);
        } else {
            columnKeyArr.push(filteredDataHashKey);
        }
        colspan += element.colspan;
    }
    return colspan;
}

// Temp code to visualize the table
function drawTable (table) {
    var i, j, rl = table.length, cl,
        row, col,
        tableStr = '<table >';

    for (i = 0; i < rl; i += 1) {
        row = table[i];
        cl = row.length;
        tableStr += '<tr>';
        for (j = 0; j < cl; j += 1) {
            col = row[j];
            tableStr += '<td';

            tableStr += ' rowspan="' + col.rowspan + '"';
            tableStr += ' colspan="' + col.colspan + '"';

            tableStr += '>' + (col.text === undefined ? '' : col.text);
            tableStr += '</td>';
        }
        tableStr += '</tr>';
    }

    tableStr += '</table >';
    document.getElementById('crosstab-div').innerHTML = tableStr;
}

function createCrosstab () {
    createCol(table, obj, colOrder, 0, '');
    table.push([]);
    createRow(table, obj, rowOrder, 0, '');
    drawTable(table);
}

createCrosstab();
