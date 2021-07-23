import React, { Component } from "react";
import CanvasBackgroundGrid from "./CanvasBackgroundGrid";
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
 */
class CanvasPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
    };
    this.containerRef = React.createRef();
    this.scrollingRef = React.createRef();
  }

  handleNewNodeButtonClicked = (event) => {
    this.setState(
      { zoom: 1 },
      this.props.createNodeObject({
        x:
          event.pageX - this.containerRef.current.offsetLeft + this.scrollingRef.current.scrollLeft,
        y: event.pageY - this.containerRef.current.offsetTop + this.scrollingRef.current.scrollTop,
      })
    );
  };

  selectNodeWithGrid = (nodeObj) => {
    // Handle grid logic then call super select prop function
    this.props.selectNode(nodeObj);
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
