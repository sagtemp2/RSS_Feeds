import React, {useState, useEffect, useRef} from 'react'
import './feed.css'
import Parser from 'rss-parser'
import Feed from './Feed'
import useOnClickOutside from "../../hooks/useOnClickOutside"

function FeedModal({selectedProject, setSelectedProject}) {
    const feedModalRef = useRef()
    const handleFeedModalOutsideClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setSelectedProject(null)
    }
    useOnClickOutside(feedModalRef,handleFeedModalOutsideClick)

    const [feedsObj, setfeedsObj] = useState({feeds:[], isLoading: true, errorMsg: "", refresh: 0}) 
    useEffect(() => {
        let parser = new Parser();
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
        parser.parseURL(CORS_PROXY + selectedProject.link, function(err, feeds) {
            if(err) {
                setfeedsObj(state => ({...state, 
                            isLoading: false, 
                            errorMsg: "Something went wrong, please try again after some time."}))
            }
            if(feeds) {
                if(feeds.hasOwnProperty("items")) {
                    if(feeds.items.length > 0) {
                        setfeedsObj(state => ({
                            ...state,
                            feeds: feeds.items,
                            isLoading: false,
                            errorMsg: ""
                        }))
                    } else {
                        setfeedsObj(state => ({
                            ...state,
                            feeds: [],
                            isLoading: false,
                            errorMsg: `Currently, No Feeds available. Please try again later.`
                        }))    
                    }
                } else {
                    setfeedsObj(state => ({
                        ...state,
                        isLoading: false,
                        errorMsg: "Our application does not support current rss link. Please try for other rss link."
                    }))
                }
            } 
        })    
    }, [feedsObj.refresh])

    return  (
        <div className="feed-modal-container" >
            <div ref={feedModalRef}>
                <div>
                    <div className="feed-modal-close-icon" onClick={() => setSelectedProject(null)}>
                        <div>
                            <div>X</div>
                        </div>
                    </div>
                    <div className="feed-modal-refresh-icon" >
                        <div>
                            <i class="material-icons" onClick={() => setfeedsObj({...feedsObj, feeds:[], isLoading: true, errorMsg: "", refresh: feedsObj.refresh + 1})}>refresh</i>
                        </div>
                    </div>
                    <div className="feed-modal-title">{selectedProject.name}</div>
                    {feedsObj.isLoading 
                        ? <div className="loader"></div>
                        : <React.Fragment>
                          {
                            feedsObj.errorMsg 
                                ? <div>{feedsObj.errorMsg}</div>
                                : <div>
                                    {feedsObj.feeds.map((feed, i) => <Feed key={feed.link ? `${feed.link}-${i}` : i} feed={feed}/>)}
                                </div> 
                          }
                          </React.Fragment>
                    }    
                </div>
            </div>
        </div>
    )
}

export default FeedModal