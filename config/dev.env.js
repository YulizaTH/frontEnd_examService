'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	endpoint_exam: '"http://192.167.99.246:1255"',
	endpoint_auth: '"http://192.167.99.246:8090"'
})
