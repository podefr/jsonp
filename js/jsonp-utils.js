/**
 * jsonp-utils.js - http://podefr.github.com/jsonp/
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
"use strict";

var script = require("script-utils");

module.exports = {
	get: function (url, options, callback) {
		script.create(url);
	}
};