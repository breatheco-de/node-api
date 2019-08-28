// /util/app.js

require('dotenv').config()

const app = require('express')()

const commonMiddlewares = require('./common/middlewares')

app.set('trust proxy', 1)
app.use(...commonMiddlewares)

module.exports = (app_name) => ({
    app,
    start: () => {
        if(process.argv.includes("-local")) app.listen(3000, () => console.log(`Listening on 3000`))
        else console.warn("⚠ Warning: the -local flag was not found, if you are running localhost you must include -local");
        return app;
    },
    get: (path, func) => app.get("/"+app_name+path, func),
    post: (path, func) => app.post("/"+app_name+path, func),
    put: (path, func) => app.put("/"+app_name+path, func),
    delete: (path, func) => app.delete("/"+app_name+path, func)
});