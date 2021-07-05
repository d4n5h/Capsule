module.exports = class {
    /**
     * Capsule dependency injection container
     * @param {Object} object
     * @return {Boolean}
     */
    constructor(definitions) {
        this.reservedProperties = ['get', 'set', 'factory', 'raw', 'protect', 'share', 'toString', 'constructor'];
        this._definitions = {};
        for (var key in definitions) {
            if (definitions.hasOwnProperty(key)) {
                this.set(key, definitions[key]);
            }
        }
    }

    _isFunction(object) {
        return object instanceof Function;
    }

    /**
     * Gets a service
     * @param {String} key
     * @returns {*}
     */
    get(key) {
        if (this._definitions[key] === undefined) return;
        if (this._isFunction(this._definitions[key])) return this._definitions[key].call(this, this);
        return this._definitions[key];
    }

    /**
     * Registers a new service
     * @param {String} key
     * @param {Object|Function} 
     * @return {Pimple} container
     */
    set(key, definition) {
        this._definitions[key] = definition;
        if (this.reservedProperties.indexOf(key) === -1) {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.get(key);
                },
                configurable: true,
                enumerable: true
            });
        }
        return this
    }

    /**
     * Gets a raw definition of a service
     * @param {String} key
     * @returns {*}
     */
    raw(key) {
        return this._definitions[key];
    }

    /**
     * Defines a shared service
     * @param {Object,Function} definition
     * @return {Function}
     */
    share(definition) {
        var cached, self = this;
        return function () {
            if (cached === undefined) {
                cached = definition.call(self, self);
            }
            return cached;
        }
    }

    /**
     * Defines a protected service
     * @param {Function} definition
     * @param {Object} context
     * @returns {Function}
     */
    protect(definition, context) {
        context = context || this;
        return function () {
            return definition.bind(context);
        }
    }

    /**
     * Extends a defined service
     * @param {String} key
     * @param {Function} definition
     * @returns {Function}
     */
    extend(key, definition) {
        return definition.bind(this, this.get(key), this);
    }

    /**
     * Registers a set of definitions
     * @param {Function} definitionProvider
     * @returns {*}
     */
    register(definitionProvider) {
        return definitionProvider(this);
    }
}