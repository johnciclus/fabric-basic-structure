'use strict';

const timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/;

const timeFn = function (data, field, message, args, get) {
    return new Promise((resolve, reject) => {
        const fieldValue = get(data, field);

        if (fieldValue && !timeRegex.test(fieldValue)) {
            return reject(message);
        }

        resolve('validation passed');
    });
};

module.exports = timeFn;
