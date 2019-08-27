const showdown  = require('showdown');
const fs = require("fs");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
};

const renderReadme = (path) => (req, res) => {
    try{
        if (fs.existsSync(path)) {
            //file exists
            const converter = new showdown.Converter();
            const text = fs.readFileSync(path).toString();
            const html = `<! –- We must always begin with an HTML label to show the browser that this is a document with an HTML format. — >
                <!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css">
                </head>
                <body>
                    <div class="markdown-body" style="max-width: 800px; margin:auto;">
                        ${converter.makeHtml(text)}
                    </div>
                </body>
            </html>`;
            res.send(html);
        }
        else{
            throw new Error("File "+path+" not found");
        }

    }
    catch(err){
        res.send(`<pre>${err.message}</pre>`);
    }
};

module.exports = {
    renderReadme, errorHandler
}