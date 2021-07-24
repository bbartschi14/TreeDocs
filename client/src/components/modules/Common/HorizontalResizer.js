import React, { Component } from "react";
import "./HorizontalResizer.css";

/**
 * Resizer component.
 * Should receive a function callback for onResize
 *
 * Proptypes
 * @param {(float) => ()} onResize passes the delta of pixels to resize
 * @param {style} customClass
 */
class HorizontalResizer extends Component {
  constructor(props) {
    super(props);
    this.state = { mousePos: { x: 0, y: 0 }, isDragging: false };
  }

  startResizing = (event) => {
    document.addEventListener("mousemove", this.handleOnMouseMove);
    document.addEventListener("mouseup", this.handleOnMouseUp);

    this.setState({ mousePos: { x: event.pageX, y: event.pageY }, isDragging: true });
  };

  handleOnMouseMove = (event) => {
    this.props.onResize(event.pageX - this.state.mousePos.x);
    this.setState({ mousePos: { x: event.pageX, y: event.pageY } });
  };

  handleOnMouseUp = (event) => {
    this.setState({ isDragging: false });
    document.removeEventListener("mousemove", this.handleOnMouseMove);
    document.removeEventListener("mouseup", this.handleOnMouseUp);
  };

  render() {
    return (
      <div
        className={"HorizontalResizer-default " + this.props.customClass}
        onMouseDown={this.startResizing}
      ></div>
    );
  }
}

export default HorizontalResizer;
