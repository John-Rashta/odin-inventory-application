const CustomNotFoundError = require("./CustomNotFoundError");

function helpWithErrors(data, errorMessage) {
    if (!data) {
        throw new CustomNotFoundError(errorMessage);
    }

    if (Array.isArray(data) && data.length === 0) {
        throw new CustomNotFoundError(errorMessage);
    }
};

module.exports = helpWithErrors;