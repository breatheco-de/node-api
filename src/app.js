// /util/app.js

require('dotenv').config()

const app = require('express')()

const commonMiddlewares = require('./common/middlewares')

app.set('trust proxy', 1)
app.use(...commonMiddlewares)

module.exports = (app_name) => ({
    app,
    listen: (...args) => app.listen,
    get: (path, func) => app.get("/"+app_name+path, func),
    post: (path, func) => app.post("/"+app_name+path, func),
    put: (path, func) => app.put("/"+app_name+path, func),
    delete: (path, func) => app.delete("/"+app_name+path, func)
});