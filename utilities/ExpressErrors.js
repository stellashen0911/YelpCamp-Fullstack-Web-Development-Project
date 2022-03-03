class ExpressErros extends Error {

    constructor (message, error_code) {
        super();
        this.message = message;
        this.error_code = error_code;
    }
};

module.exports = ExpressErros;