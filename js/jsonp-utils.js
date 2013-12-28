/**
 * jsonp-utils.js - https://github.com/podefr/jsonp
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
"use strict";

var scriptUtils = require("script-utils"),
	uuidGenerator = require("uuid"),
	querystring = require("querystring");

module.exports = {
	get: function (url, options, callback, scope) {
		var serializedOptions = serializeOptions(prepareOptions(options)),
			uuid = getUniqueId(),
			script = scriptUtils.create(prepareUrl(url), function () {
				scriptUtils.remove(script);
				delete window[uuid];
			});

		createUniqueCallback(uuid, callback, scope);
		scriptUtils.append(script);
	}
};


function getUniqueId() {
	return uuidGenerator.v4();
}

function prepareOptions(options) {
	if (!options.callbackName) {
		options.callbackName = "callback";
	}
	return options;
}

function serializeOptions(options) {
	return querystring.stringify(options);
}

function prepareUrl(url, options) {
	if (options) {
		return url + "?" + options;
	} else {
		return url;
	}
}

function createUniqueCallback(uuid, callback, scope) {
	window[uuid] = function () {
		callback.apply(scope, arguments);
	};
}