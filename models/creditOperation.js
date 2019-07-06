'use strict';

let stringsObjects = require('./helpers/stringsObjects');

let schema = {
    type:            'string',
    status:          'string',
    number:          'string',
    value:           'number',
    unit:            'string',
    issuer:          'string',
    creditor:        'string',
    guarantees:      'array',
    digitalAddress:  'string',
    expirationDate:  'string'
};

let format = {
    type:            'required',
    status:          'required',
    number:          'required',
    value:           'required|notString',
    unit:            'required',
    issuer:          'required',
    creditor:        'required',
    guarantees:      'required',
    digitalAddress:  '',
    expirationDate:  '',
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
