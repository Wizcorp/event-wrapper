function createWrapper(emitter, cb) {
    var cbs = [];
    cb = cb || function () {};

    function done() {
        if (!cb) {
            throw new Error('Final callback was already called');
        }

        for (var i = 0; i < cbs.length; i += 1) {
    		emitter.removeListener(cbs[i].eventName, cbs[i].callback);
    	}

        cbs = null;

        cb.apply(null, arguments);
        cb = null;
    }

    function on() {
        var fn = arguments[arguments.length - 1];
        if (typeof fn !== 'function') {
            throw new TypeError('Final argument must be a callback function');
        }

        function callback() {
    		try {
    			fn.apply(emitter, arguments);
    		} catch (error) {
    			done(error);
    		}
    	}

        for (var i = 0; i < arguments.length - 1; i += 1) {
            var eventName = arguments[i];

            emitter.on(eventName, callback);

            cbs.push({
                eventName: eventName,
                callback: callback
            });
        }
    };

    on.done = done;

    return on;
}

module.exports = createWrapper;