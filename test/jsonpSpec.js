/**
 * jsonpSpec.js - http://podefr.github.com/jsonp/
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
require("./wrappers");
require("./fakeDocument");

var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect,
	proxyquire = require("proxyquire");

var scriptMock = sinon.mock({
	create: function () {},
	remove: function () {},
	append: function () {}
});

var jsonp = proxyquire("../js/jsonp-utils", {
	"script-utils": scriptMock
});

GIVEN("jsonp", function() {
	WHEN("calling get", function () {
		var url = "",
			options = {},
			callback = sinon.spy();

		beforeEach(function () {
			jsonp.get(url, options, callback);
		});

		THEN("adds a script with the given url", function () {
			expect(scriptMock.create.called).to.be.true;
		});

		THEN("generates a unique callback for receiving the jsonp data", function () {

		});

		WHEN("options are given", function () {
			THEN("serializes the options", function () {

			});
		});

		WHEN("the data is loaded", function () {
			THEN("calls the given callback with that data", function () {

			});

			WHEN("a scope is given", function () {
				THEN("calls the callback in that scope", function () {

				});
			});

			THEN("removes the script", function () {

			});
		});
	});

});