var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DEV_API_HOST,
      port: parseInt(process.env.DEV_API_PORT),
      username: process.env.DEV_API_USER,
      password: process.env.DEV_API_PASSWORD,
      database: process.env.DEV_API_DATABASE,
      migrationsRun: true,
      entities: ['./**/*.entity.js'],
      ssl: false,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'staging':
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.STAGING_API_HOST,
      port: parseInt(process.env.STAGING_API_PORT),
      username: process.env.STAGING_API_USER,
      password: process.env.STAGING_API_PASSWORD,
      database: process.env.STAGING_API_DATABASE,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.PROD_API_HOST,
      port: parseInt(process.env.PROD_API_PORT),
      username: process.env.PROD_API_USER,
      password: process.env.PROD_API_PASSWORD,
      database: process.env.PROD_API_DATABASE,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
    });
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
