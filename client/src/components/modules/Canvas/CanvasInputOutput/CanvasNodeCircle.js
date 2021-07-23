import React, { Component } from "react";
import "./CanvasNodeCircle.css";

/**
 * Node circle component representing where inputs can be placed and connected
 *
 * Proptypes
 * @param {() => ()} createConnectionFromCircle function to start creating a connection
 * @param {(bool) => ()} handleNodeCircleHovered used to inform upper components about hover information. true if mouseEnter, false on exit
 */
class CanvasNodeCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMouseDown = (event) => {
    this.props.createConnectionFromCircle();
  };

  handleMouseEnter = (event) => {
    this.props.handleNodeCircleHovered(true);
  };

  handleMouseExit = (event) => {
    this.props.handleNodeCircleHovered(false);
  };

  render() {
    return (
      <div
        className="CanvasNodeCircle-container"
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseExit}
      ></div>
    );
  }
}

export default CanvasNodeCircle;
