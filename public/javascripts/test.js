/* eslint-disable */
function calc (object) {
	var keysAr = Object.keys(object),
		array2d = [],
		i = 0,
		ii = keysAr.length,
		key = '',
		storeAr = [[]],
		storeIndex = 0,
		depthAr = [1];
	// Converting object to array
	for (key in object) {
		array2d.push(object[key]);
	}

	i = keysAr.length;
	while (--i) {
		depthAr.unshift(array2d[i].length * depthAr[0]);
	}

	function logic (index) {
		var i = 0,
			arr = array2d[index],
			ii = arr && arr.length;
		if (!arr) {
			return;
		}
		for (; i < ii; ++i) {
			if (i) {
				storeAr.push([]);
				storeIndex++;
			}
			storeAr[storeIndex].push({
				value: arr[i],
				span: depthAr[index]
			});
			logic(index + 1);
		}
	}
	logic(0);
	console.log(storeAr);
	for(i = 0; i < storeAr.length; ++i){
		str = "";
		for(j = 0; j < storeAr[i].length; ++j){
			str += storeAr[i][j].value + " " + storeAr[i][j].span + ", ";
		}
		console.log(str);
	}
    createTable(storeAr);
}

var obj = {
  "product": [
    "Tea with creame",
    "Coffee"
  ],
  "variety": [
	"Cappuccino",
	"Espresso Lite",
	"Latte"
  ],
  "people": [
    "NOkhotro Chattopadhyay",
    "Anindya"
],
  "state": [
    "New York",
    "Washington",
    "California"
  ],
  "year": [
    "2013",
    "2014"
  ],
  "month": [
    "February",
    "January"
],
  "state1": [
    "New York",
    "Washington",
    "California"
  ],
  "year1": [
    "2013",
    "2014"
  ],
  "month1": [
    "February",
    "January"
]
};

calc(obj);
function createTable(calcObj) {
    console.log(calcObj);
    var table = document.createElement('table');
    for (var i = 0, ii = calcObj.length; i < ii; i++) {
        let tr = document.createElement('tr');
        for (var j = 0; j < calcObj[i].length; j++) {
            let td = document.createElement('th');
            td.setAttribute('rowspan', calcObj[i][j].span);
            td.innerHTML = calcObj[i][j].value;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

//createTable(calc(obj));
/* eslint-enable */
