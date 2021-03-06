'use strict';

// Modules
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

/*
 * Helper to filter out services from application containers
 */
exports.getApplicationServices = (services = []) => _(services)
  // Filter out non psh containers
  .filter(service => !_.isEmpty(service.platformsh))
  // Filter out psh services
  .filter(service => service.platformsh.application)
  .value();

/*
 * Helper to filter out services from application containers
 */
exports.getNonApplicationServices = (services = []) => _(services)
  // Filter out non psh containers
  .filter(service => !_.isEmpty(service.platformsh))
  // Filter out psh application containers
  .filter(service => !service.platformsh.application)
  .value();

/*
 * Helper to get terminus tokens
 */
exports.getPlatformshTokens = home => {
  if (fs.existsSync(path.join(home, '.platformsh', 'cache', 'tokens'))) {
    return _(fs.readdirSync(path.join(home, '.platformsh', 'cache', 'tokens')))
      .map(tokenFile => path.join(home, '.platformsh', 'cache', 'tokens', tokenFile))
      .map(file => JSON.parse(fs.readFileSync(file, 'utf8')))
      .value();
  } else {
    return [];
  }
};

/*
 * Helper to return most recent tokens
 */
exports.sortTokens = (...sources) => _(_.flatten([...sources]))
  .sortBy('date')
  .groupBy('email')
  .map(tokens => _.last(tokens))
  .value();
