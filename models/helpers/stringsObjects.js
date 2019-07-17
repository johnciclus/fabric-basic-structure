'use strict';
console.log('Adding String Objects');

module.exports = {
    mergeObjects : function(base_obj, complement_obj){
        return Object.keys(base_obj).map(function(prop) {
            let elements = [base_obj[prop], complement_obj[prop]].filter(item => item != null && item !== '');
            return {prop: prop, value: elements.join('|')};
        }).reduce(function(obj, keyvalue) {
            obj[keyvalue.prop] = keyvalue.value;
            return obj;
        }, {});
    }
};
