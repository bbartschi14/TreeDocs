import React, { Component } from "react";
import CanvasBackgroundGrid from "./CanvasBackgroundGrid";
import CanvasConnectionsContainer from "./CanvasConnectionsContainer";
import CanvasNode from "./CanvasNode.js";
import nextId from "react-id-generator";

import "./CanvasPanel.css";
import CanvasSnackbar from "./CanvasSnackbar";
import CanvasCommentsContainer from "./CanvasComments/CanvasCommentsContainer";
import CreateCanvasItemButton from "./CreateCanvasItemButton";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddCommentIcon from "@material-ui/icons/AddComment";
/**
 * Panel component for the main center canvas. Will be used to control
 * the placement, arrangement, connection, and selection of graph nodes.
 * Will also control the placement of stick note comments and other visuals.
 *
 * Proptypes
 * @param TODO {ProjectObject} current working project
 * @param {GraphObject} selectedGraph working graph in working project
 * @param {(string id) => ()} createClassObject function that creates a new class object
 * @param {(ClassObject) => ()} selectClass function to select a node
 * @param {SelectableObject} selectedObject
 * @param {string} selectedObjectType
 * @param {[ToastObject]} toastNotifications
 * @param {string} addToastNotification
 * @param {ToastObject} removeToastNotification
 * @param {(bool)=>()} setDeleteActive
 * @param {() => ()} deselectObjects
 *
 * Connection Proptypes
 * @param {(ConnectionObject => ())} onConnectionSelected
 *
 * Comments
 * @param {string id) => ()} createCommentObject
 * @param {(CommentObject) => ()} updateSelectedComment
 * @param {(CommentObject) => ()} selectComment
 *
 */
class CanvasPanel extends Component {
  /**
   * @typedef CanvasObject
   * @property {NodeObject[]} nodes
   * @property {ConnectionObject[]} connections
   */

  /**
   * @typedef NodeObject // Considered to be a Class Node
   * @property {string} _id // Must correspond to a Class Object
   * @property {IntPoint} savedPosition
   */

  /**
   * @typedef CommentNodeObject
   * @property {string} _id // Must correspond to a Comment Object
   * @property {IntPoint} savedPosition
   * @property {IntPoint} savedSize
   */

  /**
   * @typedef ConnectionObject // The connecton object id is a concatenation of the startNode.classObject._id and endNode.classObject._id
   * @property {string} startId
   * @property {string} endId
   * @property {bool} startIsInput determines the order of input->output or output->input
   */

  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      isCreatingConnection: false,
      connectionStartNode: null,
      connectionStartType: false, // True if input, false if output
      hoveredNode: null,
      hoveredNodeIsInput: false,
      currentPlacingPosition: { x: 0, y: 0 },
      transformState: "none", // "none", "panning"
      mousePos: { x: 0, y: 0 },
      nodes: [],
      connections: [],
      commentNodes: [],
      isPlacingNode: false,
      isPlacingCommentNode: false,
    };
    this.containerRef = React.createRef();
    this.scrollingRef = React.createRef();
  }

  handleNewNodeButtonClicked = (event) => {
    let id = nextId();
    // Create node object
    let newNode = {
      _id: id,
      savedPosition: {
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      },
    };
    this.setState({
      nodes: this.state.nodes.concat([newNode]),
      mousePos: { x: event.pageX, y: event.pageY },
    });

    this.props.createClassObject(id);

    this.setState({ isPlacingNode: true });
    document.addEventListener("mouseup", this.handleDonePlacing);
    event.preventDefault();
  };

  handleCreateNodeFromClass = (event, classObject) => {
    let newNode = {
      _id: classObject._id,
      savedPosition: {
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      },
    };

    this.props.addClassNodeToGraph(classObject._id);
    document.addEventListener("mouseup", this.handleDonePlacing);

    this.setState({
      isPlacingNode: true,
      nodes: this.state.nodes.concat([newNode]),
      mousePos: { x: event.pageX, y: event.pageY },
    });
  };

  handleDonePlacing = (event) => {
    this.setState({ isPlacingNode: false });
    document.removeEventListener("mouseup", this.handleDonePlacing);
  };

  selectNodeWithGrid = (nodeObj) => {
    // Handle grid logic then call super select prop function
    let selectedClass = this.props.selectedProject.classes.filter((c) => c._id == nodeObj._id)[0];
    this.props.selectClass(selectedClass);
  };

  updateSelectedNode = (newNodeObject) => {
    //console.log(JSON.stringify(newNodeObject));
    let updatedNodes = Object.assign({}, this.state.nodes);
    updatedNodes = this.state.nodes.map((node) =>
      node._id == newNodeObject._id ? newNodeObject : node
    );
    this.setState({
      nodes: updatedNodes,
    });
  };

  handleNodePositionChanged = (newPosition) => {
    //console.log(newPosition);
    let selectedNode = this.state.nodes.filter(
      (node) => node._id == this.props.selectedObject._id
    )[0];
    let updatedObject = Object.assign({}, selectedNode);
    updatedObject.savedPosition = newPosition;
    this.updateSelectedNode(updatedObject);
  };

  handleNewCommentButtonClicked = (event) => {
    let id = nextId();
    // Create comment node object
    let pos = {
      x:
        event.pageX -
        this.containerRef.current.offsetLeft +
        this.scrollingRef.current.scrollLeft -
        100,
      y:
        event.pageY -
        this.containerRef.current.offsetTop +
        this.scrollingRef.current.scrollTop -
        80,
    };
    this.createCommentNodeObject(pos, id);

    this.setState({
      mousePos: { x: event.pageX, y: event.pageY },
    });

    this.setState({ isPlacingCommentNode: true });
    document.addEventListener("mouseup", this.handleDonePlacingComment);
    event.preventDefault();
  };

  handleDonePlacingComment = (event) => {
    this.setState({ isPlacingCommentNode: false });
    document.removeEventListener("mouseup", this.handleDonePlacingComment);
  };

  createCommentNodeObject = (position, id) => {
    let newCommentNode = {
      _id: id,
      savedPosition: { x: position.x, y: position.y },
      savedSize: { x: 200, y: 200 },
    };
    this.props.createCommentObject(id);

    this.setState({ commentNodes: this.state.commentNodes.concat([newCommentNode]) });

    return newCommentNode;
  };

  updateSelectedCommentNode = (newCommentNode) => {
    let updatedCommentNodes = Object.assign({}, this.state.commentNodes);
    updatedCommentNodes = this.state.commentNodes.map((node) =>
      node._id == newCommentNode._id ? newCommentNode : node
    );
    this.setState({
      commentNodes: updatedCommentNodes,
    });
  };

  handleScroll = (event) => {
    // Zoom is disabled until scaling issues are fixed
    if (false) {
      var newZoom = this.state.zoom + event.deltaY * 0.001;
      console.log(newZoom);
      if (newZoom > 0.5 && newZoom < 2) {
        this.setState({
          zoom: newZoom,
        });
      }
    }
  };

  enableScroll = () => {
    document.removeEventListener("wheel", this.preventDefault, false);
  };

  disableScroll = () => {
    document.addEventListener("wheel", this.preventDefault, {
      passive: false,
    });
  };

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  /***** Panning Functionality */

  handleMiddleMouseDown = (event) => {
    if (event.button === 1) {
      this.setState({ transformState: "panning", mousePos: { x: event.pageX, y: event.pageY } });
      event.preventDefault();
    }
  };

  handleMiddleMouseMove = (event) => {
    let delta = { x: event.pageX - this.state.mousePos.x, y: event.pageY - this.state.mousePos.y };
    this.scrollingRef.current.scrollLeft -= delta.x;
    this.scrollingRef.current.scrollTop -= delta.y;

    this.setState({ mousePos: { x: event.pageX, y: event.pageY } });
  };

  handleMiddleMouseUp = (event) => {
    this.setState({ transformState: "none" });
  };

  componentDidUpdate(prevProps, prevState) {
    // Handle class deleted
    let newClasses = this.props.selectedProject.classes;
    let prevClasses = prevProps.selectedProject.classes;
    if (newClasses.length < prevClasses.length) {
      this.onNodeDeleted(newClasses, prevClasses);
    }

    // Handle comment deleted
    let newComments = this.props.selectedGraph.comments;
    let prevComments = prevProps.selectedGraph.comments;
    if (newComments.length < prevComments.length) {
      this.onCommentDeleted(newComments, prevComments);
    }

    if (this.state.transformState == "panning" && prevState.transformState == "none") {
      document.addEventListener("mousemove", this.handleMiddleMouseMove);
      document.addEventListener("mouseup", this.handleMiddleMouseUp);
    } else if (this.state.transformState == "none" && prevState.transformState == "panning") {
      document.removeEventListener("mousemove", this.handleMiddleMouseMove);
      document.removeEventListener("mouseup", this.handleMiddleMouseUp);
    }
  }

  deleteSelectedClassNode = () => {
    let deletedId = this.props.selectedObject._id;

    this.setState({
      nodes: this.state.nodes.filter((node) => node._id != deletedId),
      connections: this.state.connections.filter(
        (conn) => conn.startId != deletedId && conn.endId != deletedId
      ),
    });

    this.setState({});

    let updatedGraph = Object.assign({}, this.props.selectedGraph);
    updatedGraph.classNodeIds = this.props.selectedGraph.classNodeIds.filter(
      (c) => c != this.props.selectedObject._id
    );

    this.props.updateSelectedGraph(updatedGraph);

    //this.addToastNotification("Node deleted");
    //this.clearSelection();
  };

  onNodeDeleted = (newClasses, prevClasses) => {
    let deletedId = "";
    for (var i = 0; i < prevClasses.length; i++) {
      let found = false;
      for (var j = 0; j < newClasses.length; j++) {
        if (prevClasses[i]._id == newClasses[j]._id) {
          found = true;
        }
      }
      if (!found) {
        deletedId = prevClasses[i]._id;
        break;
      }
    }

    this.setState({
      nodes: this.state.nodes.filter((node) => node._id != deletedId),
      connections: this.state.connections.filter(
        (conn) => conn.startId != deletedId && conn.endId != deletedId
      ),
    });
  };

  onCommentDeleted = (newComments, prevComments) => {
    let deletedId = "";
    for (var i = 0; i < prevComments.length; i++) {
      let found = false;
      for (var j = 0; j < newComments.length; j++) {
        if (prevComments[i]._id == newComments[j]._id) {
          found = true;
        }
      }
      if (!found) {
        deletedId = prevComments[i]._id;
        break;
      }
    }

    this.setState({
      commentNodes: this.state.commentNodes.filter((node) => node._id != deletedId),
    });
  };

  /*************************** */

  /***** Connection creation functions */
  // Basically, keep track of the start node and connection type. On hovering over other circles, if the connection type is
  // different than the start type, we keep track of that second node. On release, we send those two nodes up to the
  // Editor to try and make a connection between the two. Note that we don't send any info about the specific circles, just the nodes.
  // The input/output order can be determined with a single bool, as inputs can't go to inputs and vice versa

  createConnectionFromNode = (nodeObject, isInputCircle) => {
    this.setState({
      isCreatingConnection: true,
      connectionStartType: isInputCircle,
      connectionStartNode: nodeObject,
    });

    //console.log(isInputCircle ? "input" : "output");

    document.addEventListener("mouseup", this.handleMouseUpWhileConnecting);
  };

  handleMouseUpWhileConnecting = () => {
    // If we are hovering over a (potentially) valid node, try connecting them in the Editor
    if (this.state.hoveredNode != null) {
      let startNodeId = this.state.connectionStartNode._id;
      let endNodeId = this.state.hoveredNode._id;
      if (startNodeId != endNodeId) {
        if (this.state.hoveredNodeIsInput != this.state.connectionStartType) {
          this.tryCreateConnection({
            startId: startNodeId,
            endId: endNodeId,
            startIsInput: this.state.connectionStartType,
          });
        } else {
          this.props.addToastNotification("Must connect inputs to outputs");
        }
      } else {
        this.props.addToastNotification("Can't connect node to itself");
      }
    }
    document.removeEventListener("mouseup", this.handleMouseUpWhileConnecting);
    this.setState({ isCreatingConnection: false, connectionStartNode: null });
  };

  handleNodeConnectionHovered = (nodeObject, isInputCircle, isHovered) => {
    let newNode = null;
    if (isHovered) {
      //isInputCircle != this.state.connectionStartType) {
      newNode = nodeObject;
    }
    this.setState({ hoveredNode: newNode, hoveredNodeIsInput: isInputCircle });
  };

  tryCreateConnection = (connectionObj) => {
    // Check both nodes still exist
    let startExists = false;
    let endExists = false;

    for (var i = 0; i < this.state.nodes.length; i++) {
      if (this.state.nodes[i]._id == connectionObj.startId) {
        startExists = true;
      }
      if (this.state.nodes[i]._id == connectionObj.endId) {
        endExists = true;
      }
    }

    if (!startExists || !endExists) {
      return;
    }

    // Filter any connections that are the same two nodes

    let existingConnections = this.state.connections.filter(function (conn) {
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
      //console.log("Connection already exists");
    } else {
      // Create the new one
      //console.log("Connection added");
      this.addConnectionToCanvas(connectionObj);
    }
  };

  addConnectionToCanvas = (newConnection) => {
    this.setState({ connections: this.state.connections.concat([newConnection]) });
  };

  deleteSelectedConnection = () => {
    this.setState({
      connections: this.state.connections.filter(
        (conn) =>
          conn.startId != this.props.selectedObject.startId ||
          conn.endId != this.props.selectedObject.endId
      ),
    });

    this.props.deselectObjects();
  };

  /***************** */

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    if (event.key == "Delete" && this.props.selectedObjectType == "Connection") {
      this.deleteSelectedConnection();
    } else if (event.key == "Delete" && this.props.selectedObjectType == "Class") {
      this.deleteSelectedClassNode();
    }
  };

  render() {
    let nodesList = null;
    nodesList = this.state.nodes.map((nodeObj, i) => {
      let associatedClassList = this.props.selectedGraph.classNodeIds.filter(
        (classId) => classId == nodeObj._id
      );
      let classObjectFound = {};
      if (associatedClassList.length > 0) {
        classObjectFound = this.props.selectedProject.classes.filter(
          (c) => c._id == associatedClassList[0]
        )[0];
      }
      return associatedClassList.length > 0 ? (
        <CanvasNode
          key={`Node_${nodeObj._id}`}
          nodeObject={nodeObj}
          classObject={classObjectFound}
          isSelected={
            this.props.selectedObjectType == "Class" &&
            nodeObj._id == this.props.selectedObject?._id
          }
          selectNodeWithGrid={this.selectNodeWithGrid}
          createConnectionFromNode={this.createConnectionFromNode}
          handleNodeConnectionHovered={this.handleNodeConnectionHovered}
          handleNodePositionChanged={this.handleNodePositionChanged}
          isBeingPlaced={i == this.state.nodes.length - 1 && this.state.isPlacingNode}
          placingMousePos={
            i == this.state.nodes.length - 1 && this.state.isPlacingNode
              ? this.state.mousePos
              : { x: 0, y: 0 }
          }
        />
      ) : null;
    });

    return (
      <>
        {React.cloneElement(this.props.children, {
          handleCreateNode: this.handleCreateNodeFromClass,
        })}
        <div
          className={"CanvasPanel-container"}
          ref={this.containerRef}
          onWheelCapture={this.handleScroll}
          onMouseEnter={this.disableScroll}
          onMouseLeave={this.enableScroll}
          onMouseDown={this.handleMiddleMouseDown}
          style={this.state.transformState == "panning" ? { cursor: "grab" } : {}}
        >
          <div className="CanvasPanel-overflow" ref={this.scrollingRef}>
            <div
              className="CanvasPanel-scaler"
              style={{ transform: "scale(" + this.state.zoom + ")" }}
            >
              <CanvasBackgroundGrid
                gridSize={60}
                deselectObjects={this.props.deselectObjects}
                createCommentObject={this.createCommentNodeObject}
              />

              <CanvasCommentsContainer
                commentNodes={this.state.commentNodes}
                isPlacingCommentNode={this.state.isPlacingCommentNode}
                mousePos={this.state.mousePos}
                selectedGraph={this.props.selectedGraph}
                selectedObject={this.props.selectedObject}
                selectedObjectType={this.props.selectedObjectType}
                selectComment={this.props.selectComment}
                updateSelectedComment={this.props.updateSelectedComment}
                updateSelectedCommentNode={this.updateSelectedCommentNode}
              />

              <CanvasConnectionsContainer
                connections={this.state.connections}
                nodes={this.state.nodes}
                connectionStartNode={this.state.connectionStartNode}
                connectionStartType={this.state.connectionStartType}
                currentPlacingPosition={this.state.currentPlacingPosition}
                onConnectionSelected={this.props.onConnectionSelected}
                selectedObject={this.props.selectedObject}
                selectedObjectType={this.props.selectedObjectType}
              />

              <div className="CanvasPanel-nodeContainer">{nodesList}</div>
            </div>
          </div>
          <div className="CanvasPanel-snackbarContainer">
            {this.props.toastNotifications.map((toastObject, i) => (
              <CanvasSnackbar
                toastObject={toastObject}
                key={nextId()}
                removeToastNotification={this.props.removeToastNotification}
              />
            ))}
          </div>

          <div className="CanvasPanel-buttonContainer">
            <CreateCanvasItemButton
              onCreateStart={this.handleNewNodeButtonClicked}
              isDragging={this.state.isPlacingNode}
            >
              <PersonAddIcon />
            </CreateCanvasItemButton>

            <CreateCanvasItemButton
              onCreateStart={this.handleNewCommentButtonClicked}
              isDragging={this.state.isPlacingCommentNode}
            >
              <AddCommentIcon />
            </CreateCanvasItemButton>
          </div>
        </div>
      </>
    );
  }
}

export default CanvasPanel;
