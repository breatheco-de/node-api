const app = require('../../../app')('streaming/hook');
const GET = require('../utils').GET;
app.get('*', async function (req, res) {
    console.log("Deleting videos");
    const data = await GET("svp_list_video_playlists");
    const playlists = data.response.video_playlists[0].video_playlist;
    playlists.forEach(p => {
        const data = await GET("svp_list_videos&channel_ref=" + p.ref_no);
        const videos = result.response.video_list[0].video;
        videos.forEach(v => {
            let created = 1000 * 60 * 60 * 24;
            let d1 = new Date(video.date_created * 1000);
            let d2 = new Date();
            let total = d2.getTime() - d1.getTime();
            let days_created = Math.floor(total / created);
            let days = (req.query.days_old ? parseInt(req.query.days_old) : 1)
            //return (parseInt(days_created) >= parseInt(days));
            if(parseInt(days_created) >= parseInt(days)){
                const result = await GET("svp_delete_video&video_ref=" + video);
            }
        });
    })
    console.log(data.response.video_playlists[0].video_playlist);

});

module.exports = app.start();