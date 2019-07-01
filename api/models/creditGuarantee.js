'use strict';

let stringsObjects = require('../helpers/stringsObjects');

let schema = {
    id:              'string',
    name:            'string',
    type:            'string',
    digitalAddress:  'string',
    expirationDate:  'string',
    value:           'number',
    units:           'string',
    owner:           'string'
};

let format = {
    id:            'required',
    name:          'required',
    type:          'required',
    digitalAddress:'required',
    expirationDate:'string',
    value:         'required|notString',
    units:         'required',
    owner:         'required'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
