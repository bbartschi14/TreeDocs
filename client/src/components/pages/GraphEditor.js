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
   * @property {ClassObject} parent
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
      selectedGraph: {
        _id: "001",
        name: "SampleGraph",
        nodes: [],
        comments: [],
        classes: [],
      },
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
      parent: "NewParent-" + id,
      description: "Blank Description",
      functions: [],
      variables: [],
    };
    this.addClassToSelectedGraph(newClassObject);
    this.selectClass(newClassObject);
  };

  setDeleteActive = (value) => {};

  addClassToSelectedGraph = (newClassObject) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classes = this.state.selectedGraph.classes.concat([newClassObject]);
    this.setState({
      selectedGraph: updatedGraph,
    });
  };

  selectClass = (classObj) => {
    //console.log("Selecting: " + JSON.stringify(classObj));
    this.setState({
      selectedObject: classObj,
      selectedObjectType: "Class",
    });
  };

  selectConnection = (connectionObj) => {
    this.setState({
      selectedObject: connectionObj,
      selectedObjectType: "Connection",
    });
  };

  selectClassObject = (classObject) => {
    let allNodesWithMatchingId = this.state.selectedGraph.nodes.filter(
      (node) => node.classObject._id == classObject._id
    );
    if (allNodesWithMatchingId.length == 1) {
      this.updateSelectedClass(allNodesWithMatchingId[0]);
    }
  };

  updateSelectedClass = (updatedClass) => {
    // Requires that we set both the selected node state and the nodes array
    // of the selected graph
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classes = this.state.selectedGraph.classes.map((c) =>
      c._id == updatedClass._id ? updatedClass : c
    );
    this.setState({
      selectedGraph: updatedGraph,
    });
    this.selectClass(updatedClass);
  };

  updateSelectedGraph = (updatedGraph) => {
    this.setState({
      selectedGraph: updatedGraph,
    });
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
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.comments = this.state.selectedGraph.comments.concat([newComment]);
    this.setState({
      selectedGraph: updatedGraph,
    });
    this.selectComment(newComment);
  };

  updateSelectedComment = (updatedComment) => {
    //console.log(JSON.stringify(updatedComment));
    // Requires that we set both the selected state and the array
    // of the selected graph
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.comments = this.state.selectedGraph.comments.map((comment) =>
      comment._id == updatedComment._id ? updatedComment : comment
    );
    this.setState({
      selectedGraph: updatedGraph,
    });
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
        this.deleteSelectedClass();
      } else if (this.state.selectedObjectType == "Comment") {
        // Delete comment
        this.deleteSelectedComment();
      }
    }
  };

  deleteSelectedClass = () => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.classes = this.state.selectedGraph.classes.filter(
      (c) => c._id != this.state.selectedObject._id
    );

    this.setState({
      selectedGraph: updatedGraph,
    });
    //this.addToastNotification("Node deleted");
    this.clearSelection();
  };

  //

  deleteSelectedComment = () => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.comments = this.state.selectedGraph.comments.filter(
      (comment) => comment._id != this.state.selectedObject._id
    );
    this.setState({
      selectedGraph: updatedGraph,
    });
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

  render() {
    return (
      <>
        <HeirarchyPanel
          selectedGraph={this.state.selectedGraph}
          selectedObject={this.state.selectedObject}
          selectedObjectType={this.state.selectedObjectType}
          selectClass={this.selectClass}
          panelWidth={this.state.heirarchyPanelWidth}
          handleResize={this.handleResizeHeirarchyPanel}
        />
        <CanvasPanel
          createClassObject={this.createClassObject}
          createCommentObject={this.createCommentObject}
          selectClass={this.selectClass}
          selectedGraph={this.state.selectedGraph}
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
        />
        <PropertiesPanel
          selectedObject={this.state.selectedObject}
          selectedObjectType={this.state.selectedObjectType}
          updateSelectedClass={this.updateSelectedClass}
          panelWidth={this.state.propertiesPanelWidth}
          handleResize={this.handleResizePropertiesPanel}
          updateSelectedComment={this.updateSelectedComment}
        />
        <GraphTitle
          updateSelectedGraph={this.updateSelectedGraph}
          currentGraph={this.state.selectedGraph}
        />
      </>
    );
  }
}

export default GraphEditor;
