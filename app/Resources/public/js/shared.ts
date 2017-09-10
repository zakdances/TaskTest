

var dateFromObjectId = (objectId: string) => {
    const substring = objectId.substring(0, 8);
    return new Date(parseInt(substring, 16) * 1000);
};

var arrayFromDBObjects = (dict) => {
    const arr = [];
    const keys = Object.keys(dict);
    console.log('keys');
    console.log(keys.length);

    keys.forEach((id, i, a) => {
        const task = dict[id];
        if (task) {
            arr.push(task);
        }
    });
    return arr;
}