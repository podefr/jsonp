/**
 * jsonpSpec.js - https://github.com/podefr/jsonp
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
	create: function () {},
	remove: function () {},
	append: function () {}
};

var uuidMock = {
	v4: sinon.stub()
};

var Jsonp = proxyquire("../js/jsonp-utils", {
	"script-utils": scriptMock,
	"uuid": uuidMock
});

GIVEN("initialised jsonp", function() {
	var jsonp = null;

	beforeEach(function () {
		jsonp = new Jsonp();
	});

	WHEN("configuration is default", function () {
		THEN("jsonp requests are set to timeout after 15s", function () {
			expect(jsonp.getTimeout()).to.equal(15000);
		});

		THEN("the default name for the jsonp is callback", function () {
			expect(jsonp.getCallbackName()).to.equal("callback");
		});

		WHEN("reconfigured", function () {
			beforeEach(function () {
				jsonp.setTimeout(30000);
				jsonp.setCallbackName("jsonpcallback");
			});

			THEN("timeout is updated", function () {
				expect(jsonp.getTimeout()).to.equal(30000);
			});

			THEN("the name of the callback is updated", function () {
				expect(jsonp.getCallbackName()).to.equal("jsonpcallback");
			});
		});
	});

	WHEN("calling get", function () {
		var options = {},
			callback = sinon.spy(),
			script = {};

		beforeEach(function () {
			sinon.stub(scriptMock, "create").returns(script);
			sinon.spy(scriptMock, "append");
			uuidMock.v4.returns("unique-id");
			jsonp.get("url", options, callback);
		});

		afterEach(function () {
			scriptMock.create.restore();
			scriptMock.append.restore();
		});

		THEN("creates a script with the given url", function () {
			expect(scriptMock.create.called).to.be.true;
			expect(scriptMock.create.args[0][0]).to.equal("url?callback=unique-id");
		});

		THEN("adds the script to head", function () {
			expect(scriptMock.append.calledWith(script)).to.be.true;
		});

		THEN("generates a unique callback for receiving the jsonp data", function () {
			expect(typeof window["unique-id"]).to.equal("function");
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