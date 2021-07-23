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
   * @typedef FunctionObject
   * @property {ClassObject} parent
   * @property {string} _id
   * @property {string} name
   */

  /**
   * @typedef ClassObject
   * @property {string} _id
   * @property {string} name
   * @property {string} parent
   * @property {string} description
   * @property {FunctionObject[]} functions
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
   * @typedef GraphObject
   * @property {string} _id
   * @property {string} name
   * @property {NodeObject[]} nodes array of nodes contained within this graph
   * @property {ConnectionObject[]} connections array of connections in this graph
   */

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
      selectedGraph: { _id: "001", name: "SampleGraph", nodes: [], connections: [] },
    };
  }

  componentDidMount() {
    document.title = "TreeDocs";
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
      },
      isAttachedToCursor: true,
      savedPosition: startPosition,
    };
    this.addNodeToSelectedGraph(newCanvasNode);
  };

  addNodeToSelectedGraph = (newNode) => {
    let updatedGraph = Object.assign({}, this.state.selectedGraph);
    updatedGraph.nodes = this.state.selectedGraph.nodes.concat([newNode]);
    this.setState({
      selectedGraph: updatedGraph,
      selectedNode: newNode,
    });
  };

  selectNode = (nodeObj) => {
    //console.log("Selecting: " + JSON.stringify(nodeObj));
    this.setState({
      selectedNode: nodeObj,
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
      selectedNode: updatedNode,
      selectedGraph: updatedGraph,
    });
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

  render() {
    return (
      <>
        <HeirarchyPanel
          selectedGraph={this.state.selectedGraph}
          selectedNode={this.state.selectedNode}
          selectClass={this.selectClassObject}
        />
        <CanvasPanel
          createNodeObject={this.createCanvasNode}
          selectNode={this.selectNode}
          selectedGraph={this.state.selectedGraph}
          selectedNode={this.state.selectedNode}
          tryCreateConnection={this.tryCreateConnection}
          updateSelectedNode={this.updateSelectedNode}
        />
        <PropertiesPanel
          selectedNode={this.state.selectedNode}
          updateSelectedNode={this.updateSelectedNode}
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
