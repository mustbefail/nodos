require('reflect-metadata');
const path = require('path');
const commandBuilders = require('./lib/commands.js');
const Db = require('./lib/Db.js');

module.exports = (config = {}) => async (app) => {
  const defaultConfig = {
    dialect: 'sqlite',
    entities: path.join(app.config.projectRoot, '/app/entities'),
    migrations: {
      directory: path.join(app.config.projectRoot, '/db/migrations/'),
    },
  };
  console.log(defaultConfig);
  const db = new Db({ ...defaultConfig, ...config });
  // TODO make it lazy
  await db.connect(app);
  Object.values(commandBuilders).forEach((build) => app.addCommandBuilder(build));
  app.addDependency('db', db);
  app.addHook('onStop', db.close);
};
