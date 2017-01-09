import * as Immutable from 'immutable';
// import { map } from 'ramda/src/map';

class CrosstabExt {
    constructor (data) {
        this.data = Immutable.Map(data);
    }

    printData () {
        let newData = this.data.set('firstName', 'Tom');
        console.log(this.data.toJS());
        console.log(newData.toJS());
    }
}

module.exports = CrosstabExt;
