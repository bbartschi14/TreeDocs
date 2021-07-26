import React, { Component } from "react";
import CanvasNodeInputCircle from "./CanvasInputOutput/CanvasNodeInputCircle";
import CanvasNodeOutputCircle from "./CanvasInputOutput/CanvasNodeOutputCircle";
import "./CanvasNode.css";

/**
 * Node component for floating nodes in the canvas graph.
 *
 * Proptypes
 * @param {NodeObject} nodeObject object represented by this node
 * @param {ClassObject} classObject with id equal to the node
 * @param {bool} isSelected
 * @param {(NodeObject) => ()} selectNodeWithGrid function to select a node
 * @param {(NodeObject, bool)=>()} createConnectionFromNode start connection. second argument is true if input, false if output
 * @param {(NodeObject, bool, bool)=>()} handleNodeConnectionHovered first bool is true for input, false for output. Second bool is true if hovered, else false
 * @param {(IntPoint) => {}} handleNodePositionChanged callback to update position
 * @param {bool} isBeingPlaced
 * @param {IntPoint} placingMousePos
 */
class CanvasNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: { x: 0, y: 0 },
      initialMousePosition: { x: 0, y: 0 },
      isDragging: false,
      hasMoved: false,
    };
  }

  handleOnMouseDown = (event) => {
    if (event.button !== 0) return;
    this.props.selectNodeWithGrid(this.props.nodeObject);
    document.addEventListener("mousemove", this.handleOnMouseMove);
    document.addEventListener("mouseup", this.handleOnMouseUp);
    this.setState({
      isDragging: true,
      initialPosition: this.props.nodeObject.savedPosition,
      initialMousePosition: { x: event.pageX, y: event.pageY },
    });

    event.stopPropagation();
    event.preventDefault();
  };

  handleOnMouseUp = (event) => {
    this.setState({ isDragging: false, hasMoved: false });
    document.removeEventListener("mousemove", this.handleOnMouseMove);
    document.removeEventListener("mouseup", this.handleOnMouseUp);
    event.stopPropagation();
    event.preventDefault();
  };

  handleOnMouseMove = (event) => {
    if (!this.state.isDragging) return;
    this.setState({ hasMoved: true });
    let deltaX = event.pageX - this.state.initialMousePosition.x;
    let deltaY = event.pageY - this.state.initialMousePosition.y;

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

  componentDidMount() {
    if (this.props.isBeingPlaced) {
      this.setState({
        isDragging: true,
        initialMousePosition: this.props.placingMousePos,
        initialPosition: this.props.nodeObject.savedPosition,
      });
      document.addEventListener("mousemove", this.handleOnMouseMove);
      document.addEventListener("mouseup", this.handleOnMouseUp);
    }
  }

  render() {
    let shadow =
      this.state.isDragging && this.state.hasMoved ? " u-hovering " : " u-default-shadow ";
    let mainClass = "CanvasNode-innerContainer";
    if (this.props.isSelected) {
      mainClass += " CanvasNode-selected";
    } else {
      mainClass += " CanvasNode-unselected";
    }
    return (
      <div
        className={"CanvasNode-base "}
        style={{
          left: this.props.nodeObject.savedPosition.x + "px",
          top: this.props.nodeObject.savedPosition.y + "px",
        }}
      >
        <div className={"CanvasNode-container u-noselect " + shadow}>
          <div className={mainClass} onMouseDown={this.handleOnMouseDown}>
            <div className="CanvasNode-nameText">{this.props.classObject.name}</div>
            <div className="CanvasNode-parentText">{this.props.classObject.parent}</div>
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
