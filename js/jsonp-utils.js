/**
 * jsonp-utils.js - https://github.com/podefr/jsonp
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
"use strict";

var scriptUtils = require("script-utils"),
	uuidGenerator = require("uuid"),
	querystring = require("querystring"),
	vow = require("vow");

/**
 * new Jsonp() creates a Jsonp component that can hit the same url
 * with different options and different callbacks. It accepts a timeout
 * that expires after n milliseconds if no data was loaded in the interval.
 * It also requires the name of the url param to specify to customise the callback name.
 *
 * Example:
 * ========
 *
 * var jsonp = new Jsonp({
 *		callbackName: "jsonpcallback", 		// the name of the param to customise the callback name
 *		timeout: 30000, 					// the number of milliseconds before the request expires
 *		url: "http://api.somewebsite.com/"  // the url to the jsonp service
 *	});
 *
 * Make a jsonp request:
 * =====================
 *
 * 1/ By giving a callback with the following signature :
 * ------------------------------------------------------
 *
 * function callback(error, data) { if (error) {} }
 *
 * jsonp.get({ method: "method", id: "id" }, callback, scope);
 *
 * 2/ By hooking to the returned A+ promise
 * ----------------------------------------
 *
 * jsonp.get({ method: "method", id: "id" }).then(onError, onSuccess);
 *
 */
module.exports = function Jsonp(params) {

	// in case no param is given
	params = params || {};

	/**
	 * Timeout after which the jsonp request expires
	 * @type Number
	 * @private
	 */
	var _timeout = params.timeout || 15000,

	/**
	 * The name of param to specify the callback name
	 * @type String
	 * @private
	 */
	_callbackName = params.callbackName || "callback",

	/**
	 * The url to hit to do the jsonp request
	 * @type String
	 * @private
	 */
	_url = params.url || "",

	/**
	 * The uuid - timeout id map
	 * @type Object
	 * @private
	 */
	_timers = {};

	/**
	 * Get the current value of the timeout after which the jsonp request expires
	 * @returns Number
	 */
	this.getTimeout = function getTimeout() {
		return _timeout;
	};

	/**
	 * Set the value of the timeout after which the jsonp request expires
	 * @param {Number} timeout the time after which the callback expires
	 */
	this.setTimeout = function setTimeout(timeout) {
		_timeout = timeout;
	};

	/**
	 * Set the name of the param that specifies the callback name for receiving the data
	 * @param {String} callbackName the name of the param
	 */
	this.setCallbackName = function setCallbackName(callbackName) {
		_callbackName = callbackName
	};

	/**
	 * Get name of the param that specifies the name of the callback to be executed
	 * @returns String
	 */
	this.getCallbackName = function getCallbackName() {
		return _callbackName;
	};

	/**
	 * Set the url to hit to do the jsonp requests
	 * @param {String} callbackName the name of the param
	 */
	this.setUrl = function setUrl(url) {
		_url = url;
	};

	/**
	 * Get the url that is hit to do the jsonp request
	 * @returns {String} url
	 */
	this.getUrl = function getUrl() {
		return _url;
	};

	/**
	 * Actually do the JSONP request, url and callbackName have to be set first
	 * @param {Object} options the options that are going to be serialized and added to the url
	 * @param {function} callback [optional] the callback for the data
	 * @param {Object} scope [optional] the scope in which to call the callback
	 * @returns {Promise/A+} a promise/A+ that will be fulfilled/rejected
	 */
	this.get = function get(options, callback, scope) {
		var	uuid = getUniqueId(),
			deferred = vow.defer(),
			serializedOptions = serializeOptions(addCallbackName(options, uuid)),
			script = scriptUtils.create(prepareUrl(_url, serializedOptions), function () {
				scriptUtils.remove(script);
			});

		createUniqueCallback(uuid, callback, scope, deferred);
		scriptUtils.append(script);
		startTimer(uuid, script, callback, scope, deferred);
		return deferred.promise();
	};

	function startTimer(uuid, script, callback, scope, deferred) {
		_timers[uuid] = setTimeout(function () {
			var error = new Error("Timeout after " + _timeout + " ms");
			callback.call(scope, error);
			deferred.reject(error);
			delete window[uuid];
			scriptUtils.remove(script);
		}, _timeout);
	}

	function clearTimer(uuid) {
		clearTimeout(_timers[uuid]);
	}

	function getUniqueId() {
		return "_jsonp_" + uuidGenerator.v4().replace(/-/g, "");
	}

	function addCallbackName(options, uuid) {
		options[_callbackName] = uuid;
		return options;
	}

	function serializeOptions(options) {
		return querystring.stringify(options);
	}

	function prepareUrl(url, options) {
		return url + "?" + options;
	}

	function createUniqueCallback(uuid, callback, scope, deferred) {
		window[uuid] = function () {
			callback && callback.apply(scope, [null].concat([].slice.call(arguments)));
			deferred.resolve.apply(deferred, arguments);
			clearTimer(uuid);
			delete window[uuid];
		};
	}
};

