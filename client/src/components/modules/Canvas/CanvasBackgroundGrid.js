import React, { Component } from "react";

import "./CanvasBackgroundGrid.css";

/**
 * Background grid of the canvas panel. Will be used to create
 * an HTML canvas on which the grid will be drawn. Should include
 * parameters for grid spacing and color.
 *
 * Proptypes
 * @param {float} gridSize of each grid cell
 * @param {() => ()} deselectObjects callback to deselect all
 */
class CanvasBackgroundGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
    };
    this.canvasContext = undefined;
  }

  drawGrid = (gridSize) => {
    //console.log("Drawing grid " + gridSize);

    let width = this.state.canvasWidth;
    let height = this.state.canvasHeight;

    this.canvasContext.clearRect(0, 0, width, height);

    this.canvasContext.strokeStyle = "rgb(150,150,150)";
    this.canvasContext.lineWidth = 0.3;

    for (var x = 0; x <= width; x += gridSize) {
      this.canvasContext.moveTo(x, 0);
      this.canvasContext.lineTo(x, height);
    }

    for (var y = 0; y <= height; y += gridSize) {
      this.canvasContext.moveTo(0, y);
      this.canvasContext.lineTo(width, y);
    }

    this.canvasContext.stroke();
  };

  updateCanvasDimensions = () => {
    if (this.backgroundCanvas != null) {
      this.setState(
        {
          canvasWidth: this.backgroundCanvas.offsetWidth,
          canvasHeight: this.backgroundCanvas.offsetHeight,
        },
        function () {
          this.drawGrid(this.props.gridSize);
        }
      );
    }
  };

  componentDidMount() {
    //window.addEventListener("resize", this.updateCanvasDimensions);
    this.canvasContext = this.backgroundCanvas.getContext("2d");
    this.updateCanvasDimensions();
  }

  handleClick = (event) => {
    if (event.ctrlKey) {
      let bounds = this.backgroundCanvas.getBoundingClientRect();
      let currentPosition = { x: event.pageX - bounds.left, y: event.pageY - bounds.top };
      this.props.createCommentObject(currentPosition);
    } else {
      this.props.deselectObjects();
    }
  };

  render() {
    return (
      <canvas
        ref={(backgroundCanvas) => (this.backgroundCanvas = backgroundCanvas)}
        className="CanvasBackgroundGrid-canvas"
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
        onClick={this.handleClick}
      />
    );
  }
}

export default CanvasBackgroundGrid;
