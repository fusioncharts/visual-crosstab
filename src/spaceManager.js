class SpaceManager {
    constructor (width, height) {
        this.width = width;
        this.height = height;
    }
    manageSpace (crosstab, cb) {
        let managedCrosstab = crosstab.slice();
        cb(managedCrosstab);
        console.log(this.width, this.height);
        console.log(managedCrosstab);
    }
}

module.exports = SpaceManager;
