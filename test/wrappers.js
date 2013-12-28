function wrap(name, step) {
	return function func(desc, cb) {
		step(name + desc, cb);
	};
}

GLOBAL.GIVEN = wrap("GIVEN ", describe);
GLOBAL.WHEN = wrap("WHEN ", describe);
GLOBAL.THEN = wrap("IT ", it);