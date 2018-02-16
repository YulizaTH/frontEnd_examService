'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

console.log('bbbbb');
console.log(prodEnv);

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  restapi: '"http://172.11.1.32:1255"'
})
