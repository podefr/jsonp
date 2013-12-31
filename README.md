jsonp
=====

jsonp utils for loading data with jsonp. It has two APIs, you can give a callback or expect a vow promise in return.

Installation:
=============

```bash
npm install jsonp-utils
```

In the browser:
===============

```html
<script src="jsonp-utils-browser"></script>
```

Usage:
======

After you've initialized jsonp you can do as many requests you want as quickly as you want, jsonp will ensure that the right callback will get the right data and do all the clean up for you!

```js
var Jsonp = require("jsonp-utils");

// create a new jsonp request broker
var jsonp = new Jsonp({
	// requires the name of param to set to specify the callback name
	callbackName: "jsonpcallback",

	// defaults to 15000
	timeout: 30000,

	// the url to hit
	url: "http://api.service.com"
});

// Using the callback API
jsonp.get({
	method: "getUser",
	id: "userId"
}, function (error, data) {
	if (error) {
		debug.error(error);
	}

	// do something with data
}, scope);


// Using the promise API (vow promise)
var promise = jsonp.get({
	method: "getUser",
	id: "userId"
});

promise.then(function onError(error) {
	// do something if error
}, function onSuccess(data) {
	// do something with data
});
```

Licence
=======

MIT