import React, { Component } from "react";
import NavBar from "./modules/NavBar/NavBar.js";
import { Router } from "@reach/router";
import GraphEditor from "./pages/GraphEditor.js";
import NotFound from "./pages/NotFound.js";
import nextId from "react-id-generator";

import { get, post } from "../utilities";

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";

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
      selectedProject: {
        graphs: [
          {
            _id: "001",
            name: "SampleGraph",
            comments: [],
            classNodeIds: [],
          },
        ],
        classes: [],
      },
      selectedGraph: {
        _id: "001",
        name: "SampleGraph",
        comments: [],
        classNodeIds: [],
      },
    };
  }

  componentDidMount() {
    /*get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id, userName: user.name, userStatus: user.status });
      }
    });*/
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

  addClassNodeToGraph = (id) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classNodeIds = this.state.selectedGraph.classNodeIds.concat([id]);
    this.updateSelectedGraph(updatedGraph);
  };

  addNewGraphToProject = () => {
    let id = nextId();
    let newGraph = { _id: id, name: "NewGraph_" + id, comments: [], classNodeIds: [] };
    let updatedProject = Object.assign({}, this.state.selectedProject);
    updatedProject.graphs = this.state.selectedProject.graphs.concat([newGraph]);
    this.updateSelectedProject(updatedProject);
  };

  updateSelectedProject = (updatedProject) => {
    this.setState({
      selectedProject: updatedProject,
    });
  };

  updateSelectedClass = (updatedClass) => {
    // Requires that we set both the selected node state and the nodes array
    // of the selected graph
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
    this.setState({ selectedGraph: newGraph });
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
        />
        <Router className="App-lower-container">
          <GraphEditor
            path="/"
            userId={this.state.userId}
            userStatus={this.state.userStatus}
            selectedProject={this.state.selectedProject}
            selectedGraph={this.state.selectedGraph}
            addClassToProject={this.addClassToProject}
            updateSelectedClass={this.updateSelectedClass}
            updateSelectedGraph={this.updateSelectedGraph}
            updateSelectedProject={this.updateSelectedProject}
            addClassNodeToGraph={this.addClassNodeToGraph}
            addNewGraphToProject={this.addNewGraphToProject}
            selectGraph={this.selectGraph}
          />
          <NotFound default />
        </Router>
      </div>
    );
  }
}

export default App;
