import React, { Component } from "react";
import CanvasNodeCircle from "./CanvasNodeCircle.js";

/**
 * Composition of CanvasNodeCircle to specifically define the output circle.
 *
 * Proptypes
 * @param {() => ()} createOutputConnection function to start creating an **output** connection
 * @param {(bool) => ()} handleNodeCircleHovered true on enter, false on exit
 */
class CanvasNodeOutputCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <CanvasNodeCircle
        createConnectionFromCircle={this.props.createOutputConnection}
        handleNodeCircleHovered={this.props.handleNodeCircleHovered}
      />
    );
  }
}

export default CanvasNodeOutputCircle;
