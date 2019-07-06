'use strict';

let stringsObjects = require('./helpers/stringsObjects');

let schema = {
    id:           'number',
    name:         'string',
    cpf_cnpj:     'number',
    external_id:  'string',
    address:      'string',
    city:         'string',
    state:        'string',
    score:        'number'
};

let format = {
    id:           'required|notString',
    name:         'required',
    cpf_cnpj:     'required|notString',
    external_id:  'required',
    address:      '',
    city:         'required',
    state:        'required',
    score:        'notString'
};

module.exports = {
    schema: schema,
    format: format,
    rules: stringsObjects.mergeObjects(schema, format)
};
