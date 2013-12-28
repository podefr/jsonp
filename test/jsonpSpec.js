/**
 * jsonpSpec.js - http://podefr.github.com/jsonp/
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
require("bdd-wrappers");
require("quick-dom");

var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect,
	proxyquire = require("proxyquire").noCallThru();

var scriptMock = {
	create: sinon.stub(),
	remove: sinon.spy(),
	append: sinon.spy()
};

var uuidMock = {
	v4: sinon.stub()
};

var jsonp = proxyquire("../js/jsonp-utils", {
	"script-utils": scriptMock,
	"uuid": uuidMock
});

GIVEN("jsonp", function() {
	WHEN("calling get", function () {
		var url = "",
			options = {},
			callback = sinon.spy(),
			script = {};

		beforeEach(function () {
			scriptMock.create.returns(script);
			uuidMock.v4.returns("unique-id");
			jsonp.get(url, options, callback);
		});

		THEN("creates a script with the given url", function () {
			expect(scriptMock.create.called).to.be.true;
		});

		THEN("adds the script to head", function () {
			expect(scriptMock.append.calledWith(script)).to.be.true;
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