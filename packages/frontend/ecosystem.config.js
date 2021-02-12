module.exports = {
    apps: [{
        name: "sharerecipes",
        script: "node server/index.js",
        env: {
            NODE_ENV: "dev"
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}