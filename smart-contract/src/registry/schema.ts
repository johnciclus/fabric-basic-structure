'use strict';

import utils from './utils';

let schema = {
    id:              'number',
    name:            'string',
    productivity:    'number',
    area:            'number',
    city:            'string',
    state:           'string',
};

let format = {
    id:            'required|notString',
    name:          'required',
    productivity:  'required|notString',
    area:          'required|notString',
    city:          'required',
    state:         'required'
};

export default {
    schema: schema,
    format: format,
    rules: utils.mergeObjects(schema, format)
};
