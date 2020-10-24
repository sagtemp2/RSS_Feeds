import React, {useState, useEffect, useRef} from 'react'
import './create.css'
import Button from '../common/Button'
import useOnClickOutside from "../../hooks/useOnClickOutside"
import {ServerPath} from "../../utils/constants"
import rssFeedParser from "../../utils/rssFeedParser"
import axios from 'axios'

function CreateModal({toggleCreatePorjectModal, fetchProjects}) {
    const createModalRef = useRef()
    const handleOutsideCreateModalClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleCreatePorjectModal(false)
    }
    useOnClickOutside(createModalRef, handleOutsideCreateModalClick)

    const [formObj, setFormObj] = useState({name: "", link: "", error: ""})
    const handleNameChange = (e) => {
        e.persist();
        setFormObj(state => ({...state, name: e.target.value}))
    }

    const handleLinkChange = (e) => {
        e.persist();
        setFormObj(state => ({...state, link: e.target.value}))
    } 

    function validateLinkAndCreateProject() {
            if(formObj.link.trim() === "" || formObj.name.trim() === "") {
                setFormObj(state => ({...state, error: "ALL fields are mandatory, please enter Project Name and Feed Link to create project."}))
                return
            }
            
            rssFeedParser(formObj.link.trim())
                .then((res) => {
                    axios.post(`${ServerPath}/projects/create`, {
                        name: formObj.name, 
                        link: formObj.link
                    })
                    .then(response => {
                        if(response.data.error) {
                            setFormObj(state => ({...state, error: "Something went wrong. Please try again after some time."}))
                        } else {
                            fetchProjects()
                            toggleCreatePorjectModal(false)
                        }  
                    })
                })
                .catch((err) => {
                    setFormObj(state => ({...state, error: err.msg})) 
                })
    }

    const projectNameRef = useRef()
    useEffect(() => {
        projectNameRef.current.focus()
    }, [])

    return  (
        <div className="create-modal-container" >
            <div ref={createModalRef}>
                <div>
                    <div className="feed-modal-close-icon" onClick={() => toggleCreatePorjectModal(false)}>
                        <div>
                            <div>X</div>
                        </div>
                    </div>
                    <div className="create-modal-header">Create Project</div>
                    <div className="create-modal-block">
                        <div className="label">Project Name:</div>
                        <div>
                            <input ref={projectNameRef} 
                                   value={formObj.name} 
                                   placeholder="Example: New Yorker Feeds" 
                                   onChange={(e) => handleNameChange(e)} />
                            <div className="desc">Enter Project name, for which you are going to setup rss feed. For Example: "New Yorker Feeds"</div>
                        </div>
                    </div>
                    <div className="create-modal-block">
                        <div className="label">Feed link:</div>
                        <div>
                            <input value={formObj.link} placeholder="Example: https://www.newyorker.com/feed/humor" onChange={(e) => handleLinkChange(e)}/>
                            <div className="desc">Enter feed link, for which you are going to recieve rss feeds. For Example: "https://www.newyorker.com/feed/humor"</div>
                        </div>
                    </div>
                    <div className={formObj.error?"error":"hidden error"}>{formObj.error? formObj.error : "hidden"}</div>
                    <div className="create-modal-button">
                        <Button handleClick={() => validateLinkAndCreateProject()}>Create</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateModal