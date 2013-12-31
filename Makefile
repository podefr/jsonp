all: clean jsonp-utils.min.js browser

clean:
	rm -f ./jsonp-utils.min.js
	rm -f ./jsonp-utils-browser.js

jsonp-utils.min.js:
	cat license-mini >> jsonp-utils.min.js
	uglifyjs js/jsonp-utils.js >> jsonp-utils.min.js

browser: clean jsonp-utils.min.js
	browserify -r ./js/jsonp-utils.js:jsonp-utils -o jsonp-utils-browser.js

.PHONY: all clean browser