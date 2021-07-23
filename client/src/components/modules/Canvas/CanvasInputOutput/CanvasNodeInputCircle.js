import React, { Component } from "react";
import CanvasNodeCircle from "./CanvasNodeCircle.js";

/**
 * Composition of CanvasNodeCircle to specifically define the input circle.
 *
 * Proptypes
 * @param {() => ()} createInputConnection function to start creating an **input** connection
 * @param {(bool) => ()} handleNodeCircleHovered true on enter, false on exit
 */
class CanvasNodeInputCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <CanvasNodeCircle
        createConnectionFromCircle={this.props.createInputConnection}
        handleNodeCircleHovered={this.props.handleNodeCircleHovered}
      />
    );
  }
}

export default CanvasNodeInputCircle;
