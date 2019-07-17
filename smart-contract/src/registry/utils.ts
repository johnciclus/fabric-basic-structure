'use strict';

function mergeObjects(base_obj, complement_obj) {
    return Object.keys(base_obj).map(function(prop) {
        let elements = [base_obj[prop], complement_obj[prop]].filter(item => item != null && item !== '');
        return {prop: prop, value: elements.join('|')};
    }).reduce(function(obj, keyvalue) {
        obj[keyvalue.prop] = keyvalue.value;
        return obj;
    }, {});
};

function filterBySchema(schema, object) {
    let MapResult = Object.keys(schema).map(function(prop) {
        return prop in object ? {prop: prop, value: object[prop]} : null;
    }).filter(item => item != null);

    return MapResult.reduce(function(obj, keyValue) {
        obj[keyValue.prop] = keyValue.value;
        return obj;
    }, {});
};

export default {
    mergeObjects: mergeObjects,
    filterBySchema: filterBySchema
};
