/**
 * jsonpSpec.js - https://github.com/podefr/jsonp
 * Copyright(c) 2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
//require("bdd-wrappers");
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

var querystringMock = {
	stringify: function () {}
};

var Jsonp = proxyquire("../js/jsonp-utils", {
	"script-utils": scriptMock,
	"uuid": uuidMock,
	"querystring": querystringMock
});

describe("GIVEN default jsonp", function() {
	var jsonp = null;

	beforeEach(function () {
		jsonp = new Jsonp();
	});

	it("THEN jsonp requests are set to timeout after 15s", function () {
		expect(jsonp.getTimeout()).to.equal(15000);
	});

	it("THEN the default name for the jsonp is callback", function () {
		expect(jsonp.getCallbackName()).to.equal("callback");
	});

	it("THEN doesnt have a default url", function () {
		expect(jsonp.getUrl()).to.equal("");
	});

	describe("WHEN reconfigured", function () {
		beforeEach(function () {
			jsonp.setTimeout(30000);
			jsonp.setCallbackName("jsonpcallback");
			jsonp.setUrl("url");
		});

		it("THEN timeout is updated", function () {
			expect(jsonp.getTimeout()).to.equal(30000);
		});

		it("THEN the name of the callback is updated", function () {
			expect(jsonp.getCallbackName()).to.equal("jsonpcallback");
		});

		it("THEN the url is updated", function () {
			expect(jsonp.getUrl()).to.equal("url");
		});

		describe("WHEN calling get", function () {
			var options = {},
				callback = sinon.spy(),
				script = {};

			beforeEach(function () {
				sinon.stub(scriptMock, "create").returns(script);
				sinon.spy(scriptMock, "append");
				sinon.spy(scriptMock, "remove");
				uuidMock.v4.returns("unique-id");
				sinon.stub(querystringMock, "stringify").returns("callback=unique-id");
				jsonp.get(options, callback);
			});

			afterEach(function () {
				scriptMock.create.restore();
				scriptMock.append.restore();
				scriptMock.remove.restore();
				querystringMock.stringify.restore();
			});

			it("THEN creates a script with the provided url", function () {
				expect(scriptMock.create.called).to.be.true;
				expect(scriptMock.create.args[0][0]).to.equal("url?callback=unique-id");
			});

			it("THEN adds the script to head", function () {
				expect(scriptMock.append.calledWith(script)).to.be.true;
			});

			it("THEN generates a unique callback to receive the jsonp data", function () {
				expect(typeof window["unique-id"]).to.equal("function");
			});

			describe("WHEN options are provided", function () {
				beforeEach(function () {
					scriptMock.create.reset();
					querystringMock.stringify.returns("stringified");
					jsonp.get(options, callback);
				});
				it("THEN serializes the options", function () {
					expect(scriptMock.create.args[0][0]).to.equal("url?stringified");
				});
			});

			describe("WHEN the script is loaded", function () {
				beforeEach(function () {
					scriptMock.create.args[0][1]();
				});

				it("THEN removes the script from head", function () {
					expect(scriptMock.remove.calledWith(script)).to.be.true;
				});
			});

			describe("WHEN the unique callback is called with the data", function () {
				beforeEach(function () {
					window["unique-id"](1, 2, 3);
				});

				it("THEN calls the provided callback with the data", function () {
					expect(callback.calledWith(1, 2, 3)).to.be.true;
				});

				it("THEN removes the unique callback", function () {
					expect(window["unique-id"]).to.be.undefined;
				});
			});

			describe("WHEN a scope is provided with the callback", function () {
				var scope = {};

				beforeEach(function () {
					jsonp.get(options, callback, scope);
					window["unique-id"]();
				});

				it("THEN calls the callback within the scope", function () {
					expect(callback.calledOn(scope)).to.be.true;
				});
			});
		});
	});
});