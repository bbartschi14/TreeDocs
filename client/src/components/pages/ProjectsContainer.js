import React, { Component } from "react";
import { get } from "../../utilities";
import "./ProjectSelection.css";

class ProjectsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { savedProjects: [] };
  }

  componentDidMount() {
    console.log("getting with " + this.props.userId);
    get("api/projectNames", { creator_id: this.props.userId }).then((projects) => {
      console.log(projects);
      this.setState({
        savedProjects: projects,
      });
    });
  }

  render() {
    return (
      <>
        {this.state.savedProjects.map((project) => (
          <div
            key={project._id}
            className="ProjectSelection-project"
            onClick={() => {
              this.props.loadProject(project._id);
            }}
          >
            <div>{project.name}</div>
            <div>{project.dateModified}</div>
          </div>
        ))}
      </>
    );
  }
}

export default ProjectsContainer;
