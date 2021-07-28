import React, { Component } from "react";
import CanvasPanel from "../modules/Canvas/CanvasPanel.js";
import HeirarchyPanel from "../modules/Heirarchy (LeftBar)/HeirarchyPanel.js";
import PropertiesPanel from "../modules/Properties (RightBar)/PropertiesPanel.js";
import GraphTitle from "../modules/NavBar/GraphTitle.js";
import nextId from "react-id-generator";
import "./GraphEditor.css";
import { connect } from "mongoose";

/**
 * Page component for graph editing.
 *
 * Proptypes
 * @None
 */
class GraphEditor extends Component {
  /**
   * @typedef VariableObject // Variable object wraps the simpler parameter object with parent data and a unique id
   * @property {ClassObject} parent
   * @property {string} _id
   * @property {ParameterObject} parameterObject
   */

  /**
   * @typedef ParameterObject
   * @property {string} name
   * @property {string} typeName
   * @property {int} type (see VARIABLE_TYPES)
   */

  /**
   * @typedef FunctionObject
   * @property {string} parentName
   * @property {string} _id
   * @property {string} name
   * @property {ParameterObject} returnValue
   * @property {[ParameterObject]} parameters
   */

  /**
   * @typedef ClassObject
   * @property {string} _id
   * @property {string} name
   * @property {string} parent
   * @property {string} description
   * @property {FunctionObject[]} functions
   * @property {VariableObject[]} variables
   */

  /**
   * @typedef CommentObject
   * @property {string} _id
   * @property {string} text
   * @property {string} color
   * @property {string} title
   *
   */

  /**
   * @typedef GraphObject
   * @property {string} _id
   * @property {string} name
   * @property {ClassObject[]} classes
   * @property {CommentObject[]} comments array of comments
   */

  /**
   * @typedef ToastObject
   * @property {int} timeCreated
   * @property {string} message
   */

  constructor(props) {
    super(props);
    this.state = {
      selectedObject: null,
      selectedObjectType: "None", // "None", "Class", "Connection", "Comment"
      propertiesPanelWidth: 300,
      heirarchyPanelWidth: 260,
      toastNotifications: [],
    };
  }

  componentDidMount() {
    document.title = "TreeDocs";
    document.addEventListener("keydown", this.handleKeyPress);
  }

  createClassObject = (id) => {
    // Creates a new class, then adds it to the selected graph
    let newClassObject = {
      _id: id,
      name: "NewClass-" + id,
      parent: "Parent",
      description: "Blank Description",
      functions: [],
      variables: [],
    };
    this.props.addClassToProject(newClassObject);
    this.selectClass(newClassObject);
  };

  setDeleteActive = (value) => {};

  selectClass = (classObj) => {
    //console.log("Selecting: " + JSON.stringify(classObj));
    this.setState({
      selectedObject: classObj,
      selectedObjectType: "Class",
    });
  };

  selectFunction = (functionObj) => {
    this.setState({
      selectedObject: functionObj,
      selectedObjectType: "Function",
    });
  };

  selectConnection = (connectionObj) => {
    this.setState({
      selectedObject: connectionObj,
      selectedObjectType: "Connection",
    });
  };

  updateSelectedClass = (updatedClass) => {
    // Requires that we set both the selected node state and the nodes array
    // of the selected graph
    this.selectClass(updatedClass);
    this.props.updateClass(updatedClass);
  };

  updateSelectedFunction = (updatedFunction) => {
    this.selectFunction(updatedFunction);
    let correspondingClass = this.props.selectedProject.classes.filter(
      (c) => c._id == updatedFunction.parentId
    )[0];
    let updatedClass = Object.assign({}, correspondingClass);
    updatedClass.functions = correspondingClass.functions.map((f) =>
      f._id == updatedFunction._id ? updatedFunction : f
    );
    this.props.updateClass(updatedClass);
  };

  /******** Comments ***************/

  createCommentObject = (id) => {
    let newComment = {
      _id: id,
      text: "Click here to edit text",
      color: "#fffd8699",
      title: "Title",
    };
    this.addCommentToSelectedGraph(newComment);
  };

  addCommentToSelectedGraph = (newComment) => {
    let updatedGraph = Object.assign({}, this.props.selectedGraph);
    updatedGraph.comments = this.props.selectedGraph.comments.concat([newComment]);
    this.props.updateSelectedGraph(updatedGraph);
    this.selectComment(newComment);
  };

  updateSelectedComment = (updatedComment) => {
    //console.log(JSON.stringify(updatedComment));
    // Requires that we set both the selected state and the array
    // of the selected graph
    let updatedGraph = Object.assign({}, this.props.selectedGraph);
    updatedGraph.comments = this.props.selectedGraph.comments.map((comment) =>
      comment._id == updatedComment._id ? updatedComment : comment
    );
    this.props.updateSelectedGraph(updatedGraph);
    this.selectComment(updatedComment);
  };

  selectComment = (commentObj) => {
    //console.log("Selecting: " + JSON.stringify(commentObj));
    this.setState({
      selectedObject: commentObj,
      selectedObjectType: "Comment",
    });
  };

  /******************************* */

  /******** Panel Resizing *********/
  handleResizeHeirarchyPanel = (amount) => {
    this.setState({ heirarchyPanelWidth: this.state.heirarchyPanelWidth + amount });
  };

  handleResizePropertiesPanel = (amount) => {
    this.setState({ propertiesPanelWidth: this.state.propertiesPanelWidth - amount });
  };
  /********************************/

  /******* Hotkey Handling *************/

  handleKeyPress = (event) => {
    if (event.key == "Delete") {
      this.deleteSelection();
    }
  };

  deleteSelection = () => {
    if (this.state.selectedObject != null) {
      if (this.state.selectedObjectType == "Class") {
        //Delete class
        // this.deleteSelectedClassNode();
      } else if (this.state.selectedObjectType == "Comment") {
        // Delete comment
        this.deleteSelectedComment();
      }
    }
  };

  deleteClass = (id) => {
    let updatedProject = Object.assign({}, this.props.selectedProject);
    updatedProject.classes = this.props.selectedProject.classes.filter(
      (c) => c._id != this.state.selectedObject._id
    );

    this.props.updateSelectedProject(updatedProject);
    //this.addToastNotification("Node deleted");
    this.clearSelection();
  };

  //

  deleteSelectedComment = () => {
    let updatedGraph = Object.assign({}, this.props.selectedGraph);
    updatedGraph.comments = this.props.selectedGraph.comments.filter(
      (comment) => comment._id != this.state.selectedObject._id
    );
    this.props.updateSelectedGraph(updatedGraph);
    this.clearSelection();
  };

  clearSelection = () => {
    this.setState({ selectedObject: null, selectedObjectType: "None" });
  };

  /********************* */

  addToastNotification = (text) => {
    if (this.state.toastNotifications.length < 6) {
      this.setState({
        toastNotifications: this.state.toastNotifications.concat([
          { message: text, timeCreated: Date.now() },
        ]),
      });
    }
  };

  removeToastNotification = (toastObject) => {
    let updatedToasts = Object.assign({}, this.state.toastNotifications);
    updatedToasts = this.state.toastNotifications.filter(
      (toast) => toast.timeCreated != toastObject.timeCreated
    );
    this.setState({
      toastNotifications: updatedToasts,
    });
  };

  handleDeleteClassFromProject = (classToDelete) => {
    this.clearSelection();
    this.props.deleteClass(classToDelete);
  };

  render() {
    return (
      <>
        <CanvasPanel
          selectedProject={this.props.selectedProject}
          createClassObject={this.createClassObject}
          createCommentObject={this.createCommentObject}
          deleteSelectedComment={this.deleteSelectedComment}
          selectClass={this.selectClass}
          selectFunction={this.selectFunction}
          selectedGraph={this.props.selectedGraph}
          selectedObject={this.state.selectedObject}
          selectedObjectType={this.state.selectedObjectType}
          onConnectionSelected={this.selectConnection}
          toastNotifications={this.state.toastNotifications}
          addToastNotification={this.addToastNotification}
          removeToastNotification={this.removeToastNotification}
          setDeleteActive={this.setDeleteActive}
          selectComment={this.selectComment}
          updateSelectedComment={this.updateSelectedComment}
          deselectObjects={this.clearSelection}
          updateSelectedGraph={this.props.updateSelectedGraph}
          addClassNodeToGraph={this.props.addClassNodeToGraph}
          handleSaveToPC={this.props.handleSaveToPC}
        >
          <HeirarchyPanel
            selectedProject={this.props.selectedProject}
            selectedGraph={this.props.selectedGraph}
            selectedObject={this.state.selectedObject}
            selectedObjectType={this.state.selectedObjectType}
            selectClass={this.selectClass}
            selectFunction={this.selectFunction}
            panelWidth={this.state.heirarchyPanelWidth}
            handleResize={this.handleResizeHeirarchyPanel}
            addNewGraphToProject={this.props.addNewGraphToProject}
            selectGraph={this.props.selectGraph}
            deleteClass={this.handleDeleteClassFromProject}
          />
        </CanvasPanel>
        <PropertiesPanel
          selectedObject={this.state.selectedObject}
          selectedObjectType={this.state.selectedObjectType}
          updateSelectedClass={this.updateSelectedClass}
          updateSelectedFunction={this.updateSelectedFunction}
          panelWidth={this.state.propertiesPanelWidth}
          handleResize={this.handleResizePropertiesPanel}
          updateSelectedComment={this.updateSelectedComment}
        />
      </>
    );
  }
}

export default GraphEditor;
