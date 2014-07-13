all: jshint test

jshint:
	jshint *.js test

test:
	mocha

.PHONY: jshint test
