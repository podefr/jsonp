/**
 * jsonp-utils.js - https://github.com/podefr/jsonp
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
"use strict";

var scriptUtils = require("script-utils"),
	uuidGenerator = require("uuid"),
	querystring = require("querystring");

module.exports = function Jsonp() {

	var _timeout = 15000,
		_callbackName = "callback",
		_url = "";

	this.getTimeout = function getTimeout() {
		return _timeout;
	};

	this.setTimeout = function setTimeout(timeout) {
		_timeout = timeout;
	};

	this.setCallbackName = function setCallbackName(callbackName) {
		_callbackName = callbackName
	};

	this.getCallbackName = function getCallbackName() {
		return _callbackName;
	};

	this.setUrl = function setUrl(url) {
		_url = url;
	};

	this.getUrl = function getUrl() {
		return _url;
	};

	this.get = function get(options, callback, scope) {
		var	uuid = getUniqueId(),
			serializedOptions = serializeOptions(addCallbackName(options, uuid)),
			script = scriptUtils.create(prepareUrl(_url, serializedOptions), function () {
				scriptUtils.remove(script);
			});

		createUniqueCallback(uuid, callback, scope);
		scriptUtils.append(script);
		//startTimer(uuid, )
	};

	function getUniqueId() {
		return uuidGenerator.v4();
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

	function createUniqueCallback(uuid, callback, scope) {
		window[uuid] = function () {
			callback.apply(scope, arguments);
			delete window[uuid];
		};
	}
};

