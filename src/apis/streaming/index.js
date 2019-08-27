const app = require('../../app');
const jwt = require('../../common/jwt');
const utils = require('../../common/utils');

const parseXML = require('xml2js').parseString;
const path = require("path");
const request = require('request');

const { STREAMING_HOST, STREAMING_KEY, STREAMING_CODE } = process.env;

//include readme file
app.get('/', utils.renderReadme(path.resolve(__dirname,"./README.md")));

let TOKEN = null;
const getToken = () => new Promise((resolve, reject) => {
    if(TOKEN) resolve(TOKEN);

    request({
        url: `${STREAMING_HOST}?l=api&a=svp_auth_get_token&&api_key=${STREAMING_KEY}&api_code=${STREAMING_CODE}`,
        json: false
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // Pintamos la respuesta JSON en navegador.
            parseXML(body, function (error, result) {
                if (error === null) {
                    TOKEN = result.response.auth_token;
                    resolve(result.response.auth_token);
                } else {
                    console.log("Error parsing token", error);
                    reject(error);
                }
            });
        }
        reject(error);
    })
});

const GET = (method) => new Promise((resolve, reject) => {
    getToken().then(_token => {
        request({
            url: STREAMING_HOST+"?l=api&a="+method+"&token=" + _token,
            json: false
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // Pintamos la respuesta JSON en navegador.
                parseXML(body, function (error, result) {
                    if (error === null) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
            }
            reject(error);
        })
    })
    .catch(err => reject(err))
});

app.get('/playlists', function (req, res) {
    GET("svp_list_video_playlists").then(data => res.send(data)).catch(err => console.log(err));
});

app.get('/playlists/:channel_ref', function (req, res) {
    GET("svp_list_videos&channel_ref=" + req.params.channel_ref)
    .then(result => {
        let videos = result.response.video_list[0].video.filter((video) => {
            console.log(video);
            let created = 1000 * 60 * 60 * 24;
            let d1 = new Date(video.date_created * 1000);
            let d2 = new Date();
            let total = d2.getTime() - d1.getTime();
            let days_created = Math.floor(total / created);
            let days = (req.query.days ? parseInt(req.query.days) : 1)
            //return (parseInt(days_created) >= parseInt(days));
            if(parseInt(days_created) >= parseInt(days)) return video;
        });

        result.response.todelete = videos;
        result.response.days = (req.query.days ? req.query.days : 1);
        res.send(result);
    })
    .catch(err => console.log(err));
});

app.get('/playlists/:channel_ref', function (req, res) {
    GET("svp_list_videos&channel_ref=" + req.params.channel_ref)
    .then(result => {
        let videos = result.response.video_list[0].video.filter((video) => {
            console.log(video);
            let created = 1000 * 60 * 60 * 24;
            let d1 = new Date(video.date_created * 1000);
            let d2 = new Date();
            let total = d2.getTime() - d1.getTime();
            let days_created = Math.floor(total / created);
            let days = (req.query.days_old ? parseInt(req.query.days_old) : 1)
            //return (parseInt(days_created) >= parseInt(days));
            if(parseInt(days_created) >= parseInt(days)) return video;
        });
        result = {};
        result.todelete = videos;
        result.days = (req.query.days_old ? req.query.days_old : 1);
        res.send(result);
    })
    .catch(err => console.log(err));

});

app.delete('/playlists/video/:video_ref', function (req, res) {
    let video_ref = req.params.video_ref;
    let preview = req.query.preview;

    let datos = {
        "details": "videos a eliminar",
        "count": 1,
        "videos": [
            {'video_ref': video_ref}
        ]
    }

    if (preview) {
        res.send(datos);
    } else {
        GET("svp_delete_video&video_ref=" + video_ref).then(data => res.send(data)).catch(err => console.log(err));
    }
});

app.delete('/playlists/:videos', function (req, res) {
    let videos = req.query.videos.split(",");
    let preview = req.query.preview;

    let datos = {
        "details": "videos a eliminar",
        "count": videos.length,
        "videos": videos
    }

    if (preview === true) {
        res.send(datos);
    } else {
        let respuesta = videos.map(async (video) => {
            const result = await GET("svp_delete_video&video_ref=" + video);
            return { 'video': video, 'result': result };
        });

        res.send(respuesta);
    }
});

if(process.argv.includes("-test")) app.listen(3000, () => console.log(`Example app listening on port 3000!`))
module.exports = app