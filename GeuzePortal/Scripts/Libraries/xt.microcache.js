/**
 * Micro Cache
 * - a micro library to handle a inmemory cache
 * - works in node and browser.
 * 
 * @tags inmemory, keyvalue, cache, node, browser
*/
var MicroCache = function () {
    var localValues = {};
    return {
        get: function (key) { return localValues[key]; },
        contains: function (key) { return key in localValues; },
        remove: function (key) { delete localValues[key]; },
        set: function (key, value) { localValues[key] = value; },
        values: function () { return localValues; },
        getSet: function (key, value) {
            if (!this.contains(key)) {
                this.set(key, typeof value == 'function' ? value() : value);
            }
            return this.get(key);
        }
    };
};

// export in common js
if (typeof module !== "undefined" && ('exports' in module)) {
    module.exports = MicroCache;
}