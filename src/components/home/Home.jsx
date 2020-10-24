import React, {useState,useEffect} from 'react'
import ProjectDashboard from './ProjectsDashboard'
import './home.css'
import FeedModal from '../feed/FeedModal'
import CreateModal from '../create/CreateModal'
import {ServerPath} from "../../utils/constants"
import axios from 'axios'

function Home() {
    const [selectedProject, setSelectedProject] = useState(null)

    const [projectsObj, setProjectsObj] = useState({projects: [], isLoading: true, showCreate: false})
    const fetchProjects = () => {
        axios.get(`${ServerPath}/projects/list`)
		.then(response => {
            setProjectsObj( state => ({
                ...state,
                projects: response.data ? response.data: [],
                isLoading: false
            }))
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchProjects()    
    }, [])

    const toggleCreatePorjectModal = (value) => {
        setProjectsObj(state => ({...state, showCreate: value}))
    }

    const removeProjectFromList = (uid) => {
        let projects = [...projectsObj.projects].filter((obj, i) => obj.uid !== uid)
        setProjectsObj(state => ({...state, projects}))
    }
    
    return (
    <div>
        <div className="home-title">RSS Projects</div>
        <div className="home-desc">RSS Projects lets you check current rss feeds so you can stay upto date with latest development.</div>
        {projectsObj.isLoading 
            ? <div className="loader"></div>
            : <React.Fragment>
                <ProjectDashboard   
                    setSelectedProject={setSelectedProject} 
                    dataStore={projectsObj}
                    toggleCreatePorjectModal={toggleCreatePorjectModal}
                    removeProjectFromList={removeProjectFromList}
                />
                {selectedProject && <FeedModal selectedProject={selectedProject} setSelectedProject={setSelectedProject}/>}
                {projectsObj.showCreate && <CreateModal toggleCreatePorjectModal={toggleCreatePorjectModal} fetchProjects={fetchProjects}/>}
              </React.Fragment>}
    </div>
    )
}

export default Home