all: jshint test

jshint:
	jshint *.js

test:
	nodejs test
