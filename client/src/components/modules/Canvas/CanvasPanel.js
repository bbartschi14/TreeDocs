import React, { Component } from "react";
import CanvasBackgroundGrid from "./CanvasBackgroundGrid";
import CanvasConnectionsContainer from "./CanvasConnectionsContainer";
import CanvasNode from "./CanvasNode.js";
import nextId from "react-id-generator";

import "./CanvasPanel.css";
import CanvasSnackbar from "./CanvasSnackbar";
import CanvasCommentsContainer from "./CanvasComments/CanvasCommentsContainer";

/**
 * Panel component for the main center canvas. Will be used to control
 * the placement, arrangement, connection, and selection of graph nodes.
 * Will also control the placement of stick note comments and other visuals.
 *
 * Proptypes
 * @param TODO {ProjectObject} current working project
 * @param {GraphObject} selectedGraph working graph in working project
 * @param {(IntPoint) => ()} createNodeObject function that creates a new node object and attaches it to the cursor at the position passed
 * @param {(NodeObject) => ()} selectNode function to select a node
 * @param {SelectableObject} selectedObject
 * @param {string} selectedObjectType
 * @param {(NodeObject) => ()} updateSelectedNode function to update node
 * @param {[ToastObject]} toastNotifications
 * @param {string} addToastNotification
 * @param {ToastObject} removeToastNotification
 * @param {(bool)=>()} setDeleteActive
 *
 * Connection Proptypes
 * @param {(ConnectionObject) => ()} tryCreateConnection callback function for letting the Editor know that we've indicated a connection between an output and input
 * @param {(ConnectionObject => ())} onConnectionSelected
 *
 * Comments
 * @param {(IntPoint) => ()} createCommentObject
 * @param {(CommentObject) => ()} updateSelectedComment
 * @param {(CommentObject) => ()} selectComment
 *
 */
class CanvasPanel extends Component {
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
    };
    this.containerRef = React.createRef();
    this.scrollingRef = React.createRef();
  }

  handleNewNodeButtonClicked = (event) => {
    this.props.setDeleteActive(false);
    this.props.createNodeObject({
      x: event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
      y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
    });
  };

  selectNodeWithGrid = (nodeObj) => {
    // Handle grid logic then call super select prop function
    this.props.selectNode(nodeObj);
  };

  handleNodePositionChanged = (newPosition) => {
    //console.log(newPosition);
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.savedPosition = newPosition; // update the parent property, assign a new value
    this.props.updateSelectedNode(updatedObject);
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
    if (this.state.transformState == "panning" && prevState.transformState == "none") {
      document.addEventListener("mousemove", this.handleMiddleMouseMove);
      document.addEventListener("mouseup", this.handleMiddleMouseUp);
    } else if (this.state.transformState == "none" && prevState.transformState == "panning") {
      document.removeEventListener("mousemove", this.handleMiddleMouseMove);
      document.removeEventListener("mouseup", this.handleMiddleMouseUp);
    }
  }

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
      let startNodeId = this.state.connectionStartNode.classObject._id;
      let endNodeId = this.state.hoveredNode.classObject._id;
      if (startNodeId != endNodeId) {
        if (this.state.hoveredNodeIsInput != this.state.connectionStartType) {
          this.props.tryCreateConnection({
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

  /***************** */

  handleCommentPositionChanged = (newPosition) => {
    //console.log(newPosition);
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.savedPosition = newPosition; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  handleCommentSizeChanged = (newSize) => {
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.savedSize = newSize; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  render() {
    let nodesList = null;
    nodesList = this.props.selectedGraph.nodes.map((nodeObj) => (
      <CanvasNode
        key={`Node_${nodeObj.classObject._id}`}
        nodeObject={nodeObj}
        isAttachedToCursor={nodeObj.isAttachedToCursor}
        savedPosition={nodeObj.savedPosition}
        isSelected={
          this.props.selectedObjectType == "Node" &&
          nodeObj.classObject._id == this.props.selectedObject?.classObject._id
        }
        selectNodeWithGrid={this.selectNodeWithGrid}
        createConnectionFromNode={this.createConnectionFromNode}
        handleNodeConnectionHovered={this.handleNodeConnectionHovered}
        handleNodePositionChanged={this.handleNodePositionChanged}
        setDeleteActive={this.props.setDeleteActive}
      />
    ));

    return (
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
            <CanvasBackgroundGrid gridSize={60} />

            <CanvasCommentsContainer
              createCommentObject={this.props.createCommentObject}
              selectedGraph={this.props.selectedGraph}
              selectedObject={this.props.selectedObject}
              selectedObjectType={this.props.selectedObjectType}
              handleCommentPositionChanged={this.handleCommentPositionChanged}
              handleCommentSizeChanged={this.handleCommentSizeChanged}
              selectComment={this.props.selectComment}
            />

            <CanvasConnectionsContainer
              selectedGraph={this.props.selectedGraph}
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

        <div
          className="CanvasPanel-createNodeButton u-noselect"
          onClick={this.handleNewNodeButtonClicked}
        >
          +
        </div>
      </div>
    );
  }
}

export default CanvasPanel;
