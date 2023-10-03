module.exports = {
    development: {
        dialect: 'postgres',
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        database: process.env.POSTGRES_DB || 'auth-user',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
    },
};

