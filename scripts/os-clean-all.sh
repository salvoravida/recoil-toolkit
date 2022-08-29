#!/bin/bash

find . -name "node_modules" -exec rm -rf '{}' +
find . -name "build" -exec rm -rf '{}' +
find . -name "coverage" -exec rm -rf '{}' +
exit 0
