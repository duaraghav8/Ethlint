#!/usr/bin/env node

/**
 * @fileoverview CLI Entry point
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var cli = require ('../lib/cli');
cli.execute (process.argv);