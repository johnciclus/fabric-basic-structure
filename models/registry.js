'use strict';

let stringsObjects = require('./helpers/stringsObjects');

let schema = {
    id:              'number',
    name:            'string',
    productivity:    'number',
    area:            'number',
    city:            'string',
    state:           'string'
};

let format = {
    id:            'required|notString',
    name:          'required',
    productivity:  'required|notString',
    area:          'required|notString',
    city:          'required',
    state:         'required'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};

