const removeUndefindes = (object = {}) => {
    const result = { ...object };
    Object.keys(result).forEach(key => {
        if (!result[key]) {
            delete result[key];
        }
    })
    return result;
}

module.exports = {
    removeUndefindes
}