import React, { Component } from "react";
import NavBar from "./modules/NavBar/NavBar.js";
import { Router } from "@reach/router";
import GraphEditor from "./pages/GraphEditor.js";
import NotFound from "./pages/NotFound.js";
import nextId from "react-id-generator";

import { get, post } from "../utilities";
import moment from "moment";

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";
import ProjectSelection from "./pages/ProjectSelection.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      userName: undefined,
      userStatus: undefined,
      selectedProject: undefined,
      selectedGraph: undefined,
      savedCanvasData: undefined,
      saveSuccessful: false,
    };
  }

  createNewProject = () => {
    let firstGraphId = "Graph_" + Date.now();
    let newProject = {
      graphs: [
        {
          _id: firstGraphId,
          name: "SampleGraph",
          comments: [],
          classNodeIds: [],
        },
      ],
      classes: [],
      name: "Untitled Project",
    };
    let data = {
      project: newProject,
      canvas: [{ _id: firstGraphId, nodes: [], connections: [], commentNodes: [] }],
    };
    const fileData = JSON.stringify(data);
    const body = {
      projectData: fileData,
      name: newProject.name,
      dateModified: moment().format("MMMM Do YYYY, h:mm a"),
    };
    post("/api/project", body).then((project) => {
      // console.log(project._id);
      // console.log(project.creator_id);
      // console.log(JSON.parse(project.projectData));
      let parsedData = JSON.parse(project.projectData);
      parsedData.project._id = project._id; // Get mongo ID
      this.setState({
        selectedProject: parsedData.project,
        selectedGraph: parsedData.project.graphs[0],
        savedCanvasData: parsedData.canvas,
      });
    });
  };

  loadProject = (newProjectId) => {
    get("api/projectSingle", { _id: newProjectId }).then((project) => {
      console.log("Loaded " + JSON.stringify(project));
      project.project._id = newProjectId;
      this.setState({
        selectedProject: project.project,
        selectedGraph: project.project.graphs[0],
        savedCanvasData: project.canvas,
      });
    });
  };

  handleSaveToPC = (canvasData) => {
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.graphs = this.state.selectedProject.graphs.map((g) =>
      g._id == this.state.selectedGraph._id ? this.state.selectedGraph : g
    );
    this.setState(
      {
        selectedProject: updatedProject,
      },
      () => {
        let data = { project: this.state.selectedProject, canvas: canvasData };
        const fileData = JSON.stringify(data);
        const body = {
          projectData: fileData,
          name: this.state.selectedProject.name,
          _id: this.state.selectedProject._id,
          dateModified: moment().format("MMMM Do YYYY, h:mm a"),
        };
        console.log("Saving, ID: " + body._id);
        post("/api/projectUpdate", body).then(this.setState({ saveSuccessful: true }));
      }
    );
  };

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id, userName: user.name, userStatus: user.status });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      console.log(user.name);

      this.setState({ userId: user._id, userName: user.name, userStatus: user.status });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  addClassToProject = (newClassObject) => {
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.classes = this.state.selectedProject.classes.concat([newClassObject]);
    this.setState(
      {
        selectedProject: updatedProject,
      },
      () => this.addClassNodeToGraph(newClassObject._id)
    );
  };

  onProjectNameChange = (event) => {
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.name = event.target.value;
    this.setState({ selectedProject: updatedProject });
  };

  deleteClassFromProject = (classToDelete) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classNodeIds = this.state.selectedGraph.classNodeIds.filter(
      (nodeId) => nodeId != classToDelete._id
    );
    this.updateSelectedGraph(updatedGraph);

    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.classes = this.state.selectedProject.classes.filter(
      (c) => c._id != classToDelete._id
    );
    this.setState({
      selectedProject: updatedProject,
    });
  };

  addClassNodeToGraph = (id) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classNodeIds = this.state.selectedGraph.classNodeIds.concat([id]);
    this.updateSelectedGraph(updatedGraph);
  };

  addNewGraphToProject = () => {
    let id = "Graph_" + Date.now();
    let newGraph = { _id: id, name: "NewGraph", comments: [], classNodeIds: [] };
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.graphs = this.state.selectedProject.graphs.concat([newGraph]);
    this.updateSelectedProject(updatedProject);
  };

  updateSelectedProject = (updatedProject) => {
    this.setState({
      selectedProject: updatedProject,
    });
  };

  updateClass = (updatedClass) => {
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.classes = this.state.selectedProject.classes.map((c) =>
      c._id == updatedClass._id ? updatedClass : c
    );
    this.setState({
      selectedProject: updatedProject,
    });
  };

  updateSelectedGraph = (updatedGraph) => {
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.graphs = this.state.selectedProject.graphs.map((g) =>
      g._id == updatedGraph._id ? updatedGraph : g
    );
    this.setState({
      selectedGraph: updatedGraph,
      selectedProject: updatedProject,
    });
  };

  selectGraph = (newGraph) => {
    // Delete any nodeIds associated to classes deleted
    newGraph.classNodeIds = newGraph.classNodeIds.filter((nodeId) => {
      let exists = false;
      for (var i = 0; i < this.state.selectedProject.classes.length; i++) {
        if (this.state.selectedProject.classes[i]._id == nodeId) {
          exists = true;
        }
        for (var j = 0; j < this.state.selectedProject.classes[i].functions.length; j++) {
          if (this.state.selectedProject.classes[i].functions[j]._id == nodeId) {
            exists = true;
          }
        }
      }
      return exists;
    });
    this.setState({ selectedGraph: newGraph });
  };

  onSaveBoxClose = () => {
    this.setState({ saveSuccessful: false });
  };

  // required method: whatever is returned defines what
  // shows up on screen
  render() {
    return (
      // <> is like a <div>, but won't show
      // up in the DOM tree
      <div className="App-container u-flexColumn">
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
          userName={this.state.userName}
          userStatus={this.state.userStatus}
          selectedGraph={this.state.selectedGraph}
          updateSelectedGraph={this.updateSelectedGraph}
          selectedProject={this.state.selectedProject}
          onProjectNameChange={this.onProjectNameChange}
          saveSuccessful={this.state.saveSuccessful}
          onSaveBoxClose={this.onSaveBoxClose}
        />
        <Router className="App-lower-container">
          {this.state.selectedProject && this.state.userId ? (
            <>
              <GraphEditor
                path="/"
                userId={this.state.userId}
                userStatus={this.state.userStatus}
                selectedProject={this.state.selectedProject}
                selectedGraph={this.state.selectedGraph}
                addClassToProject={this.addClassToProject}
                updateClass={this.updateClass}
                updateSelectedGraph={this.updateSelectedGraph}
                updateSelectedProject={this.updateSelectedProject}
                addClassNodeToGraph={this.addClassNodeToGraph}
                addNewGraphToProject={this.addNewGraphToProject}
                selectGraph={this.selectGraph}
                deleteClass={this.deleteClassFromProject}
                handleSaveToPC={this.handleSaveToPC}
                savedCanvasData={this.state.savedCanvasData}
              />
            </>
          ) : (
            <ProjectSelection
              path="/"
              createNewProject={this.createNewProject}
              userId={this.state.userId}
              loadProject={this.loadProject}
            />
          )}
          <NotFound default />
        </Router>
      </div>
    );
  }
}

export default App;
