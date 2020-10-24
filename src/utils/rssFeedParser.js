import Parser from 'rss-parser'
import {CORS_PROXY} from './constants'

const rssFeedParser = (link) => {
    return new Promise((resolve, reject) => {
        let parser = new Parser();
        parser.parseURL(CORS_PROXY + link.trim(), function(err, feeds) {
            if(err) {
                reject({error:true, msg: "Link is not valid. Please try other link"}) 
            }
            if(feeds) {
                if(feeds.hasOwnProperty("items")) {
                    resolve({feeds: feeds.items})
                } else {
                    reject({error: true, msg: "Our application does not support this rss link. Please try for other rss link."}) 
                }
            }
            reject({error:true, msg: "Something went wrong."})
        })
    })
}

export default rssFeedParser