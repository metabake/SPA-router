
import { Serv } from 'mbake/lib/Serv';

//const yaml = require('js-yaml');
var request = require('request'); // use super agent

const srv = new Serv(['*'])

const port = 3000;
const host = '0.0.0.0';

srv.handleRRoute("news", 'getNews', (req, res) => {
    const method = req.fields.method
    const params = JSON.parse(req.fields.params)
    console.info("--params:", params)
    const resp: any = {} // new response that will be set via the specific method passed

    if ('getNews' == method) {
        resp['type '] = '' // string
        resp['ispacked'] = false
        var pageSize = 20
        var page = params['page']
        console.info("--page:", page)

        request({
            url: "https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=" + pageSize + "&page=" + page + "&apiKey=c75812bea33d40efb539400d39f99c32",
            method: 'GET',
        }, function (error, response, body) {
            // console.info("--response:", response)
            var result = JSON.parse(body)
            console.info("--body:", result.status)
            if (result.status == 'ok') {
                let articles = result['articles'].map(function (article) {
                    let temp = article
                    let randomID = '_' + Math.random().toString(36).substr(2, 9)
                    temp['id'] = randomID
                    return temp
                })
                var feeds = {}
                feeds['articles'] = articles
                feeds['totalResults'] = result['totalResults']
                resp.result = feeds
                console.log("TCL: resp", resp)
                res.json(resp); //res is the response object, and it passes info back to client-side
            }
        });
    } else {
        resp.errorLevel = -1
        resp.errorMessage = 'mismatch'
        console.log('noway', resp)
        res.json(resp)
    }
    console.info()
});

srv.appInst.listen(port, () => {
    console.info(`app RPC listening on port ${port}!`);
});