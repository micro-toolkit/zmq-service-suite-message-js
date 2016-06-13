[![Build Status](https://travis-ci.org/micro-toolkit/zmq-service-suite-message-js.svg?branch=master)](https://travis-ci.org/micro-toolkit/zmq-service-suite-message-js)
[![Code Climate](https://codeclimate.com/github/micro-toolkit/zmq-service-suite-message-js.png)](https://codeclimate.com/github/micro-toolkit/zmq-service-suite-message-js)
[![Coverage](https://codeclimate.com/github/micro-toolkit/zmq-service-suite-message-js/coverage.png)](https://codeclimate.com/github/micro-toolkit/zmq-service-suite-message-js)
[![Dependency Status](https://gemnasium.com/micro-toolkit/zmq-service-suite-message-js.svg)](https://gemnasium.com/micro-toolkit/zmq-service-suite-message-js)
![Grunt](https://cdn.gruntjs.com/builtwith.png)

# ZMQ Service Oriented Suite Message Module

[![NPM version](https://badge.fury.io/js/zmq-service-suite-message.svg)](http://badge.fury.io/js/zmq-service-suite-message)

This project is a node-js message module representation for [ZMQ Service Suite](http://pjanuario.github.io/zmq-service-suite-specs/).

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Bump versioning

We use [grunt bump package](https://www.npmjs.org/package/grunt-bump) to control package versioning.

Bump Patch version

    $ grunt bump

Bump Minor version

    $ grunt bump:minor

Bump Major version

    $ grunt bump:major

## Running Specs

    $ npm test

## Coverage Report

We aim for 100% coverage and we hope it keeps that way! :)
We use pre-commit and pre-push hooks and CI to accomplish this, so don't mess with our build! :P

Check the report after running npm test.

    $ open ./coverage/lcov-report/index.html
