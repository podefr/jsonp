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
<script src="jsonp-utils-browser.js"></script>
```

Usage:
======

After you've initialized jsonp you can do as many requests you want as quickly as you want, jsonp will ensure that the right callback will get the right data and do all the clean up for you!

```js
var Jsonp = require("jsonp-utils");

// create a new jsonp request broker
var jsonp = new Jsonp({
	// requires the name of param to set to specify the callback name
	callbackName: "jsoncallback",

	// defaults to 15000
    timeout: 30000,

    // the url to hit
	url: "http://www.flickr.com/services/rest/"
});

var request = {
	method: "flickr.test.echo",
	format: "json",
	api_key: "a1faa53df9402fc5cc2d9746118f9ddc"
};

// Using the callback API
jsonp.get(request, /* callback */ function (err, data) {
	this.innerHTML = JSON.stringify(data);
}, /* scope */ document.querySelector(".example1"));

// Using the promise API (vow promise)
var promise = jsonp.get(request);

promise.then(function onSuccess(data) {
	document.querySelector(".example2").innerHTML = JSON.stringify(data);
}, function onError(err) {
	// on error
});
```

Licence
=======

MIT