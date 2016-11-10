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
            'California',
            'Washington'
        ],
        'year': [
            '2013',
            '2014'
        ]
    },
    rowOrder = ['product', 'variety'],
    colOrder = ['year', 'state'],
    table = [[{
        rowspan: colOrder.length,
        colspan: rowOrder.length
    }]];

function createRow (table, data, fieldOrder, currentIndex) {
    var rowspan = 0,
        rowComponent = rowOrder[currentIndex],
        fieldValues = data[rowComponent],
        i, l = fieldValues.length,
        element,
        hasFurtherDepth = currentIndex < (rowOrder.length - 1);
    for (i = 0; i < l; i += 1) {
        element = {
            rowspan: 1,
            colspan: 1,
            html: fieldValues[i]
        };
        if (i) {
            // insert a new Row
            table.push([element]);
        } else {
            table[table.length - 1].push(element);
        }
        if (hasFurtherDepth) {
            element.rowspan = createRow(table, data, rowOrder, currentIndex + 1);
        }
        rowspan += element.rowspan;
    }
    return rowspan;
}

function createCol (table, data, fieldOrder, currentIndex) {
    var colspan = 0,
        fieldComponent = fieldOrder[currentIndex],
        fieldValues = data[fieldComponent],
        i, l = fieldValues.length,
        element,
        hasFurtherDepth = currentIndex < (fieldOrder.length - 1);

    if (table.length <= currentIndex) {
        table.push([]);
    }
    for (i = 0; i < l; i += 1) {
        element = {
            rowspan: 1,
            colspan: 1,
            html: fieldValues[i]
        };

        table[currentIndex].push(element);

        if (hasFurtherDepth) {
            element.colspan = createCol(table, data, fieldOrder, currentIndex + 1);
        }
        colspan += element.colspan;
    }
    return colspan;
}

function createChartContainers (table) {
    let element = {
        rowspan: 1,
        colspan: 1,
        chart: 'Yeaaaa'
    };
    console.log(element);
    for (let i = 0, ii = table.length; i < ii; i++) {
        console.log(table[i]);
    }
}

createCol(table, obj, colOrder, 0);
table.push([]);
createRow(table, obj, rowOrder, 0);
createChartContainers(table);

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

            tableStr += ' rowspan="' + (col.rowspan === undefined ? '1' : col.rowspan) + '"';
            tableStr += ' colspan="' + (col.colspan === undefined ? '1' : col.colspan) + '"';

            tableStr += '>' + (col.html === undefined ? '' : col.html);
            tableStr += '</td>';
        }
        tableStr += '</tr>';
    }

    tableStr += '</table >';
    document.getElementById('crosstab-div').innerHTML = tableStr;
}

drawTable(table);
