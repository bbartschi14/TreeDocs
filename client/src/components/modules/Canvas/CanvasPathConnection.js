import { ThreeSixty } from "@material-ui/icons";
import React, { Component } from "react";

/**
 * Node path connection component rendering an svg
 *
 * Proptypes
 * @param {Vector2D} startPosition coordinates within parent container to start at
 * @param {Vector2D} endPosition coordinates within parent container to end at
 */
class CanvasPathConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathDescription: "",
    };
  }

  calculatePathFromPositions = (startPos, endPos) => {
    let calculatedPath = "";
    this.setState({ pathDescription: calculatedPath });
  };

  render() {
    return <path d={this.state.pathDescription}></path>;
  }
}

export default CanvasPathConnection;
