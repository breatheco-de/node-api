const app = require('../../../app')('streaming/hook');
const GET = require('../utils').GET;

app.get('*', async function (req, resp) {
    const data = await GET("svp_list_video_playlists");
    const playlists = data.response.video_playlists[0].video_playlist;
    let deletedVideos = [];
    playlists.forEach(async p => {
        const data = await GET("svp_list_videos&channel_ref=" + p.ref_no);
        if(data.response.video_list){
            const videos = data.response.video_list[0].video;
            videos.forEach(async video => {
                let created = 1000 * 60 * 60 * 24;
                let d1 = new Date(video.date_created * 1000);
                let d2 = new Date();
                let total = d2.getTime() - d1.getTime();
                let days_created = Math.floor(total / created);
                let days = (req.query.days_old ? parseInt(req.query.days_old) : 90)
                //return (parseInt(days_created) >= parseInt(days));
                if(parseInt(days_created) >= parseInt(days)){
                    console.log(`Should delete from ${p.title} because it has ${days_created} days old ${video.clip_key}`);
                    deletedVideos.push({ cohort: p.title, days_old: days_created, ref_no: video.ref_no });
                    const result = await GET("svp_delete_video&video_ref=" + video.ref_no);
                }
            });
        }
    });
    resp.send(`
        <p>Videos deleted: ${deletedVideos.length}</p>
        <ul>
            ${deletedVideos.map(v => `<li>Cohort: ${v.cohort}, days_old: ${v.days_old}, ref: ${v.ref_no}</li>`)}
        </ul>
    `);
});

module.exports = app.start();