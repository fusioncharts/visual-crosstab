class SpaceManager {
    manageSpace (crosstab, cb) {
        let managedCrosstab = crosstab;
        cb(managedCrosstab);
    }
}

module.exports = SpaceManager;
