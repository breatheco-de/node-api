const app = require('../../app')
const jwt = require('../../common/jwt')

app.get('*', (req, res) => {

    res.send("Hello world")
    // Tell the user they have been logged out
    res.end()
})

//app.listen(3000, () => console.log(`Example app listening on port 3000!`))
module.exports = app