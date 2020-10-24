import React from 'react'
import Button from '../common/Button'
import {ServerPath} from "../../utils/constants"
import axios from "axios"

function ProjectThumbnail({projectObj, setSelectedProject, removeProjectFromList}) {

    const handleDeleteClick = (uid) => {
        axios.delete(`${ServerPath}/projects/delete/${uid}`)
            .then(res => removeProjectFromList(uid))
            .catch((err) => console.log(err))
    } 

    return (
        <div className="project-thumbnail-container">
            <div className="delete-icon" onClick={() => handleDeleteClick(projectObj.uid)}><span class="material-icons">delete_outline</span></div>
            <span className="ellipsis inline-block thumbail-title">{projectObj.name}</span>
            <div className="view-button-container"><Button handleClick={() => setSelectedProject(projectObj)}>View</Button></div>
        </div>
    )
}

export default ProjectThumbnail