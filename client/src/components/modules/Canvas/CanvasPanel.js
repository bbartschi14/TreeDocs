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
import DeleteIcon from "@material-ui/icons/Delete";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
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
   * @property {string} _id // Should match current graph
   * @property {NodeObject[]} nodes
   * @property {ConnectionObject[]} connections
   * @property {CommentNodeObject[]} commentNodes
   */

  /**
   * @typedef NodeObject // Considered to be a Class Node
   * @property {string} _id // Must correspond to a Class, Function, or Variable Object
   * @property {string} type "Class", "Function", or "Variable"
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
      canvasObjects: [{ _id: "001", nodes: [], connections: [], commentNodes: [] }],
      currentCanvasObject: { _id: "001", nodes: [], connections: [], commentNodes: [] },
      isPlacingNode: false,
      isPlacingCommentNode: false,
    };
    this.containerRef = React.createRef();
    this.scrollingRef = React.createRef();
  }

  handleSaveButtonClick = (event) => {
    this.setState(
      {
        canvasObjects: this.state.canvasObjects.map((canvasObj) =>
          this.state.currentCanvasObject._id == canvasObj._id
            ? this.state.currentCanvasObject
            : canvasObj
        ),
      },
      () => this.props.handleSaveToPC(this.state.canvasObjects)
    );
  };

  handleNewNodeButtonClicked = (event) => {
    let id = nextId();
    // Create node object
    let newNode = {
      _id: id,
      type: "Class",
      savedPosition: {
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      },
    };

    this.addNodetoCurrentCanvas(newNode);
    this.setState({
      mousePos: { x: event.pageX, y: event.pageY },
    });

    this.props.createClassObject(id);

    this.setState({ isPlacingNode: true });
    document.addEventListener("mouseup", this.handleDonePlacing);
    event.preventDefault();
  };

  createNodeObject = (pos, id) => {
    let newNode = {
      _id: id,
      type: "Class",
      savedPosition: pos,
    };
    this.addNodetoCurrentCanvas(newNode);
    this.props.createClassObject(id);
  };

  handleCreateNodeFromClass = (event, classObject) => {
    let newNode = {
      _id: classObject._id,
      type: "Class",
      savedPosition: {
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      },
    };

    this.props.addClassNodeToGraph(classObject._id);
    document.addEventListener("mouseup", this.handleDonePlacing);
    this.addNodetoCurrentCanvas(newNode);
    this.setState({
      isPlacingNode: true,
      mousePos: { x: event.pageX, y: event.pageY },
    });
  };

  handleCreateNodeFromFunction = (event, functionObject) => {
    this.props.selectFunction(functionObject);
    console.log("Start creating function node");
    let newNode = {
      _id: functionObject._id,
      type: "Function",
      savedPosition: {
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      },
    };
    this.props.addClassNodeToGraph(functionObject._id);
    document.addEventListener("mouseup", this.handleDonePlacing);
    this.addNodetoCurrentCanvas(newNode);
    this.setState({
      isPlacingNode: true,
      mousePos: { x: event.pageX, y: event.pageY },
    });
  };

  addNodetoCurrentCanvas = (newNode) => {
    this.updateNodesInCurrentGraph(this.state.currentCanvasObject.nodes.concat([newNode]));
  };

  updateNodesInCurrentGraph = (newNodes) => {
    let updatedCanvas = Object.assign({}, this.state.currentCanvasObject);
    updatedCanvas.nodes = newNodes;
    this.setState({
      currentCanvasObject: updatedCanvas,
    });
  };

  handleDonePlacing = (event) => {
    this.setState({ isPlacingNode: false });
    document.removeEventListener("mouseup", this.handleDonePlacing);
  };

  selectNodeWithGrid = (nodeObj) => {
    // Handle grid logic then call super select prop function
    if (nodeObj.type == "Class") {
      let selectedClass = this.props.selectedProject.classes.filter((c) => c._id == nodeObj._id)[0];
      this.props.selectClass(selectedClass);
    } else if (nodeObj.type == "Function") {
      for (var i = 0; i < this.props.selectedProject.classes.length; i++) {
        for (var j = 0; j < this.props.selectedProject.classes[i].functions.length; j++) {
          if (this.props.selectedProject.classes[i].functions[j]._id == nodeObj._id) {
            let selectedFunction = this.props.selectedProject.classes[i].functions[j];
            this.props.selectFunction(selectedFunction);
          }
        }
      }
    }
  };

  updateSelectedNode = (newNodeObject) => {
    this.updateNodesInCurrentGraph(
      this.state.currentCanvasObject.nodes.map((node) =>
        node._id == newNodeObject._id ? newNodeObject : node
      )
    );
  };

  handleNodePositionChanged = (newPosition) => {
    //console.log(newPosition);
    let selectedNode = this.state.currentCanvasObject.nodes.filter(
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

  addCommentNodetoCurrentCanvas = (newCommentNode) => {
    this.updateCommentsInCurrentGraph(
      this.state.currentCanvasObject.commentNodes.concat([newCommentNode])
    );
  };

  updateCommentsInCurrentGraph = (newComments) => {
    let updatedCanvas = Object.assign({}, this.state.currentCanvasObject);
    updatedCanvas.commentNodes = newComments;
    this.setState({
      currentCanvasObject: updatedCanvas,
    });
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

    this.addCommentNodetoCurrentCanvas(newCommentNode);

    return newCommentNode;
  };

  updateSelectedCommentNode = (newCommentNode) => {
    this.updateCommentsInCurrentGraph(
      this.state.currentCanvasObject.commentNodes.map((node) =>
        node._id == newCommentNode._id ? newCommentNode : node
      )
    );
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

  // updateCanvasObjectInAllCanvases = (newCanvas) => {
  //   this.setState({
  //     canvasObjects: this.state.canvasObjects.map((canvasObj) =>
  //       newCanvas._id == canvasObj._id ? newCanvas : canvasObj
  //     ),
  //   });
  // };

  createNewCanvasForNewGraph = (newId) => {
    let newCanvas = { _id: newId, nodes: [], commentNodes: [], connections: [] };

    this.setState({ canvasObjects: this.state.canvasObjects.concat([newCanvas]) });
    return newCanvas;
  };

  componentDidUpdate(prevProps, prevState) {
    // Handle class deleted
    let newClasses = this.props.selectedProject.classes;
    let prevClasses = prevProps.selectedProject.classes;
    if (newClasses.length < prevClasses.length) {
      console.log("new: " + newClasses.length + ", old: " + prevClasses.length);
      this.onNodesDeleted(newClasses, prevClasses);
    }

    // Handle comment deleted
    let newComments = this.props.selectedGraph.comments;
    let prevComments = prevProps.selectedGraph.comments;
    if (newComments.length < prevComments.length) {
      this.onCommentDeleted(newComments, prevComments);
    }

    // Resync on graph changed by updating list of canvas objects and then updating the current canvas
    if (prevProps.selectedGraph._id != this.props.selectedGraph._id) {
      console.log(prevProps.selectedGraph.classNodeIds);
      this.setState(
        {
          canvasObjects: this.state.canvasObjects.map((canvasObj) =>
            this.state.currentCanvasObject._id == canvasObj._id
              ? this.state.currentCanvasObject
              : canvasObj
          ),
        },
        () => {
          let newMatchingCanvases = this.state.canvasObjects.filter(
            (c) => c._id == this.props.selectedGraph._id
          );
          if (newMatchingCanvases.length > 0) {
            // Clean Up nodes and connections on load
            //console.log("Old Version " + JSON.stringify(newMatchingCanvases));
            //console.log("New Version: " + this.props.selectedGraph.classNodeIds);
            newMatchingCanvases[0].nodes = newMatchingCanvases[0].nodes.filter((node) =>
              this.props.selectedGraph.classNodeIds.includes(node._id)
            );
            newMatchingCanvases[0].connections = newMatchingCanvases[0].connections.filter(
              (conn) =>
                this.props.selectedGraph.classNodeIds.includes(conn.startId) &&
                this.props.selectedGraph.classNodeIds.includes(conn.endId)
            );
            this.setState({ currentCanvasObject: newMatchingCanvases[0] });
          } else {
            // Create New canvas
            let newCanvas = this.createNewCanvasForNewGraph(this.props.selectedGraph._id);
            this.setState({ currentCanvasObject: newCanvas });
          }
        }
      );
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

    this.updateConnectionsInCurrentGraph(
      this.state.currentCanvasObject.connections.filter(
        (conn) => conn.startId != deletedId && conn.endId != deletedId
      )
    );
    this.updateNodesInCurrentGraph(
      this.state.currentCanvasObject.nodes.filter((node) => node._id != deletedId)
    );

    let updatedGraph = Object.assign({}, this.props.selectedGraph);
    updatedGraph.classNodeIds = this.props.selectedGraph.classNodeIds.filter(
      (c) => c != this.props.selectedObject._id
    );

    this.props.updateSelectedGraph(updatedGraph);
  };

  onNodesDeleted = (newClasses, prevClasses) => {
    let deletedIds = [];
    for (var i = 0; i < prevClasses.length; i++) {
      let found = false;
      for (var j = 0; j < newClasses.length; j++) {
        if (prevClasses[i]._id == newClasses[j]._id) {
          found = true;
        }
      }
      if (!found) {
        deletedIds = deletedIds.concat(prevClasses[i].functions.map((fObj) => fObj._id));
        deletedIds.push(prevClasses[i]._id);
      }
    }

    let updatedCanvas = Object.assign({}, this.state.currentCanvasObject);
    updatedCanvas.connections = this.state.currentCanvasObject.connections.filter(
      (conn) => !deletedIds.includes(conn.startId) && !deletedIds.includes(conn.endId)
    );
    updatedCanvas.nodes = this.state.currentCanvasObject.nodes.filter(
      (node) => !deletedIds.includes(node._id)
    );

    this.setState({
      currentCanvasObject: updatedCanvas,
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

    this.updateCommentsInCurrentGraph(
      this.state.currentCanvasObject.commentNodes.filter((node) => node._id != deletedId)
    );
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

    for (var i = 0; i < this.state.currentCanvasObject.nodes.length; i++) {
      if (this.state.currentCanvasObject.nodes[i]._id == connectionObj.startId) {
        startExists = true;
      }
      if (this.state.currentCanvasObject.nodes[i]._id == connectionObj.endId) {
        endExists = true;
      }
    }

    if (!startExists || !endExists) {
      return;
    }

    // Filter any connections that are the same two nodes

    let existingConnections = this.state.currentCanvasObject.connections.filter(function (conn) {
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
    this.updateConnectionsInCurrentGraph(
      this.state.currentCanvasObject.connections.concat([newConnection])
    );
  };

  deleteSelectedConnection = () => {
    this.updateConnectionsInCurrentGraph(
      this.state.currentCanvasObject.connections.filter(
        (conn) =>
          conn.startId != this.props.selectedObject.startId ||
          conn.endId != this.props.selectedObject.endId
      )
    );

    this.props.deselectObjects();
  };

  updateConnectionsInCurrentGraph = (newConnections) => {
    let updatedCanvas = Object.assign({}, this.state.currentCanvasObject);
    updatedCanvas.connections = newConnections;
    this.setState({
      currentCanvasObject: updatedCanvas,
    });
  };

  /***************** */

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    if (event.key == "Delete") {
      this.handleDeleteLogic();
    }
  };

  handleDeleteLogic = () => {
    if (this.props.selectedObjectType == "Connection") {
      this.deleteSelectedConnection();
    } else if (this.props.selectedObjectType == "Class") {
      this.deleteSelectedClassNode();
    } else if (this.props.selectedObjectType == "Function") {
      this.deleteSelectedClassNode();
    } else if (this.props.selectedObjectType == "Comment") {
      this.props.deleteSelectedComment();
    }
  };

  render() {
    let nodesList = null;
    //console.log(JSON.stringify(this.state.currentCanvasObject.nodes));
    // console.log(JSON.stringify(this.state.currentCanvasObject.connections));

    nodesList = this.state.currentCanvasObject.nodes.map((nodeObj, index) => {
      let dataObjectFound = null;
      let associatedList = [];
      associatedList = this.props.selectedGraph.classNodeIds.filter(
        (classId) => classId == nodeObj._id
      );
      if (associatedList.length > 0) {
        if (nodeObj.type == "Class") {
          dataObjectFound = this.props.selectedProject.classes.filter(
            (c) => c._id == associatedList[0]
          )[0];
        } else if (nodeObj.type == "Function") {
          for (var i = 0; i < this.props.selectedProject.classes.length; i++) {
            for (var j = 0; j < this.props.selectedProject.classes[i].functions.length; j++) {
              if (this.props.selectedProject.classes[i].functions[j]._id == associatedList[0]) {
                dataObjectFound = this.props.selectedProject.classes[i].functions[j];
              }
            }
          }
        }
      }

      return associatedList.length > 0 && dataObjectFound != null ? (
        <CanvasNode
          key={`Node_${nodeObj._id}`}
          nodeObject={nodeObj}
          dataObject={dataObjectFound}
          isSelected={
            (this.props.selectedObjectType == "Class" ||
              this.props.selectedObjectType == "Function" ||
              this.props.selectedObjectType == "Variable") &&
            nodeObj._id == this.props.selectedObject?._id
          }
          selectNodeWithGrid={this.selectNodeWithGrid}
          createConnectionFromNode={this.createConnectionFromNode}
          handleNodeConnectionHovered={this.handleNodeConnectionHovered}
          handleNodePositionChanged={this.handleNodePositionChanged}
          isBeingPlaced={
            index == this.state.currentCanvasObject.nodes.length - 1 && this.state.isPlacingNode
          }
          placingMousePos={
            index == this.state.currentCanvasObject.nodes.length - 1 && this.state.isPlacingNode
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
          handleCreateNodeFunction: this.handleCreateNodeFromFunction,
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
                createNodeObject={this.createNodeObject}
              />

              <CanvasCommentsContainer
                commentNodes={this.state.currentCanvasObject.commentNodes}
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
                canvasObject={this.state.currentCanvasObject}
                connections={this.state.currentCanvasObject.connections}
                nodes={this.state.currentCanvasObject.nodes}
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
              tooltipText={"Add Class"}
              hotkeyText={"Shift+Click"}
            >
              <PersonAddIcon />
            </CreateCanvasItemButton>

            <CreateCanvasItemButton
              onCreateStart={this.handleNewCommentButtonClicked}
              isDragging={this.state.isPlacingCommentNode}
              tooltipText={"Add Comment"}
              hotkeyText={"Ctrl+Click"}
            >
              <AddCommentIcon />
            </CreateCanvasItemButton>
          </div>
          <div style={{ position: "absolute", right: "24px", top: "240px" }}>
            <CreateCanvasItemButton
              isClickButton={true}
              handleClick={this.handleDeleteLogic}
              tooltipText={"Delete Selected"}
              useSecondaryColor={true}
              hotkeyText={"Delete"}
            >
              <DeleteIcon />
            </CreateCanvasItemButton>
          </div>

          <div style={{ position: "absolute", left: "12px", top: "12px" }}>
            <CreateCanvasItemButton
              isClickButton={true}
              handleClick={this.handleSaveButtonClick}
              tooltipText={"Download Project"}
              tooltipRight={true}
            >
              <SaveAltIcon />
            </CreateCanvasItemButton>
          </div>
        </div>
      </>
    );
  }
}

export default CanvasPanel;
