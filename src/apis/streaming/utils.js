const parseXML = require('xml2js').parseString;
const request = require('request');

const { STREAMING_HOST, STREAMING_KEY, STREAMING_CODE } = process.env;

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

module.exports = { GET }