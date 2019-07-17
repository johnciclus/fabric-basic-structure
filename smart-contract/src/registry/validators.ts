export default {
    notString: function (data, field, message, args, get) {
        return new Promise((resolve, reject) => {
            const fieldValue = get(data, field);

            if (fieldValue && typeof fieldValue === 'string') {
                return reject(message);
            }

            resolve('validation passed');
        });
    }
};
