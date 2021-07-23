import React, { Component } from "react";
import CanvasBackgroundGrid from "./CanvasBackgroundGrid";
import CanvasConnectionsContainer from "./CanvasConnectionsContainer";
import CanvasNode from "./CanvasNode.js";

import "./CanvasPanel.css";

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
 * @param {NodeObject} selectedNode
 * @param {(NodeObject) => ()} updateSelectedNode function to update node
 * Connection Proptypes
 * @param {(ConnectionObject) => ()} tryCreateConnection callback function for letting the Editor know that we've indicated a connection between an output and input
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
      currentPlacingPosition: { x: 0, y: 0 },
    };
    this.containerRef = React.createRef();
    this.scrollingRef = React.createRef();
  }

  handleNewNodeButtonClicked = (event) => {
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
    let updatedObject = Object.assign({}, this.props.selectedNode); // creating copy of selected node prop
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
        this.props.tryCreateConnection({
          startId: startNodeId,
          endId: endNodeId,
          startIsInput: this.state.connectionStartType,
        });
      }
    }
    document.removeEventListener("mouseup", this.handleMouseUpWhileConnecting);
    this.setState({ isCreatingConnection: false, connectionStartNode: null });
  };

  handleNodeConnectionHovered = (nodeObject, isInputCircle, isHovered) => {
    let newNode = null;
    if (isHovered && isInputCircle != this.state.connectionStartType) {
      newNode = nodeObject;
    }
    this.setState({ hoveredNode: newNode });
  };

  /***************** */

  render() {
    let nodesList = null;
    nodesList = this.props.selectedGraph.nodes.map((nodeObj) => (
      <CanvasNode
        key={`Node_${nodeObj.classObject._id}`}
        nodeObject={nodeObj}
        isAttachedToCursor={nodeObj.isAttachedToCursor}
        savedPosition={nodeObj.savedPosition}
        isSelected={nodeObj.classObject._id == this.props.selectedNode?.classObject._id}
        selectNodeWithGrid={this.selectNodeWithGrid}
        createConnectionFromNode={this.createConnectionFromNode}
        handleNodeConnectionHovered={this.handleNodeConnectionHovered}
        handleNodePositionChanged={this.handleNodePositionChanged}
      />
    ));

    return (
      <div
        className={"CanvasPanel-container"}
        ref={this.containerRef}
        onWheelCapture={this.handleScroll}
        onMouseEnter={this.disableScroll}
        onMouseLeave={this.enableScroll}
      >
        <div className="CanvasPanel-overflow" ref={this.scrollingRef}>
          <div
            className="CanvasPanel-scaler"
            style={{ transform: "scale(" + this.state.zoom + ")" }}
          >
            <CanvasBackgroundGrid gridSize={60} />

            <CanvasConnectionsContainer
              selectedGraph={this.props.selectedGraph}
              connectionStartNode={this.state.connectionStartNode}
              connectionStartType={this.state.connectionStartType}
              currentPlacingPosition={this.state.currentPlacingPosition}
            />
            <div className="CanvasPanel-nodeContainer">{nodesList}</div>
          </div>
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
