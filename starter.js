/* global require */

const configs = require('./configs.json');

require("./src/server/server-web")(configs);
require("./src/server/server-socket")(configs);
