const app = require('../../app')('streaming');
const utils = require('../../common/utils');
const path = require("path");
const GET = require('./utils').GET;

//include readme file
app.get('/', utils.renderReadme(path.resolve(__dirname,"./README.md")));

app.get('/playlists', function (req, res) {
    GET("svp_list_video_playlists").then(data => res.send(data)).catch(err => console.log(err));
});

app.get('/playlists/:channel_ref', function (req, res) {
    GET("svp_list_videos&channel_ref=" + req.params.channel_ref)
    .then(result => {
        let min_days = parseInt(req.query.days_old ? parseInt(req.query.days_old) : 1);
        let videos = result.response.video_list[0].video.map(v => {
            let created = 1000 * 60 * 60 * 24;
            let d1 = new Date(v.date_created * 1000);
            let d2 = new Date();
            let total = d2.getTime() - d1.getTime();
            let days_created = Math.floor(total / created);
            v.days_created = days_created;
            return v;
        });
        result = {};
        result.days = min_days;
        result.todelete = videos.filter((video) => (parseInt(video.days_created) >= min_days && video.video_source == "ondemand"));
        result.not_delete = videos.filter((video) => (parseInt(video.days_created) < min_days || video.video_source != "ondemand"));
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

module.exports = app.start();
