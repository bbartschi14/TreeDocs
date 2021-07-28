import React, { Component } from "react";
import CanvasNodeInputCircle from "./CanvasInputOutput/CanvasNodeInputCircle";
import CanvasNodeOutputCircle from "./CanvasInputOutput/CanvasNodeOutputCircle";
import "./CanvasNode.css";
import IconFromName from "../Common/IconFromName";
import { VARIABLE_TYPES } from "../Constants.js";
import PersonIcon from "@material-ui/icons/Person";

/**
 * Node component for floating nodes in the canvas graph.
 *
 * Proptypes
 * @param {NodeObject} nodeObject object represented by this node
 * @param {ClassObject/FunctionObject/VariableObject} dataObject with id equal to the node
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
    ///console.log(deltaX);

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

    let innerContent = null;
    if (this.props.nodeObject.type == "Class") {
      innerContent = (
        <>
          {/* <div className="CanvasNode-classIcon">
            <PersonIcon style={{ fontSize: 50 }} />
          </div> */}

          <div className="CanvasNode-nameText">{this.props.dataObject.name}</div>
          <div className="CanvasNode-parentText">{this.props.dataObject.parent}</div>
        </>
      );
    } else if (this.props.nodeObject.type == "Function") {
      innerContent = (
        <>
          <div className="CanvasNode-functionContainer">
            <IconFromName
              iconName="Function"
              iconSize="large"
              iconColor={VARIABLE_TYPES[this.props.dataObject.returnValue.type].color}
              tooltipText={this.props.dataObject.returnValue.typeName}
              tooltipUseAbsolute={true}
            />
            <div
              className="CanvasNode-nameText"
              style={{ marginLeft: "6px", marginRight: "6px", fontSize: "18px" }}
            >
              {this.props.dataObject.name}
              <div className="CanvasNode-functionParentContainer">
                {this.props.dataObject.parentName}
              </div>
            </div>
            <div style={{ marginRight: "4px" }}>(</div>
            {this.props.dataObject.parameters.map((param, i) => (
              <>
                <div style={{ marginTop: "4px" }}>
                  <IconFromName
                    key={"Item_" + i}
                    iconName="Variable"
                    iconColor={VARIABLE_TYPES[param.type].color}
                    tooltipText={param.typeName + ": " + param.name}
                    tooltipUseAbsolute={true}
                  />
                </div>
                {i == this.props.dataObject.parameters.length - 1 ? null : (
                  <div key={"Item2_" + i}>,</div>
                )}
              </>
            ))}
            <div style={{ marginLeft: "4px" }}>)</div>
          </div>
        </>
      );
    } else if (this.props.nodeObject.type == "Variable") {
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
            {innerContent}
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
