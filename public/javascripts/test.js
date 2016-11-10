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
    'status': [
        'Cappuccino',
        'Espresso Lite',
        'Latte'
    ]
};

var rowOrder = ['status', 'variety', 'product'];
var rowCount = 1;

function createMatrix (obj, rowOrder) {
    let rowLen = rowOrder.length;
    for (var i = 0; i < rowLen; i++) {
        rowCount = rowCount * obj[rowOrder[i]].length;
    }
}
