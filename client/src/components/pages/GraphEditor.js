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
   * @typedef NodeObject
   * @property {ClassObject} classObject
   * @property {IntPoint} savedPosition
   * @property {bool} isAttachedToCursor
   */

  /**
   * @typedef ConnectionObject // The connecton object id is a concatenation of the startNode.classObject._id and endNode.classObject._id
   * @property {string} startId
   * @property {string} endId
   * @property {bool} startIsInput determines the order of input->output or output->input
   */

  /**
   * @typedef CommentObject
   * @property {string} _id
   * @property {IntPoint} savedPosition
   * @property {IntPoint} savedSize
   * @property {string} text
   * @property {string} color
   * @property {string} title
   *
   */

  /**
   * @typedef GraphObject
   * @property {string} _id
   * @property {string} name
   * @property {NodeObject[]} nodes array of nodes contained within this graph
   * @property {ConnectionObject[]} connections array of connections in this graph
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
      selectedObjectType: "None", // "None", "Node", "Connection", "Comment"
      selectedGraph: { _id: "001", name: "SampleGraph", nodes: [], connections: [], comments: [] },
      propertiesPanelWidth: 300,
      heirarchyPanelWidth: 260,
      toastNotifications: [],
      isDeleteActive: true,
    };
  }

  componentDidMount() {
    document.title = "TreeDocs";
    document.addEventListener("keydown", this.handleKeyPress);
  }

  createCanvasNode = (startPosition) => {
    // Creates a new node, then adds it to the selected graph
    let id = nextId();
    let newCanvasNode = {
      classObject: {
        _id: id,
        name: "NewClass-" + id,
        parent: "NewParent-" + id,
        description: "Blank Description",
        functions: [],
        variables: [],
      },
      isAttachedToCursor: true,
      savedPosition: startPosition,
    };
    this.addNodeToSelectedGraph(newCanvasNode);
  };

  setDeleteActive = (value) => {
    this.setState({ isDeleteActive: value });
  };

  addNodeToSelectedGraph = (newNode) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.nodes = this.state.selectedGraph.nodes.concat([newNode]);
    this.setState({
      selectedGraph: updatedGraph,
    });
    this.selectNode(newNode);
  };

  selectNode = (nodeObj) => {
    //console.log("Selecting: " + JSON.stringify(nodeObj));
    this.setState({
      selectedObject: nodeObj,
      selectedObjectType: "Node",
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
      this.updateSelectedNode(allNodesWithMatchingId[0]);
    }
  };

  updateSelectedNode = (updatedNode) => {
    // Requires that we set both the selected node state and the nodes array
    // of the selected graph
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.nodes = this.state.selectedGraph.nodes.map((node) =>
      node.classObject._id == updatedNode.classObject._id ? updatedNode : node
    );
    this.setState({
      selectedGraph: updatedGraph,
    });
    this.selectNode(updatedNode);
  };

  updateSelectedGraph = (updatedGraph) => {
    this.setState({
      selectedGraph: updatedGraph,
    });
  };

  /********** Connections ***********/
  tryCreateConnection = (connectionObj) => {
    // Filter any connections that are the same two nodes
    let existingConnections = this.state.selectedGraph.connections.filter(function (conn) {
      if (conn.startIsInput == connectionObj.startIsInput) {
        if (conn.startId == connectionObj.startId && conn.endId == connectionObj.endId) {
          return true;
        }
      } else {
        if (conn.startId == connectionObj.endId && conn.endId == connectionObj.startId) {
          return true;
        }
      }
      return false;
    });

    // If the connection already exists, don't create the new one
    if (existingConnections.length > 0) {
      console.log("Connection already exists");
    } else {
      // Create the new one
      console.log("Connection added");
      this.addConnectionToSelectedGraph(connectionObj);
    }
  };

  addConnectionToSelectedGraph = (newConnection) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.connections = this.state.selectedGraph.connections.concat([newConnection]);
    this.setState({
      selectedGraph: updatedGraph,
    });
  };
  /*************** */

  /******** Comments ***************/

  createCommentObject = (startPosition) => {
    // Creates a new node, then adds it to the selected graph
    let id = nextId();
    let newComment = {
      _id: id,
      savedPosition: startPosition,
      savedSize: { x: 200, y: 100 },
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
    if (event.key == "Delete" && this.state.isDeleteActive) {
      this.deleteSelection();
    }
  };

  deleteSelection = () => {
    if (this.state.selectedObject != null) {
      if (this.state.selectedObjectType == "Node") {
        //Delete node
        this.deleteSelectedNode();
      } else if (this.state.selectedObjectType == "Connection") {
        // Delete connection
        this.deleteSelectedConnection();
      } else if (this.state.selectedObjectType == "Comment") {
        // Delete connection
        this.deleteSelectedComment();
      }
    }
  };

  deleteSelectedNode = () => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.nodes = this.state.selectedGraph.nodes.filter(
      (node) => node.classObject._id != this.state.selectedObject.classObject._id
    );

    // Delete any associated connections too
    updatedGraph.connections = this.state.selectedGraph.connections.filter(
      (conn) =>
        conn.startId != this.state.selectedObject.classObject._id &&
        conn.endId != this.state.selectedObject.classObject._id
    );

    this.setState({
      selectedGraph: updatedGraph,
    });
    //this.addToastNotification("Node deleted");
    this.clearSelection();
  };

  deleteSelectedConnection = () => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.connections = this.state.selectedGraph.connections.filter(
      (conn) =>
        conn.startId != this.state.selectedObject.startId ||
        conn.endId != this.state.selectedObject.endId
    );
    this.setState({
      selectedGraph: updatedGraph,
    });
    //this.addToastNotification("Connection deleted");

    this.clearSelection();
  };

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
          selectClass={this.selectClassObject}
          panelWidth={this.state.heirarchyPanelWidth}
          handleResize={this.handleResizeHeirarchyPanel}
        />
        <CanvasPanel
          createNodeObject={this.createCanvasNode}
          createCommentObject={this.createCommentObject}
          selectNode={this.selectNode}
          selectedGraph={this.state.selectedGraph}
          selectedObject={this.state.selectedObject}
          selectedObjectType={this.state.selectedObjectType}
          tryCreateConnection={this.tryCreateConnection}
          updateSelectedNode={this.updateSelectedNode}
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
          updateSelectedNode={this.updateSelectedNode}
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
