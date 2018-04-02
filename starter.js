/* global require */

const configs = require('./configs.json');

require('./src/server/server-web')(configs['web-port']);
require('./src/server/server-socket')(configs['socket-port']);
