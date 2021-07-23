import React, { Component } from "react";
import CanvasNodeInputCircle from "./CanvasInputOutput/CanvasNodeInputCircle";
import CanvasNodeOutputCircle from "./CanvasInputOutput/CanvasNodeOutputCircle";
import "./CanvasNode.css";

/**
 * Node component for floating nodes in the canvas graph.
 *
 * Proptypes
 * @param {NodeObject} nodeObject object represented by this node
 * @param {IntPoint} savedPosition x,y coordinates to load node at
 * @param {bool} isAttachedToCursor set to true when created using the create button
 * @param {bool} isSelected
 * @param {(NodeObject) => ()} selectNodeWithGrid function to select a node
 * @param {(NodeObject, bool)=>()} createConnectionFromNode start connection. second argument is true if input, false if output
 * @param {(NodeObject, bool, bool)=>()} handleNodeConnectionHovered first bool is true for input, false for output. Second bool is true if hovered, else false
 * @param {(IntPoint) => {}} handleNodePositionChanged callback to update position
 */
class CanvasNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: { x: 0, y: 0 },
      initialMousePosition: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      isDragging: false,
      shouldGetMousePos: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDragging && !prevState.isDragging) {
      document.addEventListener("mousemove", this.handleOnMouseMove);
      document.addEventListener("mouseup", this.handleOnMouseUp);
    } else if (!this.state.isDragging && prevState.isDragging) {
      document.removeEventListener("mousemove", this.handleOnMouseMove);
      document.removeEventListener("mouseup", this.handleOnMouseUp);
    }
  }

  componentDidMount() {
    this.setState({
      position: {
        x: this.props.savedPosition.x,
        y: this.props.savedPosition.y,
      },
      initialPosition: {
        x: this.props.savedPosition.x,
        y: this.props.savedPosition.y,
      },
      shouldGetMousePos: this.props.isAttachedToCursor,
      isDragging: this.props.isAttachedToCursor,
    });
  }

  handleOnMouseDown = (event) => {
    if (event.button !== 0) return;

    this.props.selectNodeWithGrid(this.props.nodeObject);
    /** Handle placement after auto dragging from add button */
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      return;
    }

    this.setState({
      isDragging: true,
      initialPosition: this.state.position,
      initialMousePosition: { x: event.pageX, y: event.pageY },
    });
    event.stopPropagation();
    event.preventDefault();
  };

  handleOnMouseUp = (event) => {
    this.setState({ isDragging: false });
    event.stopPropagation();
    event.preventDefault();
  };

  handleOnMouseMove = (event) => {
    // If a node starts attached to the cursor, the first mouse move is used to get the intial mouse position
    if (this.state.shouldGetMousePos) {
      this.setState({
        initialMousePosition: { x: event.pageX, y: event.pageY },
        shouldGetMousePos: false,
      });
      return;
    }

    if (!this.state.isDragging) return;

    let deltaX = event.pageX - this.state.initialMousePosition.x;
    let deltaY = event.pageY - this.state.initialMousePosition.y;

    this.setState({
      position: {
        x: this.state.initialPosition.x + deltaX,
        y: this.state.initialPosition.y + deltaY,
      },
    });

    this.props.handleNodePositionChanged({
      x: this.state.initialPosition.x + deltaX,
      y: this.state.initialPosition.y + deltaY,
    });

    event.stopPropagation();
    event.preventDefault();
  };

  handleCreateInputConnection = () => {
    this.props.createConnectionFromNode(this.props.nodeObject, true);
  };

  handleCreateOutputConnection = () => {
    this.props.createConnectionFromNode(this.props.nodeObject, false);
  };

  handleInputNodeHovered = (isHovered) => {
    this.props.handleNodeConnectionHovered(this.props.nodeObject, true, isHovered);
  };

  handleOutputNodeHovered = (isHovered) => {
    this.props.handleNodeConnectionHovered(this.props.nodeObject, false, isHovered);
  };

  render() {
    let mainClass = "CanvasNode-innerContainer";
    if (this.props.isSelected) {
      mainClass += " CanvasNode-selected";
    } else {
      mainClass += " CanvasNode-unselected";
    }
    return (
      <div
        className="CanvasNode-base"
        style={{ left: this.state.position.x + "px", top: this.state.position.y + "px" }}
      >
        <div className="CanvasNode-container u-default-shadow u-noselect">
          <div className={mainClass} onMouseDown={this.handleOnMouseDown}>
            <div className="CanvasNode-nameText">{this.props.nodeObject.classObject.name}</div>
            <div className="CanvasNode-parentText">{this.props.nodeObject.classObject.parent}</div>
          </div>

          <div className="CanvasNode-circleContainer CanvasNode-input">
            <CanvasNodeInputCircle
              createInputConnection={this.handleCreateInputConnection}
              handleNodeCircleHovered={this.handleInputNodeHovered}
            />
          </div>
          <div className="CanvasNode-circleContainer CanvasNode-output">
            <CanvasNodeOutputCircle
              createOutputConnection={this.handleCreateOutputConnection}
              handleNodeCircleHovered={this.handleOutputNodeHovered}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasNode;
