const app = require('../../../app')('streaming/hook');
const GET = require('../utils').GET;
app.get('*', async function (req, res) {
    const data = await GET("svp_list_video_playlists");
    const playlists = data.response.video_playlists[0].video_playlist;
    playlists.forEach(async p => {
        const data = await GET("svp_list_videos&channel_ref=" + p.ref_no);
        const videos = data.response.video_list[0].video;
        let deletedVideos = [];
        videos.forEach(async video => {
            let created = 1000 * 60 * 60 * 24;
            let d1 = new Date(video.date_created * 1000);
            let d2 = new Date();
            let total = d2.getTime() - d1.getTime();
            let days_created = Math.floor(total / created);
            let days = (req.query.days_old ? parseInt(req.query.days_old) : 90)
            //return (parseInt(days_created) >= parseInt(days));
            if(parseInt(days_created) >= parseInt(days)){
                console.log(`Should delete from ${p.title} because it has ${days_created} days old`);
                deletedVideos.push(video);
                //const result = await GET("svp_delete_video&video_ref=" + video);
            }
        });
        res.send(`Videos deleted ${deletedVideos.length}`);
    });
});

module.exports = app.start();