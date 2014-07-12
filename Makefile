all: jshint test

jshint:
	jshint *.js

test:
	node test
