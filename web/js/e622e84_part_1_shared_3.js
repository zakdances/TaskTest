var dateFromObjectId = function (objectId) {
    var substring = objectId.substring(0, 8);
    return new Date(parseInt(substring, 16) * 1000);
};
var arrayFromDBObjects = function (dict) {
    var arr = [];
    var keys = Object.keys(dict);
    console.log('keys');
    console.log(keys.length);
    keys.forEach(function (id, i, a) {
        var task = dict[id];
        if (task) {
            arr.push(task);
        }
    });
    return arr;
};
