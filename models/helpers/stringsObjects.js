'use strict';

module.exports = {
    mergeObjects : function(base_obj, complement_obj){
        return Object.keys(base_obj).map(function(prop) {
            return {prop: prop, value: [base_obj[prop], complement_obj[prop]].join('|')};
        }).reduce(function(obj, keyvalue) {
            obj[keyvalue.prop] = keyvalue.value;
            return obj;
        }, {});
    }
};
