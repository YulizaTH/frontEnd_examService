'use strict'
require('dotenv').config()

module.exports = {
	NODE_ENV: process.env.node_env,
	endpoint_exam: process.env.endpoint_exam,
	endpoint_auth: process.env.endpoint_auth
}
