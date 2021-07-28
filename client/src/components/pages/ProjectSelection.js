import React, { Component } from "react";
import { get } from "../../utilities";
import ProjectsContainer from "./ProjectsContainer";
import "./ProjectSelection.css";

class ProjectSelection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ProjectSelection-container ">
        <div className="ProjectSelection-projects u-default-shadow">
          {this.props.userId ? (
            <>
              <div className="ProjectSelection-title">My Projects</div>
              <div className="ProjectSelection-projectButtons">
                <div className="ProjectSelection-projectTitle">
                  <div>Project Name</div>
                  <div>Last Edited</div>
                </div>
                <ProjectsContainer
                  userId={this.props.userId}
                  loadProject={this.props.loadProject}
                />
                <div className="ProjectSelection-createNew" onClick={this.props.createNewProject}>
                  Create New Project
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="ProjectSelection-title">Welcome to TreeDocs</div>
              <div>Login to start creating</div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default ProjectSelection;
